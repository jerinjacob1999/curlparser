"use strict";
// Author: ssi-anik (sirajul.islam.anik@gmail.com)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("../util"));
const query_string_1 = __importDefault(require("query-string"));
const jsesc_1 = __importDefault(require("jsesc"));
//import 'string.prototype.startswith'
function repr(value, isKey = false) {
    // In context of url parameters, don't accept nulls and such.
    /*
      if ( !value ) {
     return ""
     } else {
     return "'" + jsesc(value, { quotes: 'single' }) + "'"
     } */
    return isKey ? "'" + (0, jsesc_1.default)(value, { quotes: 'single' }) + "'" : value;
}
function getQueries(request) {
    const queries = {};
    for (const paramName in request.query) {
        const rawValue = request.query[paramName];
        let paramValue;
        if (Array.isArray(rawValue)) {
            paramValue = rawValue.map((item) => repr(item));
        }
        else {
            paramValue = repr(rawValue);
        }
        queries[repr(paramName)] = paramValue;
    }
    return queries;
}
function getDataString(request) {
    if (typeof request.data === 'number') {
        request.data = request.data.toString();
    }
    /*
      if ( !request.isDataRaw && request.data.startsWith('@') ) {
     var filePath = request.data.slice(1);
     return filePath;
     }
     */
    const parsedQueryString = query_string_1.default.parse(request.data, { sort: false });
    const keyCount = Object.keys(parsedQueryString).length;
    const singleKeyOnly = keyCount === 1 && !parsedQueryString[Object.keys(parsedQueryString)[0]];
    const singularData = request.isDataBinary || singleKeyOnly;
    if (singularData) {
        const data = {};
        data[repr(request.data)] = '';
        return { data: data };
    }
    else {
        return getMultipleDataString(request, parsedQueryString);
    }
}
function getMultipleDataString(request, parsedQueryString) {
    const data = {};
    for (const key in parsedQueryString) {
        const value = parsedQueryString[key];
        if (Array.isArray(value)) {
            data[repr(key)] = value;
        }
        else {
            data[repr(key)] = repr(value);
        }
    }
    return { data: data };
}
function getFilesString(request) {
    const data = {
        files: {},
        data: {}
    };
    data.files = {};
    data.data = {};
    for (const multipartKey in request.multipartUploads) {
        const multipartValue = request.multipartUploads[multipartKey];
        if (multipartValue.startsWith('@')) {
            const fileName = multipartValue.slice(1);
            data.files[repr(multipartKey)] = repr(fileName);
        }
        else {
            data.data[repr(multipartKey)] = repr(multipartValue);
        }
    }
    if (Object.keys(data.files).length === 0) {
        delete data.files;
    }
    if (Object.keys(data.data).length === 0) {
        delete data.data;
    }
    return data;
}
const toJsonString = (curlCommand) => {
    const request = (0, util_1.default)(curlCommand);
    let requestJson = {};
    // curl automatically prepends 'http' if the scheme is missing, but python fails and returns an error
    // we tack it on here to mimic curl
    if (!request.url.match(/https?:/)) {
        request.url = 'http://' + request.url;
    }
    if (!request.urlWithoutQuery.match(/https?:/)) {
        request.urlWithoutQuery = 'http://' + request.urlWithoutQuery;
    }
    requestJson.url = request.urlWithoutQuery.replace(/\/$/, '');
    requestJson.raw_url = request.url;
    requestJson.method = request.method;
    if (request.cookies) {
        const cookies = {};
        for (const cookieName in request.cookies) {
            cookies[repr(cookieName)] = repr(request.cookies[cookieName]);
        }
        requestJson.cookies = cookies;
    }
    if (request.headers) {
        const headers = {};
        for (const headerName in request.headers) {
            headers[repr(headerName)] = repr(request.headers[headerName]);
        }
        requestJson.headers = headers;
    }
    if (request.query) {
        requestJson.queries = getQueries(request);
    }
    if (typeof request.data === 'string' || typeof request.data === 'number') {
        Object.assign(requestJson, getDataString(request));
    }
    else if (request.multipartUploads) {
        Object.assign(requestJson, getFilesString(request));
    }
    if (request.insecure) {
        requestJson.insecure = false;
    }
    if (request.auth) {
        const splitAuth = request.auth.split(':');
        const user = splitAuth[0] || '';
        const password = splitAuth[1] || '';
        requestJson.auth = {
            user: repr(user),
            password: repr(password)
        };
    }
    return JSON.stringify(Object.keys(requestJson).length ? requestJson : '{}', null, 4) + '\n';
};
exports.default = toJsonString;
