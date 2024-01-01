"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const curlstring = `curl -v -X DELETE https://api.airtable.com/v0/app2mBHGrEy9bAp1f/Table%201 \
-H "Authorization: Bearer YOUR_API_KEY" \
-G \
--data-urlencode 'records[]=rec05qRiM0gCsn0WI' \
--data-urlencode 'records[]=rec4xEHIQrO4IaQfq'`;
const result = __1.curlparser.toJsonString(curlstring);
console.log(result);
const tonode = __1.curlparser.toNodeRequest(curlstring);
console.log(tonode);
