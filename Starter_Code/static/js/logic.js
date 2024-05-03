// Store API Url.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//perform GET reqeust to the query URL
d3.json(url).then(function (dataearthquake) {

   // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let satellite = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });


    // Create Map and colors 
    let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [satellite]});

      function getColor(depth) {
        if (depth < 10) return "#4B0082";
        else if (depth < 20) return "#DDA0DD";
        else if (depth < 30) return "#CD5C5C";
        else if (depth < 40) return "#FFA500";
        else if (depth < 50) return "#FFFF00";
        else if (depth < 60) return "#7FFF00";
        else if (depth < 70) return "#00FFFF";
        else if (depth < 80) return "#000080";
        else if (depth < 90) return "#A52A2A";
        else return "#FF0000";
      }


  // Create a baseMaps view option.
  let baseMaps = {
    "Satellite Map": satellite ,"Street Map": street
  };

       
  // create an empy array for the markers
  let circleMarkers = [];
  // loop through the data, create a new marker, and push it to the circleMarkers array
  for (let i = 0; i < dataearthquake.features.length; i++) {

    let lat = dataearthquake.features[i].geometry.coordinates[1]
    let long = dataearthquake.features[i].geometry.coordinates[0]
    let depth = dataearthquake.features[i].geometry.coordinates[2]
    let colors = ["#00FF00", "#483D8B", "#FFFF00", "#FFCC00", "#6495ED", "#6495ED"]

    circleMarkers.push(
      L.circleMarker([lat,long], {
        fillOpacity: 0.60,
        color: "black",
        fillColor: getColor(depth),
        radius: dataearthquake.features[i].properties.mag ** 3
      }).bindPopup("<h3>" + dataearthquake.features[i].properties.place +" <br>" + dataearthquake.features[i].properties.mag + " magnitude "  +" <br>" + depth + "km deep </h3>").addTo(myMap)
    );
  }

  let circleLayer = L.layerGroup(circleMarkers);


    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Circles: circleLayer
      };


  //  Add Legend
  let legend = L.control({ position: 'bottomleft' });

  // Add to map
  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let labels = ['<strong>Depth</strong>'];
    let colors = ['#4B0082', '#DDA0DD', '#CD5C5C', '#FFA500', '#FFFF00', '#7FFF00', '#00FFFF', '#000080', '#A52A2A', '#FF0000'];
    let depthLabels = ['<10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90+'];
    
    // Labels
    for (let i = 0; i < colors.length; i++) {
      div.innerHTML +=
        '<div style="background-color:' + colors[i] + '; width: 20px; height: 30px; display: inline-block; margin-right: 10px;"></div>' + depthLabels[i] + '<br>';
    }

    div.style.backgroundColor = 'white';
    div.style.padding = '40px';

    return div;
  };

  legend.addTo(myMap);


  // Create a  control.
  // Pass baseMaps and overlayMaps.
  // Add the control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);




});