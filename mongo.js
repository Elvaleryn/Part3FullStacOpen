const mongoose = require('mongoose')

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url =
    `mongodb+srv://fullstack41:W8TBOAKFeTaUuj6k@cluster0-hwkfh.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length === 5 ) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
      name: name,
      number: number,
    })
    person.save().then(response => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
  }
  if ( process.argv.length===3 ) {
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(`phonebook: ${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
  }
  



