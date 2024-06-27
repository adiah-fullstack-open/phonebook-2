require("dotenv").config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  optionSuccessStatus: 200,
};

morgan.token("postData", (req, res) => JSON.stringify(req.body));

const loggingFunction = (tokens, req, res) => {
  let message = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");

  // use POST data only if it's POST method
  if (req.method === "POST") {
    return `${message} ${tokens.postData(req, res)}`;
  } else {
    return message;
  }
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const Person = require("./models/person");

app.use(express.static("dist"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan(loggingFunction));

const checkDuplicates = (name) =>
  contacts.filter((person) => person.name === name).length > 0;

app.get("/info", (request, response, next) => {
  // const count = contacts.length;
  // const count =
  Person.find({})
    .then((persons) => {
      const date = new Date();
      const count = persons.length;
      response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    `);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number missing",
    });
  }

  const person = new Person(body);

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
