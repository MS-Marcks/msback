import path from "path";

export const service = [
    {
        "name": "server.js",
        "type": "file",
        "content": path.join("src", "templates", "files", "service", "server.js.template"),
        "parent": ""
    },
    {
        "name": "config",
        "type": "folder",
        "content": "",
        "parent": ""
    },
    {
        "name": "db.js",
        "type": "file",
        "content": path.join("src", "templates", "files", "service", "db.js.template"),
        "parent": path.join("config")
    },
    {
        "name": "auth",
        "type": "folder",
        "content": "",
        "parent": path.join("config")
    },
    {
        "name": "index.js",
        "type": "file",
        "content": path.join("src", "templates", "files", "service", "auth.js.template"),
        "parent": path.join("config", "auth")
    },
    {
        "name": "route",
        "type": "folder",
        "content": "",
        "parent": path.join("config")
    },
    {
        "name": ".gitkeep",
        "type": "file",
        "content": path.join("src", "templates", "files", "service", ".gitkeep.template"),
        "parent": path.join("config", "route")
    },
    {
        "name": "controller",
        "type": "folder",
        "content": "",
        "parent": ""
    },
    {
        "name": ".gitkeep",
        "type": "file",
        "content": path.join("src", "templates", "files", "service", ".gitkeep.template"),
        "parent": path.join("controller")
    },
    {
        "name": "middleware",
        "type": "folder",
        "content": "",
        "parent": ""
    },
    {
        "name": "AuthMiddleware",
        "type": "folder",
        "content": "",
        "parent": path.join("middleware")
    },
    {
        "name": "index.js",
        "type": "file",
        "content": path.join("src", "templates", "files", "service", "authmiddleware.js.template"),
        "parent": path.join("middleware", "AuthMiddleware")
    },
    {
        "name": "tools",
        "type": "folder",
        "content": "",
        "parent": ""
    },
    {
        "name": "query",
        "type": "folder",
        "content": "",
        "parent": path.join("tools")
    },
    {
        "name": "index.js",
        "type": "file",
        "content": path.join("src", "templates", "files", "service", "query.js.template"),
        "parent": path.join("tools", "query")
    },
    {
        "name": "security",
        "type": "folder",
        "content": "",
        "parent": path.join("tools")
    },
    {
        "name": ".gitkeep",
        "type": "file",
        "content": path.join("src", "templates", "files", "service", ".gitkeep.template"),
        "parent": path.join("tools", "security")
    },
    {
        "name": ".env.{{name}}",
        "type": "file",
        "content": path.join("src", "templates", "files", "service", ".env.template"),
        "parent": path.join("..", "..", "env")
    }
]