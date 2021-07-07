const loadingMsg = document.getElementById("loadingMsg");
const mainContainer = document.querySelector(".main-container");
const weatherImg1 = document.getElementsByClassName("weatherImg")[0];
const weatherType = document.getElementById("weatherType");
const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext(`2d`);
const currentDate = new Date();
const daysObject = {
    0:"Sunday",
    1:"Monday",
    2:"Tuesday",
    3:"Wednesday",
    4:"Thursday",
    5:"Friday",
    6:"Saturday"
}
function geolocate() {
    navigator.geolocation.watchPosition(setCoords);
}
async function setCoords(position) {
    let lat = position.coords.latitude;
    let log = position.coords.longitude;
    console.log(`Geolocated with Latitude: ${lat} Longitude: ${log}`)
    console.log("Fetching data from Openweathermap...")
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${log}&exclude=minutely&units=imperial&appid=943f1223b9996ecae3cb1fe9233e975b`);
    const response2 = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${log}&limit=1&appid=943f1223b9996ecae3cb1fe9233e975b`)
    if (!response.ok) {
        loadingMsg.innerText = (`Error ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    else {
        const weatherData = await response.json();
        const locationName = await response2.json();
        loadingMsg.classList.add("hidden");
        mainContainer.classList.remove("hidden");
        setMainData(weatherData, currentDate, locationName);
        setWeeklyForecast(weatherData, currentDate.getDay());
        setClock(weatherData, currentDate.getHours());
    }
}

function setMainData(weatherData, currentDate, locationName) {
    console.log(weatherData);
    console.log(locationName);
    const date = document.getElementById("date");
    const location = document.getElementById("location");
    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const wind = document.getElementById("wind");
    date.textContent = currentDate;
    temperature.textContent = `${Math.round(weatherData.current.temp)}° F`;
    location.textContent = `${locationName[0].name}`;
    weatherType.textContent = `${weatherData.current.weather[0].description}`;
    humidity.textContent = ` ${weatherData.current.humidity}%`;
    wind.textContent = ` ${Math.round(weatherData.current.wind_speed)}mph`;
    iconSelector(weatherData.current.weather[0].main, weatherImg1, weatherData.current.weather[0].description, currentDate.getHours());
}

function setWeeklyForecast(weatherData, currentDay) {
    const daysText = document.getElementsByClassName("daysText");
    const daysImg = document.getElementsByClassName("weeklyWeatherImg");
    const daysTemp = document.getElementsByClassName("highLow");
    for (i=0, j=currentDay; i<8; i++, j++) {
        if (j>6) {
            j=0;
        }
        daysText[i].textContent = daysObject[j];
        daysTemp[i].textContent = `${Math.round(weatherData.daily[i].temp.max)}°/${Math.round(weatherData.daily[i].temp.min)}°`;
        iconSelector(weatherData.daily[i].weather[0].main, daysImg[i], weatherData.daily[i].weather[0].description);
    }
}

function iconSelector(weatherDesc, img, extraWeatherDesc, currentHour) {
    switch (weatherDesc) {
        case "Thunderstorm":
            if (extraWeatherDesc = extraWeatherDesc == "thunderstorm with light rain" || extraWeatherDesc == "light thunderstorm" || extraWeatherDesc == "thunderstorm with light drizzle") {
                img.add("pe-is-w-mix-rainfall-1");
            }
            else if (extraWeatherDesc = "thunderstorm with heavy rain" || extraWeatherDesc == "thunderstorm with rain" || extraWeatherDesc == "thunderstorm with drizzle" || extraWeatherDesc == "thunderstorm with heavy drizzle") {
                img.add("pe-is-w-mix-rainfall-2");
            }
            else if (extraWeatherDesc = "thunderstorm" || extraWeatherDesc == "ragged thunderstorm") {
                img.add("pe-is-w-thunderstorm")
            }
            else if (extraWeatherDesc = "heavy thunderstorm") {
                img.add("pe-is-w-severe-thunderstorm");
            }
            break;
        case "Drizzle":
            if (extraWeatherDesc = "heavy intensity drizzle" || extraWeatherDesc == "heavy intensity drizzle rain" || extraWeatherDesc == "heavy shower rain and drizzle") {
                img.add("pe-is-w-heavy-rain-2");
            }
            else {
                img.add("pe-is-w-drizzle");
            }
            break;
        case "Rain":
            if (extraWeatherDesc == "moderate rain" || extraWeatherDesc == "shower rain") {
                img.classList.add("pe-is-w-heavy-rain-2");
            }
            else if (extraWeatherDesc == "light rain" || extraWeatherDesc == "light intensity shower rain" || extraWeatherDesc == "ragged shower rain") {
                img.classList.add("pe-is-w-drizzle");
            }
            else if (extraWeatherDesc == "heavy intensity rain" || extraWeatherDesc == "very heavy rain" || extraWeatherDesc == "extreme rain" || extraWeatherDesc == "heavy intensity shower rain") {
                img.classList.add("pe-is-w-heavy-rain-1");
            }
            else if (extraWeatherDesc == "freezing rain") {
                img.classList.add("pe-is-w-heavy-hail");
            }
            break;
        case "Snow":
            if (extraWeatherDesc == "light shower sleet" || extraWeatherDesc == "shower sleet" || extraWeatherDesc == "sleet") {
                img.classList.add("pe-is-w-heavy-hail");
            }
            else if (extraWeatherDesc == "light rain and snow" || extraWeatherDesc == "rain and snow") {
                img.classList.add("pe-is-w-rain-and-snow");
            }
            else {
                img.classList.add("pe-is-w-snow");
            }
            break;
        case "Mist":
        case "Smoke":
        case "Haze":
        case "Dust":
        case "Sand":
        case "Ash":
        case "Squall":
            img.classList.add("pe-is-w-mist");
            break;
        case "Fog":
            img.classList.add("pe-is-w-fog-1");
            break;
        case "Tornado":
            img.classList.add("pe-is-w-tornado-1");
            break;
        case "Clear":
            if (currentHour < 6 || currentHour > 19) {
                img.classList.add("pe-is-w-moon-1");
            }
            else {
                img.classList.add("pe-is-w-sun-1");
                img.classList.add("pe-spin");
            }
            break;
        case "Clouds":
            if (extraWeatherDesc == "few clouds" || extraWeatherDesc == "scattered clouds") {
                if (currentHour < 6 || currentHour > 19) {
                    img.classList.add("pe-is-w-partly-cloudy-3");
                }
                else {
                    img.classList.add("pe-is-w-partly-cloudy-1");
                }
            }
            else if (extraWeatherDesc == "broken clouds") {
                img.classList.add("pe-is-w-mostly-cloudy-2")
            }
            else if (extraWeatherDesc == "overcast clouds") {
                img.classList.add("pe-is-w-mostly-cloudy-1")
            }
            break;
    }
}

function initialClockDraw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillRect(115, 115, 20, 20);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(125,250);
    ctx.lineTo(125,0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,125);
    ctx.lineTo(250,125);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,62);
    ctx.lineTo(250,188);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(62,0);
    ctx.lineTo(188,250);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(188,0);
    ctx.lineTo(62,250);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,188);
    ctx.lineTo(250,62);
    ctx.stroke();
}

function setClock(weatherData, currentHour) {
    const hourIcons = document.getElementsByClassName("hour");
    let currentHourHand = 0;
    const realCurrentHour = currentHour;
    if (currentHour < 12) {
        currentHourHand = currentHour;
    }
    else {
        currentHour -= 12;
        currentHourHand = currentHour;
    }
    for (i=0,j=currentHour;i<12;i++,j++){
        if (j>11) {
            j=0;
        }
        iconSelector(weatherData.hourly[i].weather[0].main, hourIcons[j], weatherData.hourly[i].weather[0].description, realCurrentHour);
    }
    const hourHands = {0:[125,0],1:[188,0],2:[250,62],3:[250,125],4:[250,188],5:[188,250],6:[125,250],7:[62,250],8:[0,188],9:[0,125],10:[0,62],11:[62,0]};
    ctx.lineWidth = 10;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(125,125);
    ctx.lineTo(hourHands[currentHourHand][0],hourHands[currentHourHand][1]);
    ctx.stroke();
}

geolocate();
initialClockDraw();
    //Fix setting the time of day for hours on the weather clock to set the icons
    //Add alerts using data from the weather api
    //Use more features from the icon pack such as thermometer icons next to temperature