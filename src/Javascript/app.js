// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var pyrmont = {lat: 40.731, lng: -73.997};
var placeList;
var markers = [];
var wikiElm = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('mapView'), {
        center: pyrmont,
        zoom: 15
    });
    var self = this;
    var service = new google.maps.places.PlacesService(map);
    var request = {
        location: pyrmont,
        radius: 500,
        type: ['store']
    };
    service.nearbySearch(request, function (result, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            placeList = result;
            ko.applyBindings(new ViewModel());
        }
    });
}

var Places = function(data) {
    this.name = ko.observable(data.name);
    this.mapError = ko.observable('');
};


var ViewModel = function(){
    var self = this;
    self.a = ko.observable('A');
    self.locations = ko.observableArray();
    self.filter = ko.observableArray(self.locations());
    self.locationInput = ko.observable('');
    self.errorMessage = ko.observable('');
    var infowindow = new google.maps.InfoWindow();

    placeList.forEach(function (data) {
        var location = new Places(data);
        var position = data.geometry.location;
        var title = data.name;

        var marker = (new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP
        }));

        marker.addListener('click', function () {
            populateInfoWindow(this, infowindow);
        });
        location.marker = marker;
        self.locations.push(location);
    });
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
    self.listFilter = ko.computed(function() {
        return ko.utils.arrayFilter(self.filter(), function(location) {
            if (location.name().toLowerCase().indexOf(self.locationInput().toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                return true;
            } else {
                location.marker.setVisible(false);
                return false;
            }
        });
    });
    console.log(self.listFilter());
    self.locationClicked = function(location) {
        google.maps.event.trigger(location.marker, 'click');
    };

};

function googlemapError() {
    alert("Google Maps failed to load.");
    this.mapError ('Google Maps failed to load.');
}



