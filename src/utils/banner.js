import './colors.js';
import figlet from 'figlet';

export const banner = (msn) => {
    console.log();
    console.log(blue(figlet.textSync(msn, {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })));
}
