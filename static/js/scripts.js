// Create map
var map = L.map('map', {
  center: [39.8283, -110.5795], 
  zoom: 5
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 13,
    id: 'mapbox.light',
    accessToken: API_KEY
}).addTo(map);

var magnitude;
var radius; 
var color;

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson', function(data) {
	// Layer for earthquakes
	function getColor(d) {
	    return d >= 5 ? '#2e2227' :
	           d >= 4 ? '#e67e22' :
	           d >= 3 ? '#FD8D3C' :
	           d >= 2 ? '#f1c40f' :
	           d >= 1 ? '#9ACD32' :
						'#2ecc71';
						'#e74c3c';
		}

	L.geoJson(data, {
	pointToLayer: function (feature, latlng) {
		magnitude = feature['properties']['mag'];
		radius = magnitude * 6
		return L.circleMarker(latlng, {color: 'black', weight: 1, fillColor: getColor(magnitude), fillOpacity: 0.7, radius: radius});
	},
	onEachFeature: function (feature, layer) {
		layer.bindPopup("<p class='earthquakeInfo'><strong>Location:</strong> " + feature['properties']['place'] + "<br><strong>Magnitude:</strong> " 
			+ feature['properties']['mag'] + "<br><a href='" + feature['properties']['url'] + "'>Click for more info</a></p>");
	}}).addTo(map);

	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

	    var div = L.DomUtil.create('div', 'info legend'),
	        grades = [0, 1, 2, 3, 4, 5],
	        labels = [];

	    // loop through our density intervals and generate a label with a colored square for each interval
	    for (var i = 0; i < grades.length; i++) {
	        div.innerHTML +=
	            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
	            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	    	}

	    return div;
	};

	legend.addTo(map);
});


