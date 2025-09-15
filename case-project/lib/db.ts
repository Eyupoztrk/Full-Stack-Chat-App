import mongoose, { Mongoose } from 'mongoose';

declare global {
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
}

let globalDb = global.mongoose;

if (!globalDb) {
    globalDb = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
    if (globalDb.conn) {
        console.log("Mevcut db kullanılıyor..");
        return globalDb.conn;
    }

    if (!globalDb.promise) {
        const opts = {
            bufferCommands: false,
        };

        const MONGODB_URI = process.env.DATABASE_URL
        if (!MONGODB_URI)
            throw new Error("Connection uri has not been defined in .env file");


        console.log("Creating DB Connection..");
        globalDb.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("DB connected successfuly..");
            return mongoose;

        });
    }
    try {
        globalDb.conn = await globalDb.promise;
    } catch (e) {
        globalDb.promise = null; 
        throw e;
    }

    return globalDb.conn;
}

export default connectDb;