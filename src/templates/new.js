import path from "path";

export const project = [
    {
        "name": "package.json",
        "type": "file",
        "content": path.join("src", "templates", "files", "new", "package.json.template"),
        "parent": ""
    },
    {
        "name": ".babelrc",
        "type": "file",
        "content": path.join("src", "templates", "files", "new", ".babelrc.template"),
        "parent": ""
    },
    {
        "name": "env",
        "type": "folder",
        "content": "",
        "parent": ""
    },
    {
        "name": ".gitkeep",
        "type": "file",
        "content": path.join("src", "templates", "files", "new", ".gitkeep.template"),
        "parent": path.join("env"),
    },
    {
        "name": "src",
        "type": "folder",
        "content": "",
        "parent": ""
    },
    {
        "name": ".gitkeep",
        "type": "file",
        "content": path.join("src", "templates", "files", "new", ".gitkeep.template"),
        "parent": path.join("src"),
    },
    {
        "name": ".gitignore",
        "type": "file",
        "content": path.join("src", "templates", "files", "new", ".gitignore.template"),
        "parent": ""
    },
    {
        "name": "config.ms.json",
        "type": "file",
        "content": path.join("src", "templates", "files", "new", "config.ms.json.template"),
        "parent": ""
    }
]