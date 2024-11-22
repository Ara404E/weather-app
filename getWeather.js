import axios from 'axios';


export function getWeather(lat, lon, timeZone){
   axios.get("https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,apparent_temperature_max,apparent_temperature_min,precipitation_sum&timeformat=unixtime"  ,{
    
    params: {
            latitude: lat,
            longitude:lon,
            timeZone,
        }
        
    })
}