

// API endpoint inside dataUrl
var dataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// GET request to the query URL
d3.json(dataUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Location: " + feature.properties.place +
      "</h3><hr><p>Date: " + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
  }

  // GeoJSON layer 
  // onEachFeature function in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 255;
      var g = Math.floor(250-80*feature.properties.mag);
      var b = Math.floor(250-80*feature.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });


  // earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap 
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiamVueGNvIiwiYSI6ImNqbjBlM2djbDQ5ZWkzcHFjcGp5aHVuY3oifQ.9s9iLhbwO3oXPgaAn6N8sg.");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };
  
  // overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // streetmap and earthquakes layers display
  var myMap = L.map("map", {
    center: [
      38.54865, -90.25703
    ],
    zoom: 3.5,
    layers: [streetmap, earthquakes]
  });


  function getColor(d) {
      return d < 1 ? 'rgb(250,250,250)' :
            d < 2  ? 'rgb(250,227,227)' :
            d < 3  ? 'rgb(255,190,190)' :
            d < 4  ? 'rgb(250,168,168)' :
            d < 5  ? 'rgb(250,132,132)' :
            d < 6  ? 'rgb(250,100,100)' :
            d < 7  ? 'rgb(250,70,70)' :
            d < 8  ? 'rgb(250,40,40)' :
            d < 9  ? 'rgb(250,12,12)' :
                        'rgb(255,0,0)';
  }

  // legend to display information
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop through density intervals and generate a label
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}

