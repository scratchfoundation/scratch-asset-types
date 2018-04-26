const tap = require('tap');
const fileType = require('../../index');
const typesList = require('../../lib/typeslist');

const checkList = [
    'gif', 'jpg', 'json', 'mp3', 'png', 'wav', 'webp', 'zip'];

tap.test('check-types', t => {
    checkList.forEach(thisType => {
        const detectedType = fileType.syncCheck(`./test/fixtures/test.${thisType}`);
        t.ok(detectedType);
        t.equals(detectedType.ext, typesList[thisType].ext);
        t.equals(detectedType.mime, typesList[thisType].mime);
    });

    t.end();
});

checkList.forEach(thisType => fileType.asyncCheck(`./test/fixtures/test.${thisType}`)
    .then(result => tap.test('check async results', t => {
        t.ok(result);
        t.equals(result.ext, typesList[thisType].ext);
        t.equals(result.mime, typesList[thisType].mime);
        t.end();
    })));
