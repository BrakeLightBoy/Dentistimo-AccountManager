const db = require('./db')
const userService = require('../services/user')
const dentistService = require('../services/dentist')
const User = require('../models/user')
const Dentist = require('../models/dentist')

const mongoose = require('mongoose')

//Before tests all the tests, creates and connects to a new test DB
beforeAll(async () => await db.connect());
//After each test, clear to database to give each test an empty DB
afterEach(async () => await db.clearDatabase());
//When all tests are done we delete the DB and close the connection to mongodb
afterAll(async () =>  await db.closeDatabase());

describe('userTests', () => {

    it('should successfully create a new user', (done) => {
        userService.createUser('Sam', 'Jobara', 'jultomte', 'jobara@chalmers.se', '7205261234')
        .then(async (user) =>{
        expect(user.first_name).toEqual('Sam')
        expect(user.last_name).toEqual('Jobara')
        expect(user.password).toEqual('jultomte')
        expect(user.email_address).toEqual('jobara@chalmers.se')
        expect(user.personal_number).toEqual('7205261234')
        console.log('test1', user)
        done()
     })
    })

    it('should successfully login an existing user', (done)  => {
        userService.createUser('Sam', 'Jobara', 'jultomte', 'jobara@chalmers.se', '7205261234')
        .then(async (user) => {
            const login = await userService.login(user.personal_number, user.password)
        expect(login).toEqual(true) //Login function returns true if user exists and password matches
        done()
        })
     })

    it('should fail to login user with wrong password', done => {
        userService.createUser('Sam', 'Jobara', 'jultomte', 'jobara@chalmers.se', '7205261234')
        .then(async (user) => {
            userService.login(user.personal_number, 'invalidpassword').catch(err => {
                console.log(err)
                expect(err).toEqual("Wrong personal number or password")
                done() 
        })
     })
    })

    it('should successfully modify user info', (done) => {
             userService.createUser('Sam', 'Jobara', 'jultomte', 'jobara@chalmers.se', '7205261234')
             .then(async (user) =>{
             user.email_address = 'newemail@chalmers.se'
             user.password = 'newpassword'
               
            userService.modifyUserInfo('7205261234', user).then(async (modifiedUser) => {
                console.log('3', modifiedUser)  
            expect(modifiedUser.password).toEqual('newpassword')
            expect(modifiedUser.email_address).toEqual('newemail@chalmers.se')
            expect(modifiedUser.personal_number).toEqual('7205261234') 
            done()
        })
     })
    })
    it('should fail to modify user info because email is already in use', (done) => {
 
        userService.createUser('testfirst', 'testlast', 'testpw', 'newemail@chalmers.se', '1234567890')
            
        userService.createUser('Sam', 'Jobara', 'jultomte', 'jobara@chalmers.se', '7205261234')
        .then(async (user) =>{
            user.first_name = 'newFirstName'
            user.last_name = 'newLastName'
            user.email_address = 'newemail@chalmers.se'
            user.password = 'newpassword'
               
            userService.modifyUserInfo('7205261234', user).catch(e => {
            console.log('test5', e)
            expect(e).toEqual('Email address already in use')
            done()
        })
     })
    })
    it('should fail to modify user info because user not found', (done) => {

             userService.createUser('Sam', 'Jobara', 'jultomte', 'jobara@chalmers.se', '7205261234')
             .then((user) =>{
             user.first_name = 'newFirstName'
             user.last_name = 'newLastName'
             user.email_address = 'newemail@chalmers.se'
             user.password = 'newpassword'
             user.personal_number = '1234567890'
            console.log('test6', user)
            userService.modifyUserInfo(user.personal_number, user).catch(err => {
            console.log('test 6', err)
            expect(err.message).toEqual('User does not exist')
            done()
        })
     })
    })
})