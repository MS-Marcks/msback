import "../../utils/colors.js";
import jsonFormat from 'json-format';
import inquirer from 'inquirer';
import path from "path";
import fs from "fs";

import { api } from "../../templates/api.js"
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
    const service = config_ms_file.services.find((e) => e === options.service)
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
                console.log(green("CREATED FILE"), path.join(api[0].parent, api[0].name.replace(/{{name}}/g, answers.name.toLowerCase())));
                fs.writeFileSync(path.join(root, api[0].parent, api[0].name.replace(/{{name}}/g, answers.name.toLowerCase())),
                    readFileModule(api[0].content)
                        .replace(/{{name}}/g, answers.name.toLowerCase())
                        .replace(/{{NAME}}/g, answers.name.toUpperCase())
                );
            }
            // ###################################### CREATE ROUTE ############################
            console.log(green("CREATED FILE"), path.join(api[1].parent, api[1].name.replace(/{{name}}/g, answers.name.toLowerCase())));
            fs.writeFileSync(path.join(root, api[1].parent, api[1].name.replace(/{{name}}/g, answers.name.toLowerCase())),
                readFileModule(api[1].content)
                    .replace(/{{name}}/g, answers.name.toLowerCase())
                    .replace(/{{NAME}}/g, answers.name.toUpperCase())
            );
            // ###################################### CREATE ROUTE ############################


            // ###################################### UPDATE AUTH ############################
            const baseAuth = path.join(root, "config", "auth");
            const authFile = readFile(`index.js`, baseAuth);
            const authTemplate = readFileModule(path.join("src", "templates", "files", "api", "authconf.js.template"))
                .replace(/{{name}}/g, answers.name.toLowerCase())
                .replace(/{{NAME}}/g, answers.name.toUpperCase())
                .replace(/{{entry}}/g, answers.entry.toLowerCase());
            let authArrAddAuthTemplate = authFile.split("//AUTH (NOT DELETE)");
            const newAuthFile_1 = authArrAddAuthTemplate[0] + authTemplate + "//AUTH (NOT DELETE)" + authArrAddAuthTemplate[1];
            let authArrAddImport = newAuthFile_1.split("//IMPORT (NOT DELETE)");
            const newAuthFile = authArrAddImport[0] + `\tAUTHoptions_${answers.name.toLowerCase()},\n//IMPORT (NOT DELETE)` + authArrAddImport[1];
            console.log(yellow("UPDATE FILE"), path.join("config", "auth", "index.js"));
            fs.writeFileSync(path.join(baseAuth, `index.js`), newAuthFile);
            // ###################################### UPDATE AUTH ############################

            // ###################################### UPDATE SERVER ############################
            const serverFile = readFile(`server.js`, root);
            let serverArrAddRoutes = serverFile.split("//ROUTE (NOT DELETE)");
            const newServerFile_1 = serverArrAddRoutes[0] + `import routes${answers.name.toLowerCase()} from './config/route/route.${answers.name.toLowerCase()}'\n` + "//ROUTE (NOT DELETE)" + serverArrAddRoutes[1];
            let serverArrAddImport = newServerFile_1.split("//AUTH (NOT DELETE)");
            const newServerFile_2 = serverArrAddImport[0] + `\tAUTHoptions_${answers.name.toLowerCase()},\n//AUTH (NOT DELETE)` + serverArrAddImport[1];
            let serverArrAddApi = newServerFile_2.split("//API (NOT DELETE)");
            const newServerFile = serverArrAddApi[0] + `app.use('/api/${answers.name.toLowerCase()}', cors(AUTHoptions_${answers.name.toLowerCase()}.cors),  auth(AUTHoptions_${answers.name.toLowerCase()}.auth), routes${answers.name.toLowerCase()});\n//API (NOT DELETE)` + serverArrAddApi[1];
            console.log(yellow("UPDATE FILE"), path.join("server.js"));
            fs.writeFileSync(path.join(root, `server.js`), newServerFile);
            // ###################################### UPDATE SERVER ############################

            // ###################################### UPDATE ENV ############################
            let hashesArr = envFile.split("#HASH")[0] + hashes;
            const newDataEnv = `${hashesArr}#HASH${envFile.split("#HASH")[1]}`;
            console.log(yellow("UPDATE FILE"), `env/.env.${nameProject}`);
            fs.writeFileSync(path.join(baseEnv, `.env.${nameProject}`), newDataEnv);
            // ###################################### UPDATE ENV ############################    

            // ###################################### CREATE FOLDER API ############################
            fs.mkdirSync(path.join(root, "controller", answers.name.toLowerCase()));
            // ###################################### CREATE FOLDER API ############################

            console.log(yellow("UPDATE FILE"), "config.ms.json");
            let config_ms_file = readJSONFile("config.ms.json", baseDir);
            // ###################################### CREATE FOLDER API ############################
            config_ms_file.service[nameProject].apis.push(answers.name.toLowerCase())
            Object.assign(config_ms_file.service[nameProject].api, JSON.parse(`
            {
                "${answers.name.toLowerCase()}":{
                    "name":"${answers.name.toLowerCase()}",
                    "encrypt": "${answers.encrypt}",
                    "controllers":[],
                    "controller":{}
                }
            }
            `));

            fs.writeFileSync(path.join(baseDir, "config.ms.json"), jsonFormat(config_ms_file));
        });
}