import { requestInterface } from './interfaces';
declare const parseCurlCommand: (curlCommand: string) => requestInterface;
export declare const serializeCookies: (cookieDict: any) => string;
export default parseCurlCommand;
