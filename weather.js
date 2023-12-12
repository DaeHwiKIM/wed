var http = require("http");

let API_KEY = "638d7b61939dd17a9f628526e2bd8e8a";

let cities = {
  서울: { lat: 37.5665, lon: 126.978 },
  부산: { lat: 35.1796, lon: 129.0756 },
  인천: { lat: 37.4563, lon: 126.7052 },
  대구: { lat: 35.8714, lon: 128.6014 },
  대전: { lat: 36.3504, lon: 127.3845 },
  광주: { lat: 35.1601, lon: 126.8515 },
  수원: { lat: 37.2636, lon: 127.0286 },
};

if (geo) {
  let lat = geo.ll[0];
  let lon = geo.ll[1];
  getWeather(lat, lon);
  getHourlyForecast(lat, lon);
  getThreeHourlyForecast(lat, lon);
}

function success(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  getWeather(lat, lon);
  getHourlyForecast(lat, lon);
  getThreeHourlyForecast(lat, lon);
}

function getWeather(lat, lon) {
  let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;
  let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&appid=${API_KEY}&units=metric&lang=kr`;

  $.getJSON(weatherUrl, function (weatherData) {
    let city = weatherData.name; //현재 위치를 가져옵니다.
    let weather = weatherData.weather[0].description; //현재 날씨를 가져옵니다.
    let temperature = weatherData.main.temp; //현재 온도를 가져옵니다.
    let feels_like = weatherData.main.feels_like; //체감 온도를 가져옵니다.
    let wind_speed = weatherData.wind.speed; //풍속 정보를 가져옵니다.

    $.getJSON(forecastUrl, function (forecastData) {
      let pop = forecastData.hourly[0].pop * 100;
      let weatherText = `${city} <br>현재 날씨: ${weather} <br>온도: ${temperature}도 <br>체감온도: ${feels_like}도 <br>강수 확률: ${pop}% <br>풍속: ${wind_speed} m/s`;
      $("#weather").html(weatherText).css("font-size", "20px");

      // 온도에 따른 옷 추천
      let clothesImg;
      if (temperature < 5) {
        clothesImg = "images/outfit4.png";
      } else if (temperature < 9) {
        clothesImg = "images/outfit5-8.png";
      } else if (temperature < 12) {
        clothesImg = "images/outfit9-11.png";
      } else if (temperature < 17) {
        clothesImg = "images/outfit12-16.png";
      } else if (temperature < 20) {
        clothesImg = "images/outfit17-19.png";
      } else if (temperature < 23) {
        clothesImg = "images/spring_outfit20-22.png";
      } else if (temperature < 28) {
        clothesImg = "images/outfit23-27.png";
      } else {
        clothesImg = "images/outfit28.png";
      }
      $("#outfit").attr("src", clothesImg);
    });
  });
}

function getHourlyForecast(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${API_KEY}&units=metric&lang=kr`;
  let selected_hours = [7, 12, 20];

  $.getJSON(url, function (data) {
    let hourly_forecast = data.hourly;
    let now = new Date(); // 현재 시간을 가져옵니다.
    for (let i = 0; i < hourly_forecast.length; i++) {
      let forecast_date = new Date(hourly_forecast[i].dt * 1000);
      if (forecast_date.getDate() !== now.getDate() || forecast_date < now) {
        continue; // 예보 시간이 현재보다 이전이거나 다음 날이면 건너뜁니다.
      }
      let hour = forecast_date.getHours();
      if (selected_hours.includes(hour)) {
        let temperature = hourly_forecast[i].temp;
        let feels_like = hourly_forecast[i].feels_like;
        let description = hourly_forecast[i].weather[0].description;
        let pop = hourly_forecast[i].pop * 100;

        // 온도에 따른 옷 추천
        let clothesImg;
        if (temperature < 5) {
          clothesImg = "images/outfit4.png";
        } else if (temperature < 9) {
          clothesImg = "images/outfit5-8.png";
        } else if (temperature < 12) {
          clothesImg = "images/outfit9-11.png";
        } else if (temperature < 17) {
          clothesImg = "images/outfit12-16.png";
        } else if (temperature < 20) {
          clothesImg = "images/outfit17-19.png";
        } else if (temperature < 23) {
          clothesImg = "images/spring_outfit20-22.png";
        } else if (temperature < 28) {
          clothesImg = "images/outfit23-27.png";
        } else {
          clothesImg = "images/outfit28.png";
        }

        let forecastText = `
        <li>
          ${hour}시 - 온도: ${temperature}도 / 체감온도: ${feels_like}도 / 날씨: ${description} / 강수 확률: ${pop}%
          <img src="${clothesImg}" alt="Clothes image">
        </li>
      `;
        $("#forecast").append(forecastText);
      }
    }
  });
}

function getThreeHourlyForecast(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${API_KEY}&units=metric&lang=kr`;

  $.getJSON(url, function (data) {
    let hourly_forecast = data.hourly;
    for (let i = 0; i < hourly_forecast.length; i += 3) {
      let date = new Date(hourly_forecast[i].dt * 1000);
      let hour = date.getHours();
      let temperature = hourly_forecast[i].temp;
      let feels_like = hourly_forecast[i].feels_like;
      let description = hourly_forecast[i].weather[0].description;
      let pop = hourly_forecast[i].pop * 100;
      let forecastText = `<li>${hour}시 - 온도: ${temperature}도 / 체감온도: ${feels_like}도 / 날씨: ${description} / 강수 확률: ${pop}% </li>`;
      $("#threeHourlyForecast").append(forecastText);
    }
  });
}
