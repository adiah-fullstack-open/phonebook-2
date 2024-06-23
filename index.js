const express = require("express");
const app = express();

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});