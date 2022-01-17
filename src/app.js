const dotenv = require('./dotenv')
dotenv.config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const twilio = require('twilio');
// const { Message } = require('twilio/lib/twiml/MessagingResponse');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

//--5--here we've created a message model and here where we gonna use mongoose so now in each messsage that's sent in we are expecting
// certain properties, and inside there we have our message's characteristics  
let MessageSchema = new mongoose.Schema({
    phoneNumber: String,
    menu: String,
    order: String,
    address: String,
    anythingElse: String
})
let Message = mongoose.model('Message', MessageSchema);

//--1--here we gonna set up our body parser library so it will put urlencoded in the correct format
//so we can use them in our operation
app.use(bodyParser.urlencoded({ extended: false }))

//--2--here we gona connect to the data base (a cloud provider and a plan hike) and we got our user credentials
//inside the connection string and we sat it to use the mongo client, then is gonna run our callback when its connected
mongoose.connect('mongodb+srv://omar:123@cluster0.jpq12.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(() => {
    console.log('db connected');
})

//--3--here we gonna set up our route and we passed in request and response objects then we ended the response
app.get('/', (req, res) => {
    res.end();
})

//--6--now here we gonna break our endpoint (/inbound) and it's gonna be coming in  on the request body
//like Who it's from and the requird specifics   
app.post('/inbound', (req, res) => {
    let from = req.body.From; //which is my phone number that I send the message from
    let to = req.body.To;
    let body = req.body.Body;
    //next we will use them info after we determine if the incoming messages are new or if it's old that already happend
    //so if we sent a text message to our twilio number it's gonna catch in the webhook to forward it to our end point (inbound) then we gonna be pulled that message apart 
    //and we gonna look for any messages in our database that have a phone number belonging to that particular message  
    Message.find({ phoneNumber: req.body.From }, (err, message) => { // here we gonna find all the messages with phoneNumber == from 
        // console.log(message)  //in the event was successful we will do the do the following and then we will end the response
        // up there we looked into database and we did not find any numbers that matches the from so that tells us it is a new conversation 
        if (message.length !== 0) { // here if the message length is not 0 so we have started the conversation and we need to carry on
            if (!message[0].menu && !message[0].order && !message[0].address && !message[0].anythingElse) { //here we gonna check if the order is existed in the database if not we need to ask them for 
                //also we need to check if the address is provided or not in the message
                Message.findByIdAndUpdate(message[0]._id, { "$set": { "menu": body } }, { "new": true, "upsert": true }, () => {
                    client.messages.create({
                        to: process.env.PHONE_NUMBER,
                        from: '+19377525109',
                        body: 'Pick any of these numbers with the quantity like this (BGLE 6, BGLO 2)\n BGLO : £0.49,\n BGLP : £0.39,\n BGLE : £0.49,\n BGLS : £0.49,\n COF : £0.99,\n BGSE : £2.99,\n BGSS : £4.99'
                    })

                    res.end();
                })
            } else if (!message[0].order && !message[0].address && !message[0].anythingElse) { //here we gonna check if the order is existed in the database if not we need to ask them for 
                //also we need to check if the address is provided or not in the message
                Message.findByIdAndUpdate(message[0]._id, { "$set": { "order": body } }, { "new": true, "upsert": true }, () => {
                    client.messages.create({
                        to: process.env.PHONE_NUMBER,
                        from: '+19377525109',
                        body: 'And may I have your address please?'
                    })

                    res.end();
                })
            }
            else if (!message[0].address && !message[0].anythingElse) {
                Message.findByIdAndUpdate(message[0]._id, { "$set": { "address": body } }, { "new": true, "upsert": true }, () => {
                    client.messages.create({
                        to: process.env.PHONE_NUMBER,
                        from: '+19377525109',
                        body: 'so this will cost you £3.99 + £5 ()delivary, anythingElse I can help you with?'
                        // to: `${from}`,
                        // from: `${to}`,
                        // body: 'thanks dude!'
                    })

                    res.end();
                })
            }
            else if (!message[0].anythingElse) { //here we gonna check if the order is existed in the database if not we need to ask them for 
                //also we need to check if the address is provided or not in the message
                Message.findByIdAndUpdate(message[0]._id, { "$set": { "anythingElse": body } }, { "new": true, "upsert": true }, () => {
                    client.messages.create({
                        to: process.env.PHONE_NUMBER,
                        from: '+19377525109',
                        body: 'Thanks dude! you have a good one'
                    })

                    res.end();
                })
            }
        } else { //if there is no messages in the database we need to create a new conversation 
            if (body.toLowerCase().includes("hello") || body.toLowerCase().includes("hi")) {
                let newMessage = new Message(); //here we are creating a new instance of the messages model
                newMessage.phoneNumber = from;
                newMessage.save(() => {// we gonna save it and in the event of successfull we gonna use our callback to text back
                    client.messages.create({
                        to: process.env.PHONE_NUMBER,
                        from: '+19377525109',
                        body: `Hello there this is Bob's Bagels, How can I help you?`
                    })

                    res.end();
                })
            }
        }

        res.end();
    })
})

//--4--here we gonna set up our server to listen on port 3000 and when it's successfully connected we gonna carry out our callback
app.listen(3000, () => {
    console.log('server connected')
})

//now whenever we run NPM start (node app.js) it's gonna read this file and 1st it's gonna connect to a database
//then to our server and we should see all the console.logs in here



