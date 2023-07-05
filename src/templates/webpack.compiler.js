import path from "path";

export const webpack = {
    "name": "webpack.config.js",
    "type": "file",
    "content": path.join("src", "templates", "files", "compiler", "webpack.config.js.template"),
    "parent": ""
}

export const webpack_modules = {
    "modules": {
        "path-browserify": "^1.0.1",
        "webpack": "^5.75.0",
        "webpack-cli": "^5.0.1",
        "webpack-node-externals": "^3.0.0"
    }
}