require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const { WebhookClient } = require("dialogflow-fulfillment");
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
app.post("/webhook", async (req, res) => {
	const agent = new WebhookClient({ request: req, response: res });
	console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
	console.log("Dialogflow Request body: " + JSON.stringify(req.body));

	function welcome(agent) {
		agent.add(`Hola soy tu asistente virtual, como puedo ayudarte?`);
	}

	function fallback(agent) {
		agent.add(`Lo siento, no te entendí`);
		agent.add(`Perdón, podrías repetirmelo?`);
	}

	async function Agendar(agent) {
		agent.add(`Cual es tu nombre?(desde el webhook)`);
		console.log(req.body);
	}

	let intentMap = new Map();
	intentMap.set("Default Welcome Intent", welcome);
	intentMap.set("Default Fallback Intent", fallback);
	intentMap.set("Agendar", Agendar);
	// intentMap.set('your intent name here', yourFunctionHandler);
	// intentMap.set('your intent name here', googleAssistantHandler);
	agent.handleRequest(intentMap);
});

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
});
