require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/tasks/Geoprocessor",
    "esri/tasks/support/FeatureSet",
    "esri/config",
    "dojox/widget/Standby",
    "dojo/domReady!"
  ],
  function(Map,
    SceneView,
    GraphicsLayer,
    Graphic,
    Point,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol,
    Geoprocessor,
    FeatureSet,
    esriConfig,
    Standby) {

    esriConfig.request.corsDetection = false;
  
    var gpEndpoint =
      "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_Currents_World/GPServer/MessageInABottle";
    
    var map = new Map({
      basemap: "national-geographic"
    });

    var view = new SceneView({
      container: "viewDiv",
      map: map,
      center: [172,1.3],
      zoom: 2
    });

    var standby = new Standby({
	    target: "viewDiv",
	    color: null
    });

    document.body.appendChild(standby.domNode);	
	  standby.startup();     
    
    var driftPathLyr = new GraphicsLayer();
    map.add(driftPathLyr);

    var markerSym = new SimpleMarkerSymbol({
      color: [255, 0, 0],
      outline: { 
        color: [255, 255, 255],
        width: 1
      }
    });

    var polylineOutput = new SimpleLineSymbol({
      color: [255, 0, 0],
      width: 2
    });
    
    var gp = new Geoprocessor({
      url: gpEndpoint
    });
	
	var days = parseInt(document.getElementById("dayInput").value);
    
    view.on("click", findPathLine);

    function findPathLine(evt) {
      standby.show();

      driftPathLyr.removeAll();
      
      var pt = new Point({
        longitude: evt.mapPoint.longitude,
        latitude: evt.mapPoint.latitude
      });

      var ptGraphic = new Graphic({
        geometry: pt,
        symbol: markerSym
      });

      driftPathLyr.add(ptGraphic);

      var featureSet = new FeatureSet({
		  features: [ptGraphic]
	  });

      var params = {
        Input_Point: featureSet,
        Days: days
      };
      gp.execute(params).catch(e => {
		  alert("GP task failed - Please refresh the page and try again!");
		  return;
		  
	  }).then(drawLine);
    }

    function drawLine(gpResponse) {
      var pathLine = gpResponse.results[0].value.features;

      var pathLineGraphics = pathLine.map(function(line) {
        line.symbol = polylineOutput;
        return line;
      });
	  console.log(pathLineGraphics);

      driftPathLyr.addMany(pathLineGraphics);

      view
	  .goTo({
        target: pathLineGraphics
      })
	  .catch(function (error) {
		  if (error.name != "AbortError"){
			  console.error(error);
		  }
	  });
      
      standby.hide();
	   
    }
	document.getElementById("dayInput").oninput = function() {
		document.getElementById("day").innerHTML = this.value;
	  }
  });