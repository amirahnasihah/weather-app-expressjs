const axios = require("axios");

const getWeather = async (req, res) => {
  const city = req.query.q;

  try {
    if (!city) {
      res.status(400).json({ msg: "Invalid query" });
    } else {
      const geocodeData = await getGeocodeData(city);

      if (geocodeData.results.length === 0) {
        res.status(404).json({ msg: "No data found" });
      } else {
        const { lat, lng } = geocodeData.results[0].geometry;
        const weatherData = await getWeatherData(lat, lng);

        res.status(200);
        res.render("forecast", { weatherData, geocodeData });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getGeocodeData = async (city) => {
  const { OPENCAGE_API_KEY } = require("../config/secrets");

  const response = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${OPENCAGE_API_KEY}&pretty=1`
  );

  return response.data;
};

const getWeatherData = async (lat, lng) => {
  const OPENMETEO_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,windspeed_10m,winddirection_10m&hourly=temperature_2m&timezone=auto`;
  const response = await axios.get(OPENMETEO_URL);

  return response.data;
};

module.exports = { getWeather };
