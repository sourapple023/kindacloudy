document.addEventListener('DOMContentLoaded', () => {
    const updateTime = () => {
        const timeElement = document.getElementById('time');
        if (timeElement) {
            timeElement.innerHTML = `<strong>Current Time:</strong> ${new Date().toLocaleTimeString()}`;
        }
    };
    setInterval(updateTime, 1000);
    updateTime();

    const changeBackground = (condition) => {
        const backgrounds = {
            clear: 'linear-gradient(135deg, #00C9FF, #FFD700)',
            clouds: 'linear-gradient(135deg, #B0BEC5, #ECEFF1)',
            rain: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
            snow: 'linear-gradient(135deg, #E0F7FA, #FFFFFF)',
            thunderstorm: 'linear-gradient(135deg, #3A3A3A, #000000)',
            drizzle: 'linear-gradient(135deg, #BDC3C7, #E0E0E0)',
            fog: 'linear-gradient(135deg, #CFD8DC, #ECEFF1)',
            haze: 'linear-gradient(135deg, #F5F5F5, #D7CCC8)',
            sleet: 'linear-gradient(135deg, #DCEEFF, #B0BEC5)',
            extreme: 'linear-gradient(135deg, #8B0000, #000000)',
            default: 'linear-gradient(135deg, #FFE4E1, #FFD700)'
        };
        document.body.style.background = backgrounds[condition.toLowerCase()] || backgrounds.default;
    };

    const fetchWeather = async (lat, lon) => {
        const apiKey = 'a153001688bf11fc5414657944da58b2';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const { temp, humidity } = data.main;
            const { description } = data.weather[0];
            const { speed } = data.wind;
            const { sunrise, sunset } = data.sys;
            const location = `${data.name}`;

            document.getElementById('weather-description').innerHTML = `
                <strong>Current Weather:</strong> ${temp}°F, ${description}
            `;
            document.getElementById('extra-weather-info').innerHTML = `
                <strong>Humidity:</strong> ${humidity}% <br>
                <strong>Wind Speed:</strong> ${speed} mph <br>
                <strong>Sunrise:</strong> ${new Date(sunrise * 1000).toLocaleTimeString()} <br>
                <strong>Sunset:</strong> ${new Date(sunset * 1000).toLocaleTimeString()}
            `;
            document.getElementById('location').innerHTML = `<strong>Location:</strong> ${location}`;

            changeBackground(data.weather[0].main);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-description').innerHTML = '<strong>Unable to fetch weather data.</strong>';
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => fetchWeather(position.coords.latitude, position.coords.longitude),
                error => {
                    console.error('Error getting location:', error);
                    document.getElementById('weather-description').innerHTML = '<strong>Unable to retrieve location.</strong>';
                }
            );
        } else {
            document.getElementById('weather-description').innerHTML = '<strong>Geolocation is not supported by this browser.</strong>';
        }
    };

    getLocation();
});
