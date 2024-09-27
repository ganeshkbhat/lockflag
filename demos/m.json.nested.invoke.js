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
    const manager = mutex.json.invokeWith();

    console.log(await manager.getValue('key1')); // undefined

    // Setting a value and then invoking a transformer
    await manager.setValue('key1', 42, (newValue) => {
        console.log('Value set for key1:', newValue); // Output: Value set for key1: 42
    });

    console.log(await manager.getValue('key1')); // 42

    // Setting a nested value and then invoking a transformer
    await manager.setValue('key2.subkey1', 'hello', (newValue) => {
        console.log('Value set for key2.subkey1:', newValue); // Output: Value set for key2.subkey1: hello
    });

    console.log(await manager.getValue('key2.subkey1')); // hello

    // Check the entire object
    console.log(await manager.getAllValues());
    // Output:
    // {
    //   key1: 42,
    //   key2: {z
    //     subkey1: 'hello'
    //   }
    // }
})();

