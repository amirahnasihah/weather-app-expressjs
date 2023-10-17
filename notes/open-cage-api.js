const axios = require("axios");
require("dotenv").config();
const mySecret = process.env.OPENCAGE_API_KEY;
const TEST_ENV = process.env.TEST_ENV;

const getGeocodeData = async (city) => {
  console.log("env:", TEST_ENV);

  const response = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${mySecret}&pretty=1`
  );
  const geocodeData = response.data.results[0];

  // console.log(response.data.results[0])
  console.log("City:", geocodeData.components.city);
  console.log("State:", geocodeData.components.state);
  console.log("Country:", geocodeData.components.country);
};

getGeocodeData("london");
