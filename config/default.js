"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("../package.json"));
exports.default = {
    app: {
        name: package_json_1.default.name,
        version: package_json_1.default.version,
        description: package_json_1.default.description,
        env: process.env.NODE_ENV,
        startDate: new Date().toLocaleString('uk-UA'),
    },
};
