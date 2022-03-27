require(["esri/WebMap",
        "esri/views/MapView",
        "esri/widgets/Home",
        "esri/widgets/Legend",
        "esri/widgets/LayerList",
        "esri/widgets/ScaleBar",
        "esri/widgets/DistanceMeasurement2D",
        "esri/widgets/AreaMeasurement2D"
    ],
    (WebMap,
        MapView,
        Home,
        Legend,
        LayerList,
        ScaleBar,
        DistanceMeasurement2D,
        AreaMeasurement2D
    ) => {
        const webmap = new WebMap({
            portalItem: {
                id: "d7cb3d55faa5471a8467de537f1bc748"
            }
        });

        const view = new MapView({
            container: "viewDiv",
            map: webmap,
            center: [-84.358451, 33.849662],
            zoom: 17
        });

        const legend = new Legend({
            view: view
        });
        const homeBtn = new Home({
            view: view
        });
        const scaleBar = new ScaleBar({
            view: view,
            unit: "metric",

        });
        view.when(() => {
            const layerList = new LayerList({
                view: view
            });
            view.ui.add(layerList, "bottom-right");
        });
        view.ui.add(homeBtn, "top-left");
        view.ui.add(legend, "bottom-left");
        view.ui.add(scaleBar, "top-left");

        view.ui.add("topbar", "top-right");
        var activeWidget = null;

        document
            .getElementById("distanceButton")
            .addEventListener("click", function() {
                setActiveWidget(null);
                if (!this.classList.contains("active")) {
                    setActiveWidget("distance");
                } else {
                    setActiveButton(null);
                }
            });

        document
            .getElementById("areaButton")
            .addEventListener("click", function() {
                setActiveWidget(null);
                if (!this.classList.contains("active")) {
                    setActiveWidget("area");
                } else {
                    setActiveButton(null);
                }
            });

        function setActiveWidget(type) {
            switch (type) {
                case "distance":
                    activeWidget = new DistanceMeasurement2D({
                        view: view
                    });

                    activeWidget.viewModel.start();

                    view.ui.add(activeWidget, "top-right");
                    setActiveButton(document.getElementById("distanceButton"));
                    break;
                case "area":
                    activeWidget = new AreaMeasurement2D({
                        view: view
                    });

                    activeWidget.viewModel.start();

                    view.ui.add(activeWidget, "top-right");
                    setActiveButton(document.getElementById("areaButton"));
                    break;
                case null:
                    if (activeWidget) {
                        view.ui.remove(activeWidget);
                        activeWidget.destroy();
                        activeWidget = null;
                    }
                    break;
            }
        }

        function setActiveButton(selectedButton) {
            view.focus();
            var elements = document.getElementsByClassName("active");
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove("active");
            }
            if (selectedButton) {
                selectedButton.classList.add("active");
            }
        }

    });