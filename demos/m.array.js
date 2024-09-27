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

const mutex = require("../index");

// Usage Example
(async () => {
    const arrayManager = mutex.array.queue();

    // Push some values
    await arrayManager.push(42);
    await arrayManager.push('hello');
    await arrayManager.push('world');
    console.log(await arrayManager.getAllValues()); // [42, 'hello', 'world']

    // Remove value at index 1
    const removedValue = await arrayManager.removeAt(1);
    console.log(removedValue); // 'hello'
    console.log(await arrayManager.getAllValues()); // [42, 'world']

    // Remove value at an out-of-bounds index
    const invalidRemove = await arrayManager.removeAt(5);
    console.log(invalidRemove); // undefined
    console.log(await arrayManager.getAllValues()); // [42, 'world']
})();

