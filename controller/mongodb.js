const MongoClient = require("mongodb").MongoClient;

const config = require("config"),
  uri = config.get("mongodb.url"),
  dbName = config.get("mongodb.database"),
  contact = config.get("mongodb.collection.contact");

async function contactSummary() {
  let client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully to Mongodb server');
    const db = client.db(dbName);
    const collection = db.collection(contact);

    const result = {
      contacts: await collection.countDocuments({}),
      addresses: await collection.countDocuments({addresses: {$type: "array", $ne: []}}),
      validAddresses: await collection.countDocuments({"addresses.verified.status": "verified"}),
      emails: await collection.countDocuments({"emails.address": {$nin: [null, ""]}}),
      phones: await collection.countDocuments({"telephones.number": {$regex: /^\d{10,11}$/}})
    };
    console.log('Found documents =>', result);
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function contactSearch(query) {
  console.log(query);
  let client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName),
      collection = db.collection(contact),
      options = {
        limit: 1000,
        projection: {
          "_id": 1,
          "familyName": 1,
          "givenName": 1,
          "emails": 1,
          "addresses": 1
          // "addresses.county": 1,
          // "addresses.state": 1,
          // "addresses.postalCode": 1
        }
      };

    let cursor = collection.find(query, options);
    let result = await cursor.toArray();

    console.log(`Found ${result.length} documents`);
    return result;
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

module.exports.contactSearch = contactSearch;
module.exports.contactSummary = contactSummary;
