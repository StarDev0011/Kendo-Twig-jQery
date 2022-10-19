const config = require("config");
const MongoClient = require('mongodb').MongoClient;
const url = config.get("mongodb.url");
const client = new MongoClient(url);
const dbName = config.get("mongodb.database");
const contact = config.get("mongodb.collection.contact");

async function contactSummary() {
  await client.connect();
  console.log('Connected successfully to Mongodb server');
  const db = client.db(dbName);
  const collection = db.collection(contact);

  const result = {
    contacts: await collection.countDocuments({}),
    addresses: await collection.countDocuments({addresses: {$type: "array", $ne: []}}),
    validAddresses: await collection.countDocuments({"addresses.verified.status": "verified"}),
    emails: await collection.countDocuments({"emails.address": {$nin: [null, ""]}}),
    phones: await collection.countDocuments({"telephones.number": {$nin: [null, ""]}})
  };
  console.log('Found documents =>', result);

  return result;
}

module.exports.contactSummary = contactSummary;
