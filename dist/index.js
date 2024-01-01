"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curlparser = void 0;
const json_1 = require("./generators/json");
const node_request_1 = require("./generators/javascript/node-request");
exports.curlparser = { toJsonString: json_1.default, toNodeRequest: node_request_1.default };
