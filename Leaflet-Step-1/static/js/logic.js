// Store our API endpoint inside earthquakesUrl 
var earthquakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// New layer for earthquakes
var earthquakes = new L.LayerGroup();


// Creating Function to make layers and objects for layers to "live"

function createMap(earthquakes) {

    //satellite map layer
    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    //grayscale map layer
    var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    //outdoor map...
    var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    //baseMap and overlayMap object to hold base and overlay layers
    var baseMap = {
        "Satellite": satelliteMap,
        "Grayscale": grayscaleMap,
        "Outdoors": outdoorsMap
    };

    var overlayMaps = {
        "Earthquakes": earthquakes,
        //"Fault Lines": tectonicPlates
    };

    //create full map now called myMap
    var myMap = L.map("mapid", {
        center: [37.09, -95.71],
        zoom: 2,
        layers: [satelliteMap, earthquakes]
    });

};

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);


//Use d3 to get URL from USGS - name of function is quakeData
d3.json(earthquakesUrl, function(quakeData) {
    //size of marker needs to be based on the magnitude of the quake
    function markerSize(mag){
        if (mag === 0) {
            return 1;
        }
        else (return mag * 3)
        }

    //CONTINUE HERE!
    });



