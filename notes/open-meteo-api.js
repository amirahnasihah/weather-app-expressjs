// run on shell: node weatherAPI/openmeteo.js
const axios = require('axios')

const getWeatherData = async (lat, lon) => {
	const response = await axios.get(
		`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,windspeed_10m,winddirection_10m&hourly=temperature_2m&timezone=auto`
	);
	const weatherData = response.data

	console.log("openmeteo:", weatherData)
	
	const {latitude, longitude, current, current_units, hourly, hourly_units} = weatherData
	console.log("Latitude:", latitude)
	console.log("Longitude:", longitude)
	
	console.log(`Current: ${current.time} ${current_units.time} || Temp: ${current.temperature_2m}${current_units.temperature_2m} || ${current.windspeed_10m}${current_units.windspeed_10m} || ${current.winddirection_10m}${current_units.winddirection_10m}`)

	const numHours = 6;
	const wholeDay = hourly.time.length
	
	// for(let i = 0; i < numHours; i++) {
	// 	const localTime = new Date(hourly.time[i]).toLocaleTimeString()
		
	// 	console.log(`Hourly: ${localTime} || ${hourly.temperature_2m[i]}°C`)
	// }

	/* map() method: we use `slice(0, numHours)` method to extract the first `numHours` elements from the `hourly.time` array. slice from arrays of time */
	// hourly.time.slice(0, numHours).map((forecastTime, index) => {
	// 	const localTime = new Date(forecastTime).toLocaleTimeString();
	// 	const temperature = hourly.temperature_2m[index];

	// 	console.log(`Hourly: ${localTime} || ${temperature}°C`);
	// });

	hourly.time.slice(0, 4).map((time, index) => {
		const localTime = new Date(time).toLocaleTimeString()
		const temperature = hourly.temperature_2m[index]

		console.log(`Hourly: ${localTime} || ${temperature}${hourly_units.temperature_2m} `)
	})
};

getWeatherData(3.1412, 101.6865)