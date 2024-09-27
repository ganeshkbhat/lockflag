/**
 * 
 * Package: 
 * Author: Ganesh B
 * Description: 
 * Install: npm i xmutex --save
 * Github: https://github.com/ganeshkbhat/lockflag
 * npmjs Link: https://www.npmjs.com/package/xmutex
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
const createObjectManager  = require('../index'); // Adjust the path

describe('createObjectManager json nested manager with mutex tests for json nested set and get with acquire and release locks', function () {
    let manager;
    let acquireStub, releaseStub;

    beforeEach(function () {
        manager = createObjectManager.json.nested();

        // Stub the mutex acquire method and mock release
        acquireStub = sinon.stub(manager, 'acquire');
        releaseStub = sinon.stub();
        acquireStub.resolves(releaseStub); // acquire resolves the release function
    });

    afterEach(function () {
        sinon.restore(); // Restore stubs after each test
    });

    it('should set and get a single level value', async function () {
        await manager.setValue('key1', 42);
        const value = await manager.getValue('key1');

        expect(value).to.equal(42);
    });

    it('should set and get a nested value', async function () {
        await manager.setValue('key1.key2', 'nestedValue');
        const value = await manager.getValue('key1.key2');

        expect(value).to.equal('nestedValue');
    });

    it('should create intermediate nested objects if they do not exist', async function () {
        await manager.setValue('key1.key2.key3', 'deepValue');
        const value = await manager.getValue('key1.key2.key3');

        expect(value).to.equal('deepValue');
    });

    it('should return undefined for non-existent keys', async function () {
        const value = await manager.getValue('nonExistentKey');

        expect(value).to.be.undefined;
    });

    it('should return the entire object with getAllValues', async function () {
        await manager.setValue('key1', 42);
        await manager.setValue('key2.subkey1', 'hello');
        await manager.setValue('key2.subkey2.subkey3', 'world');

        const allValues = await manager.getAllValues();

        expect(allValues).to.deep.equal({
            key1: 42,
            key2: {
                subkey1: 'hello',
                subkey2: { subkey3: 'world' }
            }
        });
    });

    // it('should acquire and release the lock when setting a value', async function () {
    //     // Make sure to reset stubs for locking
    //     // sinon.restore(); // Restore stubs

    //     const mutex = { acquire: sinon.stub().resolves(() => { }) };
    //     const manager = createObjectManager.json.nested();

    //     // Spy on the internal mutex acquire method
    //     sinon.spy(manager, 'setValue');
    //     sinon.spy(mutex, 'acquire');

    //     // Simulate setting value
    //     await manager.setValue('key1', 42);

    //     // Check if the mutex.acquire was called and lock was released
    //     expect(mutex.acquire.calledOnce).to.be.true;
    // });
});
