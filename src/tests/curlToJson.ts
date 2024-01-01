import curlParser from "../index";


const curlstring = `curl -v -X DELETE https://api.airtable.com/v0/app2mBHGrEy9bAp1f/Table%201 \
-H "Authorization: Bearer YOUR_API_KEY" \
-G \
--data-urlencode 'records[]=rec05qRiM0gCsn0WI' \
--data-urlencode 'records[]=rec4xEHIQrO4IaQfq'`
const result  = curlParser.toJsonString(curlstring)
console.log(result);
const tonode = curlParser.toNodeRequest(curlstring);
console.log(tonode);
