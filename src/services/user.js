const User = require('../models/user')
const mongoose = require('mongoose')

const createUser = async (first_name,last_name,password,email_address,personal_number) => {
    if(first_name && last_name && password && email_address && personal_number){
        try{
            const user = await User.create({
                first_name: first_name,
                last_name: last_name,
                password: password,
                email_address: email_address,
                personal_number: personal_number

            });

            return user;

        } catch(e){
            return Promise.reject('Malformed user data');
        }

    } else {
       return Promise.reject('All user details must be filled')
    }
}

const login = async (personal_number,password) => {
    if(!personal_number || !password){
        return Promise.reject('Personal number and password must be given')
    } else {

        const user = await User.findOne({personal_number: personal_number})

        if(user && user.password === password){
            return true
        } else {
            return Promise.reject('Wrong personal number or password')
        }
    }
}

const getUser = async (personal_number) => {
    if(personal_number){     
        const user = await User.findOne({personal_number: personal_number})

        return user;

    } else {
        return Promise.reject('User personal number cannot be empty')
    }
}

// Modify a user's password and email
const modifyUserInfo = async (id, newUser) => {
    if(id && newUser){
        try{
            const oldUser = await User.find({personal_number: id})
            
            if (!oldUser) {
                return Promise.reject({ message: 'User does not exist', code: 404 });
            }

            const user = await User.findOneAndUpdate(
                {personal_number: id},
                {
                    password: newUser.password || oldUser.password,
                    email_address: newUser.email_address || oldUser.email_address
                }, {new: true}
            )
            return user;

        } catch(e){
            return Promise.reject('Malformed user data');
        }

    } else {
       return Promise.reject('All user details must be filled')
    }
}

module.exports = {
    createUser,
    login,
    getUser,
    modifyUserInfo
}
