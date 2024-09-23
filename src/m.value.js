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

const createMutex = require("./mutex.js");

function valueBased() {
    let value = null;
    const mutex = createMutex();

    return {
        async getValue() {
            return value;
        },

        async setValue(newValue) {
            const release = await mutex.acquire();
            try {
                value = newValue;
            } finally {
                release();  // Release the lock after setting the value
            }
        },
    };
}

module.exports = valueBased;

// Usage
(async () => {
    const manager = valueBased();

    console.log(await manager.getValue()); // null

    await manager.setValue(42);

    console.log(await manager.getValue()); // 42
})();
