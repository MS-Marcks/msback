import "../../utils/colors.js"
import inquirer from 'inquirer';
import path from "path";
import fs from "fs";
import { service } from "../../templates/service.js"
import { readJSONFile } from '../../utils/readJson.js';

const baseDir = path.join(path.resolve("."), "src");

function getHash(longitud) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@|{[()¿';
    let cadenaAleatoria = '';
    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        cadenaAleatoria += caracteres.charAt(indiceAleatorio);
    }
    return cadenaAleatoria;
}

export function command_create_service() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Ingrese nombre del servicio:',
                validate: function (input) {
                    if (input) {
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
                        return true;
                    } else {
                        return 'Ingrese el perto para el servicio.';
                    }
                }
            }/*,
            {
                type: 'list',
                name: 'engine',
                message: 'Seleccione un motor de base de datos:',
                choices: ['mysql', 'sqlserver', 'mariadb', 'sqlite'],
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return 'Seleccione un motor de base de datos';
                    }
                }
            }*/
            ,
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
            const root = path.join(baseDir, answers.name.toLowerCase());
            if (fs.existsSync(root)) {
                console.log(`\n${red("Ya existe el proyecto")}`)
                return;
            }
            fs.mkdirSync(root);
            const serviceLen = service.length;
            for (let index = 0; index < serviceLen; index++) {
                const element = service[index];
                if (element.parent.length === 1) {
                    if (element.type === "file") {
                        console.log(green("CREATED FILE"), path.join(element.parent[0], element.name.replace(/{{name}}/g, answers.name.toLowerCase())));
                        fs.writeFileSync(
                            path.join(root, element.parent[0], element.name.replace(/{{name}}/g, answers.name.toLowerCase())),
                            element.content.replace(/{{name}}/g, answers.name.toLowerCase()).replace(/{{NAME}}/g, answers.name.toUpperCase())
                        );
                    } else if (element.type === "folder") {
                        console.log(green("CREATED FOLDER"), path.join(element.parent[0], element.name));
                        fs.mkdirSync(path.join(root, element.parent[0], element.name))
                    }
                } else if (element.parent.length > 1) {
                    let path_temp = "";
                    for (let i = 0; i < element.parent.length; i++) {
                        path_temp = path.join(path_temp, element.parent[i]);
                    }
                    if (element.type === "file") {
                        console.log(green("CREATED FILE"), path.join(path_temp, element.name.replace(/{{name}}/g, answers.name.toLowerCase())));
                        fs.writeFileSync(
                            path.join(root, path_temp, element.name.replace(/{{name}}/g, answers.name.toLowerCase())),
                            element.content.replace(/{{name}}/g, answers.name.toLowerCase()).replace(/{{NAME}}/g, answers.name.toUpperCase())
                        );
                    } else if (element.type === "folder") {
                        console.log(green("CREATED FOLDER"), path.join(path_temp, element.name));
                        fs.mkdirSync(path.join(root, path_temp, element.name))
                    }
                } else {
                    if (element.type === "file") {
                        console.log(green("CREATED FILE"), element.name.replace(/{{name}}/g, answers.name.toLowerCase()));
                        fs.writeFileSync(
                            path.join(root, element.name.replace(/{{name}}/g, answers.name.toLowerCase())),
                            element.content.replace(/{{name}}/g, answers.name.toLowerCase()).replace(/{{NAME}}/g, answers.name.toUpperCase())
                        );
                    } else if (element.type === "folder") {
                        console.log(green("CREATED FOLDER"), element.name);
                        fs.mkdirSync(path.join(root, element.name))
                    }
                }
            }
            console.log(green("CREATED FILE"), path.join("env", "." + answers.name.toLowerCase() + ".env"));
            fs.writeFileSync(
                path.join(root, "..", "..", "env", "." + answers.name.toLowerCase() + ".env"),
                `
#HASH
KEY_TOKEN_${answers.name.toUpperCase()}=${getHash(128)}
HASH_ENCRYPT_${answers.name.toUpperCase()}=${getHash(128)}
#HASH

DB_HOST=${answers.server}
DB_USER=${answers.user}
DB_PASSWORD=${answers.password}
DB_DATABASE=${answers.database}
DB_PORT=${answers.port}
PORT=${answers.portapp}

                `);

            const config_service = readJSONFile("config.ms.json");
            config_service.push({
                service: answers.name.toLowerCase(),
                apis: []
            })
            console.log(yellow("UPDATE FILE"), "config.ms.json");
            fs.writeFileSync(path.join(root, "..", "..", "config.ms.json"), JSON.stringify(config_service));
        });
}

