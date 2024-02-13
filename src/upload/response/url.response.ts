export class UrlResponse {
    url: string
    constructor(data?: string) {
        const baseUrl = "https://anigan-be-production.up.railway.app/";
        this.url = `${baseUrl}${data}`;
    }
}