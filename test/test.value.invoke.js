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
const createObjectManager  = require('../index'); // Adjust the path to the file

describe('createObjectManager Value Manager with Mutex and Value Transformer', function () {
  let valueManager;

  beforeEach(() => {
    // Create a new value manager before each test
    valueManager = createObjectManager.value.invokeWith();
  });

  it('should set and get a value with value transformation', async function () {
    const transformer = sinon.spy((val) => val * 2);
    await valueManager.setValue(42, transformer);
    const value = await valueManager.getValue();

    expect(value).to.equal(84); // Check if transformation (val * 2) was applied
    expect(transformer.calledOnce).to.be.true; // Ensure transformer was called once
    expect(transformer.calledWith(42)).to.be.true; // Ensure transformer was called with the correct value
  });

  it('should set and get a value without value transformation (default transformer)', async function () {
    await valueManager.setValue(50);
    const value = await valueManager.getValue();

    expect(value).to.equal(50); // Default transformer should return the value as-is
  });

  it('should handle concurrent set operations with mutex', async function () {
    const transformer = sinon.spy((val) => val + 1);

    const promises = [
      valueManager.setValue(10, transformer),
      valueManager.setValue(20, transformer),
      valueManager.setValue(30, transformer),
    ];

    await Promise.all(promises);
    const finalValue = await valueManager.getValue();

    expect([11, 21, 31]).to.include(finalValue); // Check one of the possible final values
    expect(transformer.callCount).to.equal(3); // Ensure transformer was called 3 times
  });
});
