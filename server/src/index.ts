import dotenv from "dotenv";

dotenv.config();

import server from "./server";
import database from "./database";

(async () => {
    await database.connect();
    await server.listen();
})();
