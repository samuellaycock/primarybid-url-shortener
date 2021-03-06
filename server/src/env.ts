/* istanbul ignore file */
const {
    LINK_URL = "https://pbid.io",
    LOG_LEVEL = "debug",
    MONGO_URL = "mongodb://localhost:27017/URLShortener",
    NODE_ENV = "development",
    PORT = "8080"
} = process.env;
const SERVICE_NAME = "url_shortener";
const FORMATTED_PORT = parseInt(PORT, 10)

export {
    LINK_URL,
    LOG_LEVEL,
    MONGO_URL,
    NODE_ENV,
    FORMATTED_PORT as PORT,
    SERVICE_NAME
};
