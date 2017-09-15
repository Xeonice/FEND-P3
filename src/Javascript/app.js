// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;
var wikiElm = [];
// var DataArray;

var viewModel = {
    trackArray: ko.observableArray(),
    inputData: ko.observable('A'),
    dataArray: ko.observableArray([])
};
viewModel.trackArray.subscribe(function(newValue) {
    //获取抓取的值，并对其做处理
    for (var i = 0; i < newValue.length; i++){
        viewModel.dataArray.push(newValue[i]);
    }
    // DataArray = newValue;
});



function initMap() {
    var pyrmont = {lat: 40.731, lng: -73.997};

    map = new google.maps.Map(document.getElementById('mapView'), {
        center: pyrmont,
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    var request = {
        location: pyrmont,
        radius: 500,
        type: ['store']
    };
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        viewModel.trackArray(results);   //抓取result，并赋值给result
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
    });
    var wikiRequestTimeOut = setTimeout(function (e) {
        $wikiElem.text("failed to load wiki.");
    }, 8000);

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + place.name + '&format=json&callback=wikiCallback';
    $.ajax({                                                                               //ajax函数，由url与Setting组成
        url: wikiUrl,                                                                      //设定url，可提至大括号外
        dataType: "jsonp",                                                                 //设定传输类型为JSONP

        success: function(response){
            var articleList = response[0];//articleList为从response项中取出

            var url = "http://en.wikipedia.org/wiki/" + articleList;

            wikiElm.push({
                name: articleList,
                content: '<li><a href="' + url + '">' +
                articleList + ' -wikiPedia'+ '</a></li>'
            });
            clearTimeout(wikiRequestTimeOut);                                              //成功加载时，消去timeout信息，否则8s后timeout会自动显示
        }
    });

    google.maps.event.addListener(marker, 'click', function() {
        var wikiClickUrl;
        for (var i = 0; i < wikiElm.length; i++){
            if (wikiElm[i].name == place.name){
                wikiClickUrl = wikiElm[i].content;
                break;
            }
        }
        infowindow.setContent(place.name + wikiClickUrl);
        infowindow.open(map, this);

    });
}
ko.applyBindings(viewModel);
