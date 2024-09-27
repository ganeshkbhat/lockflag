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

function nonNested() {
    let obj = {}; // Private object to store key-value pairs
    const mutex = createMutex();

    return {
        async isAcquired() {
            return mutex.isAcquired();
        },

        async getValue(key) {
            return obj[key]; // Return the value for the specified key
        },

        async setValue(key, newValue, auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }

            try {
                obj[key] = newValue; // Set the value for the specific key
            } finally {
                if (!!auto) {
                    release();  // Release the lock after setting the value
                }
            }
        },

        async getAllValues() {
                return obj; // Return the whole object
        },

        async acquire() {
            return await mutex.acquire();
        }

    };
}

module.exports.nonNested = nonNested;


// // Usage
// (async () => {
//     const manager = nonNested();

//     console.log(await manager.getValue('key1')); // undefined

//     await manager.setValue('key1', 42);
//     await manager.setValue('key2', 'hello');

//     console.log(await manager.getValue('key1')); // 42
//     console.log(await manager.getValue('key2')); // hello

//     console.log(await manager.getAllValues()); // { key1: 42, key2: 'hello' }
// })();


function nonNestedInvokeWith() {
    let obj = {}; // Private object to store key-value pairs
    const mutex = createMutex();

    return {
        async isAcquired() {
            return mutex.isAcquired();
        },

        async getValue(key) {
            return obj[key]; // Return the value for the specified key
        },

        async setValue(key, newValue, valueTransformer, auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }

            try {
                obj[key] = valueTransformer(newValue); // Set the value for the specific key
            } finally {
                if (!!auto) {
                    release();  // Release the lock after setting the value
                }
            }
        },

        async getAllValues() {
            return obj; // Return the whole object
        },

        async acquire() {
            return await mutex.acquire();
        }

    };
}

module.exports.nonNestedInvokeWith = nonNestedInvokeWith;


// // Usage
// (async () => {
//     const manager = nonNestedInvokeWith();

//     console.log(await manager.getValue('key1')); // undefined

//     await manager.setValue('key1', 42, (val) => { console.log("set value with transformer function: ", val); return val; }); // 
//     await manager.setValue('key2', 'hello', (val) => { console.log("set value with transformer function:", val); return val; }); // 

//     console.log(await manager.getValue('key1')); // 42
//     console.log(await manager.getValue('key2')); // hello

//     console.log(await manager.getAllValues()); // { key1: 42, key2: 'hello' }
// })();


function nested() {
    let obj = {}; // Private object to store key-value pairs
    const mutex = createMutex();

    // Helper function to get the value of a nested key
    function getNestedValue(keyPath) {
        return keyPath.split('.').reduce((acc, key) => acc && acc[key], obj);
    }

    // Helper function to set the value of a nested key
    function setNestedValue(keyPath, newValue) {
        const keys = keyPath.split('.');
        let current = obj;

        // Traverse the object based on key path
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {}; // Create nested objects if they don't exist
            }
            current = current[keys[i]];
        }

        // Set the value on the last key
        current[keys[keys.length - 1]] = newValue;
    }

    return {
        async isAcquired() {
            return mutex.isAcquired();
        },

        async getValue(keyPath) {
            return getNestedValue(keyPath); // Return the value for the nested key
        },

        async setValue(keyPath, newValue, auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }

            try {
                setNestedValue(keyPath, newValue); // Set the value for the nested key
            } finally {
                if (!!auto) {
                    release();  // Release the lock after setting the value
                }
            }
        },

        async getAllValues() {
            return obj; // Return the whole object
        },

        async acquire() {
            return await mutex.acquire();
        }

    };
}


module.exports.nested = nested;


// // Usage
// (async () => {
//     const manager = nested();

//     console.log(await manager.getValue('key1')); // undefined

//     await manager.setValue('key1', 42); // Single level
//     await manager.setValue('key2.subkey1', 'hello'); // Nested level
//     await manager.setValue('key2.subkey2.subkey3', 'world'); // More deeply nested
//     await manager.setValue('key3.key1', 42); // Single level
//     await manager.setValue('key4', { "key1": 42 }); // Single level

//     console.log(await manager.getValue('key1')); // 42
//     console.log(await manager.getValue('key2.subkey1')); // hello
//     console.log(await manager.getValue('key2.subkey2.subkey3')); // world

//     console.log(await manager.getAllValues());
//     // Output:
//     // {
//     //   key1: 42,
//     //   key2: {
//     //     subkey1: 'hello',
//     //     subkey2: { subkey3: 'world' }
//     //   }
//     // }
// })();


function nestedInvokeWith() {
    let obj = {}; // Private object to store key-value pairs
    const mutex = createMutex();

    // Helper function to get the value of a nested key
    function getNestedValue(keyPath) {
        return keyPath.split('.').reduce((acc, key) => acc && acc[key], obj);
    }

    // Helper function to set the value of a nested key
    function setNestedValue(keyPath, newValue, valueTransformer) {
        const keys = keyPath.split('.');
        let current = obj;

        // Traverse the object based on key path
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {}; // Create nested objects if they don't exist
            }
            current = current[keys[i]];
        }

        // Set the new value for the last key
        current[keys[keys.length - 1]] = newValue;

        // Invoke the valueTransformer function with the new value
        if (typeof valueTransformer === 'function') {
            valueTransformer(newValue);
        }
    }

    return {
        async isAcquired() {
            return mutex.isAcquired();
        },

        async getValue(keyPath) {
            return getNestedValue(keyPath); // Return the value for the nested key
        },

        async setValue(keyPath, newValue, valueTransformer, auto = true) {
            let release;
            if (!!auto) {
                release = await mutex.acquire();
            }

            try {
                setNestedValue(keyPath, newValue, valueTransformer); // Set the new value and invoke the transformer
            } finally {
                if (!!auto) {
                    release();  // Release the lock after setting the value
                }
            }
        },

        async getAllValues() {
            return obj; // Return the whole object
        },

        async acquire() {
            return await mutex.acquire();
        }

    };
}

module.exports.nestedInvokeWith = nestedInvokeWith;

// // Usage
// (async () => {
//     const manager = nestedInvokeWith();

//     console.log(await manager.getValue('key1')); // undefined

//     // Setting a value and then invoking a transformer
//     await manager.setValue('key1', 42, (newValue) => {
//         console.log('Value set for key1:', newValue); // Output: Value set for key1: 42
//     });

//     console.log(await manager.getValue('key1')); // 42

//     // Setting a nested value and then invoking a transformer
//     await manager.setValue('key2.subkey1', 'hello', (newValue) => {
//         console.log('Value set for key2.subkey1:', newValue); // Output: Value set for key2.subkey1: hello
//     });

//     console.log(await manager.getValue('key2.subkey1')); // hello

//     // Check the entire object
//     console.log(await manager.getAllValues());
//     // Output:
//     // {
//     //   key1: 42,
//     //   key2: {
//     //     subkey1: 'hello'
//     //   }
//     // }
// })();

