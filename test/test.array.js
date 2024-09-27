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

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

// Import the object manager function
const createObjectManager  = require('../index'); // Adjust the path

describe('createObjectManager Array Manager with Mutex tests', function () {
  let arrayManager;

  beforeEach(() => {
    // Create a new array manager before each test
    arrayManager = createObjectManager.array.queue();
  });

  it('should set and get a value at a specific index', async function () {
    await arrayManager.setValue(0, 42);
    const value = await arrayManager.getValue(0);
    expect(value).to.equal(42);
  });

  it('should get undefined for an unset index', async function () {
    const value = await arrayManager.getValue(0);
    expect(value).to.be.undefined;
  });

  it('should push values and retrieve all values', async function () {
    await arrayManager.push(42);
    await arrayManager.push('hello');
    const allValues = await arrayManager.getAllValues();
    expect(allValues).to.deep.equal([42, 'hello']);
  });

  it('should shift (dequeue) the first value', async function () {
    await arrayManager.push(42);
    await arrayManager.push('hello');
    const shiftedValue = await arrayManager.shift();
    expect(shiftedValue).to.equal(42);

    const remainingValues = await arrayManager.getAllValues();
    expect(remainingValues).to.deep.equal(['hello']);
  });

  it('should return undefined when shifting an empty array', async function () {
    const shiftedValue = await arrayManager.shift();
    expect(shiftedValue).to.be.undefined;
  });

  it('should remove a value at a specific index', async function () {
    await arrayManager.push(42);
    await arrayManager.push('hello');
    await arrayManager.push('world');

    const removedValue = await arrayManager.removeAt(1);
    expect(removedValue).to.equal('hello');

    const allValues = await arrayManager.getAllValues();
    expect(allValues).to.deep.equal([42, 'world']);
  });

  it('should return undefined when removing a value at an out-of-bounds index', async function () {
    await arrayManager.push(42);
    await arrayManager.push('hello');

    const removedValue = await arrayManager.removeAt(5);
    expect(removedValue).to.be.undefined;

    const allValues = await arrayManager.getAllValues();
    expect(allValues).to.deep.equal([42, 'hello']);
  });

  it('should handle concurrent access safely with mutex', async function () {
    const setSpy = sinon.spy(arrayManager, 'setValue');

    // Perform concurrent set operations
    const promises = [
      arrayManager.setValue(0, 42),
      arrayManager.setValue(1, 'hello'),
      arrayManager.setValue(2, 'world'),
    ];

    await Promise.all(promises);

    // Check that values were set correctly
    const allValues = await arrayManager.getAllValues();
    expect(allValues).to.deep.equal([42, 'hello', 'world']);
    expect(setSpy.callCount).to.equal(3);
  });
});
