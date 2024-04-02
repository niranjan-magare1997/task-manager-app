const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: (email) => {
            if (!validator.isEmail(email)) {
                throw new Error('Please enter valid email address.')
            }
        }
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minLength: 7,
        validate: (pswd) => {
            if (pswd.toLowerCase().includes('password')) {
                throw new Error('Password should not contain word password in it.')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(age) {
            if (age < 0) throw new Error('Age must be a positive number.')
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateJWTToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id.toString() }, 'task-manager-appp')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    console.log(token)
    return token
}

userSchema.statics.findByCredentials = async (email, pswd) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(pswd, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//Hash text pswd
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function () {
    const user = this;
    Task.deleteMany({
        owner: user._id
    });
})

const User = mongoose.model('users', userSchema)

module.exports = User