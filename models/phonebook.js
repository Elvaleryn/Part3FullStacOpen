const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.connect(config.DB,{ useMongoClient:true });

const url = process.env.MONGODB_URI
console.log('connecting to database')
mongoose.connect(url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(result => {
        console.log('connected to MongoDB')
    }).catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })
const personSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, minlength: 3 },
    number: { type: String, required: true, unique: true, minlength: 8},
})
personSchema.plugin(uniqueValidator);
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

mongoose.set('useFindAndModify', false)

module.exports = mongoose.model('Person', personSchema)