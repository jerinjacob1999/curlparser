"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_1 = require("./generators/json");
const node_request_1 = require("./generators/javascript/node-request");
const curlParser = { toJsonString: json_1.default, toNodeRequest: node_request_1.default };
exports.default = curlParser;
