import toJsonString from "./generators/json";
import toNodeRequest from "./generators/javascript/node-request";

const curlParser = { toJsonString, toNodeRequest };

export default curlParser;