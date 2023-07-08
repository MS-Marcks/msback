import fs from 'fs';
import path from "path";
import url from 'url';

const baseDir = path.resolve(".");
const rootDirectory = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "..", "..");

export const readJSONFile = (filePath, root = null) => {
    try {
        const data = fs.readFileSync(path.join((root === null) ? baseDir : root, filePath), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

export const readFile = (filePath, root = null) => {
    try {
        const data = fs.readFileSync(path.join((root === null) ? baseDir : root, filePath), 'utf-8');
        return data;
    } catch (error) {
        return null;
    }
}

export const readJSONFileModule = (filePath) => {
    try {
        const data = fs.readFileSync(path.join(rootDirectory, filePath), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

export const readFileModule = (filePath) => {
    try {
        const data = fs.readFileSync(path.join(rootDirectory, filePath), 'utf-8');
        return data;
    } catch (error) {
        return null;
    }
}

