import mongoose from "mongoose";
import mongoDbMemoryServer from "mongodb-memory-server";

beforeAll(async () => {
    const mongodb = new mongoDbMemoryServer.MongoMemoryServer();
    const url = await mongodb.getConnectionString();

    await mongoose.connect(url, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    });
});
  
afterAll(async () => {
    await mongoose.disconnect();
    await MONGODB.stop();
});
