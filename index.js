const loadingMsg = document.getElementById("loadingMsg");
const mainContainer = document.querySelector(".main-container");
navigator.geolocation.watchPosition(setCoords);
async function setCoords(position) {
    let lat = position.coords.latitude;
    let log = position.coords.longitude;
    console.log("Latitude: " + lat + " Longitude: " + log)
    const response = await fetch('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+log+'&units=imperial&appid=943f1223b9996ecae3cb1fe9233e975b');
    const weatherData = await response.json();
    console.log(weatherData);
    loadingMsg.classList.add("hidden");
    mainContainer.classList.remove("hidden");
}