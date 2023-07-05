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
