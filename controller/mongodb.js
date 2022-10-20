/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const MongoClient = require("mongodb").MongoClient;

const config = require("config"),
  uri = config.get("mongodb.host"),
  dbName = config.get("mongodb.database"),
  contact = config.get("mongodb.collection.contact");

async function contactSummary() {
  let client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully to Mongodb server');
    const db = client.db(dbName);
    const collection = db.collection(contact);

    return {
      contacts: await collection.countDocuments({}),
      addresses: await collection.countDocuments({addresses: {$type: "array", $ne: []}}),
      validAddresses: await collection.countDocuments({"addresses.verified.status": "verified"}),
      emails: await collection.countDocuments({"emails.address": {$nin: [null, ""]}}),
      validEmails: await collection.countDocuments({"emails.verified.status": "verified"}),
      phones: await collection.countDocuments({"telephones.number": {$regex: /^\d{10,11}$/}})
    };
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
          "email": {"$first": "$emails.address"},
          "city": {"$first": "$addresses.verified.usps.AddressValidateResponse.Address.City"},
          "county": {"$first": "$addresses.county"},
          "state": {"$first": "$addresses.verified.usps.AddressValidateResponse.Address.State"},
          "postalCode": {"$first": "$addresses.verified.usps.AddressValidateResponse.Address.Zip5"},
          "organization": {"$first": "$addresses.organization"},
          "verifiedAddress": {"$eq": [{"$first": "$addresses.verified.status"}, "verified"]},
          "verifiedEmail": {"$eq": [{"$first": "$emails.verified.status"}, "verified"]}
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
