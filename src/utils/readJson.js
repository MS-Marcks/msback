import fs from 'fs';
import path from "path";
const baseDir = path.resolve(".");

export const readJSONFile = (filePath) => {
    try {
        const data = fs.readFileSync(path.join(baseDir, filePath), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        return 'Error al leer el archivo JSON';
    }
}


export const readFile = (filePath) => {
    try {
        const data = fs.readFileSync(path.join(baseDir, filePath), 'utf-8');
        return data;
    } catch (error) {
        console.log(error);
        return 'Error al leer el archivo';
    }
}