import * as fs from 'node:fs';
const tmpQuene = "./src/tmp/quene.txt";
const initFiles = () => {
    fs.writeFile(tmpQuene, '', (err) => {
        if (err)
            throw err;
        console.log(tmpQuene);
        console.log(`${tmpQuene} created`);
    });
};
export const setup = () => {
    initFiles();
};
export const deconstruct = () => {
    fs.unlink(tmpQuene, (err) => {
        if (err)
            throw err;
        console.log('quene.txt destroyed');
    });
};
//# sourceMappingURL=quene.js.map