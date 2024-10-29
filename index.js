require('dotenv').config();
const Person = require('./models/Persons');
const express = require('express');
const morgan  = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.static('dist'));
app.use(express.json())
app.use(morgan('tiny'));
app.use(cors());

const ID_RANGE = 10_000_000;
const PORT = process.env.PORT;

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(persons => res.json(persons));
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error))
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    Person.findByIdAndDelete(id)
        .then(result => {
            console.log(result);
            res.status(204).end();
        })
        .catch(e => next(e));
});

app.post('/api/persons', (req, res, next) => {
    const newPerson = req.body;
    console.log(newPerson);

    if (!newPerson.name) {
        return res.status(400).json({error: "name is not set"});
    }

    if (!newPerson.number) {
        return res.status(400).json({error: "name is not set"});
    }

    if (!Person.find({name: newPerson.name})) {
        return res.status(400).json({error: `person with name ${newPerson.name} already exists`});
    }

    const newPersonDb = new Person({
        name: newPerson.name,
        number: newPerson.number
    });

    newPersonDb.save()
    .then(() => {
        res.json(newPerson);
    })
    .catch(e => next(e))
});

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body;
    const id = req.params.id;

    const updatedPerson = {
        number: body.number,
        name: body.name
    };

    Person.findByIdAndUpdate(id, updatedPerson, {new: true})
        .then(result => res.json(result))
        .catch(e => next(e));
});

app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(result => {
            let htmlPage = `<p>Phonebook has info for ${result} people</p>`;
            htmlPage += new Date().toLocaleString(); 
            res.send(htmlPage);
        })
        .catch(e => next(e));
});


function errorHandlerMiddleware(error, req, res, next) {
    console.error(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } if (error.name === 'ValidationError') {
        return res.status(400).send({error: error.message})
    }

    next(error);
}

app.use(errorHandlerMiddleware);

app.listen(PORT);