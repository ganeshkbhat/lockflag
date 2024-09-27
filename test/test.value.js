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

describe('createObjectManager Value Manager tests for single value set and get with acquire and release locks test', function () {
    let manager;
    let acquireStub, releaseStub;

    beforeEach(function () {
        manager = createObjectManager.value.value();

        // // Stub the mutex acquire method and mock release
        // acquireStub = sinon.stub(manager, 'acquire');
        // releaseStub = sinon.stub();
        // acquireStub.resolves(releaseStub); // acquire resolves the release function
    });

    afterEach(function () {
        // sinon.restore(); // Restore stubs after each test
    });

    it('should set and get a single level value', async function () {
        await manager.setValue(42);
        const value = await manager.getValue();

        expect(value).to.equal(42);
    });

    
});

