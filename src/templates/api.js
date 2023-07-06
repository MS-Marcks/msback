import path from "path";

export const api = [
    {
        "name": "security.{{name}}.js",
        "type": "file",
        "content": path.join("src", "templates", "files", "api", "security.js.template"),
        "parent": path.join("tools", "security"),
    },
    {
        "name": "route.{{name}}.js",
        "type": "file",
        "content": path.join("src", "templates", "files", "api", "route.js.template"),
        "parent": path.join("config", "route"),
    }
]