const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Service = Schema(
	{
		Name: String,
		Price: Number,
	},
	{ versionKey: false }
);

module.exports = mongoose.model("Service", Service);
