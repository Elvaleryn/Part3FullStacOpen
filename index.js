const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require("cors")

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

morgan.token('type', function (request, response) {
    return JSON.stringify(request.body)
})



let persons = [{
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

const numberOfPeople = persons.length

const generateId = () => Math.floor(Math.random(...persons.map(p => p.id)) * 10000000) + 4

app.get("/api/persons", (req, res) => {
    res.json(persons)
})


app.get("/info", (req, res) => {
    res.send(`<div>Phonebook has ${numberOfPeople} in contact list</div><div>${Date()}</div>`)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    if (!body.name) {
        return res.status(400).json({
            error: "Please Enter a Name"
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: "Please enter a number"
        })
    } else if (body.name === person.name) {
        return res.status(400).json({
            error: "Name is equal, change it"
        })
    }


    persons = persons.concat(person)
    console.log(method);
    res.json(person)
})




























const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})