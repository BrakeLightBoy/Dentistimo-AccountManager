class MqttHandler{
    //singleton mqtt client that subscribes to a common topic where it listens for client requests
    constructor() {
        const mqtt = require('mqtt');

        const brokerHost = 'localhost';
        const brokerPort = 9001;
        const brokerURI = process.env.BROKER_URI || `ws://${brokerHost}:${brokerPort}`;


        if(MqttHandler.instance instanceof MqttHandler){
            return MqttHandler.instance;
        }
            
        const client = mqtt.connect(brokerURI);    

        
        client.on('connect', () => {
            client.subscribe('common/#',{qos:2})
        })

        client.on('error',error => {
            console.error(`Failed to connect to mqtt broker with URI: ${brokerURI}`);
            console.error(error.stack);
            process.exit(1);
        })

        this.client = client
        MqttHandler.instance = this;
    }

    getClient(){
        return this.client;
    }
}

module.exports = MqttHandler