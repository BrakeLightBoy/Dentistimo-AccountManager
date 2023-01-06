const Dentist = require('../models/dentist')
const mongoose = require('mongoose')

const createDentist = async function (firstName, lastName, userName, password, works_at){
    if (!(firstName && lastName && userName && password && works_at)){
        return Promise.reject('All user details must be filled in')
    }
    else
        try {
            return await Dentist.create({
                first_name: firstName,
                last_name: lastName,
                username: userName,
                password: password,
                works_at: works_at
            })
        } catch (err) {
            console.log(err)
            return Promise.reject('Invalid user data')
        }
}

const dentistLogin = async function (username, password) {
    if (username && password) {
        const dentist = await Dentist.findOne({username: username})
        if (dentist && dentist.password === password) return true
        if (!dentist) return Promise.reject('User not found')
        else return Promise.reject('Invalid password')
    }
}

//Modify a dentist's username and password
const modifyDentistInfo = async function (id, newDentist) {
    if(id && newDentist){
        try{
            const oldDentist = await Dentist.find({username: id})
            
            if (!oldDentist) {
                return Promise.reject({ message: 'Dentist does not exist', code: 404 });
            }

            const dentist = await Dentist.findOneAndUpdate(
                {username: id},
                {
                    username: newDentist.username || oldDentist.username,
                    password: newDentist.password || oldDentist.password,
                    first_name: newDentist.first_name || oldDentist.first_name,
                    last_name: newDentist.last_name || oldDentist.last_name
                }
            )

            await dentist.save();
            return dentist;

        } catch(e){
            console.log(e)
            return Promise.reject('Malformed dentist data');
        }

    } else {
       return Promise.reject('All dentist details must be filled')
    }
}

module.exports = {
    createDentist,
    dentistLogin,
    modifyDentistInfo,
}

