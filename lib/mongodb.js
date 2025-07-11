// lib/mongodb.js

import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017"; // Or use your MongoDB Atlas URI
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
