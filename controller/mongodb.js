const config = require("config");
const MongoClient = require('mongodb').MongoClient;
const url = config.get("mongodb.url");
const client = new MongoClient(url);
const dbName = 'aces';

async function summary() {
  await client.connect();
  console.log('Connected successfully to Mongodb server');
  const db = client.db(dbName);
  const collection = db.collection('person');

  const findResult = await collection.countDocuments({});
  console.log('Found documents =>', findResult);

  return 'done.';
}
