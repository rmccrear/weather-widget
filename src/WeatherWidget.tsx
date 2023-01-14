import {useEffect, useState} from 'react';
import WeatherIcons from './WeatherIcons';
import styles from './App.module.scss';

// import testWeatherData from './__fixtures__/testWeatherData';
// const weatherData = JSON.parse(testWeatherData);

interface WeatherData {
    queryCost: number,
    latitude: number,
    longitude: number,
    resolvedAddress: string,
    timezone: string,
    description: string,
    currentConditions: Day,
    days: Day[]
}

interface Day {
  datetime: string,
  tempmax: number,
  tempmin: number,
  temp: number,
  icon: string,
  preciptype: string,
  resolvedAddress: string,
  datetimeEpoch: number
}

const days = (data: WeatherData) : Day[] => data.days;

const temp = (day: Day) : number => day.temp;

const icon = (day: Day) : string => day.icon;

const location = (data: WeatherData) : string => data.resolvedAddress;

const date = (day: Day) : string => {
    const date = new Date(day.datetimeEpoch * 1000);
    const localeFormatted = new Intl.DateTimeFormat().format(date)
    return localeFormatted;
}

function DisplayDay({day, dayOfWeek}: {day: Day, dayOfWeek: string}) {
    return (<div className={styles["weather-day"]}>
          <div className={styles["day-name"]}>{dayOfWeek}</div>
          <div className={styles["weather-icon"]}>
            <img alt={icon(day)} src={WeatherIcons[icon(day) as keyof typeof WeatherIcons]} />
          </div>
          <div className={styles["weather-temp"]}>
            {temp(day)}°
          </div>
    </div>);
}

const week = (days: Day[]) : Day[] => {
    const [one, two, three, four, five, six, seven] = days;
    return [one, two, three, four, five, six, seven];
};

const weekMap : {[index: number] : string} = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat'
};

function WeatherWidget() {
    const [weatherData, setWeatherData] = useState<WeatherData | undefined>();
    const dayOfWeek = (new Date()).getDay();
    useEffect((): void => {
        const queryApiKey = new URLSearchParams(window.location.search).get('apiKey');
        const queryLocation = new URLSearchParams(window.location.search).get('location');
        const weatherDataUri = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${queryLocation}?unitGroup=metric&key=${queryApiKey}&contentType=json&iconSet=icons1`;
        if(queryApiKey && queryLocation) {
            fetch(weatherDataUri).then((res) => res.json()).then((data) => {
                setWeatherData(data);
                console.log(data);
            }).catch(e => console.log(e));
        }
    }, []);

    let dayCounter = dayOfWeek;
    return (
        <div className={styles['weather-widget']}>
        { weatherData &&
            <>
            <div className={styles['header']}>
                <div className={styles['weather-location']}>
                    <h3>{location(weatherData)}</h3>
                </div>
                <div className={styles['weather-date']}>
                    <h4>{date(weatherData.currentConditions)}</h4>
                </div>
            </div>
            <div className={styles['weather-widget-inner-container']}>
                <div className={styles['weather-widget-week']}>
                    {
                        week(days(weatherData)).map(day => (
                            <DisplayDay dayOfWeek={weekMap[dayCounter++ % 7]} day={day} key={day.datetime}/>
                        ))
                    }
                </div>
            </div>
            </>
        }
        { !weatherData &&
            <div>
            <h2>Welcome to Weather Widget</h2>
            <div> This is a simple weather widget that displays the weather for the next 7 days. </div>
            <div> To use this widget, add `apiKey` and `location` to the url query params for this page. </div>
            <div> To sign up for an api key, visit <a href="https://www.visualcrossing.com/weather-api">https://www.visualcrossing.com/weather-api</a></div>
            </div>
        }
       </div>
    );
}

export default WeatherWidget;
