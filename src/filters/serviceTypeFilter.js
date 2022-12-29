const filterUserServ = require('./userServFilter')
const filterDentistServ = require('./dentistServFilter')

const transform = (payload) => {
    if(payload.opCat){
        switch(payload.opCat){
            case 'user':
                filterUserServ(payload)
                break;
            case 'dentist':
                filterDentistServ(payload)
                break;
        }
    } else {
        console.log('No operation category given')
    }
}

module.exports = transform
