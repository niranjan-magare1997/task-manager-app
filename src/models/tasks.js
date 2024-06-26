const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    }
}, {
    timestamps: true
})

taskSchema.pre('save', async function (next) {
    const task = this

    if (task.isModified('description')) {
        console.log("Description is modified bro...")
    }

    next()
})

const task = mongoose.model('task', taskSchema)

module.exports = task