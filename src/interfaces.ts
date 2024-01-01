export type YargsObj = {
    [x: string]: unknown;
    _: string[];
    $0: string;
}

export interface requestJson {
    url: string
    raw_url: string
    method: string
    cookies: object
    headers: object
    queries: object
    insecure: boolean
    auth: {
        user: string
        password: string
    }
}

export interface requestInterface {
    url: string
    urlWithoutQuery: string
    compressed: boolean
    query: object
    headers: object
    method: string
    cookies: object
    cookieString: string
    multipartUploads:object
    data: any
    isDataBinary: boolean
    isDataRaw: boolean
    auth: string
    dataArray: object
    insecure: boolean
}


