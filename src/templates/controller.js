import path from "path";

export const controller = [
    {
        "name": "controller",
        "type": "folder",
        "content": "",
        "parent": path.join("{{name}}")
    },
    {
        "name": "route",
        "type": "folder",
        "content": "",
        "parent": path.join("{{name}}")
    },
    {
        "name": "index.js",
        "type": "file",
        "content": path.join("src", "templates", "files", "controller", "controller{{option}}.js.template"),
        "parent": path.join("{{name}}", "controller"),
    },
    {
        "name": "index.js",
        "type": "file",
        "content": path.join("src", "templates", "files", "controller", "route.js.template"),
        "parent": path.join("{{name}}", "route"),
    }
]