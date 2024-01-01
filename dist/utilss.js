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
exports.serializeCookies = void 0;
const query_string_1 = __importDefault(require("query-string"));
const URL = __importStar(require("url"));
const yargs_1 = __importDefault(require("yargs"));
const cookie_1 = __importDefault(require("cookie"));
//import yargs from '@curlconverter/yargs-parser'
//const URL = require('ur')
//const querystring = require('query-string')
// const nunjucks = require('nunjucks')
// const env = nunjucks.configure(['templates/'], { // set folders with templates
//   autoescape: false
// })
// env.addFilter('isArr', something => Array.isArray(something))
// env.addFilter('isString', something => typeof something === 'string')
// env.addFilter('isNumber', something => typeof something === 'number')
const has = (obj, prop) => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};
const buildRequest = (parsedArguments) => {
    // TODO: handle multiple URLs
    if (!parsedArguments.url || !parsedArguments.url.length) {
        // TODO: better error message (could be parsing fail)
        throw 'no URL specified!';
    }
    console.log(parsedArguments);
    let url = parsedArguments.url;
    let headers;
    let cookieString;
    if (parsedArguments.header) {
        if (!headers) {
            headers = {};
        }
        //convert header to array
        if (!Array.isArray(parsedArguments.header)) {
            parsedArguments.header = [parsedArguments.header];
        }
        parsedArguments.header.forEach(header => {
            if (header.indexOf('Cookie') !== -1) {
                cookieString = header;
            }
            else {
                const components = header.split(/:(.*)/s);
                if (components[1]) {
                    headers[components[0]] = components[1].trim();
                }
            }
        });
    }
    if (parsedArguments['user-agent']) {
        if (!headers) {
            headers = {};
        }
        headers['User-Agent'] = parsedArguments['user-agent'];
    }
    if (parsedArguments.cookie) {
        cookieString = parsedArguments.cookie;
    }
    let multipartUploads;
    if (parsedArguments.form) {
        multipartUploads = {};
        parsedArguments.form.forEach(multipartArgument => {
            // input looks like key=value. value could be json or a file path prepended with an @
            // TODO: what if multipartArgument is empty string?
            // TODO: if string has more than one '=', this throws away data
            const [key, value] = multipartArgument.split('=', 2);
            multipartUploads[key] = value;
        });
    }
    let cookies;
    if (cookieString) {
        const cookieParseOptions = { decode: (s) => s };
        // separate out cookie headers into separate data structure
        // note: cookie is case insensitive
        cookies = cookie_1.default.parse(cookieString.replace(/^Cookie: /gi, ''), cookieParseOptions);
    }
    // TODO: don't lower case method,
    // curl expects you to uppercase always, if you do -X PoSt, that's
    // what it will put as the method and we should do the same.
    // TODO: read curl's source to figure out precedence rules.
    let method;
    if (parsedArguments.X === 'POST') {
        method = 'post';
    }
    else if (parsedArguments.X === 'PUT' ||
        parsedArguments.T) {
        method = 'put';
    }
    else if (parsedArguments.X === 'PATCH') {
        method = 'patch';
    }
    else if (parsedArguments.X === 'DELETE') {
        method = 'delete';
    }
    else if (parsedArguments.X === 'OPTIONS') {
        method = 'options';
    }
    else if ((parsedArguments.d ||
        parsedArguments.data ||
        parsedArguments['data-ascii'] ||
        parsedArguments['data-binary'] ||
        parsedArguments['data-raw'] ||
        parsedArguments.F ||
        parsedArguments.form) && !((parsedArguments.G || parsedArguments.get))) {
        method = 'post';
    }
    else if (parsedArguments.I ||
        parsedArguments.head) {
        method = 'head';
    }
    else {
        method = 'get';
    }
    const urlObject = URL.parse(url); // eslint-disable-line
    // if GET request with data, convert data to query string
    // NB: the -G flag does not change the http verb. It just moves the data into the url.
    if (parsedArguments.get) {
        urlObject.query = urlObject.query ? urlObject.query : '';
        if (has(parsedArguments, 'data')) {
            let urlQueryString = '';
            if (url.indexOf('?') < 0) {
                url += '?';
            }
            else {
                urlQueryString += '&';
            }
            urlQueryString += parsedArguments.data.join('&');
            urlObject.query += urlQueryString;
            url += urlQueryString;
            delete parsedArguments.data;
        }
    }
    if (urlObject.query && urlObject.query.endsWith('&')) {
        urlObject.query = urlObject.query.slice(0, -1);
    }
    const query = query_string_1.default.parse(urlObject.query, { sort: false });
    for (const param in query) {
        if (query[param] === null) {
            query[param] = '';
        }
    }
    urlObject.search = null; // Clean out the search/query portion.
    const request = {
        url: url.replace(/'/g, "").replace(/"/g, ""),
        urlWithoutQuery: decodeURIComponent(URL.format(urlObject)).replace(/'/g, "").replace(/"/g, "")
    };
    if (parsedArguments.compressed) {
        request.compressed = true;
    }
    if (Object.keys(query).length > 0) {
        request.query = query;
    }
    if (headers) {
        request.headers = headers;
    }
    request.method = method;
    if (cookies) {
        request.cookies = cookies;
        request.cookieString = cookieString.replace('Cookie: ', '');
    }
    if (multipartUploads) {
        request.multipartUploads = multipartUploads;
    }
    // TODO: all of these could be specified in the same command.
    // They also need to maintain order.
    // TODO: do all of these allow @file?
    // TODO: set Content-Type downstream for some of these
    if (parsedArguments.data) {
        request.data = parsedArguments.data;
    }
    else if (parsedArguments['data-binary']) {
        request.data = parsedArguments['data-binary'];
        request.isDataBinary = true;
    }
    else if (parsedArguments['data-ascii']) {
        request.data = parsedArguments['data-ascii'];
    }
    else if (parsedArguments['data-raw']) {
        request.data = parsedArguments['data-raw'];
        request.isDataRaw = true;
    }
    else if (parsedArguments['data-urlencode']) {
        // TODO: this doesn't exactly match curl
        // all '&' and all but the first '=' need to be escaped
        request.data = parsedArguments['data-urlencode'];
    }
    if (parsedArguments.user) {
        request.auth = parsedArguments.user;
    }
    if (has(request, 'data')) {
        if (request.data.length > 1) {
            request.dataArray = request.data;
            request.data = request.data.join('&');
        }
        else {
            request.data = request.data[0];
        }
    }
    if (parsedArguments.insecure) {
        request.insecure = true;
    }
    return request;
};
const parseCurlCommand = (curlCommand) => {
    // Remove newlines (and from continuations)
    curlCommand = curlCommand.replace(/\\\r|\\\n/g, '');
    // Remove extra whitespace
    curlCommand = curlCommand.replace(/\s+/g, ' ');
    // yargs parses -XPOST as separate arguments. just prescreen for it.
    curlCommand = curlCommand.replace(/ -XPOST/, ' -X POST');
    curlCommand = curlCommand.replace(/ -XGET/, ' -X GET');
    curlCommand = curlCommand.replace(/ -XPUT/, ' -X PUT');
    curlCommand = curlCommand.replace(/ -XPATCH/, ' -X PATCH');
    curlCommand = curlCommand.replace(/ -XDELETE/, ' -X DELETE');
    // Safari adds `-Xnull` if is unable to determine the request type, it can be ignored
    curlCommand = curlCommand.replace(/ -Xnull/, ' ');
    curlCommand = curlCommand.trim();
    // Parse with some understanding of the meanings of flags.  In particular,
    // boolean flags can be trouble if the URL to fetch follows immediately
    // after, since it will be taken as an argument to the flag rather than
    // interpreted as a positional argument.  Someone should add all the flags
    // likely to cause trouble here.
    const parsedArguments = yargs_1.default
        .boolean(['I', 'head', 'compressed', 'L', 'k', 'silent', 's'])
        .alias('H', 'header')
        .alias('A', 'user-agent')
        .parse(curlCommand);
    console.log(parsedArguments);
    //set url to build request data
    parsedArguments.url = parsedArguments._[1];
    const request = buildRequest(parsedArguments);
    console.log(request);
    return request;
};
const serializeCookies = (cookieDict) => {
    let cookieString = '';
    let i = 0;
    const cookieCount = Object.keys(cookieDict).length;
    for (const cookieName in cookieDict) {
        const cookieValue = cookieDict[cookieName];
        cookieString += cookieName + '=' + cookieValue;
        if (i < cookieCount - 1) {
            cookieString += '; ';
        }
        i++;
    }
    return cookieString;
};
exports.serializeCookies = serializeCookies;
exports.default = parseCurlCommand;
