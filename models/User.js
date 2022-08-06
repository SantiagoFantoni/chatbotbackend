const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = Schema({
	Name: String,
	CI: {
		type: Number,
		unique: true,
	},
	Service: [String],
	Date: String,
	Time: String,
});

module.exports = mongoose.model("User", User);
