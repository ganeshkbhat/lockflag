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
    await manager.setValue(41, false);
    console.log(await manager.getValue()); // 41
    release();
    console.log(await manager.getValue()); // 41
    try {
        await manager.setValue(34, false);
    } catch(e) {
        console.log("ERROR LOG: ", e);
    } finally {
        console.log("\nThe was an demo or an example of acquire lock manually used");
    }
    
})();

