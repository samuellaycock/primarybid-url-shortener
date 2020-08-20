import APIMock from "./api";
import { mongo } from "mongoose";

interface MockResponse {
    headers: Headers;
    redirected: boolean;
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
    bodyUsed: boolean;
    type: ResponseType;
    body: ReadableStream<Uint8Array>;
    trailer: Promise<Headers>;
    clone: () => MockResponse;
    json: () => Promise<object>;
    text: () => Promise<string>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    blob: () => Promise<Blob>;
    formData: () => Promise<FormData>;
}

export default class FetchMock {
    _api: APIMock

    constructor(api: APIMock) {
        this._api = api || new APIMock();
        this.fetch = this.fetch.bind(this);
    }

    fetch(url: string, options: { method: string, body: string } = { method: "GET", body: "{}" }): Promise<MockResponse> {
        const {
            status,
            body: responseBody
        } = this._api.handleRequest(
            options.method,
            url,
            options.body ? JSON.parse(options.body) : null
        );

        const res = {
            headers: {} as Headers,
            redirected: false,
            ok: status < 400,
            status: status,
            statusText: "Mocked fetch response",
            url,
            bodyUsed: false,
            trailer: Promise.resolve(new Headers()),
            type: "basic" as ResponseType,
            body: {} as ReadableStream,
            clone: () => res as MockResponse,
            json: async () => responseBody,
            text: async () => JSON.stringify(responseBody),
            arrayBuffer: async () => {
                const encoder = new TextEncoder();

                return encoder.encode(JSON.stringify(responseBody))
            },
            blob: async () => new Blob([JSON.stringify(responseBody)] as BlobPart[]),
            formData: async () => new FormData()
        }

        return Promise.resolve(res);
    }
};
