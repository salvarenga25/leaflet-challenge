// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
// queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
  console.log(data)
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    let radius = feature.properties.mag * 5
    let magnitude = feature.properties.mag
    // let circle = L.circle(,{
    //    color:'red',
    //   fillColor:'#f03'
    //  })
   // return L.circle()
   // console.log(radius)

   // let radius = feature.properties.mag * 5; // Adjust the multiplier based on your preference
   // let magnitude = feature.properties.mag;

    // Create a circle marker with specified style
    //   circle = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
    //   radius: radius,
    //   color: 'red',
    //   fillColor: '#f03',
    //   fillOpacity: 0.8,
    //   weight: 1
    // }).addTo(myMap);
    // circle.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)} Mag: ${magnitude}</p>`);
    
    //layer.addLayer(circle);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let newT = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  })
  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
    "NewT" : newT
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [newT, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}


// // Function to get earthquake data and create the map
// function createMap() {
//   // Replace 'YOUR_JSON_URL' with the actual URL of your earthquake data
//   const jsonUrl = 'YOUR_JSON_URL';

//   // Create a map centered around a specific location
//   const myMap = L.map('map').setView([0, 0], 2);

//   // Add the base tile layer (you can choose a different one if you like)
//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '© OpenStreetMap contributors'
//   }).addTo(myMap);

//   // Fetch earthquake data and add markers to the map
//   fetch(jsonUrl)
//     .then(response => response.json())
//     .then(data => {
//       // Loop through each earthquake and add a marker
//       data.features.forEach(feature => {
//         const coordinates = feature.geometry.coordinates;
//         const magnitude = feature.properties.mag;
//         const depth = coordinates[2];

//         // Define marker size based on magnitude and color based on depth
//         const markerSize = magnitude * 5;
//         const markerColor = getColor(depth);

//         // Create a circle marker
//         const circle = L.circleMarker([coordinates[1], coordinates[0]], {
//           radius: markerSize,
//           fillColor: markerColor,
//           color: '#000',
//           weight: 1,
//           opacity: 1,
//           fillOpacity: 0.8
//         }).addTo(myMap);

//         // Add popup with earthquake information
//         circle.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br>
//                           <strong>Magnitude:</strong> ${magnitude}<br>
//                           <strong>Depth:</strong> ${depth} km`);
//       });

//       // Add legend to the map
//       addLegend(myMap);
//     });
// }

// // Function to get color based on depth
// function getColor(depth) {
//   // Customize this function based on your desired color scale
//   // Here is a simple example
//   if (depth < 10) return 'green';
//   else if (depth < 30) return 'yellow';
//   else if (depth < 50) return 'orange';
//   else return 'red';
// }

// // Function to add legend to the map
// function addLegend(map) {
//   const legend = L.control({ position: 'bottomright' });

//   legend.onAdd = function () {
//     const div = L.DomUtil.create('div', 'info legend');
//     const depths = [0, 10, 30, 50];
//     const labels = [];

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (let i = 0; i < depths.length; i++) {
//       div.innerHTML +=
//         '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
//         depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
//     }

//     return div;
//   };

//   legend.addTo(map);
// }

// // Call the createMap function to initialize the map
// createMap();
