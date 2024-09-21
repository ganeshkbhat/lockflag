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



function createMutex() {
  let queue = [];
  let locked = false;

  function acquire() {
    const unlock = () => {
      if (queue.length > 0) {
        const next = queue.shift();
        next(unlock);
      } else {
        locked = false;
      }
    };

    return new Promise((resolve) => {
      if (locked) {
        queue.push(resolve);
      } else {
        locked = true;
        resolve(unlock);
      }
    });
  }

  return { acquire };
}

function createObjectManager() {
  let obj = {}; // Private object to store key-value pairs
  const mutex = createMutex();

  return {
    async getValue(key) {
      return obj[key]; // Return the value for the specified key
    },

    async setValue(key, newValue) {
      const release = await mutex.acquire();
      try {
        obj[key] = newValue; // Set the value for the specific key
      } finally {
        release();  // Release the lock after setting the value
      }
    },

    async getAllValues() {
      return obj; // Return the whole object
    },
  };
}

// Usage
(async () => {
  const manager = createObjectManager();

  console.log(await manager.getValue('key1')); // undefined

  await manager.setValue('key1', 42);
  await manager.setValue('key2', 'hello');

  console.log(await manager.getValue('key1')); // 42
  console.log(await manager.getValue('key2')); // hello

  console.log(await manager.getAllValues()); // { key1: 42, key2: 'hello' }
})();
