# lockflag
javascript based lockflag is a mutex like is a simple mutually exclusive flag or MuTex 

- value based mutex with acquire/release
- json single value mutex acquire/release
- json nested value mutex acquire/release
- json nested value with function invoke mutex 

### value based mutex

```
(async () => {
    const manager = mutex.value();
    console.log(await manager.getValue()); // null
    await manager.setValue(42);
    console.log(await manager.getValue()); // 42
})();
```


### json single value mutex 

```
(async () => {
    const manager = mutex.json.nonNested();
    console.log(await manager.getValue('key1')); // undefined
    await manager.setValue('key1', 42);
    await manager.setValue('key2', 'hello');
    console.log(await manager.getValue('key1')); // 42
    console.log(await manager.getValue('key2')); // hello
    console.log(await manager.getAllValues()); // { key1: 42, key2: 'hello' }
})();
```


### json nested value mutex 

```
(async () => {
    const manager = mutex.json.nested();
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
```


### json nested value with function invoke mutex 

```
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
```


### todo:

- include array value mutex (use queues package) for semaphore queue
- include key or flag to be specified key and not just a function acquire/release lock
