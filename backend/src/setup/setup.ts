import { ReadConfig } from "../config";
import { MongoCommon } from "../lib/mongodb";

async function SetupSampleData() {
  const config = await ReadConfig();
  console.log(new Date(), config);
  const client = await MongoCommon.Connect(config.database.db_url, {
    replica: false,
  });
  console.log(new Date(), "connected to database");
  const database = client.db(config.database.db_name);
  console.log(new Date(), `setup finished`);
}

module.exports = {
  SetupSampleData,
};
