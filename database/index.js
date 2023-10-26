const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.URL_DATABASE)
        .then( () => {
            console.log('Connect succeeded DB')
        })
    } catch (error) {
        console.log('Connect fail DB')
        console.log(error)
    }
}

module.exports = {
    connectDb
}