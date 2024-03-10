import "./App.css";
import React, { useState } from "react";
import CityButton from "./components/CityButton";
import WeatherLog from "./components/WeatherLog";
import { isValidCity, formatCityName } from "./api/getLocationData";

function App() {
  const [cities, setCities] = useState(["Austin", "Dallas", "Houston"]);
  const [city, setCity] = useState("Austin");
  const [textInputValue, setTextInputValue] = useState("");

  const addCity = async (cityName) => {
    const lowercaseCities = cities.map((city) => city.toLowerCase());
    if (lowercaseCities.includes(cityName.toLowerCase())) return;

    const isValid = await isValidCity(cityName);
    if (!isValid) {
      alert(`Latitude and longitude for "${cityName}" not found!`);
      return;
    }

    const formattedCity = await formatCityName(cityName);

    setCities((prevCities) => [...prevCities, formattedCity]);
    setTextInputValue(""); // clear input field after adding the new city
  };

  return (
    <div>
      <h1>Weather</h1>
      {cities.map((cityName, index) => (
        <CityButton
          key={index}
          name={cityName}
          onClick={() => setCity(cityName)}
        />
      ))}
      <div>
        <input
          value={textInputValue}
          onChange={(e) => setTextInputValue(e.target.value)}
        />
        <button
          onClick={async () => {
            if (textInputValue.trim() !== "") {
              await addCity(textInputValue);
            }
          }}
        >
          +
        </button>
      </div>
      <WeatherLog name={city} />
    </div>
  );
}

export default App;
