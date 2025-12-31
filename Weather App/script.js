const input = document.querySelector(".searchBar input");
const btn = document.querySelector("button");
const tempDetection = document.querySelector(".tempDetection");
const icon = document.querySelector(".tempDetection i");
const tempDegree = document.querySelector(".tempDegree");
const cloudInfo = document.querySelector(".cloudInfo");
const feelsLike = document.querySelector(".feelsLikeInfo");
const humidity = document.querySelector(".humidityInfo");
const windSpeed = document.querySelector(".windSpeedInfo");

btn.addEventListener("click", getWeather);

input.addEventListener("keydown", (e) => {
    if(e.key === "Enter") getWeather();
})

async function getWeather() {
    const city = input.value.trim();
    const API_KEY = "5ddf23ffcd167b264af91f81e255bc78";

    if(!city) {
        alert("Enter city name");
        return;
    }

    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(URL);

        if(!response.ok) {
            if(response.status === 401) throw new Error("Invalid API key");
            if(response.status === 429) throw new Error("Too many requests");
            if(response.status === 404) throw new Error("City not found");
            throw new Error("Something went wrong");
        }

        const data = await response.json();

        //Update Text on UI
        tempDegree.innerText = `${Math.round(data.main.temp)}°C`;
        cloudInfo.innerText = data.weather[0].description;
        feelsLike.innerText = `${Math.round(data.main.feels_like)}`;
        humidity.innerText = `${data.main.humidity}%`;
        windSpeed.innerText = `${data.wind.speed}m/s`;

        const weatherType = data.weather[0].main;
        const description = data.weather[0].description;

        const config = weatherConfig[weatherType] || weatherConfig.Fog;

        //Reset all classes
        tempDetection.className = "tempDetection"; 

        //apply icon
        icon.className = config.icon;

        //set icon color
        icon.style.color = config.color;

        //set weather background
        tempDetection.classList.add(config.bg);

        //Special case: broken clouds
        if(weatherType === "Clouds" && description.includes("broken")) {
            icon.className = "wi wi-day-cloudy";
        }
        
    } catch(error) {
        alert(error.message);
    }
}

const weatherConfig = {
    Clear: {
        icon: "wi wi-day-sunny",
        color: "#FDB813",
        bg: "clear"
    },
    Clouds: {
        icon: "wi wi-cloudy",
        color: "#9CA3AF",
        bg: "clouds"
    },
    Rain: {
        icon: "wi wi-rain",
        color: "#3B82F6",
        bg: "rain"
    },
    Snow: {
        icon: "wi wi-snow",
        color: "#E5E7EB",
        bg: "snow"
    },
    Fog: {
        icon: "wi wi-fog",
        color: "#6B7280",
        bg: "fog"
    }
};