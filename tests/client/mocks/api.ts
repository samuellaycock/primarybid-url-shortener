import * as url from "url";
import * as casual from "casual";
import * as randomstring from "randomstring";

export default class APIMock {
    _state = {
        urls: []
    };

    constructor(existing: number = 10) {
        this._state.urls = new Array(existing)
            .fill(null)
            .map((_, index) => {
                const { url } = casual;
                const code = randomstring.generate({
                    length: 8,
                    capitalization: "lowercase"
                });
                const link = `https://test.com/${code}`;

                return {
                    url,
                    code,
                    link,
                    createdAt: new Date(Date.now() + (index * 60 * 60 * 1000)),
                    updatedAt: new Date(Date.now() + (index * 60 * 60 * 1000)),
                }
            })
            .reverse();
        this.handleRequest = this.handleRequest.bind(this);
    }

    handleRequest(method: string, endpoint: string, body: { url }) {
        if (method === "GET" && endpoint === "/api/v1/urls") {
            return {
                status: 200,
                body: {
                    status: 200,
                    success: true,
                    data: [...this._state.urls]
                }
            }
        }

        if (method === "POST" && endpoint === "/api/v1/urls") {
            if (!body.url) {
                return {
                    status: 422,
                    body: {
                        status: 422,
                        success: false,
                        error: "'url' is required"
                    }
                };
            }

            try {
                const parsed = url.parse(body.url);

                if (!parsed.hostname) {
                    throw new Error("Invalid URL");
                }
            } catch (_) {
                return {
                    status: 422,
                    body: {
                        status: 422,
                        success: false,
                        error: "'url' must be a valid URL"
                    }
                };
            }

            const code = randomstring.generate({
                length: 8,
                capitalization: "lowercase"
            });
            const link = `https://test.com/${code}`;
            const newUrl = {
                url,
                code,
                link,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            this._state.urls.unshift(newUrl);

            return {
                status: 200,
                body: {
                    status: 200,
                    success: true,
                    data: { ...newUrl }
                }
            };
        }

        if (method === "DELETE" && endpoint.match(/\/api\/v1\/urls\/.*/)) {
            const [, , , , code] = endpoint.split("/");
            const found = this._state.urls.findIndex(
                (url) => url.code === code
            );

            if (found === -1) {
                return {
                    status: 404,
                    body: {
                        status: 404,
                        success: false,
                        error: "Not found"
                    }
                };
            }

            this._state.urls.splice(found, 1);

            return {
                status: 200,
                body: {
                    status: 200,
                    success: true,
                    data: "URL deleted"
                }
            };
        }

        return {
            status: 404,
            body: {
                status: 404,
                success: false,
                error: "Not found"
            }
        };
    }

    getSnapshot() {
        return this._state;
    }
};
