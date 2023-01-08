const filterServType = require('./serviceTypeFilter')

const transform  = function (topic, payload) {

    let rTopic = null
    
    try{
        rTopic = topic.split('/')[1]
    } catch(e){}
 
    try{   
        const jPayload = JSON.parse(payload)
        
        if(rTopic){
            jPayload.resTopic = rTopic
            filterServType(jPayload)
        } 

    } catch(e) {
        if(rTopic){
            client.publish(`${rTopic}`,`{"success":false, "reason":"${e.message}"}`,{qos:2})
        }
    }
}


module.exports = transform
