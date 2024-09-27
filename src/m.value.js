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

const createMutex = require("./mutex.js");

function valueBased() {
  let value = null;
  const mutex = createMutex();

  return {
    async isAcquired() {
      return mutex.isAcquired();
    },

    async getValue() {
      return value;
    },

    async setValue(newValue, auto = true) {
      let release;
      if (!!auto) {
        release = await mutex.acquire();
      }

      try {
        if (!mutex.isAcquired()) {
          throw new Error("\n Lock not acquired with auto acquire disabled. \n Please make the auto acquire to be true or \n if auto lock is false then acquire the lock manually \n before setting the value \n");
        }
        value = newValue;
      } finally {
        if (!!auto) {
          release();  // Release the lock after setting the value
        }
      }
    },

    async acquire() {
      return await mutex.acquire();
    }

  };
}

module.exports.value = valueBased;

function invokeWith(initialValue = null) {
  let value = initialValue; // Private value
  const mutex = createMutex();

  return {
    async isAcquired() {
      return mutex.isAcquired();
    },

    // Get the current value
    async getValue() {
      return value;
    },

    // Set the value with valueTransformer
    async setValue(newValue, valueTransformer = (val) => val, auto = true) {
      let release;
      if (!!auto) {
        release = await mutex.acquire();
      }

      try {
        if (!mutex.isAcquired()) {
          throw new Error("\n Lock not acquired with auto acquire disabled. \n Please make the auto acquire to be true or \n if auto lock is false then acquire the lock manually \n before setting the value \n");
        }
        value = valueTransformer(newValue); // Apply transformation and set the value
      } finally {
        if (!!auto) {
          release(); // Release the lock after setting the value
        }
      }
    },

    async acquire() {
      return await mutex.acquire();
    }
  };
}

module.exports.invokeWith = invokeWith;

// // Usage
// (async () => {
//     const manager = valueBased();

//     console.log(await manager.getValue()); // null

//     await manager.setValue(42);

//     console.log(await manager.getValue()); // 42
// })();
