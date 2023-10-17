# ref with comments

```javascript
const axios = require("axios");

const getWeather = async (req, res) => {
  // opencage; location name to coordinates since open meteo accept coord only
  const city = req.query.q;

  try {
    if (!city) {
      res.status(400).json({ msg: "Invalid query" });
    } else {
      // got location(london) with coord from opencage. then, extract coord from opencage.

      // we passed the location (which is req.query) to the getGeocodeData() (ie get data from opencage api) and store in geocodeData variable.
      const geocodeData = await getGeocodeData(city);

      if (geocodeData.results.length === 0) {
        res.status(404).json({ msg: "No data found" });
      } else {
        // destructure coordinates from geocodeData, take first index of results.
        const { lat, lng } = geocodeData.results[0].geometry;

        // got coord, now get data from open meteo bcs we need hourly forecast and current weather. so, passed { lat, lng } to getWeatherData() as arguments.
        const weatherData = await getWeatherData(lat, lng);
        // now, we got weather data from openmeteo in coord since we passed lat,lng from opencage to getWeatherData().
        // and openmeteo gives current info also hourly forecast.

        // so, render info that we want to ejs
        res.status(200);
        res.render("forecast", { weatherData, geocodeData });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// forward geocode open cage
const getGeocodeData = async (city) => {
  const { OPENCAGE_API_KEY } = require("../config/secrets");

  const response = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${OPENCAGE_API_KEY}&pretty=1`
  );

  return response.data;
};

// open meteo to get coordinates
const getWeatherData = async (lat, lng) => {
  const OPENMETEO_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,windspeed_10m,winddirection_10m&hourly=temperature_2m&timezone=auto`;
  const response = await axios.get(OPENMETEO_URL);

  return response.data;
};

module.exports = { getWeather };
```