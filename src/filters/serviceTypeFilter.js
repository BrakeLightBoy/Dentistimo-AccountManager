const filterUserServ = require('./userServFilter')
const filterDentistServ = require('./dentistServFilter')

const transform = (payload) => {
    //decides which group of services the requests is addressing
    if(payload.opCat){
        switch(payload.opCat){
            case 'user':
                filterUserServ(payload)
                break;
            case 'dentist':
                filterDentistServ(payload)
                break;
        }
    } 
}

module.exports = transform
