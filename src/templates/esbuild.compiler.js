import path from "path";

export const esbuild = {
    "name": "esbuild.config.js",
    "type": "file",
    "content": path.join("src", "templates", "files", "compiler", "esbuild.config.js.template"),
    "parent": ""
}

export const esbuild_modules = {
    "modules": {
        "esbuild": "0.18.11"
    }
}