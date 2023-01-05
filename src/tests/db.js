const mongoose = require('mongoose');
//const { MongoMemoryServer } = require('mongodb-memory-server');

let connection;
let db;

const mongoPort = 27017;
const mongoHost = 'localhost';
const dbName = 'testDentistDB';

const mongoURI = process.env.MONGODB_URI || `mongodb://${mongoHost}:${mongoPort}/${dbName}`;

module.exports.connect = async () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
}

/**
 * Drop database, close the connection.
 */
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
}

/**
 * Remove all the data for all db collections.
 */

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
 
    for (const key in collections) { 
        //const collection = collections[key];
        //await collection.deleteMany();
       try {
             mongoose.connection.db.dropCollection(key)
        } catch (error) {
            continue
        }
        
       
       
    }
}