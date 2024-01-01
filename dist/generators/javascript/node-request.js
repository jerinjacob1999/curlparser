"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsesc_1 = __importDefault(require("jsesc"));
const util_1 = __importStar(require("../../util"));
const toNodeRequest = (curlCommand) => {
    const request = (0, util_1.default)(curlCommand);
    let nodeRequestCode = 'var request = require(\'request\');\n\n';
    if (request.headers || request.cookies) {
        nodeRequestCode += 'var headers = {\n';
        const headerCount = Object.keys(request.headers).length;
        let i = 0;
        for (const headerName in request.headers) {
            nodeRequestCode += '    \'' + headerName + '\': \'' + request.headers[headerName] + '\'';
            if (i < headerCount - 1 || request.cookies) {
                nodeRequestCode += ',\n';
            }
            else {
                nodeRequestCode += '\n';
            }
            i++;
        }
        if (request.cookies) {
            const cookieString = (0, util_1.serializeCookies)(request.cookies);
            nodeRequestCode += '    \'Cookie\': \'' + cookieString + '\'\n';
        }
        nodeRequestCode += '};\n\n';
    }
    if (request.data === true) {
        request.data = '';
    }
    if (request.data) {
        if (typeof request.data === 'number') {
            request.data = request.data.toString();
        }
        // escape single quotes if there are any in there
        if (request.data.indexOf("'") > -1) {
            request.data = (0, jsesc_1.default)(request.data);
        }
        nodeRequestCode += 'var dataString = \'' + request.data + '\';\n\n';
    }
    nodeRequestCode += 'var options = {\n';
    nodeRequestCode += '    url: \'' + request.url + '\'';
    if (request.method !== 'get') {
        nodeRequestCode += ',\n    method: \'' + request.method.toUpperCase() + '\'';
    }
    if (request.headers || request.cookies) {
        nodeRequestCode += ',\n';
        nodeRequestCode += '    headers: headers';
    }
    if (request.data) {
        nodeRequestCode += ',\n    body: dataString';
    }
    if (request.auth) {
        nodeRequestCode += ',\n';
        const splitAuth = request.auth.split(':');
        const user = splitAuth[0] || '';
        const password = splitAuth[1] || '';
        nodeRequestCode += '    auth: {\n';
        nodeRequestCode += "        'user': '" + user + "',\n";
        nodeRequestCode += "        'pass': '" + password + "'\n";
        nodeRequestCode += '    }\n';
    }
    else {
        nodeRequestCode += '\n';
    }
    nodeRequestCode += '};\n\n';
    // nodeRequestCode += 'function callback(error, response, body) {\n'
    // nodeRequestCode += '    if (!error && response.statusCode == 200) {\n'
    // nodeRequestCode += '        console.log(body);\n'
    // nodeRequestCode += '    }\n'
    // nodeRequestCode += '}\n\n'
    nodeRequestCode += 'request(options, callback);';
    return nodeRequestCode + '\n';
};
exports.default = toNodeRequest;
