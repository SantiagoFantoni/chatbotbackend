require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const router = require("./routes/Webhook");

main().catch((err) => console.log(err));

async function main() {
	await mongoose.connect(process.env.DB_CONNECTION);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/webhook", router);

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
});
