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
        return mag * 3;
        }
        //stylize marker
        function styleMark(feature){
            return{
                opacity: 1,
                fillOpacity: 1,
                //color based on mag...
                fillColor: chooseColor(feature.properties.mag),
                color: "#000000",
                //radius based on mag
                radius: markerSize(feature.properties.mag),
                stroke: true,
                weight: 0.5
            };


        }
        function chooseColor(magnitude){
            switch(true){
                case magnitude > 5:
                    return "#581845";
                case magnitude > 4:
                    return "#900C3F";
                case magnitude > 3:
                    return "#C70039";
                case magnitude > 2:
                    return "#FF5733";
                case magnitude > 1:
                    return "#FFC300";
                default:
                    return "#DAF7A6";
                }
        }
        
        //geojson layer that contains the features array on quakedata object
        L.geoJSON(quakeData, {
            pointToLayer: function(feature, latlng){
                return L.circleMarker(latlng);
            },
            style: styleMark,
            //giving each element/feature a popup with place and time of quake
            onEachFeature: function(feature, layer) {
                layer.bindPopup("<h4>Location: " + feature.properties.place + 
                "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
                "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
            }
        //add the data above to earthquakes layer
        }).addTo(earthquakes);
        //now add it to mymap
        earthquakes.addTo(myMap);

        
    });



