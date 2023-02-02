var $todaysForcast = $('#todaysForcast');
var $citySearch = $('#cityInput');
var $searchButton = $('#citySearchButton')
var selectedCity;

function saveCityName(event) {
    event.preventDefault();

    selectedCity = $citySearch.val();

    fetchData();
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

        
        fetch('api.openweathermap.org/data/2.5/forecast?lat=' + locationLat + '&lon=' + locationLon + '&appid=9d7ee1a0c89726386b718cd593b3c6c3')
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            });
    });
    
    
}


$searchButton.on('click', saveCityName);

