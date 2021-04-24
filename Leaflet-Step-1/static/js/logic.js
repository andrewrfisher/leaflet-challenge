// Earthquakes & Tectonic Plates GeoJSON URL Variables
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// // New layer for earthquakes
var earthquakes = new L.LayerGroup();
var tectonicPlates = new L.LayerGroup();

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p> Magnitude: "+
        feature.properties.mag);
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}


function createMap(earthquakes){

    //satellite map layer
    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

        //grayscale map layer
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

        //outdoor map...
        // var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        //     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        //     maxZoom: 18,
        //     id: "outdoors-v10",
        //     accessToken: API_KEY
        // });

        //baseMap and overlayMap object to hold base and overlay layers
    var baseMap = {
        "Grayscale": lightMap,
        "Satellite": satelliteMap
        // "Outdoors": outdoorsMap
        };

    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    //create full map now called myMap
    var myMap = L.map("map", {
        center: [36.1699, -115.1398],
        zoom: 4,
        layers: [lightMap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
        }).addTo(myMap);

    L.circleMarker(function markerSize(magnitude){
            if (magnitude === 0) {
                return 1;
            }
            return magnitude * 3;
        })


    //stylize marker
    L.circleMarker(function styleMark(feature){
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


        })
        function chooseColor(magn){
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
        // // Create a GeoJSON Layer Containing the Features Array on the earthquakeData Object
        // L.geoJSON(earthquakeData, {  
        //     pointToLayer: function(feature, latlong){
        //         return L.circleMarker(latlng);
        //     },
        // onEachFeature: function(feature, layer) {
        //         layer.bindPopup("<h3>Location: " + feature.properties.place +
        //         "</h3><hr><p>Date and Time: " + new Date(feature.properties.time) + "</p><hr><p> Magnitude: "+
        //         feature.properties.mag + "</p>");
        //     }
        // //Add earthquakeData to earthquake Layer
        // }).addTo(earthquakes);

        // //add earthquakes to map
        // earthquakes.addTo(myMap);

        
        // //using platesUrl and create tectonic plates layer with d3
        // d3.json(platesUrl, function(plateData) {
        //     //geoJSON layer with plateData
        //     L.geoJSON(plateData, {
        //         color: "#DC143C",
        //         weight: 2
        //     //add layer to map
        //     }).addTo(myMap);
        // });

        // // legend setup
        // var legend = L.control({ position: "bottomright" });
        // legend.onAdd = function() {
        //     var div = L.DomUtil.create("div", "info legend"), 
        //     magnitudeLevels = [0, 1, 2, 3, 4, 5];

        //     div.innerHTML += "<h3>Magnitude</h3>"

        //     //for loop
        //     for (var i = 0; i < magnitudeLevels.length; i++) {
        //         div.innerHTML +=
        //             '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
        //             magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        //     }
        //     return div;
        // };
        // //Add to map
        // legend.addTo(myMap);
    };



