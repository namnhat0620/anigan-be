export class UrlResponse {
    static toString(url: string) {
        return `${process.env.BE_SERVER_URL}/${url}`
    }
}