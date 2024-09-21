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

function createObjectManager() {
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
        async getValue(keyPath) {
            return getNestedValue(keyPath); // Return the value for the nested key
        },

        async setValue(keyPath, newValue, valueTransformer) {
            const release = await mutex.acquire();
            try {
                setNestedValue(keyPath, newValue, valueTransformer); // Set the new value and invoke the transformer
            } finally {
                release();  // Release the lock after setting the value
            }
        },

        async getAllValues() {
            return obj; // Return the whole object
        },
    };
}

// Usage
(async () => {
    const manager = createObjectManager();

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
    //   key2: {
    //     subkey1: 'hello'
    //   }
    // }
})();
