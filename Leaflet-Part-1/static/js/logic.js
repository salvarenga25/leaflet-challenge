let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

let mapStyle = {
  color: "white",
  fillColor:"pink",
  fillOpacity:0.5,
  weight:1.5
};

let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4.7,
    layers: street
  });



d3.json(queryUrl).then(function(data){
  //declaring variables to be used to map
  // const coordinates = feature.geometry.coordinates;
  // const magnitude = feature.properties.mag;
  // const depth = coordinates[2];
  // const markerSize = magnitude * 5;
  // const markerColor = getColor(depth);
  //Creating a GeoJSON layer with the retrieved data
  
  //Function to decide the color of the cirvle based on the depth
  function chooseColor(depth){

      if (depth >= 50 ){
        return 'red'
      }
      else if(depth > 30){
        return 'orange'
      } 
      else if (depth > 10){
        return 'yellow'
      }
      else {
        return 'green'
      }
    
  }
  //Creating the widget per circle that will Give info about each activity
  function onEachFeature(feature, layer) {
      layer.bindPopup(`<h2>Detailed Information:</h2>
                       <p>Location: ${feature.properties.place}</p>
                       <p>Magnitude: ${feature.properties.mag}</p>
                       <p>Depth:${feature.geometry.coordinates[2]}</p>`);
  }

  //Creating the circles
    L.geoJSON(data.features,{
      pointToLayer:function(feature,latlng) {
        let magnitude = feature.properties.mag;
        let coordinates = feature.geometry.coordinates
        let depth = coordinates[2]
        let markerStyle = {

          radius: magnitude * 7,
          color : '#000',
          fillColor: chooseColor(depth),
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      
        } 


        return L.circleMarker(latlng,markerStyle);
      },
      onEachFeature: onEachFeature}).addTo(myMap);

      let legend = L.control({ position:'bottomright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 10, 30, 50, 70, 90]; // Example depth ranges
        const colors = ['#00ff00', '#ffff00', '#ff9900', '#ff6600', '#ff3300', '#ff0000']; // Example colors
    
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

      legend.addTo(myMap);

      L.control.layers(baseMaps, {
        collapsed: false
      }).addTo(myMap);

});
