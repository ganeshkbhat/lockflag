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

function queue(initialSize = 0) {
    let arr = new Array(initialSize); // Private array to store values
    const mutex = createMutex();

    return {
        async isAcquired() {
            return mutex.isAcquired();
        },

        // Get value at a specific index
        async getValue(index) {
            return arr[index];
        },

        // Set value at a specific index
        async setValue(index, newValue, auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }
            
            try {
                if (index >= arr.length) {
                    arr.length = index + 1; // Extend array size if index is out of bounds
                }
                arr[index] = newValue; // Set the new value at the specified index
            } finally {
                if (!!auto) {
                    release(); // Release the lock after setting the value
                }
            }
        },

        // Push new value to the end of the array (enqueue)
        async push(newValue, auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }
            
            try {
                arr.push(newValue); // Add new value to the end of the array
            } finally {
                if (!!auto) {
                    release(); // Release the lock after push operation
                }
            }
        },

        // Shift the first value from the array (dequeue)
        async shift(auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }
            
            try {
                if (arr.length === 0) {
                    return undefined; // Return undefined if the array is empty
                }
                return arr.shift(); // Remove and return the first element
            } finally {
                if (!!auto) {
                    release(); // Release the lock after shift operation
                }
            }
        },

        // Remove value at a specific index
        async removeAt(index, auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }
            
            try {
                if (index < 0 || index >= arr.length) {
                    return undefined; // Index out of bounds, return undefined
                }
                const removedValue = arr.splice(index, 1)[0]; // Remove the element at the index and return it
                return removedValue;
            } finally {
                if (!!auto) {
                    release(); // Release the lock after removal
                }
            }
        },

        // Get the entire array
        async getAllValues() {
            return arr;
        },
    };
}

module.exports.queue = queue;

function invokeWith(initialSize = 0) {
    let arr = new Array(initialSize); // Private array to store values
    const mutex = createMutex();

    return {
        async acquire() {
            return await mutex.acquire();
        },

        async isAcquired() {
            return mutex.isAcquired();
        },


        // Get value at a specific index
        async getValue(index) {
            return arr[index];
        },

        // Set value at a specific index with valueTransformer
        async setValue(index, newValue, valueTransformer = (val) => val, auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }
            
            try {
                if (index >= arr.length) {
                    arr.length = index + 1; // Extend array size if index is out of bounds
                }
                arr[index] = valueTransformer(newValue); // Set the transformed value at the specified index
            } finally {
                if (!!auto) {
                    release(); // Release the lock after setting the value
                }
            }
        },

        // Push new value to the end of the array (enqueue) with valueTransformer
        async push(newValue, valueTransformer = (val) => val, auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }
            
            try {
                arr.push(valueTransformer(newValue)); // Add transformed new value to the end of the array
            } finally {
                if (!!auto) {
                    release(); // Release the lock after push operation
                }
            }
        },

        // Shift the first value from the array (dequeue) and apply valueTransformer on the removed value
        async shift(valueTransformer = (val) => val, auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }
            
            try {
                if (arr.length === 0) {
                    return undefined; // Return undefined if the array is empty
                }
                return valueTransformer(arr.shift()); // Apply valueTransformer on the shifted value
            } finally {
                if (!!auto) {
                    release(); // Release the lock after shift operation
                }
            }
        },

        // Remove value at a specific index with valueTransformer
        async removeAt(index, valueTransformer = (val) => val, auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }
            
            try {
                if (index < 0 || index >= arr.length) {
                    return undefined; // Index out of bounds, return undefined
                }
                const removedValue = arr.splice(index, 1)[0]; // Remove the element at the index
                return valueTransformer(removedValue); // Return the transformed removed value
            } finally {
                if (!!auto) {
                    release(); // Release the lock after removal
                }
            }
        },

        // Get the entire array
        async getAllValues() {
            return arr;
        },
    };
}

module.exports.invokeWith = invokeWith;
