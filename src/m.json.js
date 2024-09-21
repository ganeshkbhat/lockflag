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


function createObjectManagerJson() {
    let obj = {}; // Private object to store key-value pairs
    const mutex = createMutex();

    return {
        async getValue(key) {
            return obj[key]; // Return the value for the specified key
        },

        async setValue(key, newValue) {
            const release = await mutex.acquire();
            try {
                obj[key] = newValue; // Set the value for the specific key
            } finally {
                release();  // Release the lock after setting the value
            }
        },

        async getAllValues() {
            return obj; // Return the whole object
        },
    };
}

module.exports.createObjectManagerJson = createObjectManagerJson;

// Usage
(async () => {
    const manager = createObjectManagerJson();

    console.log(await manager.getValue('key1')); // undefined

    await manager.setValue('key1', 42);
    await manager.setValue('key2', 'hello');

    console.log(await manager.getValue('key1')); // 42
    console.log(await manager.getValue('key2')); // hello

    console.log(await manager.getAllValues()); // { key1: 42, key2: 'hello' }
})();


function createObjectManagerNested() {
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
        async getValue(keyPath) {
            return getNestedValue(keyPath); // Return the value for the nested key
        },

        async setValue(keyPath, newValue) {
            const release = await mutex.acquire();
            try {
                setNestedValue(keyPath, newValue); // Set the value for the nested key
            } finally {
                release();  // Release the lock after setting the value
            }
        },

        async getAllValues() {
            return obj; // Return the whole object
        },
    };
}


module.exports.createObjectManagerNested = createObjectManagerNested;


// Usage
(async () => {
    const manager = createObjectManagerNested();

    console.log(await manager.getValue('key1')); // undefined

    await manager.setValue('key1', 42); // Single level
    await manager.setValue('key2.subkey1', 'hello'); // Nested level
    await manager.setValue('key2.subkey2.subkey3', 'world'); // More deeply nested
    await manager.setValue('key3.key1', 42); // Single level
    await manager.setValue('key4', { "key1": 42 }); // Single level

    console.log(await manager.getValue('key1')); // 42
    console.log(await manager.getValue('key2.subkey1')); // hello
    console.log(await manager.getValue('key2.subkey2.subkey3')); // world

    console.log(await manager.getAllValues());
    // Output:
    // {
    //   key1: 42,
    //   key2: {
    //     subkey1: 'hello',
    //     subkey2: { subkey3: 'world' }
    //   }
    // }
})();

