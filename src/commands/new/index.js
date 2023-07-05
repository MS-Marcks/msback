import "../../utils/colors.js"
import inquirer from 'inquirer';
import path from "path";
import fs from "fs";
import { exec } from 'child_process';
import { init } from "../../templates/init.js"

const baseDir = path.resolve(".");

export function command_create_project() {
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
            }
        ])
        .then(answers => {
            const root = path.join(baseDir, answers.name.toLowerCase());
            if (fs.existsSync(root)) {
                console.log(`\n${red("Ya existe el proyecto")}`)
                return;
            }
            fs.mkdirSync(root);
            const initLen = init.length;
            for (let index = 0; index < initLen; index++) {
                const element = init[index];
                if (element.type === "file") {
                    if (element.parent.length === 1) {
                        console.log(green("CREATED FILE"), path.join(element.parent[0], element.name));
                        fs.writeFileSync(path.join(root, element.parent[0], element.name), element.content.replace(/{{name}}/g, answers.name.toLowerCase()));
                    } else {
                        console.log(green("CREATED FILE"), element.name);
                        fs.writeFileSync(path.join(root, element.name), element.content.replace(/{{name}}/g, answers.name.toLowerCase()));
                    }

                } else if (element.type === "folder") {
                    console.log(green("CREATED FOLDER"), element.name);
                    fs.mkdirSync(path.join(root, element.name))
                }
            }
            const comando = `cd ${root} && npm install`;
            console.log(green("INSTALL MODULES"));
            exec(comando, (error, stdout, stderr) => {
                if (error) {
                    console.error(`${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`${stderr}`);
                    return;
                }
                console.log(`\n${stdout}`);
            });
        });
}