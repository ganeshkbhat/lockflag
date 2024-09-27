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

describe('createObjectManager Array Manager with Mutex and Value Transformer', function () {
  let arrayManager;

  beforeEach(() => {
    // Create a new array manager before each test
    arrayManager = createObjectManager.array.invokeWith();
  });

  it('should set a value at a specific index with value transformation', async function () {
    const transformer = sinon.spy((val) => val * 2);
    await arrayManager.setValue(0, 42, transformer);
    const value = await arrayManager.getValue(0);

    expect(value).to.equal(84); // Check if transformation (val * 2) was applied
    expect(transformer.calledOnce).to.be.true; // Ensure transformer was called once
    expect(transformer.calledWith(42)).to.be.true; // Ensure transformer was called with the correct value
  });

  it('should push a value with value transformation', async function () {
    const transformer = sinon.spy((val) => val + ' world');
    await arrayManager.push('hello', transformer);
    const allValues = await arrayManager.getAllValues();

    expect(allValues).to.deep.equal(['hello world']); // Check if transformation was applied
    expect(transformer.calledOnce).to.be.true; // Ensure transformer was called once
    expect(transformer.calledWith('hello')).to.be.true; // Ensure transformer was called with the correct value
  });

  it('should shift (dequeue) a value with value transformation', async function () {
    const transformer = sinon.spy((val) => val.toString().toUpperCase());
    await arrayManager.push(42);
    const shiftedValue = await arrayManager.shift(transformer);

    expect(shiftedValue).to.equal('42'); // Check if transformation was applied (to uppercase)
    expect(transformer.calledOnce).to.be.true; // Ensure transformer was called once
    expect(transformer.calledWith(42)).to.be.true; // Ensure transformer was called with the correct value
  });

  it('should return undefined when shifting from an empty array', async function () {
    const transformer = sinon.spy();
    const shiftedValue = await arrayManager.shift(transformer);

    expect(shiftedValue).to.be.undefined; // Check if the result is undefined for an empty array
    expect(transformer.notCalled).to.be.true; // Ensure transformer was not called for an empty array
  });

  it('should remove a value at a specific index with value transformation', async function () {
    const transformer = sinon.spy((val) => val.split('').reverse().join(''));
    await arrayManager.push('hello');
    await arrayManager.push('world');

    const removedValue = await arrayManager.removeAt(1, transformer);

    expect(removedValue).to.equal('dlrow'); // Check if transformation (reverse) was applied
    expect(transformer.calledOnce).to.be.true; // Ensure transformer was called once
    expect(transformer.calledWith('world')).to.be.true; // Ensure transformer was called with the correct value

    const allValues = await arrayManager.getAllValues();
    expect(allValues).to.deep.equal(['hello']); // Ensure the value was removed correctly
  });

  it('should return undefined when removing from an out-of-bounds index', async function () {
    const transformer = sinon.spy();
    await arrayManager.push(42);

    const removedValue = await arrayManager.removeAt(5, transformer);

    expect(removedValue).to.be.undefined; // Check if undefined is returned for out-of-bounds index
    expect(transformer.notCalled).to.be.true; // Ensure transformer was not called
  });

  it('should set, push, shift, and remove values with default transformer', async function () {
    // Testing default behavior (identity transformer) when no transformer is provided

    // Set value with default transformer
    await arrayManager.setValue(0, 42);
    expect(await arrayManager.getValue(0)).to.equal(42);

    // Push value with default transformer
    await arrayManager.push('hello');
    expect(await arrayManager.getAllValues()).to.deep.equal([42, 'hello']);

    // Shift value with default transformer
    const shiftedValue = await arrayManager.shift();
    expect(shiftedValue).to.equal(42);
    expect(await arrayManager.getAllValues()).to.deep.equal(['hello']);

    // Remove value with default transformer
    const removedValue = await arrayManager.removeAt(0);
    expect(removedValue).to.equal('hello');
    expect(await arrayManager.getAllValues()).to.deep.equal([]);
  });
});
