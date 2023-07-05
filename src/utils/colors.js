// -------------- COLORS FONT -----------------

const CF = {
    BLACK: "\x1b[30m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
    GRAY: "\x1b[39m",
    END: "\x1b[0m"
}


// -------------- COLORS BACKGROUND --------------

const CB = {
    BLACK: "\x1b[40m",
    RED: "\x1b[41m",
    GREEN: "\x1b[42m",
    YELLOW: "\x1b[43m",
    BLUE: "\x1b[44m",
    MAGENTA: "\x1b[45m",
    CYAN: "\x1b[46m",
    WHITE: "\x1b[47m",
    END: "\x1b[0m"
}

global.black = (str) => {
    return `${CF["BLACK"]}${str}${CF["END"]}`
}
global.red = (str) => {
    return `${CF["RED"]}${str}${CF["END"]}`
}
global.green = (str) => {
    return `${CF["GREEN"]}${str}${CF["END"]}`
}
global.yellow = (str) => {
    return `${CF["YELLOW"]}${str}${CF["END"]}`
}
global.blue = (str) => {
    return `${CF["BLUE"]}${str}${CF["END"]}`
}
global.magenta = (str) => {
    return `${CF["MAGENTA"]}${str}${CF["END"]}`
}
global.cyan = (str) => {
    return `${CF["CYAN"]}${str}${CF["END"]}`
}
global.white = (str) => {
    return `${CF["WHITE"]}${str}${CF["END"]}`
}
global.gray = (str) => {
    return `${CF["GRAY"]}${str}${CF["END"]}`
}

global.Bblack = (str) => {
    return `${CB["BLACK"]}${str}${CB["END"]}`
}

global.Bred = (str) => {
    return `${CB["RED"]}${str}${CB["END"]}`
}
global.Bgreen = (str) => {
    return `${CB["GREEN"]}${str}${CB["END"]}`
}
global.Byellow = (str) => {
    return `${CB["YELLOW"]}${str}${CB["END"]}`
}
global.Bblue = (str) => {
    return `${CB["BLUE"]}${str}${CB["END"]}`
}
global.Bmagenta = (str) => {
    return `${CB["MAGENTA"]}${str}${CB["END"]}`
}
global.Bcyan = (str) => {
    return `${CB["CYAN"]}${str}${CB["END"]}`
}
global.Bwhite = (str) => {
    return `${CB["WHITE"]}${str}${CB["END"]}`
}
global.Bgray = (str) => {
    return `${CB["GRAY"]}${str}${CB["END"]}`
}