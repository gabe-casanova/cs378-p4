import React, { useState, useEffect } from "react";
import getWeatherData from "../api/getWeatherData";
import { getLocationData } from "../api/getLocationData";

const WeatherLog = ({ name }) => {
  const [days, setDays] = useState("");
  const [degrees, setDegrees] = useState([]);
  const [currTemp, setCurrTemp] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch city's latitude/longitude coordinates
    getLocationData(name)
      .then((locationData) => {
        const { name, latitude, longitude } = locationData.results[0];
        setLocation({ name, latitude, longitude });

        const params = {
          latitude,
          longitude,
          current: "temperature_2m",
          hourly: "temperature_2m",
          forecast_days: 1,
        };

        // fetch city's weather data
        getWeatherData(params)
          .then((weatherData) => {
            // get current temperature in fahrenheit
            const { currentTemperature } = weatherData.current;
            setCurrTemp(((currentTemperature * 9) / 5 + 32).toFixed(2));
            
            // extract hourly weather data
            const { time, temperature2m } = weatherData.hourly;
            const formattedDays = time.map((t) => t.toDateString());
            const uniqueDays = [...new Set(formattedDays)];
            const degrees = time.map((t, index) => {
              // day of the week ("Fri Mar 08 2024")
              const day = t.toDateString();

              // time of day ("6pm")
              const hours = t.getHours();
              const ampm = hours >= 12 ? "PM" : "AM";
              const formattedHours = hours % 12 || 12; // no military time
              const time = formattedHours + ampm;

              // degree in fahrenheit
              const celsius = temperature2m[index];
              const fahrenheit = (celsius * 9) / 5 + 32;
              const degree = fahrenheit.toFixed(2);

              return [day, time, degree];
            });
            setDays(uniqueDays);
            setDegrees(degrees);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching weather data:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });
  }, [name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // console.log(currTemp);

  return (
    <>
      <div>
        <h2>Location Information:</h2>
        <p>Name: {location.name}</p>
        <p>Latitude: {location.latitude}</p>
        <p>Longitude: {location.longitude}</p>
      </div>
      <div>
        <h2>Degrees Information:</h2>
        {degrees.map((degree, index) => (
          <div key={index}>
            <p>Day: {degree[0]}</p>
            <p>Time: {degree[1]}</p>
            <p>Degree: {degree[2]}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default WeatherLog;
