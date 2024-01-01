"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_1 = __importDefault(require("./generators/json"));
const node_request_1 = __importDefault(require("./generators/javascript/node-request"));
const curlParser = { toJsonString: json_1.default, toNodeRequest: node_request_1.default };
exports.default = curlParser;
