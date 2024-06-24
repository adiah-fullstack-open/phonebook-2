const express = require("express");
const morgan = require("morgan");

const app = express();

morgan.token("postData", (req, res) => JSON.stringify(req.body));

// const requestLogger = (request, response, next) => {
//   console.log("Method: ", request.method);
//   console.log("Path: ", request.path);
//   console.log("Body: ", request.body);
//   console.log("---");
//   next();
// };

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

app.use(express.json());
// app.use(morgan("tiny"));
app.use(morgan(loggingFunction));
// app.use(requestLogger);

let contacts = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelave",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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
  response.json(contacts);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number missing",
    });
  }

  if (checkDuplicates(body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const contact = {
    id: Math.floor(Math.random() * 1000000),
    ...body,
  };

  contacts = contacts.concat(contact);
  response.json(contact);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
