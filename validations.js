const { Test } = require("./models/Test");
const { ValidationError } = require("./exceptions");

class Validations {
    checkTest(entry = new Test()) {
        if (!entry.name || entry.name.length < 8) throw new ValidationError("name missing");
        if (!entry.age || entry.age < 0) throw new ValidationError("age illegal");
    }
}

const validations = new Validations();

module.exports = {
    validations: validations,
};