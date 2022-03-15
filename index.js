// Derived from file-type npm module

const typesList = require('./lib/typeslist');
const readChunk = require('read-chunk');

// Check if the file extension provided is in our
// list of acceptable file formats.
// acceptable, return true
// not acceptable, return false
module.exports.acceptableExtension = fileName => {
    const pieces = fileName.split('.');
    if (pieces && pieces.length > 1 && pieces[pieces.length - 1] in typesList) {
        return true;
    }

    return false;
};

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
            // If a bitmask is set
            if (options.mask) {
                // If header doesn't equal `buf` with bits masked off
                if (header[i] !== (options.mask[i] & buf[i + options.offset])) {
                    return false;
                }
            } else if (header[i] !== buf[i + options.offset]) {
                return false;
            }
        }

        return true;
    };

    // Starts with a <, assume SVG
    if (check([0x3c])) {
        return typesList.svg;
    }

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

    // Check for MPEG header at different starting offsets
    for (let start = 0; start < 2 && start < (buf.length - 16); start++) {
        if (
            check([0x49, 0x44, 0x33], {offset: start}) || // ID3 header
            check([0xFF, 0xE2], {offset: start, mask: [0xFF, 0xE2]}) // MPEG 1 or 2 Layer 3 header
        ) {
            return typesList.mp3;
        }
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
