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

const Person = require("./models/person");

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("dist"));
app.use(morgan(loggingFunction));

const checkDuplicates = (name) =>
  contacts.filter((person) => person.name === name).length > 0;

app.get("/info", (request, response) => {
  const count = contacts.length;
  const date = new Date();
  response.send(`
	<p>Phonebook has info for ${count} people</p>
	<p>${date}</p>
	`);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((notes) => {
    response.json(notes);
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number missing",
    });
  }

  const person = new Person(body);

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const contact = contacts.find((contact) => contact.id === id);

  if (contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  contacts = contacts.filter((contact) => contact.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
