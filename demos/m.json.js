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


const mutex = require("../index");

console.log("mutex:", mutex);

// Usage
(async () => {
    const manager = mutex.json.nonNested();

    console.log(await manager.getValue('key1')); // undefined

    await manager.setValue('key1', 42);
    await manager.setValue('key2', 'hello');

    console.log(await manager.getValue('key1')); // 42
    console.log(await manager.getValue('key2')); // hello

    console.log(await manager.getAllValues()); // { key1: 42, key2: 'hello' }
})();

