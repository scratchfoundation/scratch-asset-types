// Derived from file-type npm module

const typesList = require('./lib/typeslist');
const readChunk = require('read-chunk');

module.exports.bufferCheck = input => {
    const buf = (input instanceof Uint8Array) ? input : new Uint8Array(input);

    if (!(buf && buf.length > 1)) {
        return null;
    }

    const check = (header, options) => {
        options = Object.assign({
            offset: 0
        }, options);

        for (let i = 0; i < header.length; i++) {
            if (header[i] !== buf[i + options.offset]) {
                return false;
            }
        }

        return true;
    };

    if (check([0xFF, 0xD8, 0xFF])) {
        return typesList.jpg;
    }

    if (check([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
        return typesList.png;
    }

    if (check([0x47, 0x49, 0x46])) {
        return typesList.gif;
    }

    if (check([0x57, 0x45, 0x42, 0x50], {offset: 8})) {
        return typesList.webp;
    }

    if (check([0x50, 0x4B]) &&
        (buf[2] === 0x3 || buf[2] === 0x5 || buf[2] === 0x7) &&
        (buf[3] === 0x4 || buf[3] === 0x6 || buf[3] === 0x8)) {
        return typesList.zip;
    }

    if (check([0x52, 0x49, 0x46, 0x46]) &&
        check([0x57, 0x41, 0x56, 0x45], {offset: 8})) {
        return typesList.wav;
    }

    if (check([0x00, 0x00, 0x00, 0x0C, 0x6A, 0x50, 0x20,
        0x20, 0x0D, 0x0A, 0x87, 0x0A])) {
        // JPEG-2000 family

        if (check([0x6A, 0x70, 0x32, 0x20], {offset: 20})) {
            return typesList.jpg;
        }

        if (check([0x6A, 0x70, 0x78, 0x20], {offset: 20})) {
            return typesList.jpg;
        }

        if (check([0x6A, 0x70, 0x6D, 0x20], {offset: 20})) {
            return typesList.jpg;
        }

        if (check([0x6D, 0x6A, 0x70, 0x32], {offset: 20})) {
            return typesList.jpg;
        }
    }

    if (check([0x7b])) {
        // Might be GIANT^H^H^H^H JSON
        return typesList.json;
    }

    return null;
};

module.exports.asyncCheck = fileName => new Promise((resolve, reject) => {
    const chunkPromise = readChunk(fileName, 0, 128);
    chunkPromise.then(result => {
        resolve(module.exports.bufferCheck(result));
    }, err => {
        reject(err);
    });
});

module.exports.syncCheck = fileName => module.exports.bufferCheck(readChunk.sync(fileName, 0, 128));
