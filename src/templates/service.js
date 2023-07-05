export const service = [
    {
        "name": "server.js",
        "type": "file",
        "content": `
import express from 'express'
import helmet from "helmet"
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import auth from './middleware/AuthMiddleware';

//ROUTE (NOT DELETE)
//ROUTE (NOT DELETE)

//AUTH (NOT DELETE)
import {

} from './config/auth'
//AUTH (NOT DELETE)

if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config({ path: "./env/.{{name}}.env" })
}

const app = express()
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('common'))
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: "10mb" }))
app.use(helmet());

//API (NOT DELETE)
//API (NOT DELETE)

app.get('/', (req, res) => { res.send('Welcome {{name}} orchestrator v1.1') })

const server = app.listen(process.env.PORT, () => {
    console.log("http://localhost:"+server.address().port)
})

export default app
        `,
        "parent": []
    },
    {
        "name": "config",
        "type": "folder",
        "parent": []
    },
    {
        "name": "db.js",
        "type": "file",
        "content": `
'use strict';
if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config({ path: "./env/.{{name}}.env" })
}

const Connect = {
    host: process.env.DB_HOST ,
    user:  process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database:  process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    multipleStatements: true
}

export default Connect;
        `,
        "parent": ["config"]
    },
    {
        "name": "auth",
        "type": "folder",
        "parent": ["config"]
    },
    {
        "name": "index.js",
        "type": "file",
        "content": `
'use strict';
if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config({ path: "./env/.{{name}}.env" })
}

//AUTH (NOT DELETE)
//AUTH (NOT DELETE)

//IMPORT (NOT DELETE)
module.exports = {    
}
//IMPORT (NOT DELETE)
        `,
        "parent": ["config", "auth"]
    },
    {
        "name": "route",
        "type": "folder",
        "parent": ["config"]
    },
    {
        "name": ".gitkeep",
        "type": "file",
        "content": ``,
        "parent": ["config", "route"]
    },
    {
        "name": "controller",
        "type": "folder",
        "parent": []
    },
    {
        "name": ".gitkeep",
        "type": "file",
        "content": ``,
        "parent": ["controller"]
    },
    {
        "name": "middleware",
        "type": "folder",
        "parent": []
    },
    {
        "name": "AuthMiddleware",
        "type": "folder",
        "parent": ["middleware"]
    },
    {
        "name": "index.js",
        "type": "file",
        "content": `
        'use strict'
        const jwt = require('jsonwebtoken');
        exports = module.exports = AUTH
        
        function AUTH(options) {
            var opts = {}
            if (options) {
                for (var prop in options) {
                    if (prop !== 'type') {
                        opts[prop] = options[prop]
                    }
                }
            }
            return function AUTH(req, res, next) {
                Security(req, res, next, opts)
            }
        }
        
        function Security(req, res, next, data) {
            if (typeof data.Ignore !== 'undefined') {
                let partUrl = req.url.split("/");
                data.Ignore.forEach(e => {
                    if (e.indexOf("?") != -1) {
                        let PartUrlTmp = partUrl;
                        let tmpUrl = e.split("/");
                        while (tmpUrl.indexOf("?") != -1) { tmpUrl[tmpUrl.indexOf("?")] = PartUrlTmp[tmpUrl.indexOf("?")]; }
                        if (tmpUrl.join("/") == PartUrlTmp.join("/")) { return next() }
                    } else if (e == req.url) { return next() }
                });
            }
            if (typeof data === 'undefined' || typeof data.UrlStart === 'undefined' || typeof data.KEY_TOKEN === 'undefined' || typeof data.NameToken === 'undefined') {
                return next(new Error("FALTAN CAMPOS PARA RELLENAR EN OBJETO COLOCADO EN MIDDLEWARE"))
        
            } else if (req.url == data.UrlStart) {
                let optsToken = {}
                if (typeof data.EncryptionMethod !== 'undefined') {
                    if (VerifyEncryptionMethod(data.EncryptionMethod)) {
                        optsToken.algorithm = data.EncryptionMethod;
                    } else { next(new Error("ERROR METODO DE ENCRIPTACION NO VALIDO")) }
                }
                if (typeof data.ActiveTime !== 'undefined') { optsToken.expiresIn = data.ActiveTime; }
                req.GenerateToken = (option) => {
                    return jwt.sign({ option }, data.KEY_TOKEN, optsToken)
                };
                return next()
            } else {
                const BearerHeader = req.headers[data.NameToken];
                if (typeof BearerHeader !== 'undefined') {
                    const bearer = BearerHeader.split(" ");
                    const Token = bearer[1];
                    jwt.verify(Token, data.KEY_TOKEN, (err, data) => {
                        if (err) { res.sendStatus(403); }
                        else { req.user = data; return next() }
                    })
                } else {
                    res.sendStatus(403);
                }
            }
        }
        function VerifyEncryptionMethod(Method) {
            switch (Method) {
                case "HS256":
                    return true;
                    break;
                case "HS384":
                    return true;
                    break;
                case "HS512":
                    return true;
                    break;
                case "RS256":
                    return true;
                    break;
                case "RS384":
                    return true;
                    break;
                case "RS512":
                    return true;
                    break;
                case "ES256":
                    return true;
                    break;
                case "ES384":
                    return true;
                    break;
                case "ES512":
                    return true;
                    break;
                case "PS256":
                    return true;
                    break;
                case "PS384":
                    return true;
                    break;
                case "PS512":
                    return true;
                    break;
                default:
                    return false;
                    break;
            }
        
        }
        `,
        "parent": ["middleware", "AuthMiddleware"]
    },
    {
        "name": "tools",
        "type": "folder",
        "parent": []
    },
    {
        "name": "query",
        "type": "folder",
        "parent": ["tools"]
    },
    {
        "name": "index.js",
        "type": "file",
        "content": `
        'use strict';
import Connect from '../../config/db';
import mysql from 'promise-mysql';

export const query = async (sp, body = null) => {
    try {
        const connection = await mysql.createConnection(Connect);
        try {
            await connection.beginTransaction();
            const query = (body === null) ? await connection.query(sp) : await connection.query(sp, body);
            await connection.commit(); await connection.end();
            return { code: 200, query: query };
        } catch (err) {
            await connection.rollback(); await connection.end();
            return { code: 404, err: err };
        }
    } catch (err) {
        return { code: 404, err: err };
    }
}
        `,
        "parent": ["tools", "query"]
    },
    {
        "name": "security",
        "type": "folder",
        "parent": ["tools"]
    },
    {
        "name": ".gitkeep",
        "type": "file",
        "content": ``,
        "parent": ["tools", "security"]
    },
]