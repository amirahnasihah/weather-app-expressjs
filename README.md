# What to install?

> express, ejs, dotenv, axios, nodemon
> folder config, public, routes, controllers, views
> require express, path, dotenv, axios. mw json, urlencoded, view engine --ejs, static --public, cors

# Project Specifications

1. `/(root route)`
- Render a search page where users can search for a location.
- This page can be **rendered with an EJS** template which takes a single **query** and **forwards it to the forecast route**, **passing on the input value into it as the query string**.

2. `/forecast?q=query (forecast)`
- Render the results for the specific location.

## Folder structure

### config (dotenv, config, path)

For keeping secrets like API keys

```env
EXPRESS_OPENCAGE_API = 123456789
PORT = 3000
TEST_ENV = "development"
```

# Project 1 - Weather App Guide

**Instructions**

1.	Please create an assignment folder for this assignment
2.	Submission guideline:
  i.	First you should remove the node_modules folder.
  ii.	Secondly, compress the assignment folder into a .zip file.
  iii.	Submit to TalentLabs learning management system.

Weather app is a simple project which touches on a few fundamentals that we have developed so far in the course and enforce the learnings further.

**Pre-Requisite Skills:**
-	Understanding of Controllers
-	Understanding of express fundamentals 
-	Understanding Templating 

**Goals of the Project:**
-	Learning how to manage secrets
-	Learning to integrate third party services into the application 
-	Practicing and re-enforcing core API fundamentals 
-	Getting a grasp over templating 

**Required 3rd Party Integrations: **
-	OpenCage API (sign up for API Key here https://opencagedata.com/)
-	OpenMeteo API

**Specifications of the Project:**

1. / (root route):

Render a search page where users can search for a location.

This page can be rendered with an EJS template which takes a single query and forwards it to the forecast route, passing on the input value into it as the query string.
 
2. /forecast?q=query (forecast): 

Render the results for the specific location

The page must have 3 sections: 
-	Location Block (contains information about the location) 
-	Current Time Block (contains weather data for the current time) 
-	Hourly Block (gives weather information by the hour) 

To achieve this, we need to do the following. 

-	Create a controller which obtains the forecast information for the requested location.
-	Extract the location from the query string.
-	One small caveat we run into is the fact that OpenMeteo api just takes the longitude and latitude, but unfortunately for us we don’t have something to geocode (converting location name to coordinates). To fix this we bring in the OpenCage API. 
-	Use the OpenCage API to geocode the location which was passed on and extract the coordinates.
-	Using these coordinates make further requests to the Open Meteo API and check the parameters for hourly and current time weather. 
-	Create a template with corresponding cards and render the data onto those pages by passing the retrieved information in parameters to the render method.

## Planning Flow

`/forecast?q=...`

The page must have 3 sections:

1. Location Block (contains information about the location)
- City, State, Country
- Latitude: x.xx | Longitude: x.xx

2. Current Time Block (contains weather data for the current time)
- Current Temp: Celcius
- Wind Speed: km/h
- Wind Direction: Degree

3. Hourly Block (gives weather information by the hour)
- weather icon
- hourly time (24 hours)
- temperature

> client search city name to know about weather. but, OpenMeteo only takes lat and lon so have to **convert city name to coordinates** of latitude/longitude with OpenCage first.
> query = city name --> use OpenCage Forward geocode -->

## Geocode **(converting location name to coordinates)** with OpenCage API

Two Geocoding API provide by OpenCage:

1. Worldwide
2. Reverse **(latitude/longitude to text)**
3. Forward **(text to latitude/longitude)✅**

- **Reverse geocoding**

`https://api.opencagedata.com/geocode/v1/json?q=LAT+LNG&key=${apiKey}`

[Sample reverse request using your API key&nbsp;](https://api.opencagedata.com/geocode/v1/json?key=a9e584620e7b4b318df2d454fedbec8e&q=52.3877830%2C9.7334394&pretty=1) 

- **Forward geocoding✅**

`https://api.opencagedata.com/geocode/v1/json?q=URI-ENCODED-PLACENAME&key=${apiKey}`

[Sample forward request using your key&nbsp;](https://api.opencagedata.com/geocode/v1/json?key=a9e584620e7b4b318df2d454fedbec8e&q=Frauenplan+1%2C+99423+Weimar%2C+Germany&pretty=1)

## example

To create a weather app using Express.js, Axios, and EJS, you'll need to follow several steps. Here's a step-by-step guide on how to implement the features you mentioned:

1. Set Up Your Project:
   - Initialize a new Node.js project and install the required dependencies (Express.js, Axios, EJS).
   - Create an Express application and set up your project structure.

2. Obtain API Keys:
   - Sign up for an account and obtain API keys for both OpenMeteo and OpenCage.

3. Create a Controller for Weather Forecast:
   - Create a controller file (e.g., `weatherController.js`) to handle the logic for obtaining weather forecasts.
   - Import the necessary modules (Express, Axios) and set up the routes.

```javascript
// weatherController.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Define routes for weather information
router.get('/', async (req, res) => {
  try {
    const location = req.query.location; // Extract location from the query string

    // Step 4: Use OpenCage API to geocode the location
    const geocodeData = await getGeocodeData(location);

    // Extract the latitude and longitude from geocodeData
    const { lat, lng } = geocodeData.results[0].geometry;

    // Step 5: Make requests to OpenMeteo API for hourly and current weather
    const weatherData = await getWeatherData(lat, lng);

    // Step 6: Create a template and render the weather information
    res.render('weather', { weatherData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});

// Function to get geocode data using OpenCage API
async function getGeocodeData(location) {
  // Use Axios to make a request to the OpenCage API
  const response = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=YOUR_OPENCAGE_API_KEY`
  );

  return response.data;
}

// Function to get weather data using OpenMeteo API
async function getWeatherData(lat, lng) {
  // Use Axios to make requests to OpenMeteo API for hourly and current weather
  // Replace 'YOUR_OPENMETEO_API_KEY' with your actual API key
  const currentWeatherResponse = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto&timezone_offset=auto&appid=YOUR_OPENMETEO_API_KEY`
  );

  return currentWeatherResponse.data;
}

module.exports = router;
```

4. Set Up Views (EJS Templates):
   - Create EJS templates for rendering weather information. These templates can be in a `views` folder.
   - Create a template (e.g., `weather.ejs`) that will display the weather data.

```html
<!-- views/weather.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather Forecast</title>
</head>
<body>
  <h1>Weather Forecast for <%= weatherData.results.location %></h1>
  <div class="current-weather">
    <h2>Current Weather</h2>
    <p>Temperature: <%= weatherData.current.temperature %>°C</p>
    <!-- Add more current weather information here -->
  </div>
  <div class="hourly-weather">
    <h2>Hourly Weather</h2>
    <ul>
      <% weatherData.hourly.temperature_2m.forEach(temp => { %>
        <li><%= temp %>°C</li>
      <% }); %>
    </ul>
    <!-- Add more hourly weather information here -->
  </div>
</body>
</html>
```

5. Set Up Express to Use EJS:
   - Configure Express to use EJS as the view engine.

```javascript
// In your main app file (e.g., app.js)
const express = require('express');
const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Use the weather controller
const weatherController = require('./weatherController');
app.use('/weather', weatherController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

6. Run Your App:
   - Start your Express application using `node app.js` (or your main app file).

Now, when you visit `http://localhost:3000/weather?location=YourLocation`, your app will make requests to the OpenCage API to geocode the location, then use the coordinates to fetch weather data from the OpenMeteo API. Finally, it will render the weather data in your EJS template. Don't forget to replace `'YOUR_OPENCAGE_API_KEY'` and `'YOUR_OPENMETEO_API_KEY'` with your actual API keys.