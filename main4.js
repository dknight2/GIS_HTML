require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend"
], function(Map, MapView, FeatureLayer, Legend) {

    const mag1 = {
        type: "simple-marker",
        color: "#ffed85",
        style: "diamond"
    };

    const mag2 = {
        type: "simple-marker",
        color: "#fbaf52",
        style: "diamond"
    };

    const mag3 = {
        type: "simple-marker",
        color: "#f6711f",
        style: "diamond"
    };

    const mag4 = {
        type: "simple-marker",
        color: "#c33910",
        style: "diamond"
    };

    const renderer = {
        type: "class-breaks",
        field: "magnitude",
        legendOptions: {
            title: "Magnitudes"
        },
        defaultSymbol: {
            type: "simple-marker",
            color: "green",
            style: "diamond"
        },
        defaultLabel: "no data",
        classBreakInfos: [{
            minValue: 1.6,
            maxValue: 4.999999,
            symbol: mag1,
            label: "1.6 - 4.9"
        }, {
            minValue: 5.0,
            maxValue: 5.999999,
            symbol: mag2,
            label: "5 - 5.9 "
        }, {
            minValue: 6.0,
            maxValue: 6.999999,
            symbol: mag3,
            label: "6 - 6.9"
        }, {
            minValue: 7.0,
            maxValue: 9.000000,
            symbol: mag4,
            label: "7 - 9 "
        }]
    };

    const magnitudeLayer = new FeatureLayer({
        url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/FeatureServer/0",
        title: "Earthquakes since 1970",
        renderer: renderer,
        popupTemplate: {
            title: "Earthquake: {name}",
            content: "Magnitude {magnitude} and it occurred in {year_}"

        },
    });

    const map = new Map({
        basemap: "gray-vector",
        layers: [magnitudeLayer]
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-170, 32],
        zoom: 2
    });

    const legend = new Legend({
        view: view
    });

    view.ui.add(legend, "top-right");
});