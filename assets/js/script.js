var $todaysForcast = $('#todaysForcast');
var $citySearch = $('#cityInput');
var $searchButton = $('#citySearchButton');
var $recentSearches = $('#recentSearches');
var selectedCity;

function saveCityName(event) {
    event.preventDefault();

    selectedCity = $citySearch.val().trim();

    var listItem = document.createElement('li').textContent = selectedCity;
    $recentSearches.removeClass('d-none')
    $recentSearches.append(listItem);


    fetchData();
    // setInterval(fetchData, 1000);
}

function fetchData() {
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + selectedCity + '&limit=5&appid=9d7ee1a0c89726386b718cd593b3c6c3')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)

        var locationLat = data[0].lat;
        var locationLon = data[0].lon;

        // rounds number to nearest .00 decimale place
        locationLat = Math.round(locationLat*100)/100;
        locationLon = Math.round(locationLon*100)/100;

        console.log(locationLat)
        console.log(locationLon)

        
        fetch('http://api.openweathermap.org/data/2.5/weather?lat=' + locationLat + '&lon=' + locationLon + '&appid=9d7ee1a0c89726386b718cd593b3c6c3&units=imperial')
            .then((response) => response.json())
            .then((data) => {
                console.log(data)

                var cityName = data.name;
                var temp = data.main.temp + '°F';
                var windSpeed = data.wind.speed + 'mph';
                var humidity = data.main.humidity + '%';

                var currentCity = document.createElement('h1');
                var currentTemp = document.createElement('p');
                var currentWind = document.createElement('p');
                var currentHumidity = document.createElement('p');

                currentCity.textContent = cityName + ' (' + dayjs().format('MM/DD/YYYY') + ')';
                currentTemp.textContent = 'Temp: ' + temp;
                currentWind.textContent = 'Wind: ' + windSpeed;
                currentHumidity.textContent = 'Humidity: ' + humidity;

                $todaysForcast.append(currentCity);
                $todaysForcast.append(currentTemp);
                $todaysForcast.append(currentWind);
                $todaysForcast.append(currentHumidity);
            });
    });
    
    
}


$searchButton.on('click', saveCityName);

