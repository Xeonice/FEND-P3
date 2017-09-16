// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;
var wikiElm = [];
var markers = [];
var backUpCrray = ko.observableArray();
// var DataArray;

var viewModel = function(){
    var self = this;
    self.inputData = ko.observable('A');
    self.filteredNames = ko.computed(function() {
        if (!self.inputData()) {
            return backUpCrray;
        } else {
            return backUpCrray().filter(function(name) {
                return (function(){name.toLowerCase().indexOf(self.inputData().toLowerCase()) != -1});;
            });
        }
    });
    self.clickList = function (point) {
        for (var i = 0; i < markers.length; i++) {
            if (point.geometry.location == markers[i].position) {
                // console.log('Yes' + markers[i].position + point.name);
                google.maps.event.trigger(markers[i], 'click', {});
            }
        }
    };
};

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
        backUpCrray().push(results)  //抓取result，并赋值给result
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    markers.push(new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
    }));

    var inputMarker = markers.slice(-1).pop();

    inputMarker.addListener('click', toggleBounce);
    function toggleBounce() {
        inputMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){
            inputMarker.setAnimation(null);
        }, 1500);
    }



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
        },
        timeout: 4000,
        error: function(){
            alert("App is not loaded!!");
        }
    });


    google.maps.event.addListener(inputMarker, 'click', function() {
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
ko.applyBindings(new viewModel());
