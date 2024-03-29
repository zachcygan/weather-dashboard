var $todaysForcast = $('#todaysForcast');
var $citySearch = $('#cityInput');
var $searchButton = $('#citySearchButton');
var $recentSearches = $('#recentSearches');
var $forecastContainer = $('#forecastContainer');
var $forecastTitle = $('#forecastTitle');
var $otherOptions = $('#otherOptions');
var firstRun = true;


function searchCity(event) {
    var searchedCities = JSON.parse(localStorage.getItem('city')) || [];
    event.preventDefault();

    if($citySearch.val().trim() === '') {
        return;
    }

    City = $citySearch.val().trim();

    if(searchedCities.length >= 1 && !searchedCities.includes(City)) {
        console.log(searchedCities)
        searchedCities.push(City);
        localStorage.setItem('city', JSON.stringify(searchedCities));
    } else if (searchedCities.length === 0){
        searchedCities[0] = City;
        localStorage.setItem('city', JSON.stringify(searchedCities));
    }

    for (var i = 0; i < searchedCities.length; i++) {
        if(i === 0 && $recentSearches.children().length >= 1) {
            $recentSearches.empty()
        }

        var listItem = $('<li>').addClass('list-group-item text-center custom-list');
        var closeButton = $('<div>').addClass('close');
        closeButton.text('x');
        listItem.text(searchedCities[i]);

        // Searches the city when clicked on from recent searches
        // use .click instead of .on to allow for parameters
        listItem.click({param: searchedCities[i]}, function(event) {
            // console.log(event.data.param) the value of the li that is clicked
            fetchData(event.data.param);
            $citySearch.val(searchedCities[i]);
        })

        $recentSearches.removeClass('d-none')
        $recentSearches.append(listItem);
        listItem.append(closeButton);

        closeButton.click({param: searchedCities[i]}, function(event) {
            // console.log(event.data.param) = what value is on the li that is clicked
            var closeArr = JSON.parse(localStorage.getItem('city'));

            // closeArr.splice(searchedCities[i], 0)
            // closeArr.
            var value = event.data.param;
            // filters out the item that the user removed
            // a function with the item parameter
            closeArr = closeArr.filter(item => item !== value)
            localStorage.setItem('city', JSON.stringify(closeArr));

            var btnClicked = $(event.target);
            // removes the parent li of the button
            btnClicked.parent('li').remove();
        })
    }

    fetchData(City);
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

    // bodyTextTitle.text(dayjs().day(i).format('MM/DD/YYYY'));
    bodyTextTitle.text(obj.date.split(' ', 1));

    $forecastTitle.removeClass('d-none')
    forecastTemp.text('Temp: ' + obj.temp + '°F');
    forecastFeelsLike.text('Feels like: ' + obj.feelsLike + '°F');
    forecastWind.text('Wind: ' + obj.wind + 'mph');
    forecastHumidity.text('Humidity: ' + obj.humidity + '%');

    forecastContainer.addClass(['card', 'bg-primary', 'p-2', 'm-2', 'text-light', 'flex-grow-1']);
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

function fetchGeoData(cityName, country = null) { 
    console.log(cityName)
    var url = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=9d7ee1a0c89726386b718cd593b3c6c3'

    fetch(url).then(function (response) {
        if (response.ok) {
            response.json().then(function(data) {

                if(data.length > 0) {
                    console.log(data)

                    // firstRun = true;

                    deleteOtherOptions();

                    for (var i = 0; i < data.length; i++) {
                        var locationLat = data[0].lat;
                        var locationLon = data[0].lon;

                        if(i === 0) {
                            fetchTodayWeather(locationLat, locationLon, data[i].state);
                            fetchForecastWeather(locationLat, locationLon);
                        }

                        if(i !== 0) {
                            generateOptions(data[i]);
                        }
                    }         
                    return;           
                }
            })
        } else {
            return;
        }
    })
}

function fetchTodayWeather(lat, lon, state) {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=9d7ee1a0c89726386b718cd593b3c6c3&units=imperial')
    .then((response) => response.json())
    .then((data) => {
        console.log(data)

        var cityName = data.name;

        

        var temp = data.main.temp + '°F';
        var windSpeed = data.wind.speed + 'mph';
        var humidity = data.main.humidity + '%';

        // if children already exist, delete them
        if($todaysForcast.children()) {
            $todaysForcast.empty()
        }

        var currentWeatherIcon = $('<img>');
        var weatherIcon = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
        
        currentWeatherIcon.attr('src', weatherIcon);
        currentWeatherIcon.css('width', '50px');
        

        var currentCity = $('<h1>');
        var currentTemp = $('<p>');
        var currentWind = $('<p>');
        var currentHumidity = $('<p>');

        $todaysForcast.removeClass('d-none');
        $todaysForcast.append(currentCity);
        $todaysForcast.append(currentWeatherIcon);
        $todaysForcast.append(currentTemp);
        $todaysForcast.append(currentWind);
        $todaysForcast.append(currentHumidity);

        currentCity.text(cityName + ', ' + state + ' (' + dayjs().format('MM/DD/YYYY') + ')');
        currentTemp.text('Temp: ' + temp);
        currentWind.text('Wind: ' + windSpeed);
        currentHumidity.text('Humidity: ' + humidity);
    });
}

function fetchForecastWeather(lat, lon) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=9d7ee1a0c89726386b718cd593b3c6c3&units=imperial')
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        var dataArr = []

        data.list.forEach(item => {
            if(item.dt_txt.includes('12:00:00')) {
                // stores the values from the targeted time into dataArr
                dataArr.push(item);
            }
        })

        console.log(dataArr)

        for (var i = 0; i < dataArr.length; i++) {
            var forecastTemperatures = {
                temp: dataArr[i].main.temp,
                feelsLike: dataArr[i].main.feels_like,
                wind: dataArr[i].wind.speed,
                humidity: dataArr[i].main.humidity,
                weather: dataArr[i].weather[0],
                date: dataArr[i].dt_txt,
            }

            createWeatherForecast(forecastTemperatures, i);
        }
    });
}

function deleteOtherOptions() {
    if($otherOptions.children()) {
        $otherOptions.empty();
    }
}

function generateOptions(data) {
    console.log('genOptions: ', data)
    var stateID = data.state;
    var cityName = data.name;

    var otherOptionsButtons = $('<div>').addClass('btn btn-primary badge badge-pill mb-2');

    otherOptionsButtons.text(cityName + ', ' + stateID);
    $otherOptions.append(otherOptionsButtons);

    otherOptionsButtons.click(data, function(event) {
        event.preventDefault()
        console.log(data)

        // otherOptionsButtons.text(cityName + ', ' + stateID);
        fetchGeoData(cityName);
        fetchTodayWeather(data.lat, data.lon, data.state);
        fetchForecastWeather(data.lat, data.lon);
        
        generateOptions(data)
    })

}

function fetchData(cityName) {
    fetchGeoData(cityName)
}

function init() {
    var localStorageTemp = JSON.parse(localStorage.getItem('city'));

    for (var i = 0; i < localStorageTemp.length; i++) {
        var initListItem = $('<li>').addClass('list-group-item text-center custom-list');
        var initCloseButton = $('<div>').addClass('close');
        initCloseButton.text('x');
        initListItem.text(localStorageTemp[i]);

        initListItem.append(initCloseButton);
        $recentSearches.append(initListItem);
        $recentSearches.removeClass('d-none');

        initListItem.click({param: localStorageTemp[i]}, function(event) {
            // console.log(event.data.param) the value of the li that is clicked
            fetchData(event.data.param);
            $citySearch.val(localStorageTemp[i]);
        })

        initCloseButton.click({param: localStorageTemp[i]}, function(event) {
            // console.log(event.data.param) = what value is on the li that is clicked
            var closeArr = JSON.parse(localStorage.getItem('city'));

            // closeArr.splice(searchedCities[i], 0)
            // closeArr.
            var value = event.data.param;
            // filters out the item that the user removed
            // a function with the item parameter
            closeArr = closeArr.filter(item => item !== value)
            localStorage.setItem('city', JSON.stringify(closeArr));

            var btnClicked = $(event.target);
            // removes the parent li of the button
            btnClicked.parent('li').remove();
        })
    }
}

$searchButton.on('click', searchCity);
init();

