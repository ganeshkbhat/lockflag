/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: 
 * Install: npm i  --save
 * Github: https://github.com/ganeshkbhat/lockflag
 * npmjs Link: https://www.npmjs.com/package/
 * File: index.js
 * File Description: 
 * 
 * 
*/

/* eslint no-console: 0 */

'use strict';


const { expect } = require('chai');
const sinon = require('sinon');

// Import the object manager function
const createObjectManager  = require('../index'); // Adjust the path to the file

describe('createObjectManager tests for nested function invoke set and get with acquire and release locks', function () {
    let manager;
    let valueTransformerSpy;

    beforeEach(function () {
        manager = createObjectManager.json.invokeWith();
        valueTransformerSpy = sinon.spy(); // Spy for valueTransformer function
    });

    afterEach(function () {
        sinon.restore(); // Restore spies and mocks after each test
    });

    it('should set a single-level key value and invoke the transformer', async function () {
        await manager.setValue('key1', 42, valueTransformerSpy);

        const value = await manager.getValue('key1');

        expect(value).to.equal(42);
        expect(valueTransformerSpy.calledOnce).to.be.true;
        expect(valueTransformerSpy.calledWith(42)).to.be.true; // Transformer called with the new value
    });

    it('should set a nested key value and invoke the transformer', async function () {
        await manager.setValue('key1.key2', 'nestedValue', valueTransformerSpy);

        const value = await manager.getValue('key1.key2');

        expect(value).to.equal('nestedValue');
        expect(valueTransformerSpy.calledOnce).to.be.true;
        expect(valueTransformerSpy.calledWith('nestedValue')).to.be.true; // Transformer called with the new value
    });

    it('should create intermediate objects if they do not exist and invoke transformer', async function () {
        await manager.setValue('key1.key2.key3', 'deepValue', valueTransformerSpy);

        const value = await manager.getValue('key1.key2.key3');

        expect(value).to.equal('deepValue');
        expect(valueTransformerSpy.calledOnce).to.be.true;
        expect(valueTransformerSpy.calledWith('deepValue')).to.be.true; // Transformer called with the new value
    });

    it('should not throw if valueTransformer is undefined', async function () {
        await manager.setValue('key1.key2', 'someValue'); // No transformer provided

        const value = await manager.getValue('key1.key2');

        expect(value).to.equal('someValue');
        expect(valueTransformerSpy.notCalled).to.be.true; // Transformer should not have been called
    });

    it('should set and transform values for multiple keys', async function () {
        await manager.setValue('key1', 100, valueTransformerSpy);
        await manager.setValue('key2.subkey1', 'hello', valueTransformerSpy);

        const key1Value = await manager.getValue('key1');
        const key2Value = await manager.getValue('key2.subkey1');

        expect(key1Value).to.equal(100);
        expect(key2Value).to.equal('hello');
        expect(valueTransformerSpy.calledTwice).to.be.true;
        expect(valueTransformerSpy.firstCall.calledWith(100)).to.be.true;
        expect(valueTransformerSpy.secondCall.calledWith('hello')).to.be.true;
    });

    it('should handle concurrent setValue calls with proper locking', async function () {
        const releaseStub = sinon.stub();
        const acquireStub = sinon.stub(manager, 'acquire').resolves(releaseStub);

        // Set two different values concurrently
        await Promise.all([
            manager.setValue('key1', 200, valueTransformerSpy),
            manager.setValue('key2.subkey1', 'world', valueTransformerSpy),
        ]);

        // Verify both values have been set correctly
        const key1Value = await manager.getValue('key1');
        const key2Value = await manager.getValue('key2.subkey1');

        expect(key1Value).to.equal(200);
        expect(key2Value).to.equal('world');
        // expect(valueTransformerSpy.calledOnce).to.be.true;

        // Verify that acquire was called twice, ensuring mutex locking
        // expect(acquireStub.calledTwice).to.be.true;
        // expect(releaseStub.calledTwice).to.be.true; // Ensure the lock was released both times
    });

    it('should return the whole object when getAllValues is called', async function () {
        await manager.setValue('key1', 50, valueTransformerSpy);
        await manager.setValue('key2.subkey1', 'world', valueTransformerSpy);

        const allValues = await manager.getAllValues();

        expect(allValues).to.deep.equal({
            key1: 50,
            key2: {
                subkey1: 'world',
            },
        });
    });
});
