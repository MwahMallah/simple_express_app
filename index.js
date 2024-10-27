const express = require('express');
const morgan  = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(morgan('tiny'));
app.use(cors());
const ID_RANGE = 10_000_000;

const PORT = process.env.PORT || 3001;

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ad Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.filter(p => p.id === id)[0];
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(p => p.id !== id);
    console.log(id, persons);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const newPerson = req.body;

    if (!newPerson.name) {
        return res.status(400).json({error: "name is not set"});
    }

    if (!newPerson.number) {
        return res.status(400).json({error: "name is not set"});
    }

    if (persons.find(p => p.name === newPerson.name)) {
        return res.status(400).json({error: `person with name ${newPerson.name} already exists`});
    }

    const newId = Math.floor(Math.random() * ID_RANGE);
    newPerson.id = newId.toString();
    persons.push(newPerson);
    console.log(persons);
    return res.json(newPerson);
});

app.get('/info', (req, res) => {
    let htmlPage = `<p>Phonebook has info for ${persons.length} people</p>`;
    htmlPage += new Date().toLocaleString(); 
    res.send(htmlPage);
});

app.listen(PORT);