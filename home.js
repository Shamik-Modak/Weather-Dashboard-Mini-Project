const API_KEY = "64538683818d68a8971150a4cef3eaf6"; 
const city = "Nagpur";

async function getWeather() {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  const data = await res.json();

  document.getElementById("city").textContent = data.name;
  document.getElementById("temp").textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById("desc").textContent = data.weather[0].description;
  document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

getWeather();
