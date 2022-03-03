export type HttpRequest = {
    body?:any,
    headers?:any
}

export type HttpResponse = {
    statusCode: number
    data?: any,
}
