import server from "./server";
import database from "./database";

(async () => {
    await database.connect();
    await server.listen();
})();
