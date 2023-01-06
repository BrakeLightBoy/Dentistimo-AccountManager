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
   //try {
        
        userService.createUser('Sam', 'Jobara', 'jultomte', 'jobara@chalmers.se', '7205261234')
        .then((user) =>{
        expect(user.first_name).toEqual('Sam')
        expect(user.last_name).toEqual('Jobara')
        expect(user.password).toEqual('jultomte')
        expect(user.email_address).toEqual('jobara@chalmers.se')
        expect(user.personal_number).toEqual('7205261234')
        
        //expect(0).toEqual(1)
        //console.log('test', e)
        done()
        //Promise.resolve()
        }).catch((err) => {
            
        })
     })
    it('should successfully login an existing dentist', (done)  => {
        userService.createUser('Sam', 'Jobara', 'jultomte', 'jobara@chalmers.se', '7205261234')
        .then(async (user) => {
            console.log(user)
            const login = await userService.login(user.personal_number, user.password)
            console.log(login)
        expect(login).toEqual(true) //Login function returns true if user exists and password matches
        done()
        })
     })
    it('should fail to login user with wrong password', done => {
        userService.createUser('Sam', 'Jobara', 'jultomte', 'jobara@chalmers.se', '7205261234')
        .then(async (user) => {
            userService.login(user.personal_number, 'invalidpassword').catch(err => {
                expect(err).toEqual("Wrong personal number or password")
            })
        done()
     })
    })
})