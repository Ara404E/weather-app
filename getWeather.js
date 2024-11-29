


export function getWeather(lat, long, timeZone) {
    const url = `https://api.open-meteo.com/v1/forecast?current=temperature_2m,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&timeformat=unixtime`;
    
    const params = new URLSearchParams({
            latitude: `${lat}`,  
            longitude: `${long}`,
            timezone: `${timeZone}`  
    });
    
    return fetch(`${url}&${params}`)
    .then((response)=>{
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);        
        }
            return response.json();
    }) 
    .catch((err)=>{
        console.error("Error fetching the weather" , err)
        throw Error;
    })
    .then((data) => {
        // return data
        return{
            current: parseCurrentWeather(data),
            daily: parseDailyWeather(data),
            // hourly: parseHourlyWeather(data),
            timeOfDaYWeather: parseTimeOfDayWeather(data)
        }
    }) 
    
}

function parseCurrentWeather({current , daily}){
       
    const { 
        temperature_2m: currentTemp, 
        wind_speed_10m: windSpeed,   
        weather_code: iconCode       
    } = current
    const 
    {
      temperature_2m_max:[maxTemp],
      temperature_2m_min:[minTemp],
      apparent_temperature_max:[maxFeelsLike],
      apparent_temperature_min:[minFeelsLike],
      precipitation_sum:[percip],
    } = daily

    return{
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp) ,
        lowTemp: Math.round(minTemp),
        highFeelsLike: Math.round(maxFeelsLike) ,
        lowFeelsLike: Math.round(minFeelsLike),
        windSpeed:  Math.round(windSpeed),
        percip: Math.round((percip * 100 ) /100),
        iconCode
    }
}

function parseDailyWeather({daily}){

    return daily.time.map( (time, index) =>{
        return {
            maxTemp: Math.round(daily.temperature_2m_max[index]),
            minTemp: Math.round(daily.temperature_2m_min[index]),
            timeStamp: time * 1000,
            iconCode: daily.weather_code[index]
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

function parseTimeOfDayWeather({ hourly }){
   const timeOdDayWeather = {
    morning: getWeatherForPeriod(hourly, 6 , 12),
    afternoon: getWeatherForPeriod(hourly, 12 , 18),
    evening: getWeatherForPeriod(hourly, 18 , 24),
    midnight: getWeatherForPeriod(hourly, 0 , 6),
   }
   return timeOdDayWeather
}

function getWeatherForPeriod(hourly, startHour , endHour){
    const hoursInPeriod=[];
    for (let i= startHour ; i< endHour; i++){
        if(hourly.time[i]){
            hoursInPeriod.push({
                time: new Date(hourly.time[i] * 1000).toLocaleDateString(),
                temperature: hourly.temperature_2m[i],
                iconCode: hourly.weather_code[i]
            });
        }

        const avgTemp= hoursInPeriod.reduce((sum , weather)=> (sum + weather.temperature, 0) / hoursInPeriod.length);
        const iconCode= hoursInPeriod[0]?.iconCode;

        return {
            avgTemp: Math.round(avgTemp),
            iconCode: iconCode
        }
    }
}

