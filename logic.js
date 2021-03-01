//link to data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//tile layer
var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// create map
var myMap = L.map("map", {
	center: [25,0],
  zoom: 2
});
// calling data and function for determining marker sizes
d3.json(link, function(data){
  function markerSize(magnitude){
    if (magnitude === 0){
      return 1;
    }
    return magnitude * 3;
  }
// Style and features of map
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: chooseColor(feature.properties.mag),
      color: "#000000",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // Colors based on magnitude 
  function chooseColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "red";
    case magnitude > 4:
      return "orangered";
    case magnitude > 3:
      return "Gold";
    case magnitude > 2:
      return "yellow";
    case magnitude > 1:
      return "green";
    default:
      return "blue";
    }
  }
// circle markers
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
    },
    style: styleInfo,
// bind popup for on-click with locations, time, and magnitude
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h4>Location: " + feature.properties.place + "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(myMap);

  lightMap.addTo(myMap);



// creating the legend, and getting color labels for the legend
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function (myMap){
    var div = L.DomUtil.create("div", "info legend"),
      colors = ["blue", "green", "yellow", "gold", "orangered", "red"],
      labels = ["Magnitude: 0", "Magnitude: 1", "Magnitude: 2", "Magnitude: 3", "Magnitude: 4", "Magnitude: 5"];

    div.innerHTML += "<h3>Magnitude</h3>"

    for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style="background: ' + colors[i] + '">' + labels[i] + "</i> <br>";

    }
    return div;
  };
  legend.addTo(myMap);
});