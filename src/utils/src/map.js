import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./leaflet.canvas-markers"
import "./leaflet-locatecontrol/L.Control.Locate.min.js"
import "./leaflet-locatecontrol/L.Control.Locate.css"
import 'font-awesome/css/font-awesome.css';
import "./Leaflet.AccuratePosition/Leaflet.AccuratePosition.js";
import "./Leaflet.PolylineMeasure/Leaflet.PolylineMeasure.js";
import "./Leaflet.PolylineMeasure/Leaflet.PolylineMeasure.css";
let createMap = (id, options) => {
    options = options || {};
    options.center = options.center || new L.LatLng(24.908853, 118.589421);
    options.glayer_type = options.glayer_type || 0;
    options.zoom = options.zoom || 10;
    let url_google = '/@api_map/google/{z}/{x}/{y}';
    let glayer_google = new L.TileLayer(url_google, {id: 0, maxZoom: 19, attribution: '普通地图'});

    let url_google_satelite = '/@api_map/google_satellite/{z}/{x}/{y}';
    let glayer_google_satelite = new L.TileLayer(url_google_satelite, {
        id: 1, maxZoom: 19, attribution: '卫星地图'
    });
    let glayer_google_satelite2 = new L.TileLayer(url_google_satelite, {
        maxZoom: 19, attribution: ''
    });
    let url_google_hybrid = '/@api_map/google_hybrid/{z}/{x}/{y}';
    let glayer_google_hybrid = new L.TileLayer(url_google_hybrid, {
        id: 2, maxZoom: 19, attribution: '混合地图'
    });
    let google = L.layerGroup([glayer_google_satelite2, glayer_google_hybrid]);
    let glayer = [glayer_google, glayer_google_satelite, google];
    let map = new L.Map(id, {
        center: options.center,
        zoom: options.zoom,
        layers: glayer[options.glayer_type],
        zoomControl: false,
        contextmenu: true,
        preferCanvas: true,
        renderer: L.canvas(),
        editable: true
    });
    L.control.zoom({
        zoomInTitle: '放大',
        zoomOutTitle: '缩小'
    }).addTo(map);
    L.control.locate({
        drawCircle: false,
        locateOptions: {
            enableHighAccuracy: true
        }
    }).addTo(map);
    L.control.polylineMeasure({
        position: 'topleft',            // Position to show the control. Values: 'topright', 'topleft', 'bottomright', 'bottomleft'
        unit: 'metres',                 // Show imperial or metric distances. Values: 'metres', 'landmiles', 'nauticalmiles'
        clearMeasurementsOnStop: false,  // Clear all the measurements when the control is unselected
        showBearings: false,            // Whether bearings are displayed within the tooltips
        bearingTextIn: 'In',             // language dependend label for inbound bearings
        bearingTextOut: 'Out',          // language dependend label for outbound bearings
        tooltipTextFinish: '点击<b>终点线</b><br>',
        tooltipTextDelete: '按shift键并点击<b>删除点</b>',
        tooltipTextMove: '点击并拖动<b>移动点</b><br>',
        tooltipTextResume: '<br>按ctrl键并点击<b>继续画线</b>',
        tooltipTextAdd: '按ctrl键并点击<b>新增点</b>',
        // language dependend labels for point's tooltips
        measureControlTitleOn: '开启测距',   // Title for the control going to be switched on
        measureControlTitleOff: '关闭测距', // Title for the control going to be switched off
        measureControlLabel: '<span class="iconfont">&#xeb48;</span>', // Label of the Measure control (maybe a unicode symbol)
        measureControlClasses: [],      // Classes to apply to the Measure control
        showClearControl: true,        // Show a control to clear all the measurements
        clearControlTitle: '清除', // Title text to show on the clear measurements control button
        clearControlLabel: '&times',    // Label of the Clear control (maybe a unicode symbol)
        clearControlClasses: [],        // Classes to apply to clear control button
        showUnitControl: false,         // Show a control to change the units of measurements
        distanceShowSameUnit: false,    // Keep same unit in tooltips in case of distance less then 1 km/mi/nm
        unitControlTitle: {             // Title texts to show on the Unit Control button
            text: 'Change Units',
            metres: 'metres',
            landmiles: 'land miles',
            nauticalmiles: 'nautical miles'
        },
        unitControlLabel: {             // Unit symbols to show in the Unit Control button and measurement labels
            metres: 'm',
            kilometres: 'km',
            feet: 'ft',
            landmiles: 'mi',
            nauticalmiles: 'nm'
        },
        tempLine: {                     // Styling settings for the temporary dashed line
            color: '#00f',              // Dashed line color
            weight: 0                   // Dashed line weight
        },
        fixedLine: {                    // Styling for the solid line
            color: '#006',              // Solid line color
            weight: 2                   // Solid line weight
        },
        startCircle: {                  // Style settings for circle marker indicating the starting point of the polyline
            color: '#000',              // Color of the border of the circle
            weight: 1,                  // Weight of the circle
            fillColor: '#0f0',          // Fill color of the circle
            fillOpacity: 1,             // Fill opacity of the circle
            radius: 3                   // Radius of the circle
        },
        intermedCircle: {               // Style settings for all circle markers between startCircle and endCircle
            color: '#000',              // Color of the border of the circle
            weight: 1,                  // Weight of the circle
            fillColor: '#ff0',          // Fill color of the circle
            fillOpacity: 1,             // Fill opacity of the circle
            radius: 3                   // Radius of the circle
        },
        currentCircle: {                // Style settings for circle marker indicating the latest point of the polyline during drawing a line
            color: '#000',              // Color of the border of the circle
            weight: 1,                  // Weight of the circle
            fillColor: '#f0f',          // Fill color of the circle
            fillOpacity: 1,             // Fill opacity of the circle
            radius: 9                  // Radius of the circle
        },
        endCircle: {                    // Style settings for circle marker indicating the last point of the polyline
            color: '#000',              // Color of the border of the circle
            weight: 1,                  // Weight of the circle
            fillColor: '#f00',          // Fill color of the circle
            fillOpacity: 1,             // Fill opacity of the circle
            radius: 3                   // Radius of the circle
        },
    }).addTo(map);

    let baseLayers =
        {
            "普通地图": glayer_google,
            "卫星地图": glayer_google_satelite,
            "混合地图": google
        };
    let lay = L.control.layers(baseLayers).addTo(map);
    /*比例尺*/
    L.control.scale().addTo(map);
    return map;
};
L.Map.prototype.setZoomAndCenter = function (latlng, zoom) {
    let currZoom = this.getZoom();
    if (zoom == undefined || zoom < currZoom) {
        zoom = currZoom;
    }
    this.setView(latlng, zoom);
    this.invalidateSize(true);
}

export default {createMap};

