import { MongoClient } from "mongodb";

declare global {
  // Fixes the type resolution in development hot-reloads
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export {};