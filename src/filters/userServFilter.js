const userService = require('../services/user')
const MqttHandler = require('../MqttHandler')
const client = new MqttHandler().getClient()

const transform = (payload) => {
    
        if(payload.operation){
            switch(payload.operation){
                case 'login':
                    userService.login(payload.personal_number, payload.password).then(res => {
                        client.publish(`${payload.resTopic}/login`,'{"success":true, "operation":"login"}',{qos:2})
                    }).catch( e => {
                        client.publish(`${payload.resTopic}/login`,'{"success":false, "operation":"login"}',{qos:2})
                    })
                    
                    break;
                case 'register':
                    userService.createUser(payload.first_name,payload.last_name,payload.password,payload.email_address,payload.personal_number).then(res => {
                        client.publish(`${payload.resTopic}/register`,'{"success":true, "operation":"register"}',{qos:2})
                    }).catch(e => {
                        client.publish(`${payload.resTopic}/register`,'{"success":false, "operation":"register", "reason":"to be added"}',{qos:2})
                    })
                    break;
                case 'modify':
                    const newUser = {
                        password: payload.password,
                        email_address: payload.email_address
                    }
                    userService.modifyUserInfo(payload.id, newUser).then(res => {
                        client.publish(`${payload.resTopic}/modify`,'{"success":true, "operation":"modify"}',{qos:2})
                    }).catch(e => {
                        client.publish(`${payload.resTopic}/modify`,`{"success":false, "operation":"modify", "reason":"${e}"}`,{qos:2})
                    })
                    break;
                case 'get-user':
                    userService.getUser(payload.personal_number).then(res => {
                        const resPayload = {data: res, operation: 'get-user'}
                        client.publish(`${payload.resTopic}/get-user`,JSON.stringify(resPayload),{qos:2})
                    }).catch(e => {
                        client.publish(`${payload.resTopic}/get-user`,'{"success":false, "operation":"get-user"}',{qos:2})
                    })
                    break;
            }
        }
}

module.exports = transform