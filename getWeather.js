
const API_KEY= "9749c88da7d84e6fbe1160220250301"

const WEATHER_ICON_MAP = {
    1000: "fa-solid fa-sun", // Clear sky (day)
    1003: "fa-solid fa-cloud-sun", // Partly cloudy (day)
    1006: "fa-solid fa-cloud", // Cloudy (day)
    1009: "fa-solid fa-smog", // Overcast (day)
    1030: "fa-solid fa-smog", // Mist (day)
    1063: "fa-solid fa-cloud-showers-heavy", // Patchy rain possible (day)
    1066: "fa-solid fa-snowflake", // Patchy snow possible (day)
    1069: "fa-solid fa-cloud-sleet", // Patchy sleet possible (day)
    1072: "fa-solid fa-cloud-drizzle", // Freezing drizzle (day)
    1080: "fa-solid fa-cloud-sleet", // Light freezing rain (day)
    1114: "fa-solid fa-snowflake", // Blowing snow (day)
    1117: "fa-solid fa-wind", // Blizzard (day)
    1135: "fa-solid fa-smog", // Fog (day)
    1147: "fa-solid fa-smog", // Freezing fog (day)
    1150: "fa-solid fa-cloud-drizzle", // Light drizzle (day)
    1153: "fa-solid fa-cloud-showers-heavy", // Moderate rain (day)
    1183: "fa-solid fa-cloud-showers-heavy", // Moderate rain (day)
    1210: "fa-solid fa-snowflake", // Light snow showers (day)
    1213: "fa-solid fa-snowflake", // Light snow (day)
    1216: "fa-solid fa-snowflake", // Moderate snow (day)
    1219: "fa-solid fa-snowflake", // Moderate snow showers (day)
    1222: "fa-solid fa-snowflake", // Heavy snow (day)
    1225: "fa-solid fa-snowflake", // Heavy snow showers (day)
    1237: "fa-solid fa-snowflake", // Ice pellets (day)
    1240: "fa-solid fa-cloud-rain", // Light rain showers (day)
    1243: "fa-solid fa-cloud-showers-heavy", // Moderate or heavy rain showers (day)
    1246: "fa-solid fa-cloud-showers-heavy", // Torrential rain shower (day)
    1255: "fa-solid fa-snowflake", // Light snow showers (day)
    1258: "fa-solid fa-snowflake", // Heavy snow showers (day)
    1273: "fa-solid fa-cloud-bolt", // Patchy moderate rain with thunder (day)
    1276: "fa-solid fa-cloud-bolt", // Moderate or heavy rain with thunder (day)
    1279: "fa-solid fa-cloud-bolt", // Patchy light snow with thunder (day)
    1282: "fa-solid fa-cloud-bolt", // Moderate or heavy snow with thunder (day)

    // Night-time weather codes
    1001: "fa-solid fa-moon", // Clear sky (night)
    1002: "fa-solid fa-cloud-moon", // Partly cloudy (night)
    1007: "fa-solid fa-cloud-moon", // Cloudy (night)
    1008: "fa-solid fa-cloud-moon", // Overcast (night)
    1031: "fa-solid fa-cloud-moon", // Mist (night)
    1067: "fa-solid fa-cloud-showers-heavy", // Patchy rain possible (night)
    1068: "fa-solid fa-snowflake", // Patchy snow possible (night)
    1073: "fa-solid fa-cloud-sleet", // Patchy sleet possible (night)
    1074: "fa-solid fa-cloud-drizzle", // Freezing drizzle (night)
    1081: "fa-solid fa-cloud-sleet", // Light freezing rain (night)
    1115: "fa-solid fa-snowflake", // Blowing snow (night)
    1118: "fa-solid fa-wind", // Blizzard (night)
    1136: "fa-solid fa-smog", // Fog (night)
    1148: "fa-solid fa-smog", // Freezing fog (night)
    1151: "fa-solid fa-cloud-drizzle", // Light drizzle (night)
    1184: "fa-solid fa-cloud-showers-heavy", // Moderate rain (night)
    1211: "fa-solid fa-snowflake", // Light snow showers (night)
    1214: "fa-solid fa-snowflake", // Light snow (night)
    1217: "fa-solid fa-snowflake", // Moderate snow (night)
    1220: "fa-solid fa-snowflake", // Moderate snow showers (night)
    1223: "fa-solid fa-snowflake", // Heavy snow (night)
    1226: "fa-solid fa-snowflake", // Heavy snow showers (night)
    1238: "fa-solid fa-snowflake", // Ice pellets (night)
    1241: "fa-solid fa-cloud-rain", // Light rain showers (night)
    1244: "fa-solid fa-cloud-showers-heavy", // Moderate or heavy rain showers (night)
    1247: "fa-solid fa-cloud-showers-heavy", // Torrential rain shower (night)
    1256: "fa-solid fa-snowflake", // Light snow showers (night)
    1259: "fa-solid fa-snowflake", // Heavy snow showers (night)
    1274: "fa-solid fa-cloud-bolt", // Patchy moderate rain with thunder (night)
    1277: "fa-solid fa-cloud-bolt", // Moderate or heavy rain with thunder (night)
    1280: "fa-solid fa-cloud-bolt", // Patchy light snow with thunder (night)
    1283: "fa-solid fa-cloud-bolt", // Moderate or heavy snow with thunder (night)
};





export function getWeather(lat,long,timeZone) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${long}&days=14&aqi=no&alerts=no&timezone=${timeZone}`; // Include forecast for 14 days

    const params = new URLSearchParams({
        latitude: lat,
        longitude: long,
        timeZone, 
    });
    return fetch(`${url}&${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error fetching the weather", err);
            throw err;
        })
        .then(data => {
            // return data
            return {
                current : parseCurrentWeather(data.current),
                daily : parseDailyWeather(data.forecast.forecastday),
                today: parseTodayWeather(data.forecast.forecastday[0]),
                tomorrow: parseTomorrowWeather(data.forecast.forecastday[1]),
                timeOfDayWeather:parseTimeOfDayWeather(data.forecast.forecastday),
                location : getLocation(data.location),
                astro: getcurrentSun(data.forecast.forecastday[0]),
                // hourly: parseHourlyWeather(data.forecast.forecastday)
            };
        });
}

function parseCurrentWeather(current){
       
    const { 
        temp_c, pressure_mb, humidity,
        feelslike_c, precip_mm, vis_km,
        condition, wind_kph , wind_dir, uv, 
    } = current
    return{
        currentTemp: Math.round(temp_c),
        feelslike: Math.round(feelslike_c) ,
        pressure: Math.round(pressure_mb),
        humidity: Math.round(humidity),
        precip: Math.round((precip_mm * 100 ) /100),
        visibilty:Math.round(vis_km),
        windSpeed:  Math.round(wind_kph),
        windDir: wind_dir,
        uv: uv,
        iconCode : `${WEATHER_ICON_MAP[condition.code]}` || "fa-solid fa-question",
        condition: condition.text,
    }
}

function parseTodayWeather(today){
    return{
        chanceOfRain:today.day.daily_chance_of_rain,
        chanceOfSnow:today.day.daily_chance_of_snow
    }
}

function parseTomorrowWeather(forecastTomorrow){
        return{
            avgTemp: Math.round(forecastTomorrow.day.avgtemp_c),
            condition: forecastTomorrow.day.condition.text,
            iconCode: `${WEATHER_ICON_MAP[forecastTomorrow.day.condition.code]}` || "fa-solid fa-question",
        }
    }



function parseDailyWeather(forecastDays){
    
    return forecastDays.map((day) =>{         
        return {
            day: day.date,
            maxTemp: Math.round(day.day.maxtemp_c),
            minTemp: Math.round(day.day.mintemp_c),
            condition: day.day.condition.text,
            // iconCode:  `${WEATHER_ICON_MAP[day.day.condition.code]}` || "fa-solid fa-question" 
            iconCode: day.day.condition.icon
        }
    })
}

function parseHourlyWeather({hourly}){
    return hourly.time.map((time,index)=>{
        return {
            timeStamp: time * 1000,
            iconCode: hourly.weather_code[index],
            temp: Math.round(hourly.temperature_2m[index])
        }
    })
}

function parseTimeOfDayWeather( forecast ){
    const hourly=forecast[0].hour
   return {
    morning: getWeatherForPeriod(hourly, 6 , 12),
    afternoon: getWeatherForPeriod(hourly, 12 , 18),
    evening: getWeatherForPeriod(hourly, 18 , 24),
    midnight: getWeatherForPeriod(hourly, 0 , 6),
   }
}

function getWeatherForPeriod(hourly, startHour , endHour){
    const hoursInPeriod= hourly.filter((data)=>{
        const hour = new Date(data.time).getHours();
        return hour >= startHour && hour < endHour; 
    });

        const avgTemp= hoursInPeriod.reduce((sum , weather)=>{
           return sum + weather.temp_c
        }, 0) / hoursInPeriod.length;

        const iconCode= hoursInPeriod[0]?.condition.code;
        const iconClass= `${WEATHER_ICON_MAP[iconCode]}` || "fa-solid fa-question"
        
        return {
            avgTemp: Math.round(avgTemp),
            iconCode: iconClass
        }
    }


function getcurrentSun(day){
    return {
        sunrise: day.astro.sunrise,
        sunset: day.astro.sunset
    }
}



function getLocation(location){
   const  { country, name , region } = location
   return{
    country,
    name,
    region
   }
}
