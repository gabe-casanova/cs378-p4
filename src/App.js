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
      alert(`Could not find weather data for "${cityName}"`);
      return;
    }

    // if we get here, we know the user submitted a valid city
    const formattedCity = await formatCityName(cityName);

    setCities((prevCities) => [...prevCities, formattedCity]);
    setTextInputValue(""); // clear input field after adding the new city
    setCity(formattedCity);

    // scroll to the end of the cities-container (after new button has been added)
    setTimeout(() => {
      const container = document.querySelector(".cities-container");
      container.scrollLeft = container.scrollWidth;
    }, 0);
  };

  return (
    <div className="main-container">
      <div className="cities-container">
        {cities.map((cityName, index) => (
          <CityButton
            key={index}
            name={cityName}
            onClick={() => setCity(cityName)}
            isLastChild={index === cities.length - 1}
            isSelected={city === cityName}
          />
        ))}
      </div>
      <div className="input-container">
        <input
          className="input-field"
          value={textInputValue}
          onChange={(e) => setTextInputValue(e.target.value)}
        />
        <button
          className="add-button"
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
