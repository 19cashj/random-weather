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
    //
    temperature.textContent = `${Math.round(weatherData.current.temp)}° F`;
    location.textContent = `${locationName[0].name}`;
    weatherType.textContent = `${weatherData.current.weather[0].description}`;
    humidity.textContent = ` ${weatherData.current.humidity}%`;
    wind.textContent = ` ${Math.round(weatherData.current.wind_speed)}mph`;
    iconSelector(weatherData.current.weather[0].main, weatherImg1, currentDate.getHours());
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
        iconSelector(weatherData.daily[i].weather[0].main, daysImg[i]);
    }
}

function iconSelector(weatherDesc, img, currentHour) {
    switch (weatherDesc) {
        case "Thunderstorm":
            img.add("pe-is-w-mix-rainfall-2");
            break;
        case "Drizzle":
            img.classList.add("pe-is-w-drizzle");
            break;
        case "Rain":
            img.classList.add("pe-is-w-rain-1");
            break;
        case "Snow":
            img.classList.add("pe-is-w-snow");
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
                img.classList.add("pe-is-w-moon-2");
            }
            else {
                img.classList.add("pe-is-w-sun-1");
                img.classList.add("pe-spin");
            }
            break;
        case "Clouds":
            img.classList.add("pe-is-w-mostly-cloudy-1");
            break;
    }
}
function hamUIAnimate(state) {
    if (state == 1) {
        document.getElementById("hamUI").classList.remove("hamAnimateBack");
        document.getElementById("hamUI").classList.remove("hidden");
        document.getElementById("hamUI").classList.add("hamAnimateStart");
    }
    else {
        document.getElementById("hamUI").classList.remove("hamAnimateStart");
        document.getElementById("hamUI").classList.add("hamAnimateBack");
        setTimeout(() => {
            document.getElementById("hamUI").classList.add("hidden");
        }, 400);
    }
}

function initialClockDraw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillRect(115, 115, 20, 20);
    ctx.lineWidth = 1;
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
        iconSelector(weatherData.hourly[i].weather[0].main, hourIcons[j]);
    }
    //
    const hourHands = {0:[125,0],1:[188,0],2:[250,62],3:[250,125],4:[250,188],5:[188,250],6:[125,250],7:[62,250],8:[0,188],9:[0,125],10:[0,62],11:[62,0]};
    ctx.lineWidth = 20;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(125,125);
    ctx.lineTo(hourHands[currentHourHand][0],hourHands[currentHourHand][1]);
    ctx.stroke();
}

function hideHumidityWind() {
    //document.querySelector(".container2").classList.add("hidden");
}

geolocate();
initialClockDraw();
    //Add if statements in cases for checking time of day to set the icon to the moon/sun and if statements to check weather description and set icons
    //Fill in colors on both sides of the hour hand for the weather clock to differentiate AM and PM such as filling in RED/BLUE for the icons before and after the current hour
    //Add alerts using data from the weather api