const AUTHoptions_{{name}} = {
    auth: {
        UrlStart: "/session",
        ActiveTime: '2h',
        KEY_TOKEN: process.env.KEY_TOKEN_{{NAME}},
        NameToken: "access-token-{{name}}",
        EncryptionMethod: "HS256"
    },
    cors: { origin: "*" }
}
,
    {
        "name": "route.{{name}}.js",
        "type": "file",
        "content": `
'use strict';
import { Router } from 'express'
//CONTROLLER (NOT DELETE)
//CONTROLLER (NOT DELETE)

var route = Router();

//ROUTER (NOT DELETE)
//ROUTER (NOT DELETE)

export default route;
        `,
        "parent": ["config", "route"]
    },


    ,
    {
        "name": "{{name}}.security.js",
        "type": "file",
        "content": `
'use strict';
import * as CryptoJS from 'crypto-js';

if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config({ path: "./env/.{{name}.env" })
}

export const Encrypt = ( value ) => {
    return CryptoJS.AES.encrypt(value, process.env.HASH_ENCRYPT_{{NAME}}).toString();
}
export const Decrypt = (value) => {
    return CryptoJS.AES.decrypt(value, process.env.HASH_ENCRYPT_{{NAME}}).toString(CryptoJS.enc.Utf8);
}
        `,
        "parent": ["tools", "security"]
    },