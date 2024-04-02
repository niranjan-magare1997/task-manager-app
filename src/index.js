const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('./db/mongoose')
const multer = require("multer");

const userRouter = require('./routers/user')
const tasksRouter = require('./routers/tasks')

const app = express()

const port = 3000;

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // if (!file.originalname.endsWith(".pdf")) {
        //     cb(new Error("File is not a PDF."));
        // }

        if (!file.originalname.match(/\.(doc|docx)$/)) {
            cb(new Error("File format is not a word document."));
        }
        cb(undefined, true);

        // cb(new Error('File format not supported.'));    // Reject upload with error.
        // cb(undefined, true);    // Accept upload
        // cb(undefined, false);   // Reject upload
    }
});

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
});

// app.use((req, res, next) => {
//     console.log(req.method, req.path)
//     // if (req.method === "GET") {
//     //     res.send("Get requests are blocked temperorily")
//     // } else {
//     //     next()
//     // }

//     res.status(503).send("Site under maintainance.")
// })

app.use(express.json())
app.use(userRouter)
app.use(tasksRouter)

app.listen(port, () => {
    console.log("Server is running on port " + port)
})

// const User = require('./models/users')

// const main = async () => {
//     const user = await User.findById("650eaed0d8ed45518a0b5343")
//     await (await user.populate('tasks')).$getPopulatedDocs
//     console.log(user.tasks)
// }

// main()

// const Task = require('./models/tasks')

// const task = async () => {
//     const task = await Task.findById("650eb02596fd7e58778ae4ed")
//     // task.populate('owner').exec
//     await (await task.populate('owner')).$getPopulatedDocs
//     console.log(task.owner)
// }

// task()


const newFun = async () => {
    let pswd = "Niranjan@123"
    let hashed = await bcrypt.hash(pswd, 8)

    console.log("Password ", pswd)
    console.log("Hased pswd ", hashed)

    const isMatch = await bcrypt.compare("Niranjan@1234", hashed)
    console.log("isMatch ", isMatch)
}

// newFun()

// const token = jwt.sign({
//     _id: "niranjan123"
// }, 'task-manager-private-key', {
//     expiresIn: '1 seconds'
// })

// console.log(token)

// console.log(jwt.verify(token, "task-manager-private-key"))