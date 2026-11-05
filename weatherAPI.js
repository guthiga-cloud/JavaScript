// 5. weatherAPI.js - Weather API simulator and fetcher

class WeatherAPI {
    constructor(apiKey = null) {
        this.apiKey = apiKey;
    }

    // Simulated weather data
    getMockWeather(city) {
        const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy'];
        const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const randomTemp = Math.floor(Math.random() * 35) - 5; // -5 to 30 degrees
        
        return {
            city: city,
            temperature: randomTemp,
            condition: randomCondition,
            humidity: Math.floor(Math.random() * 100),
            windSpeed: Math.floor(Math.random() * 50),
            timestamp: new Date()
        };
    }

    formatWeatherReport(weatherData) {
        return `
Weather Report for ${weatherData.city}:
Temperature: ${weatherData.temperature}°C
Condition: ${weatherData.condition}
Humidity: ${weatherData.humidity}%
Wind Speed: ${weatherData.windSpeed} km/h
Last Updated: ${weatherData.timestamp.toLocaleString()}
        `;
    }
}

module.exports = WeatherAPI;
