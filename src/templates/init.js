export const init = [
    {
        "name": "package.json",
        "type": "file",
        "content": `
        {
            "name": "{{name}}",
            "version": "1.0.0",
            "description": "",
            "main": "index.js",
            "scripts": {
            },
            "author": "",
            "license": "ISC",
            "dependencies": {
              "axios": "^1.3.2",
              "body-parser": "^1.20.1",
              "cors": "^2.8.5",
              "crypto-js": "^4.1.1",
              "cryptr": "^6.1.0",
              "dotenv": "^16.0.3",
              "express": "4.18.2",
              "helmet": "6.0.1",
              "into-stream": "^7.0.0",
              "jsonwebtoken": "^9.0.0",
              "mime-types": "^2.1.35",
              "morgan": "^1.10.0",
              "multer": "^1.4.4",
              "node-fpdf": "github:MS-Marcks/node-fpdf",
              "nodemailer": "^6.9.1",
              "promise-mysql": "^5.2.0"
            },
            "devDependencies": {
              "@babel/cli": "^7.20.7",
              "@babel/core": "^7.20.12",
              "@babel/node": "^7.20.7",
              "@babel/preset-env": "^7.20.2",
              "@babel/register": "^7.18.9",
              "javascript-obfuscator": "^4.0.0",
              "nodemon": "^2.0.20",
              "path-browserify": "^1.0.1",
              "webpack": "^5.75.0",
              "webpack-cli": "^5.0.1",
              "webpack-node-externals": "^3.0.0"
            }
          }
        `,
        "parent": []
    },
    {
        "name": ".babelrc",
        "type": "file",
        "content": `
        {
            "presets": [
                [
                    "@babel/preset-env",
                    {
                        "targets" : {
                            "node":true
                        }
                    }
                ]
            ]
        }
        `,
        "parent": []
    },
    {
        "name": "webpack.config.js",
        "type": "file",
        "content": `
const path = require("path");
var nodeExternals = require('webpack-node-externals');
module.exports = {
    entry: "./dist/server.js",
    output: {
        filename: "server.js",
        path: path.resolve(path.resolve("."), "build")
    },
    resolve: {
        alias: {
            path: require.resolve("path-browserify")
        }
    },
    target: 'node',
    externals: [nodeExternals()]
}
        `,
        "parent": []
    },
    {
        "name": "env",
        "type": "folder",
        "parent": []
    },
    {
        "name": ".gitkeep",
        "type": "file",
        "content": "",
        "parent": ["env"]
    },
    {
        "name": "src",
        "type": "folder",
        "parent": []
    },
    {
        "name": ".gitignore",
        "type": "file",
        "content": `/node_modules
/dist
/build
        `,
        "parent": []
    },
    {
        "name": "config.ms.json",
        "type": "file",
        "content": `[]`,
        "parent": []
    }
]