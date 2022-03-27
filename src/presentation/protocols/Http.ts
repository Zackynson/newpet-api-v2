export type HttpRequest<T> = {
    body?:T | any,
    headers?:any,
    userId?:string
}

export type HttpResponse = {
    statusCode: number
    data?: any,
    error?: Error
}
