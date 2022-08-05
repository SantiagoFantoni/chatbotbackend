const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Staff = Schema({
	firstName: String,
	lastName: String,
});

module.exports = mongoose.model("Staff", Staff);
