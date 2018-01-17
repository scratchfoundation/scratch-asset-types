# scratch-asset-types

A library for detecting types for Scratch backend services that is optimized for the specific file types that Scratch services depend on.

### Usage:

Three possible use cases:

`bufferCheck`, `syncCheck`, `asyncCheck`

These will return `null` if the type is not recognized.
If recognized, a JSON object will be returned of the form:

```json
{ext: 'gif', mime: 'image/gif'}
```

Examples:

Synchronous check on a buffer:
```javascript
const assetTypes = require('scratch-asset-types');
const result = assetTypes.bufferCheck(someBuffer);
```

Synchronous check on a filename:
```javascript
const assetTypes = require('scratch-asset-types');
const result = assetTypes.syncCheck('full/path/to/filename');
```

Asynchronous check on a filename:
```javascript
const assetTypes = require('scratch-asset-types');
assetTypes.asyncCheck('full/path/to/filename').then( ... );
```

There is no asynchronous check on a buffer as that would be highly inefficent.


### Thanks to file-type

This library is derived from the more general [file-type](https://www.npmjs.com/package/file-type) npm module.
