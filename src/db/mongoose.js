const mongoose = require('mongoose')
const validator = require('validator')
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager'

mongoose.connect(connectionURL, {
    "useNewUrlParser": true/* ,
    "useCreateIndex": true */
})

// const user = mongoose.model('users', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         validate: (email) => {
//             if (!validator.isEmail(email)) {
//                 throw new Error('Please enter valid email address.')
//             }
//         }
//     },
//     password: {
//         type: String,
//         require: true,
//         trim: true,
//         minLength: 7,
//         validate: (pswd) => {
//             if (pswd.toLowerCase().includes('password')) {
//                 throw new Error('Password should not contain word password in it.')
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate (age) {
//             if (age < 0) throw new Error('Age must be a positive number.')
//         }
//     }
// })

// const u1 = new user({
//     name: "Sachin  ",
//     email: " sachin@gmail.com  ",
//     password: "sachin",
//     age: 27
// })

// // u1.save().then(() => {
// //     console.log("Data saved...", u1)
// // }).catch((e) => {
// //     console.log(e)
// // })


// const task = mongoose.model('task', {
//     description: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const t1 = new task({
//     description: "    Get ready for office.   "
// })

// t1.save().then((data) => {
//     console.log(data)
// }).catch((error) => {
//     console.log(error)
// })