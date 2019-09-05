require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require("cors")
const Person = require('./models/phonebook')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

morgan.token('type', function (request, response) {
    return JSON.stringify(request.body)
})


// const generateId = () => Math.floor(Math.random(...persons.map(p => p.id)) * 10000000) + 4

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})


app.get("/info", (req, res) => {
    Person.find({}).then(p => {
        const numberOfPeople = p.map(person => person.toJSON()).length
        res.send(`<div>Phonebook has ${numberOfPeople} in contact list</div><div>${Date()}</div>`)
    })

})

app.get("/api/persons/:id", (request, response, next) => {
    // const id = Number(req.params.id)
    // const person = persons.find(person => person.id === id)

    // if (person) {
    //     res.json(person)
    // } else {
    //     res.status(404).end()
    // }
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
    const body = req.body
    if (body.name === "") {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if (body.number === "") {
        return response.status(400).json({
            error: 'content missing'
        })
    }


    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
    // if (!body.name) {
    //     return res.status(400).json({
    //         error: "Please Enter a Name"
    //     })
    // } else if (!body.number) {
    //     return res.status(400).json({
    //         error: "Please enter a number"
    //     })
    // } else if (persons.map(p => p.name) === body.name) {
    //     return res.status(400).json({
    //         error: "Name is equal, change it"
    //     })
    // }
    // persons = persons.concat(person)

    // res.json(person)
})

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findOneAndUpdate({
            _id: request.params.id
        }, person, {
            new: true,
            runValidators: true,
            context: 'query'
        })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }  else if (error.name === 'TypeError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)


























const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})