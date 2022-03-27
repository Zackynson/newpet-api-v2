export type HttpRequest<T> = {
    body?:T | any,
    headers?:any
}

export type HttpResponse = {
    statusCode: number
    data?: any,
    error?: Error
}
