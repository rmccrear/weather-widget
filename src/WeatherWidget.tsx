import {useEffect, useState} from 'react';
import WeatherIcons from './WeatherIcons';
import styles from './App.module.scss';

// const weatherData = JSON.parse(testWeatherData);

interface WeatherData {
    queryCost: number,
    latitude: number,
    longitude: number,
    resolvedAddress: string,
    timezone: string,
    description: string,
    days: Day[]
}

interface Day {
  datetime: string,
  tempmax: number,
  tempmin: number,
  temp: number,
  icon: string,
  preciptype: string
}

const days = (data: WeatherData) : Day[] => {
    return data.days;
}

const temp = (day: Day) : number => day.temp;

const icon = (day: Day) : string => day.icon;

const preciptype = (day: Day) : string => day.preciptype;

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
    const [weatherData, setWeatherData] = useState<WeatherData>();
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
            <div className={styles['weather-widget-inner-container']}>
                <div className={styles['weather-widget-week']}>
                    {
                        week(days(weatherData)).map(day => (
                            <DisplayDay dayOfWeek={weekMap[dayCounter++ % 7]} day={day} key={day.datetime}/>
                        ))
                    }
                </div>
            </div>
        }
        { !weatherData &&
            <div> add `apiKey` and `location` to url query params </div>
        }
       </div>
    );
}

export default WeatherWidget;
