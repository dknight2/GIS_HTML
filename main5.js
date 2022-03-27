require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/layers/GraphicsLayer",
    "esri/rest/support/Query"
], function(Map, MapView, FeatureLayer, Legend, GraphicsLayer, Query) {
  
 var regionPrompt = window.prompt("Enter a geographic region (eg. North, South East, etc.) for results in England, or one of the other pronvinces of the United Kingdom (Scotland, Northern Ireland, or Wales) for results in those areas.");
console.log(regionPrompt);
  
 var whereClause = "pa_region = " + "'" + regionPrompt + "'";
  
    const sym1 = {
        type: "simple-fill",
        color: "#ece7f2",
        style: "solid"
    };

    const sym2 = {
        type: "simple-fill",
        color: "#a6bddb",
        style: "solid"
    };

    const sym3 = {
        type: "simple-fill",
        color: "#2b8cbe",
        style: "solid"
    };
    const sym4 = {
        type: "simple-fill",
        color: "#fee0d2",
        style: "solid"
    };

    const sym5 = {
        type: "simple-fill",
        color: "#fc9272",
        style: "solid"
    };

    const sym6 = {
        type: "simple-fill",
        color: "#de2d26",
        style: "solid"
    };
    const renderer = {
        type: "class-breaks",
        valueExpression: "$feature.percentageRemainVotes - $feature.percentageLeaveVotes",
        legendOptions: {
            title: "Margin Difference in Voting"
        },

        classBreakInfos: [{
            minValue: 0,
            maxValue: 9.999999,
            symbol: sym1,
            label: "0-10% to Remain"
        }, {
            minValue: 10,
            maxValue: 19.999999,
            symbol: sym2,
            label: "10-20% to Remain"
        }, {
            minValue: 20,
            maxValue: 100,
            symbol: sym3,
            label: "+20% to Remain"
        }, {
            minValue: -9.999999,
            maxValue: -.00000001,
            symbol: sym4,
            label: "0-10% to Leave"
        }, {
            minValue: -19.999999,
            maxValue: -10,
            symbol: sym5,
            label: "10-20% to Leave"
        }, {
            minValue: -100,
            maxValue: -20,
            symbol: sym6,
            label: "+20% to Leave"
        }]
    };
  
    const ukLayer = new FeatureLayer({
        url: "https://services.arcgis.com/WQ9KVmV6xGGMnCiQ/arcgis/rest/services/EU_Referendum_2016_Results_excluding_Gibraltar/FeatureServer",
        title: "2016 UK EU Referendum",
        renderer: renderer,
        definitionExpression: whereClause,
        popupTemplate: {
            title: "Name: {pa_name}",
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {
                    fieldName: "pa_region",
                    label: "Region"
                  },
                  {
                    fieldName: "percentageRemainVotes",
                    label: "Percent Voting to Remain"
                  },
                  {
                    fieldName: "percentageLeaveVotes",
                    label: "Percent Voting to Leave"
                  },
                  {
                    fieldName: "winningAnswerText",
                    label: "Voting Result"
                  }
                ]
              }
            ]
       }
    });
  
    const map = new Map({
        basemap: "gray-vector",
        layers: [ukLayer]
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-2.36967, 55],
        zoom: 5
    });
  
  ukLayer.queryExtent().then(function(results){
  view.goTo(results.extent);
}); 


    const legend = new Legend({
        view: view
    });

    view.ui.add(legend, "top-right");
    
});