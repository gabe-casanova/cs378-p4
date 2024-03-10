import { fetchWeatherApi } from "openmeteo";

const URL = "https://api.open-meteo.com/v1/forecast";

// Using Open-Meteo Weather Forecast API
const getWeatherData = (params) => {
  return new Promise((resolve, reject) => {
    fetchWeatherApi(URL, params)
      .then((responses) => {
        // helper function to form time ranges
        const range = (start, stop, step) =>
          Array.from(
            { length: (stop - start) / step },
            (_, i) => start + i * step
          );

        const response = responses[0];

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const current = response.current();
        const hourly = response.hourly();

        const weatherData = {
          current: {
            currentTime: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
		        currentTemperature: current.variables(0).value(),
          },
          hourly: {
            time: range(
              Number(hourly.time()),
              Number(hourly.timeEnd()),
              hourly.interval()
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            temperature2m: hourly.variables(0).valuesArray(),
          },
        };
        resolve(weatherData);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        reject(error);
      });
  });
};

export default getWeatherData;
