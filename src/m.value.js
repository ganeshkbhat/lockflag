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


function createValueManager() {
    let value = null;
    const mutex = new Mutex();

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

module.exports = createObjectManager;

// Usage
(async () => {
    const manager = createValueManager();

    console.log(await manager.getValue()); // null

    await manager.setValue(42);

    console.log(await manager.getValue()); // 42
})();
