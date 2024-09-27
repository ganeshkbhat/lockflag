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

// Usage
(async () => {
    const manager = mutex.value.value();
    console.log(await manager.getValue()); // null
    const release = await manager.acquire();
    await manager.setValue(42, false);
    console.log(await manager.getValue()); // 42
    await manager.setValue(41, false);
    release();
    console.log(await manager.getValue()); // 41
})();

