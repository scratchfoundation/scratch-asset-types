const tap = require('tap');
const readChunk = require('read-chunk');
const fileType = require('../../index');
const typesList = require('../../lib/typeslist');

const checkList = [
    'gif', 'jpg', 'json', 'png', 'webp', 'zip'];

tap.test('check-types', t => {

    checkList.forEach(thisType => {
        const buffer = readChunk.sync(`./test/fixtures/test.${thisType}`, 0, 128);
        const detectedType = fileType(buffer);
        t.ok(detectedType);
        t.equals(detectedType.ext, typesList[thisType].ext);
        t.equals(detectedType.mime, typesList[thisType].mime);
    });

    t.end();
});
