const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conx = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`Mongo Connected: ${conx.connection.host}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }

}
module.exports = connectDB;