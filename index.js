import fastify from "fastify";
import fetch from "node-fetch";
import dotenv from "dotenv";


dotenv.config("./.env");


(async () => {

    const API_KEY = process.env.API_KEY;
    const app = fastify({logger: true});
    
    app.get("/", async (request, reply) => {
      return {ok: true};
    });

    app.get("/weather", async (request, reply) => {
      
      const { lat, lon } = request.query;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

      try {
        const weatherResponse = await fetch(url);
        const weatherData = await weatherResponse.json();
        reply.status(200).send({
          "Condition": weatherData.weather[0].main,
          "Temperature": weatherData.main.temp,
          "Feels_like": weatherData.main.feels_like,
          "City": weatherData.name
      })
      } catch (err) {
        app.log.error(err);
        reply.status(503).send({err: "Oh noes"})
      }});

  try {
    await app.listen({
      port: process.env.PORT || 8080,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1)
  }
})();
