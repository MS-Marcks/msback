import { program } from 'commander';
import { readJSONFile } from "./utils/readJson.js";

import {
    command_version,
    command_create_project,
    command_create_service,
    command_create_api
} from './commands/index.js';

program.version(readJSONFile('package.json').version);

program
    .command('version')
    .description('Mostrar la versión del cliente')
    .action(command_version)

program
    .command('new')
    .description('Crear un nuevo proyecto')
    .action(command_create_project)

program
    .command('service')
    .description('Crear un nuevo servicio')
    .action(command_create_service)

program
    .command('api')
    .description('Crear una nueva api')
    .option('-s, --service <value>', 'Servicio a generar la api')
    .action(command_create_api)

/*
program
    .command('check')
    .description('Verificar la conexión a la base de datos')
    .action(command_check);

program
    .command('tables')
    .description('Listar las tablas de la base de datos')
    .action(command_list_table);

program
    .command('create <arg>')
    .description('Crear el procedimiento de creación (Sintaxis: ./sp create <Nombre de la tabla>)')
    .action(command_create);

program
    .command('search <arg>')
    .description('Crear el procedimiento de busqueda')
    .action(command_search);

program
    .command('update <arg>')
    .description('Crear el procedimiento de actulizar')
    .action(command_update);

program
    .command('delete <arg>')
    .description('Crear el procedimiento de eliminar')
    .action(command_delete);

program
    .command('all <arg>')
    .description('Crear los procedimientos de creación, busqueda, actualizar y eliminar')
    .action(command_all);*/

program.parse(process.argv);