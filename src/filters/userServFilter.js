const userService = require('../services/user')
const MqttHandler = require('../MqttHandler')
const client = new MqttHandler().getClient()

const transform = (payload) => {
    
        if(payload.operation){
            switch(payload.operation){
                case 'login':
                    userService.login(payload.personal_number, payload.password).then(res => {
                        console.log('resTopic:', payload.resTopic)
                        client.publish(`${payload.resTopic}/login`,'{"success":true, "operation":"login"}',{qos:2})
                    }).catch( e => {
                        console.log(e)
                        client.publish(`${payload.resTopic}/login`,'{"success":false, "operation":"login"}',{qos:2})
                    })
                    
                    break;
                case 'register':
                    userService.createUser(payload.first_name,payload.last_name,payload.password,payload.email_address,payload.personal_number).then(res => {
                        console.log('resTopic:', payload.resTopic)
                        client.publish(`${payload.resTopic}/register`,'{"success":true, "operation":"register"}',{qos:2})
                    }).catch(e => {
                        console.log(e)
                        client.publish(`${payload.resTopic}/register`,'{"success":false, "operation":"register", "reason":"to be added"}',{qos:2})
                    })
                    break;
                case 'modify':
                    const newUser = {
                        password: payload.password,
                        email_address: payload.email_address
                    }
                    userService.modifyUserInfo(payload.id, newUser).then(res => {
                        console.log('resTopic:', payload.resTopic)
                        client.publish(`${payload.resTopic}/modify`,'{"success":true, "operation":"modify"}',{qos:2})
                    }).catch(e => {
                        console.log(e)
                        client.publish(`${payload.resTopic}/modify`,`{"success":false, "operation":"modify", "reason":"${e}"}`,{qos:2})
                    })
                    break;
                default:
                    console.log('Wrong user operation given')
            }
        } else {
            console.log('No operation given')
        }
}

module.exports = transform