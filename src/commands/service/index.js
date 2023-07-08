import "../../utils/colors.js"
import jsonFormat from 'json-format';
import inquirer from 'inquirer';
import path from "path";
import fs from "fs";
import { service } from "../../templates/service.js"
import { readFileModule, readJSONFile } from '../../utils/readJson.js';

const baseDir = path.join(path.resolve("."));

export function command_create_service() {

    if (readJSONFile("config.ms.json", baseDir) === null) {
        console.log(`\n\t${red("Esta intentando crear un servicio en una carpeta que no es un proyecto de msback")}`);
        return;
    }

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Ingrese nombre del servicio:',
                validate: function (input) {
                    if (input) {
                        const root = path.join(baseDir, "src", input.toLowerCase());
                        if (fs.existsSync(root)) {
                            return "Ya existe el servicio";
                        }
                        return true;
                    } else {
                        return 'Ingrese un nombre para el servicio.';
                    }
                }
            },
            {
                type: 'input',
                name: 'portapp',
                message: 'Ingrese el puerto del servicio:',
                validate: function (input) {
                    if (input) {
                        let config_ms_file = readJSONFile("config.ms.json", baseDir);
                        if (config_ms_file.ports.find((e) => e === parseInt(input))) {
                            return 'El puerto ya se esta usando en otro servicio.';
                        }
                        return true;
                    } else {
                        return 'Ingrese el perto para el servicio.';
                    }
                }
            },
            {
                type: 'input',
                name: 'server',
                message: 'Ingrese el servidor de la base de datos:',
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return 'Ingrese el servidor de la base de datos.';
                    }
                }
            },
            {
                type: 'input',
                name: 'database',
                message: 'Ingrese el nombre de la base de datos:',
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return 'Ingrese el nombre de la base de datos.';
                    }
                }
            },
            {
                type: 'input',
                name: 'user',
                message: 'Ingrese el usuario de la base de datos:',
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return 'Ingrese el usuario de la base de datos.';
                    }
                }
            },
            {
                type: 'input',
                name: 'password',
                message: 'Ingrese la contraseña de la base de datos:'
            },
            {
                type: 'input',
                name: 'port',
                message: 'Ingrese el puerto de la base de datos:'
            }
        ])
        .then(answers => {
            const root = path.join(baseDir, "src", answers.name.toLowerCase());
            if (fs.existsSync(root)) {
                console.log(`\n\t${red("Ya existe el servicio")}`)
                return;
            }
            fs.mkdirSync(root);
            const serviceLen = service.length;
            for (let index = 0; index < serviceLen; index++) {
                const { name, type, content, parent } = service[index];
                if (type === "file") {
                    console.log(green("CREATED FILE"), path.join(parent, name.replace(/{{name}}/g, answers.name.toLowerCase())));
                    fs.writeFileSync(
                        path.join(root, parent, name.replace(/{{name}}/g, answers.name.toLowerCase())),
                        readFileModule(content)
                            .replace(/{{name}}/g, answers.name.toLowerCase())
                            .replace(/{{NAME}}/g, answers.name.toUpperCase())
                            .replace(/{{DB_HOST}}/g, answers.server)
                            .replace(/{{DB_USER}}/g, answers.user)
                            .replace(/{{DB_PASSWORD}}/g, answers.password)
                            .replace(/{{DB_DATABASE}}/g, answers.database)
                            .replace(/{{DB_HOST}}/g, answers.server)
                            .replace(/{{DB_PORT}}/g, answers.port)
                            .replace(/{{PORT}}/g, answers.portapp)
                    );
                } else if (type === "folder") {
                    console.log(green("CREATED FOLDER"), path.join(parent, name));
                    fs.mkdirSync(path.join(root, parent, name))
                }
            }
            console.log(yellow("UPDATE FILE"), "config.ms.json");
            let config_ms_file = readJSONFile("config.ms.json", baseDir);
            config_ms_file.services.push(answers.name.toLowerCase());
            config_ms_file.ports.push(parseInt(answers.portapp));
            Object.assign(config_ms_file.service, JSON.parse(`{"${answers.name.toLowerCase()}":{"name":"${answers.name.toLowerCase()}","apis":[],"api":{}}}`));
            fs.writeFileSync(path.join(baseDir, "config.ms.json"), jsonFormat(config_ms_file));

            let scripts = `{"dev:${answers.name.toLowerCase()}": "npx nodemon --exec babel-node ./src/${answers.name.toLowerCase()}/server",
            "build-babel:${answers.name.toLowerCase()}": "babel -d ./dist ./src/${answers.name.toLowerCase()} -s",
            "build:${answers.name.toLowerCase()}": "npm run clean && npm run build-babel:${answers.name.toLowerCase()}",
            `;

            if (config_ms_file.bundle === "webpack") {
                scripts += `"package:${answers.name.toLowerCase()}": "npm run build:${answers.name.toLowerCase()} && npm run webpack"}`
            } else if (config_ms_file.bundle === "esbuild") {
                scripts += `"package:${answers.name.toLowerCase()}": "npm run build:${answers.name.toLowerCase()} && npm run esbuild"}`
            }
            console.log(yellow("UPDATE FILE"), "package.json");
            let package_file = readJSONFile("package.json", baseDir);
            Object.assign(package_file.scripts, JSON.parse(scripts));
            fs.writeFileSync(path.join(baseDir, "package.json"), jsonFormat(package_file));
        });
}

