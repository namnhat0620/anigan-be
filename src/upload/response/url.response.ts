export class UrlResponse {
    static toString(url: string) {
        const baseUrl = "https://anigan-be-production.up.railway.app/";
        return `${baseUrl}${url}`
    }
}