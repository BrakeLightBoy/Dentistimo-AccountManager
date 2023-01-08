const filterServType = require('./serviceTypeFilter')

const transform  = function (topic, payload) {
    //temporary log messages
    console.log('topic:',topic)
    console.log('payload:',payload.toString())
    let rTopic = null
    
    try{
        rTopic = topic.split('/')[1]
    } catch(e){}
 
    try{   
        const jPayload = JSON.parse(payload)
        
        if(rTopic){
            jPayload.resTopic = rTopic
            filterServType(jPayload)
        } else {
            console.log(`Parsing of topic failed, topic: ${topic} has invalid format`)
        }

    } catch(e) {
        if(rTopic){
            client.publish(`${rTopic}`,`{"success":false, "reason":"${e.message}"}`,{qos:2})
        }
    }
}


module.exports = transform
