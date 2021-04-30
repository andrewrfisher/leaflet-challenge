// Earthquakes & Tectonic Plates GeoJSON URL Variables
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// // New layer for earthquakes
var earthquakesLayer = new L.LayerGroup();
var tectonicPlates = new L.LayerGroup();


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
var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v10",
    accessToken: API_KEY
});


//myMap
//create full map now called myMap
var myMap = L.map("map", {
    center: [36.1699, -115.1398],
    zoom: 4,
    layers: [lightMap, earthquakesLayer, tectonicPlates]
});



// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

    function createFeatures(earthquakeData) {

        // Define a function we want to run once for each feature in the features array
        // Give each feature a popup describing the place and time of the earthquake
        function onEachFeature(feature, layer) {
            layer.bindPopup("<h3>Location: </h3>" + "<p>" + feature.properties.place +
            "</p></h3><hr><h3>Date of Quake: </h3><p>" + new Date(feature.properties.time) + "</p><hr><h3> Magnitude: "+ "<p>"+ 
            feature.properties.mag) + "</p>";
        }

    //new style function
    function setStyle(feature){
        return{
            radius: markerSize(feature.properties.mag),
            opacity: 1,
            fillOpacity: 1,
            //color based on mag...
            fillColor: chooseColor(feature.properties.mag),
            color: "#000000",
            //radius based on mag
            stroke: true,
            weight: 0.5
        }
    }

    //marker size function
    function markerSize(magnitude){
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 3;
    }

    //if statement to change color of markers
    function chooseColor(magnitude){
        if(magnitude > 5){
            return "#581845";
        }
        else if (magnitude > 4){
            return "#900C3F";
        }
        else if (magnitude > 3){
            return "#C70039";
        }
        else if (magnitude > 2){
            return "#FF5733";
        }
        else if(magnitude > 1){
                return "#FFC300";
        }
        else {
                return "#DAF7A6";
            }
    };

    //legend setup
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {

         var div = L.DomUtil.create("div", "info legend "), 
         magnitude = [0, 1, 2, 3, 4, 5];

         div.innerHTML += "<h3>Magnitude</h3>";
    
            //for loop that looks through 0-5 above
            for (var i = 0; i < magnitude.length; i++) {
                div.innerHTML +=
                '<i style="background:' + chooseColor(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
            }
        return div;
     };
     //Add to map
       // Adding legend to the map
    legend.addTo(myMap);
     
//      // Set up the legend
//   var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = geojson.options.limits;
//     var colors = geojson.options.colors;
//     var labels = [];

//     // Add min & max
//     var legendInfo = "<h1>Median Income</h1>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding legend to the map
//   legend.addTo(myMap);


    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        },
        style: setStyle
    }).addTo(earthquakesLayer).addTo(myMap);

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}


function createMap(earthquakes){

        //baseMap and overlayMap object to hold base and overlay layers
    var baseMap = {
        "Grayscale": lightMap,
        "Satellite": satelliteMap
        // "Outdoors": outdoorsMap
        };

    var overlayMaps = {
        "Earthquakes": earthquakesLayer,
        "Tectonic Plates": tectonicPlates
    };


    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
        }).addTo(myMap);
    
    //using platesUrl and create tectonic plates layer with d3
    d3.json(platesUrl).then(function(plateData) {
        //geoJSON layer with plateData
        L.geoJSON(plateData, {
            color: "#DC143C",
            weight: 2
        //add layer to map
        }).addTo(tectonicPlates).addTo(myMap);
    });

       
    }


// //query to grab data
// d3.json(queryUrl, function(quakeData){
//     //opening up JSON and using circle marker for lat/lng and make the size based on mag
//     L.geoJSON(quakeData.features, {
//         pointToLayer: function (geoJsonPoint, latlng) {
//             return L.circleMarker(latlng, {radius: markerSize(geoJsonPoint.properties.mag)});
//         },
//         style: function(geoJsonFeature){
//             return {
//                 fillColor: chooseColor(geoJsonFeature.properties.mag),
//                 fillOpacity: 0.7,
//                 weight: 0.1,
//                 color: "black"
//             }
//         },
//         onEachFeature: function(feature, layer){
//             layer.bindPopup("<h3>" + feature.properties.place +
//                 "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p> Magnitude: "+
//                 feature.properties.mag + "</p>");
//         }
//     }).addTo(earthquakes);
//     createMap(earthquakes);
// });

// //now go grab the tectonic plates data from the URL
// d3.json(platesUrl, function (geoJson) {
//     L.geoJSON(geoJson.features, {
//         style: function (geoJsonFeature) {
//             return {
//                 weight: 2,
//                 color: 'magenta'
//             }
//         },
//     }).addTo(tectonicPlates);
// })

// //switch statement to change color of markers
// function chooseColor(magnitude){
//     switch(true){
//         case magnitude > 5:
//             return "#581845";
//         case magnitude > 4:
//             return "#900C3F";
//         case magnitude > 3:
//             return "#C70039";
//         case magnitude > 2:
//             return "#FF5733";
//         case magnitude > 1:
//             return "#FFC300";
//         default:
//             return "#DAF7A6";
//         }
// };

// //function for creating the map
// function createMap(){
//     //satellite map layer
//     var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "mapbox.satellite",
//         accessToken: API_KEY
//     });

//     //grayscale map layer
//     var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "light-v10",
//         accessToken: API_KEY
//     });

//     //outdoor map...
//     // var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     //     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     //     maxZoom: 18,
//     //     id: "outdoors-v10",
//     //     accessToken: API_KEY
//     // });

//         //baseMap and overlayMap object to hold base and overlay layers
//     var baseMap = {
//         "Grayscale": lightMap,
//         "Satellite": satelliteMap
//         // "Outdoors": outdoorsMap
//         };

//     var overlayMaps = {
//         "Earthquakes": earthquakes,
//         "Tectonic Plates": tectonicPlates
//     };

//     //create full map now called myMap
//     var myMap = L.map("map", {
//         center: [36.1699, -115.1398],
//         zoom: 4,
//         layers: [lightMap, earthquakes, tectonicPlates]
//     });

//     // Create a layer control
//     // Pass in our baseMaps and overlayMaps
//     // Add the layer control to the map
//     L.control.layers(baseMap, overlayMaps, {
//         collapsed: false
//         }).addTo(myMap);

//     // legend setup
//     var legend = L.control({ position: "bottomright" });

//     legend.onAdd = function() {

//          var div = L.DomUtil.create("div", "info legend"), 
//          magnitude = [0, 1, 2, 3, 4, 5];

//          div.innerHTML += "<h3>Magnitude</h3>"

//          //for loop
//          for (var i = 0; i < magnitude.length; i++) {
//              div.innerHTML +=
//                  '<i style="background: ' + chooseColor(magnitude[i] + 1) + '"></i> ' +
//                  magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
//          }
//          return div;
//      };
//      //Add to map
//      legend.addTo(myMap);

// }
