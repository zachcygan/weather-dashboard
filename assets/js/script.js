var $todaysForcast = $('#todaysForcast');
var $citySearch = $('#cityInput');
var $searchButton = $('#citySearchButton');
var $recentSearches = $('#recentSearches');
var $forecastContainer = $('#forecastContainer');
var selectedCity;

function saveCityName(event) {
    event.preventDefault();

    selectedCity = $citySearch.val().trim();

    var listItem = $('<li>').addClass('list-group-item text-center');
    listItem.text(selectedCity);

    $recentSearches.removeClass('d-none')
    $recentSearches.append(listItem);

    fetchData();
    // setInterval(fetchData, 1000);
}

function createWeatherForecast(obj, i) {
    var forecastContainer = $('<div>');
    var forecastBodyContainer = $('<div>')
    var bodyTextTitle = $('<h6>');
    var forecastTemp = $('<p>');
    var forecastFeelsLike = $('<p>');
    var forecastWind = $('<p>');
    var forecastHumidity = $('<p>');

    if($forecastContainer.children().length >= 5) {
        $forecastContainer.empty()
    }

    var photoCardImage = $('<img>');
    var forecastPhoto = 'https://openweathermap.org/img/wn/' + obj.weather.icon + '@2x.png';
    photoCardImage.attr('src', forecastPhoto);
    photoCardImage.css('width', '50px')

    bodyTextTitle.text(dayjs().day(i+6).format('MM/DD/YYYY'));
    forecastTemp.text('Temp: ' + obj.temp + '°F');
    forecastFeelsLike.text('Feels like: ' + obj.feelsLike + '°F');
    forecastWind.text('Wind: ' + obj.wind + 'mph');
    forecastHumidity.text('Humidity: ' + obj.humidity + '%');

    forecastContainer.addClass('card');
    forecastContainer.addClass('bg-primary');
    forecastContainer.addClass('p-2');
    forecastContainer.addClass('m-2');
    forecastContainer.addClass('text-light');
    forecastContainer.addClass('flex-grow-1');
    forecastContainer.css('max-width', '50%')
    forecastBodyContainer.addClass('card-body');
    photoCardImage.addClass('card-img-top');
    forecastTemp.addClass('card-text')
    forecastFeelsLike.addClass('card-text')
    forecastWind.addClass('card-text')
    forecastHumidity.addClass('card-text')

    

    forecastContainer.append(forecastBodyContainer);
    forecastContainer.append(photoCardImage);
    forecastContainer.append(forecastTemp);
    forecastContainer.append(forecastFeelsLike);
    forecastContainer.append(forecastWind);
    forecastContainer.append(forecastHumidity);
    forecastBodyContainer.append(bodyTextTitle);
    $forecastContainer.append(forecastContainer);
}

function fetchData() {
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + selectedCity + '&limit=5&appid=9d7ee1a0c89726386b718cd593b3c6c3')
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)

        var locationLat = data[0].lat;
        var locationLon = data[0].lon;

        // rounds number to nearest .00 decimale place
        locationLat = Math.round(locationLat*100)/100;
        locationLon = Math.round(locationLon*100)/100;
        
        fetch('http://api.openweathermap.org/data/2.5/weather?lat=' + locationLat + '&lon=' + locationLon + '&appid=9d7ee1a0c89726386b718cd593b3c6c3&units=imperial')
            .then((response) => response.json())
            .then((data) => {
                // console.log(data)

                var cityName = data.name;
                var temp = data.main.temp + '°F';
                var windSpeed = data.wind.speed + 'mph';
                var humidity = data.main.humidity + '%';

                // console.log($recentSearches.children())

                // if children already exist, delete them
                if($todaysForcast.children()) {
                    $todaysForcast.empty()
                }

                var currentCity = $('<h1>');
                var currentTemp = $('<p>');
                var currentWind = $('<p>');
                var currentHumidity = $('<p>');

                $todaysForcast.append(currentCity);
                $todaysForcast.append(currentTemp);
                $todaysForcast.append(currentWind);
                $todaysForcast.append(currentHumidity);

                currentCity.text(cityName + ' (' + dayjs().format('MM/DD/YYYY') + ')');
                currentTemp.text('Temp: ' + temp);
                currentWind.text('Wind: ' + windSpeed);
                currentHumidity.text('Humidity: ' + humidity);
            });

            fetch('http://api.openweathermap.org/data/2.5/forecast?lat=' + locationLat + '&lon=' + locationLon + '&appid=9d7ee1a0c89726386b718cd593b3c6c3&units=imperial')
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                var dataArr = []

                
                data.list.forEach(item => {
                    if(item.dt_txt.includes('00:00:00')) {
                        // stores the values from the targeted time into dataArr
                        dataArr.push(item);
                    }
                })

                console.log(dataArr)

                for (var i = 0; i < dataArr.length; i++) {
                    var forecastTemperatures = {
                        temp: data.list[i].main.temp,
                        feelsLike: data.list[i].main.feels_like,
                        wind: data.list[i].wind.speed,
                        humidity: data.list[i].main.humidity,
                        weather: data.list[i].weather[0],
                    }

                    createWeatherForecast(forecastTemperatures, i);
                }
            });
    });
    
    
}


$searchButton.on('click', saveCityName);

