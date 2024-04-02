require('../src/db/mongoose')

const Task = require('../src/models/tasks')

const User = require('../src/models/users')

// Task.deleteOne({
//     _id: "6507226c2ea75e8467789315"
// }).then((response) => {
//     console.log(response)
//     return Task.countDocuments({
//         completed: false
//     })
// }).then((incompleteTasks) => {
//     console.log(incompleteTasks)
// })

const deleteTaskByIdAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    console.log(task)
    const count = await Task.countDocuments({ completed: false})
    return count
}

deleteTaskByIdAndCount("65072e04d3e71e46493290f7", false).then((count) => {
    console.log("Remaing incomplete tasks are ", count)
}).catch((e) => {
    console.log(e)
})


// const updateUserAgeAndCount = async (id, age) => {
//     const user = await User.findByIdAndUpdate(id, { age })
//     const count = await User.countDocuments({ age })
//     return count
// }

// updateUserAgeAndCount("65071fdb496395d04644f31f", 30).then((count) => {
//     console.log("Updated users with age 30 are ", count)
// }).catch((e) => {
//     console.log(e)
// })