/**
 * Serverless MongoDB connection with caching.
 *
 * In serverless environments each invocation may reuse a warm Lambda/V8 context.
 * We cache the connection on `global` so subsequent invocations in the same
 * container skip the expensive connect() call.
 */

const mongoose = require('mongoose');

let cached = global._mongooseConn;

if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next request retries
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

module.exports = connectDB;
