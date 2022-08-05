const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = Schema({
	firstName: String,
	lastName: String,
});

module.exports = mongoose.model("User", User);
