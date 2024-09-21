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

class Mutex {
    constructor() {
        this.queue = [];
        this.locked = false;
    }

    acquire() {
        const unlock = () => {
            if (this.queue.length > 0) {
                const next = this.queue.shift();
                next(unlock);
            } else {
                this.locked = false;
            }
        };

        return new Promise((resolve) => {
            if (this.locked) {
                this.queue.push(resolve);
            } else {
                this.locked = true;
                resolve(unlock);
            }
        });
    }
}

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

// Usage
(async () => {
    const manager = createValueManager();

    console.log(await manager.getValue()); // null

    await manager.setValue(42);

    console.log(await manager.getValue()); // 42
})();
