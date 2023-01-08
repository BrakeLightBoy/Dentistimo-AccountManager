const mongoose = require('mongoose');
const mqtt = require('mqtt');
const reqFilter = require('./src/filters/requestFilter.js')
const MqttHandler = require('./src/MqttHandler')
const client = new MqttHandler().getClient() 

const mongoPort = 27017;
const mongoHost = 'localhost';
const dbName = 'dentistDB';

const mongoURI = process.env.MONGODB_URI || `mongodb://${mongoHost}:${mongoPort}/${dbName}`;

//connects do mongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, error => {
    if (error) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(error.stack);
        process.exit(1);
    }
});

//defines on message behaviour
client.on('message', async (topic, payload,packet)=> {
    reqFilter(topic,payload)    
})
