require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const Staff = require("./models/Staff");

main().catch((err) => console.log(err));

async function main() {
	await mongoose.connect(process.env.DB_CONNECTION);
	console.log("Access granted!");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.post("/home", async (req, res) => {
	await Staff.create({
		firstName: "Sandra",
		lastName: "Gonzales",
	});
	res.json({ message: "Hola" });
});

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
});
