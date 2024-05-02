import React, { useState, useEffect } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import './WeatherApp.css';
import search_icon from '../Assets/weatherSearch.png';
import cloud_icon from '../Assets/cloudy (2).png';
import drizzle_icon from '../Assets/cloudy (1).png';
import humidity_icon from '../Assets/weather.png';
import wind_icon from '../Assets/wind-power.png';
import sun from '../Assets/sun (1).png';
import snow from '../Assets/snow.png';
import rain from '../Assets/rain.png';
import feelsLike from '../Assets/feels-like.png';
import pressure_icon from '../Assets/pressure.png';
import default_icon from '../Assets/default.png';




const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '231d9dc557msh8f8bb3ef6a2f253p128f89jsn923d29fbdd88',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};

const WeatherApp = () => {
    let apiKey = "0797ce3b4b423c2c307d1c528dca3020";
    const [wicon, setWicon] = useState(cloud_icon);
    const [searchData, setSearchData] = useState(null);
    const [weatherData, setWeatherData] = useState({});

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
        }
    };

    const handleRetry = (inputValue, retryDelay = 2000) => {
        setTimeout(() => {
            loadOptions(inputValue);
        }, retryDelay);
    };


    const loadOptions = (inputValue) => {
        if (!inputValue || inputValue.length < 3) {
            return Promise.resolve({ options: [] });
        }
        return fetch(`${url}?minPopulation=1000000&namePrefix=${inputValue}`, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 429) {
                        console.error("Rate limit hit. Retrying after some time...");
                        handleRetry(inputValue, 5000);
                        return { options: [] };
                    }
                    throw new Error(`HTTP status ${response.status}`);
                }
                return response.json();
            })
            .then(response => ({
                options: response.data.map(city => ({
                    value: `${city.latitude} ${city.longitude}`,
                    label: `${city.name}, ${city.countryCode}`,
                })),
            }))
            .catch(error => {
                console.error('Failed to load options:', error);
            });
    };


    const handleOnChange = searchData => {
        setSearchData(searchData);
    };

    const searchWeather = async () => {
        if (!searchData) return;

        // Removing 'district' Word 
        const cityName = searchData.label.replace(/district/gi, '').trim();
        let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=Metric&appid=${apiKey}`;

        try {
            let response = await fetch(weatherUrl);
            if (!response.ok) throw new Error(`Failed to fetch weather data, status ${response.status}`);
            let data = await response.json();
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temp: data.main.temp,
                location: data.name,
                feelsLikes: data.main.feels_like,
                pressure: data.main.pressure,
                tempMin: data.main.temp_min,
                tempMax: data.main.temp_max,
                weatherDescription: data.weather[0].description,
            });

            // Setting weather condition
            switch (data.weather[0].icon) {
                case "01d":
                case "01n":
                    setWicon(sun);
                    break;
                case "02d":
                case "02n":
                    setWicon(cloud_icon);
                    break;
                case "03d":
                case "03n":
                case "04d":
                case "04n":
                    setWicon(drizzle_icon);
                    break;
                case "09d":
                case "09n":
                    setWicon(rain);
                    break;
                case "13d":
                case "13n":
                    setWicon(snow);
                    break;
                default:
                    setWicon(default_icon);
                    break;
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };


    return (
        <div className='container'>
            <div className=".containerUp">
            <div className="top-bar">
                <AsyncPaginate className="top-bar1"
                    placeholder="Search for city"
                    debounceTimeout={1000}
                    value={searchData}
                    onChange={handleOnChange}
                    loadOptions={loadOptions}
                />
                <div className="search_icon" onClick={searchWeather}>
                    <img src={search_icon} width='90px' />
                </div>
            </div>
            
            <div className="describe">
    <div className='weather-img'>
        <img src={wicon} width='200px' alt="Weather Icon" />
    </div>
    <div className="description-container">
        <span className="vertical-text">{weatherData.weatherDescription}</span>
    </div>
</div>


            <div className='weather-temp'>{weatherData.temp} °C</div>
            <div className='weather-tempMinMax'> ↑ {weatherData.tempMax}&nbsp;&nbsp;&nbsp;↓ {weatherData.tempMin} </div>
            <div className='weather-location'>{weatherData.location}</div>
            <div className="detail-container">
                <p>Detail :</p>
                <div className='data-content'>
                    <div className='element'>
                        <img src={humidity_icon} className='icon' width='50px' />
                        <div className='data'>
                            <div className='humidity-percentage'>{weatherData.humidity}%</div>
                            <div className='text'>Humidity</div>
                        </div>
                    </div>
                    <div className='element'>
                        <img src={wind_icon} className='icon' width='50px' />
                        <div className='data'>
                            <div className='wind-speed'>{weatherData.windSpeed} KM/h</div>
                            <div className='text'>Wind Speed</div>
                        </div>
                    </div>
                </div>
                <div className='data-content'>
                    <div className='element'>
                        <img src={feelsLike} className='icon' width='50px' />
                        <div className='data'>
                            <div className='wind-speed'>{weatherData.feelsLikes} °C</div>
                            <div className='text'>Feels Like</div>
                        </div>
                    </div>
                    <div className='element'>
                        <img src={pressure_icon} className='icon' width='50px' />
                        <div className='data'>
                            <div className='wind-speed'>{weatherData.pressure} hPa</div>
                            <div className='text'>Pressure</div>
                        </div>
                    </div>
                </div>
                {/* <div className='data-content-3'>
                    <div className='element'>
                        <img src={uv_icon} className='icon' width='50px' />
                        <div className='data'>
                            <div className='wind-speed'>{weatherData.windSpeed} Lowest</div>
                            <div className='text'>UV</div>
                        </div>
                    </div>
                    <div className='element'>
                        <img src={precipitation_icon} className='icon' width='50px' />
                        <div className='data'>
                            <div className='wind-speed'>{weatherData.windSpeed} mm</div>
                            <div className='text'>Precipitation</div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>

        </div>

    );
};

export default WeatherApp;