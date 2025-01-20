
import Admin from "../src/models/admin.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

/* Global cache for mongoose connection */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}


async function seedAdmin() {
    await dbConnect();
    const hashedPassword = await bcrypt.hash("", 10);

    await Admin.create({ username: "admin", password: hashedPassword });
    console.log("Admin user created!");
}

seedAdmin().catch((error) => console.error(error));