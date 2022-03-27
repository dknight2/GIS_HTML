require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/layers/GraphicsLayer",
    "esri/rest/support/Query",
    "esri/widgets/Home"
], function(Map, MapView, FeatureLayer, Legend, GraphicsLayer, Query, Home) {

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
    var popupInfo = {
        title: "Name: {pa_name}",
        content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "pa_region",
                label: "Region"
            }, {
                fieldName: "percentageRemainVotes",
                label: "Percent Voting to Remain"
            }, {
                fieldName: "percentageLeaveVotes",
                label: "Percent Voting to Leave"
            }, {
                fieldName: "winningAnswerText",
                label: "Voting Result"
            }]
        }]
    }
    var listNode = document.getElementById("list_votingRegions")

    const ukLayer = new FeatureLayer({
        url: "https://services.arcgis.com/WQ9KVmV6xGGMnCiQ/arcgis/rest/services/EU_Referendum_2016_Results_excluding_Gibraltar/FeatureServer",
        title: "2016 UK EU Referendum",
        renderer: renderer,
        popupTemplate: popupInfo
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
    document
        .getElementById("regionSelect")
        .addEventListener("change", showRegions);
    view.ui.add(document.getElementById("optionsDiv"), {
        position: "top-left"
    });
	var graphics = [];
	console.log(graphics)

    function showRegions(event) {
        const regionQuery = event.target.value;
        map.layers.forEach((layer) => {
            layer.definitionExpression = regionQuery;
        });
        view.when(function() {
            var districtQuery = new Query({
                where: event.target.value,
                returnGeometry: true,
                outFields: ["pa_name"],
                outSpatialReference: view.map.basemap.baseLayers.items[0].spatialReference
            });
            return ukLayer.queryFeatures(districtQuery).then(displayResults);
        });
    }

    function displayResults(results) {
		
        var fragment = document.createDocumentFragment();

        results.features.forEach(function(district, index) {
			district.popupTemplate = popupInfo;

            graphics.push(district);

            var attributes = district.attributes;
            var name = attributes.pa_name

            var li = document.createElement("li");
            li.classList.add("panel-result");
            li.tabIndex = 0;
            li.setAttribute("data-result-id", index);
            li.textContent = name;

            fragment.appendChild(li);
        });

        listNode.innerHTML = "";
        listNode.appendChild(fragment);

    };
    listNode.addEventListener("click", onListClickHandler);

    function onListClickHandler(event) {
		//graphics.removeAll();
        var target = event.target;
        var resultId = target.getAttribute("data-result-id");

        var result = resultId && graphics && graphics[parseInt(resultId, 10)];
        console.log(result);
        if (result) {
            view.popup.open({
                features: [result],
				popupTemplate: popupInfo,
                location: [result.geometry.centroid.longitude, result.geometry.centroid.latitude]
            });
        }
    }
    const legend = new Legend({
        view: view
    });
    const homeBtn = new Home({
        view: view
    });

    view.ui.add(homeBtn, "top-left");
    view.ui.add(legend, "bottom-left");

});