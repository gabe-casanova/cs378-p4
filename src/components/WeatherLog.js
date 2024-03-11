import React, { useState, useEffect } from "react";
import getWeatherData from "../api/getWeatherData";
import { getLocationData } from "../api/getLocationData";

const WeatherLog = ({ name }) => {
  const [days, setDays] = useState("");
  const [degrees, setDegrees] = useState([]);
  const [currTemp, setCurrTemp] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    setLoading(true); // start loading

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
          forecast_days: 3,
        };

        // fetch city's weather data
        getWeatherData(params)
          .then((weatherData) => {
            // get current temperature in fahrenheit
            const { currentTemperature } = weatherData.current;
            setCurrTemp(((currentTemperature * 9) / 5 + 32).toFixed(0));

            // extract hourly weather data
            const { time, temperature2m } = weatherData.hourly;
            const formattedDays = time.map((t) => formatDate(t));
            const uniqueDays = [...new Set(formattedDays)];
            const degrees = time.map((t, index) => {
              // day of the week ("March 8")
              const day = formatDate(t);

              // time of day ("6p")
              const hours = t.getHours();
              const ampm = hours >= 12 ? "p" : "a";
              const formattedHours = hours % 12 || 12; // no military time
              const time = formattedHours + ampm;

              // degree in fahrenheit
              const celsius = temperature2m[index];
              const fahrenheit = (celsius * 9) / 5 + 32;
              const degree = fahrenheit.toFixed(0);

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
        setLoading(false);
      });
  }, [name]);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  const currentSystemDay = new Date().toLocaleString("en-US", {
    month: "long",
    day: "numeric",
  });

  const currentSystemHour = new Date()
    .toLocaleString("en-US", {
      hour: "numeric",
      hour12: true,
    })
    .toLowerCase()
    .replace(/\s/, "")
    .slice(0, -1); // "4pm" -> "4p"

  const renderDegreesForDay = (day) => {
    return degrees
      .filter((degree) => degree[0] === day)
      .map((degree, index) => {
        const hour = degree[1];
        const temperature = degree[2];
        const isCurrentHour =
          day === currentSystemDay && hour === currentSystemHour;
        const rowClassName = isCurrentHour ? "current-hour-row" : "";
        return (
          <tr key={index} className={rowClassName}>
            <td className="hour">{hour}</td>
            <td className="temp">{temperature}°</td>
          </tr>
        );
      });
  };

  return (
    <>
      <div className="city-header-container">
        <h2 id="city-name">{location.name}</h2>
        <span id="city-temperature">{currTemp}° F</span>
      </div>
      <div className="weather-log-container">
        {days.map((day, dayIndex) => (
          <div key={dayIndex}>
            <h3 className="day-header">
              {day === currentSystemDay ? "☆ " : null}
              {day}
            </h3>
            <div className="table-container">
              <table>
                <tbody>{renderDegreesForDay(day)}</tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default WeatherLog;
