require(["esri/Map", "esri/views/MapView", "esri/Graphic"], (Map, MapView, Graphic) => {
  const map = new Map({
    basemap: "terrain"
  });
  var lat = 34.730
  var lon = -86.586

  const view = new MapView({
    center: [lon, lat],
    container: "viewDiv",
    map: map,
    zoom: 8
  });

  const point = {
    type: "point", 
    longitude: lon,
	latitude: lat
  };

  
  const pointSymbol = {
    type: "simple-marker",
    color: "red",
	style: "diamond",
    width: 12
  };

  
  const pointAtt = {
    Name: "Huntsville",
    Population: "200000",
    Founded: "1805",
	
  };

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: pointSymbol,
    attributes: pointAtt,
    popupTemplate: {
      title: "{Name}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "Name"
            },
            {
              fieldName: "Population"
            },
            {
              fieldName: "Founded"
            }
          ]
        }
      ]
    }
  });

  view.graphics.add(pointGraphic);
});