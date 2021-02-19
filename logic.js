//link to dataset
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// create map
var myMap = L.map("Map", {
	center: [25,0],
});
//tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}").addTo(myMap);

// calling data and creating features for later use in mapping
d3.json(link, function(data){
    var features = data["features"];
    for (var i = 0; i < features.length; i++){
        var mag = features[i]['properties']['mag'];
        var place = features[i]["properties"]["mag"];
        var geometry = features[i]["geometry"]["coordinates"];
        var coords = {
			longitude: geometry["0"],
			latitude: geometry["1"],
            depth: geometry['2']
        };
        var latlng = L.latLng(coords.latitude, coords.longitude);
        var circle = L.circleMarker(latlng, {
            fillcolor: bubblecolors(coords.depth),
            fillopacity: 1,
            radius: mag *4,
// bind popup for place, mag, and depth of earthquakes
    }).bindPopup(
        `<h1>${place}</h1> <hr> <h3>Magnitude: ${magnitude}</h3> <h3>Depth: ${coords.depth}</h3>`
     )
        .addTo(myMap);
        }
// creating the legend, and getting color labels for the legend
        var legend = L.control({position: "bottomright"});
        legend.onAdd = function (myMap){
            var div = L.DomUtil.create("div", "legend"),
                labels = ["<10", "<30", "<50", "<70", ">90" ],
                colors = bubblecolors;
            div.innerHTML += "<h4 style = 'color: #ff00ff'>Depth Legend</h4>";
            for (var i = 0; i < labels.length; i++) {
                div.innerHTML +=
                '<i style="background:' +
                colors[i] +
                '">' +
                labels[i] +
                "</i> <br>";
            }
            return div;
        };
        legend.addTo(myMap);
});
//colors based on depth of earthquake
function bubblecolors(depth) {
    switch (true) {
        case depth > 90:
          return "red";
        case depth > 70:
          return "orangered";
        case depth > 50:
          return "Gold";
        case depth > 30:
          return "yellow";
        case depth > 10:
          return "green";
        default:
          return "blue";
    }
    bubblecolors();
     
};