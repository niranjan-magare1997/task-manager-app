const mongodb = require('mongodb')
const { MongoClient , ObjectID } = mongodb

// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectId

const id = new ObjectID()

console.log(id)
console.log(id.id)
console.log(id.id.length)
console.log(id.toHexString().length)
console.log(id.getTimestamp())

const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'

MongoClient.connect(connectionURL, {
    "useNewUrlParser": true
}, (err, client) => {
    if (err) {
        console.log("Failed to connnect")
        return
    }

    console.log("Connection done boss.")

    const db = client.db(database)
    const users = db.collection('users')
    const tasks = db.collection('tasks')

    // users.findOne({
    //     // name: "The Flash"
    //     // age: 26
    //     _id: new ObjectID("6506a5156749ab43896fbdee")
    // }, (err, result) => {
    //     if (err) {
    //         console.log(err)
    //         return console.log("Unable to fetch users")
    //     }

    //     console.log(result)
    // })



    // tasks.findOne({
    //     _id: new ObjectID("6506a0a7504194405eb67635")
    // }, (err, result) => {
    //     if (err) {
    //         console.log(err)
    //         return console.log("Unable to find document...")
    //     }

    //     console.log(result)
    // })

    // tasks.find({
    //     completed: false
    // }).toArray((err, result) => {
    //     if (err) {
    //         console.log(err)
    //         return console.log("Unable to find document...")
    //     }

    //     console.log(result)
    // })


    // users.updateOne({
    //     name: "The Flash"
    // }, {
    //     $set: {
    //         age: 27
    //     }
    // }).then((result) => {
    //     console.log(result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // tasks.updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // tasks.findOne({
    //     _id: new ObjectID("6506a0a7504194405eb67635")
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // tasks.find({
    //     completed: true
    // }).toArray().then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })


    // users.insertOne({
    //     name: "Khatri",
    //     age: 27
    // }, (err, result) => {
    //     if (err) {
    //         console.log(err)
    //         return
    //     }
    //     console.log(result.ops)
    // })

    // users.deleteOne({
    //     name: "Niranjan"
    // }, (err, result) => {
    //     if (err) {
    //         console.log(err)
    //         return
    //     }

    //     console.log(result.result)
    // })
 
    // tasks.insertMany([{
    //     description: "Badminton @12pm today",
    //     completed: true
    // }, {
    //     description: "Drink water everyday",
    //     completed: false
    // }, {
    //     description: "Got to bajaj showroom",
    //     completed: false
    // }], (err, result) => {
    //     if (err) {
    //         console.log("Failed to insert data")
    //         console.log(err)
    //         return
    //     }
    //     console.log(result.ops)
    // })

    tasks.deleteOne({
        description: "Badminton @12pm today"
    }).then((result) => {
        console.log(result.deletedCount)
    }).catch((err) => {
        console.log(err)
    })
})