const { WebhookClient, Payload } = require("dialogflow-fulfillment");

const User = require("../models/User");
const Service = require("../models/Service");

module.exports = function (req, res) {
	const agent = new WebhookClient({ request: req, response: res });

	function welcome(agent) {
		agent.add(
			`Hola soy tu asistente virtual, puedo ayudarte a agendar una cita, contarte sobre los servicios que ofrecemos, nuestro horario y donde nos ubicamos!`
		);
	}

	function fallback(agent) {
		agent.add(`Lo siento, no te entendí`);
		agent.add(`Perdón, podrías repetirmelo?`);
	}
	//No muestra la imagen en la Web pero si en DialogFlow.
	function Ubicacion(agent) {
		const payloadData = {
			richContent: [
				[
					{
						type: "image",
						rawUrl:
							"https://www.javea.com/wp-content/uploads/2018/11/fachada-vanguardia-peluqueria-766x507.jpg",
						accessibilityText: "Buidling",
					},
				],
			],
		};
		agent.add(
			new Payload(agent.UNSPECIFIED, payloadData, {
				sendAsMessage: true,
				rawPayload: true,
			})
		);
		agent.add(`Estamos ubicados en 18 de julio 1234, esquina Yi.`);
	}

	async function Agendar(agent) {
		const date = agent.parameters.date.split("T")[0];
		const time = agent.parameters.time.split("T")[1];
		agent.add(
			`Confirmame si esta bien ${agent.parameters["given-name"]}, el ${date} a las ${time} para ${agent.parameters.Servicios}?`
		);
	}

	async function Listado(agent) {
		const services = await Service.find();
		agent.add(`Estos son nuestros servicios:`);
		for (const service of services) {
			agent.add(`${service.Name} $${service.Price}`);
		}
	}

	async function Positiva(agent) {
		const date = agent.parameters.date.split("T")[0];
		const time = agent.parameters.time.split("T")[1];
		await User.create({
			Name: agent.parameters["given-name"],
			CI: agent.parameters.number,
			Service: agent.parameters.Servicios,
			Date: date,
			Time: time,
		});
		agent.add(`Genial te esperamos!`);
	}

	function Negativa(agent) {
		agent.add(`No hay problema, lo cancelo y seguimos.`);
		agent.add(`Si hay algo mas en lo que te pueda ayudar solo decime.`);
	}

	let intentMap = new Map();
	intentMap.set("Default Welcome Intent", welcome);
	intentMap.set("Default Fallback Intent", fallback);
	intentMap.set("Ubicacion", Ubicacion);
	intentMap.set("Agendar", Agendar);
	intentMap.set("ListadoServicios", Listado);
	intentMap.set("FinDeAgendaPositiva", Positiva);
	intentMap.set("FinDeAgendaNegativa", Negativa);
	// intentMap.set('your intent name here', yourFunctionHandler);
	agent.handleRequest(intentMap);
};
