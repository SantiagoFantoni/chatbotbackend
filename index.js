require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const { WebhookClient } = require("dialogflow-fulfillment");
const mongoose = require("mongoose");
const User = require("./models/User");

main().catch((err) => console.log(err));

async function main() {
	await mongoose.connect(process.env.DB_CONNECTION);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/webhook", async (req, res) => {
	const agent = new WebhookClient({ request: req, response: res });
	// console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
	// console.log("Dialogflow Request body: " + JSON.stringify(req.body));

	function welcome(agent) {
		agent.add(
			`Hola soy tu asistente virtual, puedo ayudarte a agendar una cita, contarte sobre los servicios que ofrecemos, nuestro horario y donde nos ubicamos!`
		);
	}

	function fallback(agent) {
		agent.add(`Lo siento, no te entendí`);
		agent.add(`Perdón, podrías repetirmelo?`);
	}

	async function Agendar(agent) {
		const date = agent.parameters.date.split("T")[0];
		const time = agent.parameters.time.split("T")[1];
		await User.create({
			Name: agent.parameters["given-name"],
			CI: agent.parameters.number,
			Service: agent.parameters.Servicios,
			Date: date,
			Time: time,
		});
		const user = await User.findOne({ CI: agent.parameters.number });
		if (user) {
			agent.add(
				`Te agendo ${user.Name} el ${user.Date} a las ${user.Time} gracias`
			);
		} else {
			agent.add(
				`Lo siento, hubo un error en nuestro sistema, contactanos al 09344444`
			);
		}
	}

	let intentMap = new Map();
	intentMap.set("Default Welcome Intent", welcome);
	intentMap.set("Default Fallback Intent", fallback);
	intentMap.set("Agendar", Agendar);
	// intentMap.set('your intent name here', yourFunctionHandler);
	agent.handleRequest(intentMap);
});

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
});
