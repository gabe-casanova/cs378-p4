// Using Open-Meteo Geocoding API
const fetchData = async (name) => {
  const URL = "https://geocoding-api.open-meteo.com/v1/search";
  try {
    const response = await fetch(
      `${URL}?name=${name}&count=1&language=en&format=json`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

const isValidCity = async (name) => {
  try {
    const locationData = await fetchData(name);
    if (locationData.results.length > 0) {
      // check if latitude and longitude data are present
      const { latitude, longitude } = locationData.results[0];
      return typeof latitude === "number" && typeof longitude === "number";
    }
    return false; // no result found
  } catch (error) {
    console.error("Error checking city validity:", error);
    return false; // error occurred
  }
};

const formatCityName = async (unformattedName) => {
  try {
    const locationData = await fetchData(unformattedName);
    const { name } = locationData.results[0];
    return name;
  } catch (error) {
    console.error("Error checking city validity:", error);
  }
};

const getLocationData = (name) => {
  return fetchData(name);
};

export { getLocationData, isValidCity, formatCityName };
