import { getWeather  } from "./getWeather.js";


getWeather(40.7128, -74.0060, Intl.DateTimeFormat().resolvedOptions().timeZone) 
    .then(data => console.log(data))
    .catch(err => console.error(err));

