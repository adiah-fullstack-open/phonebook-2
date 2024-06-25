const mongoose = require("mongoose");

// Check command line arguments
if (process.argv.length < 3) {
  console.log("Please provide pasword");
  console.log("Usage: `node mongo.js <password> <name> <number>`");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://phonebook:${password}@phonebook-test.cnrlway.mongodb.net/?retryWrites=true&w=majority&appName=phonebook-test`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema(
  {
    name: String,
    number: String,
  },
  {
    timestamps: true,
  }
);

const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 3) {
  console.log("Phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`Added ${person.name} ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("Usage: `node mongo.js <password> <name> <number>`");
  process.exit(1);
}
