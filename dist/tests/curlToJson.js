"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const curlstring = `curl -v -X DELETE https://api.airtable.com/v0/app2mBHGrEy9bAp1f/Table%201 \
-H "Authorization: Bearer YOUR_API_KEY" \
-G \
--data-urlencode 'records[]=rec05qRiM0gCsn0WI' \
--data-urlencode 'records[]=rec4xEHIQrO4IaQfq'`;
const result = index_1.default.toJsonString(curlstring);
console.log(result);
const tonode = index_1.default.toNodeRequest(curlstring);
console.log(tonode);
