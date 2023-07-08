import "../../utils/colors.js";
import jsonFormat from 'json-format';
import inquirer from 'inquirer';
import path from "path";
import fs from "fs";

import { controller } from "../../templates/controller.js";
import { readFileModule, readJSONFile, readFile } from '../../utils/readJson.js';

const baseDir = path.resolve(".");

export async function command_create_controller(options) {

    if (readJSONFile("config.ms.json", baseDir) === null) {
        console.log(`\n\t${red("Esta intentando crear un controlador en una carpeta que no es un proyecto de msback")}`);
        return;
    }
    if (typeof options.service === "undefined") {
        console.log(`\n\t${red("Debe especificar en que servicio se generará el nuevo controlador (Ejemp: msback controller -s admin -a admin)")}`)
        return;
    }

    if (typeof options.api === "undefined") {
        console.log(`\n\t${red("Debe especificar en que api se generará el nuevo controlador (Ejemp: msback controller -s admin -a admin)")}`)
        return;
    }

    let config_ms_file = readJSONFile("config.ms.json", baseDir);
    const service = config_ms_file.services.find((e) => e === options.service)

    if (service === undefined) {
        console.log(`\n\t${red("No existe el servicio")}`)
        return;
    }
    const nameService = service.toLowerCase();
    const baseService = path.join(baseDir, "src", nameService);
    if (!fs.existsSync(baseService)) {
        console.log(`\n\t${red("No existe el servicio")}`)
        return;
    }
    const serviceOptions = config_ms_file.service[nameService];

    const api = serviceOptions.apis.find((e) => e === options.api);
    if (api === undefined) {
        console.log(`\n\t${red("No existe la api")}`)
        return;
    }
    const nameApi = api.toLowerCase();
    const baseApi = path.join(baseDir, "src", nameService, "controller", nameApi);
    if (!fs.existsSync(baseApi)) {
        console.log(`\n\t${red("No existe la api")}`)
        return;
    }
    const apiOptions = config_ms_file.service[nameService].api[nameApi];
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Ingrese nombre del controlador:',
                validate: function (input) {
                    if (input) {
                        const nameController = "Controller" + input.charAt(0).toUpperCase() + input.slice(1);
                        if (fs.existsSync(path.join(baseApi, nameController))) {
                            return "Ya existe el controlador";
                        }
                        return true;
                    } else {
                        return 'Ingrese nombre del controlador.';
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
            }
        ])
        .then(async (answers) => {
            const nameController = "Controller" + answers.name.charAt(0).toUpperCase() + answers.name.slice(1);
            if (fs.existsSync(path.join(baseApi, nameController))) {
                console.log(`\n\t${red("Ya existe el controlador.")}`)
                return;
            }
            fs.mkdirSync(path.join(baseApi, nameController));

            const controllerLen = controller.length;
            for (let index = 0; index < controllerLen; index++) {
                const { name, type, content, parent } = controller[index];
                if (type === "file") {
                    console.log(green("CREATED FILE"), path.join(parent.replace(/{{name}}/g, nameController), name));
                    fs.writeFileSync(path.join(baseApi, parent.replace(/{{name}}/g, nameController), name),
                        readFileModule(content
                            .replace(/{{option}}/g, (apiOptions.encrypt === "si") ? ".encrypt" : ""))
                            .replace(/{{api}}/g, nameApi)
                            .replace(/{{name}}/g, nameController)
                    );
                } else if (type === "folder") {
                    console.log(green("CREATED FOLDER"), path.join(parent.replace(/{{name}}/g, nameController), name));
                    fs.mkdirSync(path.join(baseApi, parent.replace(/{{name}}/g, nameController), name))
                }
            }

            const routeFile = readFile(`route.${nameApi}.js`, path.join(baseService, "config", "route"));
            let routerArrAddController = routeFile.split("//CONTROLLER (NOT DELETE)");
            const newRouteFile = routerArrAddController[0] + `import ${nameController} from '../../controller/${nameApi}/${nameController}/route';\n//CONTROLLER (NOT DELETE)` + routerArrAddController[1];
            let serverArrAddUse = newRouteFile.split("//ROUTER (NOT DELETE)");
            const newRouteFile_1 = serverArrAddUse[0] + `route.use("/${answers.entry.toLowerCase()}", ${nameController});\n//ROUTER (NOT DELETE)` + serverArrAddUse[1];
            console.log(yellow("UPDATE FILE"), path.join("config", "route", `route.${nameApi}.js`));
            fs.writeFileSync(path.join(baseService, "config", "route", `route.${nameApi}.js`), newRouteFile_1);

            config_ms_file.service[nameService].api[nameApi].controllers.push(answers.name.toLowerCase());
            Object.assign(config_ms_file.service[nameService].api[nameApi].controller, JSON.parse(`
            {
                "${answers.name.toLowerCase()}":{
                    "name":"${answers.name.toLowerCase()}"
                }
            }
            `));
            console.log(yellow("UPDATE FILE"), "config.ms.json");
            fs.writeFileSync(path.join(baseDir, "config.ms.json"), jsonFormat(config_ms_file));
        });
}