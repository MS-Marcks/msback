import "../../utils/colors.js";
import jsonFormat from 'json-format';
import inquirer from 'inquirer';
import path from "path";
import fs from "fs";

import { project } from "../../templates/new.js"
import { webpack, webpack_modules } from '../../templates/webpack.compiler.js';
import { readFileModule, readJSONFile, readFile } from '../../utils/readJson.js';
import { executeCommand } from "../../utils/process.command.js";

const baseDir = path.resolve(".");
const baseEnv = path.join(path.resolve("."), "env");

function getHash(longitud) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@|{[()¿';
    let cadenaAleatoria = '';
    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        cadenaAleatoria += caracteres.charAt(indiceAleatorio);
    }
    return cadenaAleatoria;
}
export async function command_create_api(options) {

    let config_ms_file = readJSONFile("config.ms.json", baseDir);
    const service = config_ms_file.service.find((e) => e === options.service)
    if (service === undefined) {
        console.log(`\n${red("no existe el servicio")}`)
        return;
    }
    const nameProject = service.toLowerCase();
    const root = path.join(baseDir, "src", nameProject);
    if (!fs.existsSync(root)) {
        console.log(`\n${red("no existe el servicio")}`)
        return;
    }

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Ingrese nombre de la api:',
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return 'Ingrese nombre de la api.';
                    }
                }
            },
            {
                type: 'input',
                name: 'entry',
                message: 'Ingrese la ruta principal de acceso:',
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return 'Ingrese la ruta principal de acceso';
                    }
                }
            },
            {
                type: 'list',
                name: 'encrypt',
                message: 'desea encriptar el cuerpo de las solicitudes:',
                choices: ['si', 'no'],
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return 'seleccione una opción.';
                    }
                }
            }
        ])
        .then(async (answers) => {

            const envFile = readFile(`.env.${nameProject}`, baseEnv);
            let hashes = `\nKEY_TOKEN_${answers.name.toUpperCase()}=${getHash(128)}\n`;
            if (answers.encrypt === "si") {
                hashes += `HASH_ENCRYPT_${answers.name.toUpperCase()}=${getHash(128)}\n`;
            }
            let hashesArr = envFile.split("#HASH")[0] + hashes;
            const newDataEnv = `${hashesArr}#HASH${envFile.split("#HASH")[1]}`;
            fs.writeFileSync(path.join(baseEnv, `.env.${nameProject}`), newDataEnv);

            /*const initLen = project.length;
            for (let index = 0; index < initLen; index++) {
                const { name, type, content, parent } = project[index];
                if (type === "file") {
                    console.log(green("CREATED FILE"), path.join(parent, name));
                    fs.writeFileSync(path.join(root, parent, name), readFileModule(content).replace(/{{name}}/g, nameProject));
                } else if (type === "folder") {
                    console.log(green("CREATED FOLDER"), path.join(parent, name));
                    fs.mkdirSync(path.join(root, parent, name))
                }
            }

            if (answers.bundle === "webpack") {
                console.log(blue("## CONFIGURE WEBPACK ##"));
                const { name, type, content, parent } = webpack;
                console.log(green("CREATED FILE"), path.join(parent, name));
                fs.writeFileSync(path.join(root, parent, name), readFileModule(content).replace(/{{name}}/g, nameProject));

                console.log(yellow("UPDATE FILE"), "package.json");
                let package_file = readJSONFile("package.json", root);

                Object.assign(package_file.scripts, JSON.parse(`{"clean": "rm -rf ./dist && mkdir ./dist && rm -rf ./build && mkdir ./build","webpack": "webpack --mode production"}`));
                Object.assign(package_file.devDependencies, webpack_modules.modules);
                fs.writeFileSync(path.join(root, "package.json"), jsonFormat(package_file));

                console.log(yellow("UPDATE FILE"), "config.ms.json");
                let config_ms_file = readJSONFile("config.ms.json", root);
                config_ms_file.bundle = answers.bundle;
                fs.writeFileSync(path.join(root, "config.ms.json"), jsonFormat(config_ms_file));
            }*/
        });
}