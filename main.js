import { getWeather } from "./getWeather";



getWeather(10,10,Intl.DateTimeFormat().resolvedOptions().timeZone   ).then( res =>{
    console.log(res.data)
});

