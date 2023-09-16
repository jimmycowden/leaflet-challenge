
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });


// depth color function
function depthcolor(depth) {    
        if (depth < 10) return "lightgreen";
        else if (depth < 30) return "greenyellow";
        else if (depth < 50) return "yellow";
        else if (depth < 70) return "orange";
        else if (depth < 90) return "orangered";
        else return "red";
    }



  function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }


    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    // Point to layer used to alter markers
    pointToLayer: function(feature, lalg) {

      
      var markers = {
        radius: feature.properties.mag * 30000,
        fillColor: depthcolor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        color: "black",
        weight: 0.5
      }
      return L.circle(lalg,markers);
    }
  });

  
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

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
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
    layers: [street, earthquakes]
  });



//Legend
let myColors = ["lightgreen", "greenyellow", "yellow", "orange", "orangered", "red"];
    
    let mylegend = L.control({ position: 'bottomright' });
    mylegend.onAdd = function () {

        let div = L.DomUtil.create('div');
        mytext = ["<div style='background-color: white'><strong>&nbsp&nbspdepth(km)&nbsp&nbsp</strong></div>"];
        mycategories = ['-10-10', ' 10-30', ' 30-50', ' 50-70', ' 70-90', '+90'];
        for ( let i = 0; i < mycategories.length; i++) {
            div.innerHTML +=
                mytext.push('<li class=""  style="background:' + myColors[i] +  '">'  + mycategories[i] + '</li> '  );
                
        }
        div.innerHTML = mytext.join('') 
        return div;


    };
    mylegend.addTo(myMap);

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
