import "../../utils/colors.js";
import jsonFormat from 'json-format';
import inquirer from 'inquirer';
import path from "path";
import fs from "fs";

import { project } from "../../templates/new.js"
import { webpack, webpack_modules } from '../../templates/webpack.compiler.js';
import { readFileModule, readJSONFile } from '../../utils/readJson.js';
import { executeCommand } from "../../utils/process.command.js";


const baseDir = path.resolve(".");

export async function command_create_project() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Ingrese nombre del projecto:',
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return 'Ingrese un nombre para el proyecto.';
                    }
                }
            },
            {
                type: 'list',
                name: 'bundle',
                message: 'Seleccione el empaquetador que desee usar en su aplicación:',
                choices: ['esbuild', 'webpack'],
                validate: function (input) {
                    if (input) {
                        return true;
                    } else {
                        return 'Seleccione el empaquetador que desee usar en su aplicación';
                    }
                }
            }
        ])
        .then(async (answers) => {
            const nameProject = answers.name.toLowerCase();
            const root = path.join(baseDir, nameProject);
            if (fs.existsSync(root)) {
                console.log(`\n${red("Ya existe el proyecto")}`)
                return;
            }
            fs.mkdirSync(root);
            const initLen = project.length;
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
            }
            console.log(blue("## INSTALL MODULES ##"));
            await executeCommand('npm', ['install'], { cwd: root });

        });
}