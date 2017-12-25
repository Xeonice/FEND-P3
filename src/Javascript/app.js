// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var pyrmont = {lat: 40.731, lng: -73.997};
var placeList;
var markers = [];
var wikiElm = [];
var initStatus;
var nameArray = [];
var clickStatus = [];
var request = {
    radius: 500,
    type: [],
    location
}
var inputLocation = '';


function initMap() {
    map = new google.maps.Map(document.getElementById('mapView'), {
        center: pyrmont,
        zoom: 15
    });
    var self = this;
    var a = 'a';
    var service = new google.maps.places.PlacesService(map);
    var geocoder = new google.maps.Geocoder();

    var listview = new Vue({
        el: "#mapData-present",
        data: {
            elements: [],
            filter: '',
            inputStatus: false
        },
        methods: {
            clicked: function (index) {
                for (var i = 0; i < clickStatus.length; i++) {
                    if (index === i) {
                        google.maps.event.trigger(clickStatus[i], 'click');
                        break;
                    }
                }
            }
        }
    });

    var requestMade = new Vue({
        el: '#request-add',
        data: {
            location: 'pyrmont',
            type: ''
        },
        methods: {
            getData: function () {
                listview.elements = [];
                inputLocation = this.location;
                request.type.push(this.type);
                geocodeAddress(geocoder, map);
                function geocodeAddress(geocoder, resultsMap) {
                    geocoder.geocode({ 'address': inputLocation }, function (results, status) {
                        if (status === 'OK') {
                            resultsMap.setCenter(results[0].geometry.location);
                            request.location = results[0].geometry.location;
                            service.nearbySearch(request, function (result, status) {
                                listview.initStatus = true;
                                if (status === google.maps.places.PlacesServiceStatus.OK) {
                                    var i = 0;
                                    result.forEach(function (element) {
                                        listview.inputStatus = true;
                                        Vue.set(listview.elements, i, element.name);
                                        i++;
                                    })
                                    ViewModel(result);
                                }
                            });
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
                }
            }
        }
    })
}

// var Places = function(data) {
//     this.name = ko.observable(data.name);
//     this.mapError = ko.observable('');
// };


var ViewModel = function(data){

    // var mapMarkerPresent = new Vue({
    //     el: "#mapData-present",
    //     data: {
    //         elements: [],
    //         filter: ''
    //     },
    //     methods: {
    //         clicked: function (input) {
    //             for (var i = 0; i < clickStatus.length; i++) {
    //                 if (clickStatus[i].title === input) {
    //                     google.maps.event.trigger(clickStatus[i], 'click');
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    // });

    var i = 0;
    var infowindow = new google.maps.InfoWindow();


    data.forEach(function (element) {
        if(clickStatus.length == 20){
            function deleteMarkers() {
                clearMarkers();
                clickStatus = [];
            }
            function clearMarkers() {
                setMapOnAll(null);
            }
            function setMapOnAll(map) {
                for (var i = 0; i < clickStatus.length; i++) {
                    clickStatus[i].setMap(map);
                }
            }
            deleteMarkers();
            clickStatus = [];
        }
        var position = element.geometry.location;
        var title = element.name;

        var marker = (new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP
        }));

        // Vue.set(listview.elements, i, title);
        // i++;
        marker.addListener('click', function () {
            populateInfoWindow(this, infowindow);
        });
        clickStatus.push(marker);
    });


    // console.log(mapMarkerPresent.elements);

    function populateInfoWindow(marker, infowindow) {
        if(infowindow.marker != marker) {
            infowindow.marker = marker;
            marker.setAnimation(google.maps.Animation.BOUNCE);
            infowindow.setContent(marker.title);
            infowindow.open(map, marker);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1200);
            // Foresquare API
            var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + infowindow.marker.title + '&format=json&callback=wikiCallback';
            $.ajax({                                                                               //ajax函数，由url与Setting组成
                url: wikiUrl,                                                                      //设定url，可提至大括号外
                dataType: "jsonp"                                                                  //设定传输类型为JSONP
            }).done(function(response) {
                var articleList = response[0];//articleList为从response项中取出
                var text = response[2][0];
                var url = response[3][0];
                var wikiContentName = articleList + "--wikiPedia";

                if (url !== undefined){
                    if (response[2][0].indexOf("refer to") !== -1){
                        text = response[2][1];
                    }
                    infowindow.open(map, marker);
                    infowindow.setContent('<div>' + marker.title + '</div><p>' + text + '</p>'+'<a href="'+url+'">'+wikiContentName+'</a>');
                }
                else {
                    infowindow.open(map, marker);
                    infowindow.setContent(articleList + '<p>No WikiPedia Datas!</p>');
                }
            }).fail(function (e) {
                infowindow.setContent('Foursquare info failed to load');
                this.errorMessage();
            });
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    }
}
//     console.log(self.listFilter());
    self.locationClicked = function(location) {
        google.maps.event.trigger(location.marker, 'click');
    };

// };

// function googlemapError() {
//     alert("Google Maps failed to load.");
//     this.mapError ('Google Maps failed to load.');
// }



