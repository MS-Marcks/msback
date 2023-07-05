import { spawn } from 'child_process';
import spinners from 'cli-spinners';
const spinnerStyle = spinners.dots;

function showLoading() {
    let i = 0;
    const spinnerFrames = spinnerStyle.frames;
    const interval = setInterval(() => {
        const frame = spinnerFrames[i];
        process.stdout.write(`\r${frame} instalando...`);
        i = (i + 1) % spinnerFrames.length;
    }, spinnerStyle.interval);

    return interval;
}

export function executeCommand(command, args, options) {
    const loadingInterval = showLoading();

    return new Promise((resolve, reject) => {
        const childProcess = spawn(command, args, options);

        childProcess.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        childProcess.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        childProcess.on('close', (code) => {
            if (code === 0) {
                clearInterval(loadingInterval);
                resolve();
            } else {
                reject(new Error(`Error al ejecutar el comando: ${command}`));
            }
        });
    });
}
