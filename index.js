const loadingMsg = document.getElementById("loadingMsg");
const mainContainer = document.querySelector(".main-container");
navigator.geolocation.watchPosition(setCoords);
async function setCoords(position) {
    let lat = position.coords.latitude;
    let log = position.coords.longitude;
    console.log(`Geolocated with Latitude: ${lat} Longitude: ${log}`)
    console.log("Fetching data from Openweathermap...")
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&units=imperial&appid=943f1223b9996ecae3cb1fe9233e975b`);
    if (!response.ok) {
        loadingMsg.innerText = (`Error ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    else {
        const weatherData = await response.json();
        loadingMsg.classList.add("hidden");
        mainContainer.classList.remove("hidden");
        setData(weatherData);
    }
}

function setData(weatherData) {
    console.log(weatherData);
    const currentDate = new Date();
    const date = document.getElementById("date");
    const location = document.getElementById("location");
    const weatherImg1 = document.getElementsByClassName("weatherImg")[0];
    const weatherType = document.getElementById("weatherType");
    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const wind = document.getElementById("wind");
    date.textContent = `${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;
    temperature.textContent = `${Math.round(weatherData.main.temp)} F`;
    location.textContent = weatherData.name;
    weatherType.textContent = weatherData.weather[0].description;
    switch (weatherData.weather[0].main) {
        case "Thunderstorm":
            weatherImg1.classList.add("pe-is-w-mix-rainfall-2");
            break;
        case "Drizzle":
            weatherImg1.classList.add("pe-is-w-drizzle");
            break;
        case "Rain":
            weatherImg1.classList.add("pe-is-w-rain-1");
            break;
        case "Snow":
            weatherImg1.classList.add("pe-is-w-snow");
            break;
        case "Mist":
        case "Smoke":
        case "Haze":
        case "Dust":
        case "Sand":
        case "Ash":
        case "Squall":
            weatherImg1.classList.add("pe-is-w-mist");
            break;
        case "Fog":
            weatherImg1.classList.add("pe-is-w-fog-1");
            break;
        case "Tornado":
            weatherImg1.classList.add("pe-is-w-tornado-1");
            break;
        case "Clear":
            weatherImg1.classList.add("pe-is-w-sun-1");
            break;
        case "Clouds":
            weatherImg1.classList.add("pe-is-w-mostly-cloudy-1");
            break;
    }

    humidity.textContent = ` ${weatherData.main.humidity}%`;
    wind.textContent = ` ${weatherData.wind.speed}mph`;
}