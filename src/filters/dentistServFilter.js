const dentistService = require('../services/dentist');
const MqttHandler = require('../MqttHandler')
const client = new MqttHandler().getClient()

const transform = (payload) => {

    if(payload.operation){
        switch(payload.operation){
            case 'login':
                dentistService.dentistLogin(payload.username, payload.password).then(res => {
                    console.log('resTopic:', payload.resTopic)
                    client.publish(`${payload.resTopic}/login`,'{"success":true, "operation":"dentist-login"}',{qos:2})
                }).catch( e => {
                    console.log(e)
                    client.publish(`${payload.resTopic}/login`,'{"success":false, "operation":"dentist-login"}',{qos:2})
                })

                break;
            case 'register':
                dentistService.createDentist(payload.first_name,payload.last_name,payload.username,payload.password).then(res => {
                    console.log('resTopic:', payload.resTopic)
                    client.publish(`${payload.resTopic}/register`,'{"success":true, "operation":"dentist-register"}',{qos:2})
                }).catch(e => {
                    console.log(e)
                    client.publish(`${payload.resTopic}/register`,'{"success":false, "operation":"dentist-register", "reason":"to be added"}',{qos:2})
                })
                break;
            case 'modify':
                const newDentist = {
                    username: payload.username,
                    password: payload.password
                }
                dentistService.modifyDentistInfo(payload.id, newDentist).then(res => {
                    console.log('resTopic:', payload.resTopic)
                    client.publish(`${payload.resTopic}/modify`,'{"success":true, "operation":"modify"}',{qos:2})
                }).catch(e => {
                    console.log(e)
                    client.publish(`${payload.resTopic}/modify`,`{"success":false, "operation":"modify", "reason":"${e}"}`,{qos:2})
                })
                break;
            case 'get-dentist':
                dentistService.getDentist(payload.username).then(res => {
                    console.log('resTopic:', payload.resTopic)
                    const resPayload = {data: res, operation: 'get-dentist'}
                    client.publish(`${payload.resTopic}/get-dentist`,JSON.stringify(resPayload),{qos:2})
                }).catch(e => {
                    console.log(e)
                    client.publish(`${payload.resTopic}/get-dentist`,'{"success":false, "operation":"get-dentist"}',{qos:2})
                })
                break;
            default:
                console.log('Wrong dentist operation given')
        }
    } else {
        console.log('No operation given')
    }
}

module.exports = transform

