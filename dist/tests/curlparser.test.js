"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("..")); // Adjust the import path based on your project structure
const curlstring = `curl -v -X DELETE https://api.airtable.com/v0/app2mBHGrEy9bAp1f/Table%201 \
-H "Authorization: Bearer YOUR_API_KEY" \
-G \
--data-urlencode 'records[]=rec05qRiM0gCsn0WI' \
--data-urlencode 'records[]=rec4xEHIQrO4IaQfq'`;
test('toJsonString function', () => {
    const result = __1.default.toJsonString(curlstring);
    // Log the actual result
    console.log('Actual toJsonString result:', result);
    // You can add more meaningful assertions based on your actual expected output
    expect(result).toBeDefined(); // For example, ensure the result is defined
});
test('toNodeRequest function', () => {
    const result = __1.default.toNodeRequest(curlstring);
    // Log the actual result
    console.log('Actual toNodeRequest result:', result);
    // You can add more meaningful assertions based on your actual expected output
    expect(result).toBeDefined(); // For example, ensure the result is defined
});
