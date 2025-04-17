import { getWeather  } from "./getWeather.js";

const input=document.querySelector('input');
const form=document.querySelector('.location-search')


function renderWeather({ location ,current, today ,tomorrow , daily , timeOfDayWeather , astro}){
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    renderChanceOfRainAndSnow(today)
    renderTomorrowWeather(tomorrow)
    renderTimeOfTheDayWeather(timeOfDayWeather)
    renderLocation(location,current)
    renderAstro(astro)
}


if(getWeather(null)){
    getWeather(10,10,Intl.DateTimeFormat().resolvedOptions().timeZone)
    .then(data =>{
        console.log(data)
        renderWeather(data)
    })
.catch(err => console.error(err));}


form.addEventListener('submit',(location)=>{
    location.preventDefault()
    getWeather(input.value) 
    .then(data =>{
        renderWeather(data)

    }).catch(err => console.error(err));
})


function renderLocation(location, current){
    document.querySelector("[data-current-condition]")
    .innerHTML=current.condition
    
    document.querySelector('[data-current-location]')
    .innerHTML=`${location.country}, ${location.region}, ${location.name}`;
    
    document.querySelector("[data-current-tempe]")
    .innerHTML=`${current.currentTemp}°C`
}

function renderCurrentWeather(current){
    
    const iconElement = document.querySelector("[data-current-weather]")
    iconElement.className = ""; 
    iconElement.classList.add(...current.iconCode.split(" "));


    document.querySelector('[data-current-temp]')
    .innerHTML=`${current.currentTemp}°C`

    document.querySelector("[data-current-feelslike]")
    .innerHTML=`${current.feelslike}°C`

    document.querySelector("[data-current-windspeed]")
    .innerHTML=`${current.windSpeed} kph`

    document.querySelector("[data-current-pressure]")
    .innerHTML=`<b> Pressure <br> ${current.pressure} mb </b>`;
    
    document.querySelector("[data-current-humidity]")
    .innerHTML=`<b> Humidity <br> ${current.humidity}% </b>`;
  
    document.querySelector("[data-current-visibilty]")
    .innerHTML=`<b> Visibilty <br> ${current.visibilty} km </b>`;


    document.querySelector("[data-current-windDire]")
    .innerHTML=`${current.windDir}`
    
    const uvState=uvCategory(current.uv)

    

    document.querySelector("[data-current-uv]")
    .innerHTML=`${current.uv} UV <span class='moderate'>${uvState}</span>`
}


function renderChanceOfRainAndSnow(today){
    document.querySelector('[data-chance-ofRain]')
    .innerHTML=`${today.chanceOfRain}%`

     document.querySelector('[data-chance-ofSnow]')
    .innerHTML=`${today.chanceOfSnow}%`
}

function renderDailyWeather(daily){

  const date=document.querySelectorAll("[data-daily-date]")
  const maxTemp=document.querySelectorAll("[data-daily-max-temp]")
  const minTemp=document.querySelectorAll("[data-daily-min-temp]")
  const condition=document.querySelectorAll("[data-daily-condition]")
  const iconElement=document.querySelectorAll("[data-daily-icon]")

  date.forEach(( date , index )=> {
    let formatedDate= formatDate(daily[index].day);
    date.textContent=formatedDate;
  });

  maxTemp.forEach((temp , index) => {
        temp.textContent=`${daily[index].maxTemp}°C`
  });

  minTemp.forEach((temp , index) => {
    temp.textContent=`${daily[index].minTemp}°C`
  });

  condition.forEach((condition , index) => {
    condition.textContent=`${daily[index].condition}`
  });
  
  
  iconElement.forEach((icon , index) => {
    // icon.className = "";     
    // icon.classList.add(...daily[index].iconCode.split(" "));

    const iconCode=daily[index].iconCode
    if(iconCode.includes('cdn')){
        icon.src=iconCode;
        icon.classList.remove('fa-solid');
    }
    else{
        icon.classList.add(...iconCode.split(" "));
    }
  })
}

function renderTimeOfTheDayWeather(period) {
    const periodNames = document.querySelectorAll('[data-period-name]');
    const periodTemp = document.querySelectorAll('[data-period-temp]');
    const iconElement = document.querySelectorAll('[data-day-period-weather]');
    const currentHour = new Date().getHours();

    Array.from(periodNames).forEach((element, index) => {
        const periodKey = Object.keys(period)[index];
        element.textContent = periodKey;
    });

    Array.from(periodTemp).forEach((element, index) => {
        const periodKey = Object.keys(period)[index];
        const periodData = period[periodKey];
        element.textContent = `${periodData.avgTemp}°C`;
    });

    Array.from(iconElement).forEach((element, index) => {
        const periodKey = Object.keys(period)[index];
        const periodData = period[periodKey];
        element.className = ""; // Reset previous classes
        element.classList.add(...periodData.iconCode.split(" "));
    });

    // Highlight the current period
    let currentPeriod;

    if (currentHour >= 6 && currentHour < 12) {
        currentPeriod = "morning";
    } else if (currentHour >= 12 && currentHour < 18) {
        currentPeriod = "afternoon";
    } else if (currentHour >= 18 && currentHour < 24) {
        currentPeriod = "evening";
    } else {
        currentPeriod = "midnight";
    }

    // Add the "current" class to the correct period's weather icon
    const periodForecastElements = document.querySelectorAll('.period-forecast');
    Array.from(periodForecastElements).forEach((element, index) => {
        const periodKey = Object.keys(period)[index];
        const icon = element.querySelector('.weather-icon i');

        if (periodKey === currentPeriod) {
            icon.classList.add('current');
        } else {
            icon.classList.remove('current');
        }
    });
}

function renderAstro(astro) {
    console.log(`Astro Sunrise: ${astro.sunrise}`);
    console.log(`Astro Sunset: ${astro.sunset}`);

    const sunrise = document.querySelector("[data-sunrise-time]");
    sunrise.innerHTML = astro.sunrise;

    const sunset = document.querySelector("[data-sunset-time]");
    sunset.innerHTML = astro.sunset;

    const sunriseMinute = timeToMinutes(astro.sunrise);
    const sunsetMinute = timeToMinutes(astro.sunset);

    const now = new Date();

    // Correct calculation of local minutes
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

  

    const totalDaylight = sunsetMinute - sunriseMinute;

    let progress;

    if (currentMinutes < sunriseMinute) {
        progress = 0; // Before sunrise, align to sunrise
    } else if (currentMinutes > sunsetMinute) {
        progress = 100; // After sunset, align to sunset
    } else {
        progress = ((currentMinutes - sunriseMinute) / totalDaylight) * 100; // During daylight
    }


    const sunIcon = document.querySelector(".sun-icon");

    if (sunIcon) {
        // Ensure the sun icon stays within bounds
        if (progress < 0) {
            progress = 0; // Align to sunrise position
        } else if (progress > 100) {
            progress = 100; // Align to sunset position
        }

        sunIcon.style.left = `${progress}%`;
        sunIcon.style.transform = `translateX(-${progress}%)`;
    } else {
        console.error("Sun icon not found in the DOM!");
    }
}






function renderTomorrowWeather(tomorrow){

    const iconElement = document.querySelector("[data-tomorrow-icon]")
    iconElement.className = ""; 
    iconElement.classList.add(...tomorrow.iconCode.split(" "));

    document.querySelector("[data-tomorrow-temp]")
    .innerHTML=`${tomorrow.avgTemp}°C`
    
    document.querySelector("[data-tomorrow-condition]")
    .innerHTML=tomorrow.condition
}






function formatDate(dateString){
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US' , {month:'long' , day: "numeric"});
}


function uvCategory(uvIndex){
const uvCondition=document.querySelector('[data-current-uv-condition]')

    if(uvIndex <=2){
        uvCondition.textContent=`Low risk from UV rays`
        return 'Low'
    }
    else if(uvIndex <=5){
        uvCondition.textContent=`Moderate risk from UV rays`
        return 'Moderate'
    }
    else if(uvIndex <=7){
        uvCondition.textContent=`High risk from UV rays`
        return 'High'
    }
    else if(uvIndex <= 10){
        uvCondition.textContent=`Very High risk from UV rays`
        return 'Very High'
    }
    else{
        uvCondition.textContent=`Exterem risk from UV rays`
        return 'Exterem'
    }
}

// Helper function 
function timeToMinutes(timeString) {
    const [time, modifier] = timeString.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;

    // Adjust for AM/PM
    if (modifier === "PM" && hours !== 12) {
        totalMinutes += 12 * 60;
    }
    if (modifier === "AM" && hours === 12) {
        totalMinutes -= 12 * 60;
    }

    return totalMinutes;
}
