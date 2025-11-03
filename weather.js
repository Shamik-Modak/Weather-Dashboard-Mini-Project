const apiKey = "64538683818d68a8971150a4cef3eaf6";

async function getWeather() {
  const city = document.getElementById("city").value.trim();
  if (!city) return alert("Please enter a city name!");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      alert("City not found!");
      return;
    }

    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("feels-like").textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${data.wind.speed} km/h`;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    const forecastData = await forecastResponse.json();
    displayForecast(forecastData);
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

function displayForecast(forecastData) {
  const hourlyContainer = document.getElementById("hourly-forecast");
  const dailyContainer = document.getElementById("daily-forecast");
  hourlyContainer.innerHTML = "";
  dailyContainer.innerHTML = "";

  forecastData.list.slice(0, 6).forEach(item => {
    const time = new Date(item.dt * 1000).getHours();
    const div = document.createElement("div");
    div.classList.add("forecast-item");
    div.innerHTML = `
      <p>${time}:00</p>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
      <p>${Math.round(item.main.temp)}°C</p>
    `;
    hourlyContainer.appendChild(div);
  });

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const now = new Date();
  const nextDays = [
    dayNames[(now.getDay() + 1) % 7],
    dayNames[(now.getDay() + 2) % 7],
    dayNames[(now.getDay() + 3) % 7]
  ];

  const dailyMap = {};
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap[date]) dailyMap[date] = [];
    dailyMap[date].push(item);
  });

  Object.keys(dailyMap).slice(1, 4).forEach((date, index) => {
    const dayData = dailyMap[date];
    const avgTemp = dayData.reduce((sum, i) => sum + i.main.temp, 0) / dayData.length;
    const div = document.createElement("div");
    div.classList.add("forecast-item");
    div.innerHTML = `
      <p>${nextDays[index]}</p>
      <img src="https://openweathermap.org/img/wn/${dayData[0].weather[0].icon}.png">
      <p>${Math.round(avgTemp)}°C</p>
    `;
    dailyContainer.appendChild(div);
  });
}

function updateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
  document.getElementById("time").textContent = time;
  document.getElementById("date").textContent = date;
}
setInterval(updateTime, 1000);

document.getElementById("city").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    getWeather();
  }
});
