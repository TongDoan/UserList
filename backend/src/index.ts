import { ReadConfig } from "./config";
import * as express from "express";
import "./lib/express";
import "./ext/log";
import * as cors from "cors";

import { NewUsersAPI } from "./users/users.api";
import { UsersBLLBase } from "./users/users.bll.base";
import { UsersDALMongo } from "./users/users.dal.mongo";

import { MongoCommon } from "./lib/mongodb";
import { ExpressStaticFallback } from "./lib/express";

async function main() {
  const config = await ReadConfig();
  console.log(config);
  console.log(config);
  const client = await MongoCommon.Connect(config.database.db_url, {
    replica: false,
  });
  console.log("connected to database");
  const database = client.db(config.database.db_name);
  /******************************************************* */
  // const contextBLL = new ContextBLLBase(client);
  // const eventBLL = new EventBLLBase(database, contextBLL);
  // await eventBLL.init();

  // users
  const usersDAL = new UsersDALMongo(database);
  await usersDAL.init();
  const usersBLL = new UsersBLLBase(usersDAL);
  await usersBLL.init();

  /******************************************************* */

  /****************************************************** */
  const app = express();
  app.disable("x-powered-by");
  app.use(cors());
  app.use(express.json());
  app.use("/api/users", NewUsersAPI(usersBLL));
  /****************************************************** */
  app.use("/", ExpressStaticFallback(config.app.dir));
  console.log(`listen on ${config.server.port}`);
  app.listen(config.server.port, "0.0.0.0", () => {
    const err = arguments[0];
    if (err) {
      console.log(err);
    }
  });
  /****************************************************** */
}

const isSetup = process.argv[2] === "setup";

if (isSetup) {
  console.log("in setup mode");
  require("./setup/setup").SetupSampleData().catch(console.log);
} else {
  main().catch(console.log);
}
