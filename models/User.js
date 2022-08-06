const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = Schema({
	Name: String,
	Service: [String],
	Date: String,
	Time: String,
});

module.exports = mongoose.model("User", User);
