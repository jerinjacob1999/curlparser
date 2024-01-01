declare const curlParser: {
    toJsonString: (curlCommand: string) => string;
    toNodeRequest: (curlCommand: string) => string;
};
export default curlParser;
