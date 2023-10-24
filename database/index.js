const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        await mongoose.connect('mongodb+srv://Web72:Caohung1311@cluster0.hasa2kf.mongodb.net/Teelab-DB')
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