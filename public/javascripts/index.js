var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([30.400000, 40.783333]),
      zoom: 6
    })
});
var overlays = [];
function refreshMap(data) {
    for (const overlay of overlays) {
        map.removeOverlay(overlay);
    }
    for (const device of data) {
        var element = document.createElement('div');
        element.innerHTML = '<img src="https://cdn.mapmarker.io/api/v1/fa/stack?size=50&color=DC4C3F&icon=fa-microchip&hoffset=1" />';
        var marker = new ol.Overlay({
            position: ol.proj.fromLonLat([device.longitude, device.latitude]),
            positioning: 'center-center',
            element: element,
            stopEvent: false
        });
        overlays.push(marker);
        map.addOverlay(marker);
    }
}

var socket = io();
socket.on("connect", function () {
  console.log("socket connected");
});
socket.on("allDevices", function (data) {
    console.log("devices arrived")
    if(data == null) return;
    if(data) document.getElementById('devices-count').innerHTML = data.length
    refreshMap(data);
});
socket.on("newRecord", function (data) {
  var table = document.getElementById("records");
  var row = table.insertRow(0);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  var cell8 = row.insertCell(7);
  cell1.innerHTML = 0;
  cell2.innerHTML = data.fireAlert ? "Fire Alert" : "No Fire";
  cell3.innerHTML = data.temperature + " °C";
  cell4.innerHTML = data.humidity + "% RH";
  cell5.innerHTML = data.pressure + " Pa";
  cell6.innerHTML = data.latitude ? data.latitude : "";
  cell7.innerHTML = data.longitude ? data.longitude : "";
  cell8.innerHTML = data.date
    ? new Date(data.date).toLocaleString("tr-TR")
    : "";
  if (data.fireAlert) row.classList.add("bg-warning");
  row.classList.add("font-weight-bold");
  var rowCount = table.rows.length;
  table.deleteRow(rowCount - 1);
  for (let index = 0; index < table.rows.length; index++) {
    const element = table.rows[index];
    element.cells[0].innerHTML = index;
  }
});
socket.on("disconnect", function () {});


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }