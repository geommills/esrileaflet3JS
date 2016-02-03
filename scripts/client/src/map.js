
var layer;
var map;
var layerLabels;
var samplePoints;
var layer;
var geojson = new L.FeatureGroup();

function loadMap()
{
	map = L.map('map2D').setView([44.0604588794, -121.295087621], 13);
    setBasemap("Topographic");
    var basemaps = document.getElementById('basemapsDDL');
    var threeControl = $("#threeControl");
    basemaps.addEventListener('change', function(){
        setBasemap(basemaps.value);
    });
    map.on('zoomend', function() {
        if(map.getZoom() > 14)
        {
            threeControl.prop('disabled', false);
        }
        else
        {            
            threeControl.prop('disabled', true);
        }
    });

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw({
        /*draw: {
            circle: false,
            polygon: false,
            marker: false
        },*/
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);

    map.on('draw:created', function (e) {
        // Do whatever else you need to. (save to db, add to map etc)
        var type = e.layerType,
            layer = e.layer;
        console.log(layer);

        var shape = layer.toGeoJSON()
        var shape_for_db = JSON.stringify(shape.geometry);

        //drawnItems.addLayer(layerEdit);
        $.ajax({
          type: "Get",
          url: "./bufferFeatures",
          data: { geometry: shape_for_db},
          success: function(result)
            {
                showFeatures(result);
            }
        });
    });
}

function showFeatures(featureCollection)
{
    console.log(featureCollection)
    map.removeLayer(geojson);
    geojson = L.geoJson(featureCollection).addTo(map);

}

function setBasemap(basemap) {
    if (layer) {
      map.removeLayer(layer);
    }
    layer = L.esri.basemapLayer(basemap);
    map.addLayer(layer);
    if (layerLabels) {
      map.removeLayer(layerLabels);
    }

    if (basemap === 'ShadedRelief' || basemap === 'Oceans' || basemap === 'Gray' || basemap === 'DarkGray' || basemap === 'Imagery' || basemap === 'Terrain') {
      layerLabels = L.esri.basemapLayer(basemap + 'Labels');
      map.addLayer(layerLabels);
    }
    samplePoints = L.esri.featureLayer('http://services1.arcgis.com/NPDrPpMk7Wd8mOGL/arcgis/rest/services/Sampling_Locations/FeatureServer/0');
    map.addLayer(samplePoints);
    samplePoints.bindPopup(function (feature) {
        return L.Util.template('<p>Location: {LocName}<br>Sample Depth: {Depth}<br>Soil Type: {SoilType}</p>', feature.properties);
    });
    if(scene)
    {
        var extent = map.getBounds();
        var width = window.innerWidth;
        var height = window.innerHeight;
        var mapurl = layer._url.toString().replace("/tile/{z}/{y}/{x}", "").replace("{s}", "services");
        createTerrain(width, height, extent, mapurl);
    }
}

  