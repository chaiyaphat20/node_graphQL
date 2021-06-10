import express from "express";
import { server } from "./server";
const mongoose = require("mongoose");
import { config } from "./config";
const { db_endpoint, db_name, db_password, db_username, port } = config;

const createServer = async () => {
  try {
    const mongoURL = `mongodb+srv://${db_username}:${db_password}@${db_endpoint}/${db_name}?retryWrites=true&w=majority`;
    await mongoose
      .connect(mongoURL,{
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true 
      })
      .then()
      .catch((e) => console.log(e));
    const app = express();
    server.applyMiddleware({ app });

    app.listen({ port }, () => {
      console.log(`Sever ready http://localhost:${port}${server.graphqlPath}`);
    });
    return app;
  } catch (error) {
    console.log(error);
  }
};
createServer();
export { createServer };
