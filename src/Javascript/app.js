// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;    //初始化地图变量存储
var pyrmont = {lat: 40.731, lng: -73.997}; //   lat/lng位置设定
var wikiElm = [];   //wiki API 调用变量
var clickStatus = [];   //全局变量，存储 marker 信息，即地图上的坐标点
var request = {
    /*
    radius: 整数类型
    type: 字符串数组类型
    location: lat/lng 信息类型（地理位置坐标）
     */
    radius: 500,
    type: [],
    location 
}   //存储request信息，用于调用nearbySearch服务搜索地点


function initMap() {

    map = new google.maps.Map(document.getElementById('mapView'), {
        center: pyrmont,
        zoom: 15
    });
    //初始化变量 map，将获取的地图交互组件引入 HTML 文件 ID 为 mapView 的 div 中

    var requestMade = new Vue({
        el: '#request-add',//监听 id 为 request-add 的 div
        data: {
            location: '',
            type: ''
        },
        methods: {
            getData: function () {
                listview.elements = []; //清空elements数组，方便重新赋值
                request.type.push(this.type);
                geocodeAddress(geocoder, map);
            }
        }
    });     
    
    // requestMade 类，从input接收location和type的相关数据信息，search 按钮绑定 getData 方法

/* 
    getData方法：
    调用时间：点击 Search 按钮
    1.清空 listview 类中用于呈现数据的 elements 数组
    2.将输入的想要查询的地点类型引入 request 对象中的 type 中
    3.调用自定义的 geocodeAddress 函数，
*/

    var listview = new Vue({
        el: "#mapData-present",//监听 id 为 mapData-present 的 div
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

    // listview 类，将 nearbySearchInit 函数中获取到的 result 数组加入到 elements 中，然后利用 v-for 方法将数组中的名称呈现到 HTML 文件中

/*
    clicked 方法：
    调用时间：点击列表中的标题时调用
    1.引入 HTML 文件中被点击的 elements 数组项的 index
    2.与 clickStatus 数组中的数组项进行比对，判断序号（index）是否一致
    3.序号一致时，调用 google map 自带的 marker 点击事件
*/



    var self = this;
    var a = 'a';
    var service = new google.maps.places.PlacesService(map); // 定义调用 nearbySearchInit 函数时需要调用的相关服务
    var geocoder = new google.maps.Geocoder(); // 定义调用 geocodeAddress 函数时需要传入的 Geocoder 服务

/*
    geocodeAddress 方法：

    成功获取地理位置信息时：

        1.设定地图中心为查询地点
        2.获取的地理位置坐标传入 request 对象的 location 属性中

        判断 request.type[0] 是否为空（即判断 request.type 是否有输入值）
        是：
            将 listview.inputStatus 设置为 false，禁止呈现
        否：
            将 listview.inputStatus 设置为 true，允许呈现
            调用 nearbySearchInit 函数进行临近地点查询

    未能成功获取地理位置信息时：
        1.将 listview.inputStatus 设置为 false，禁止呈现
        2.将未能获取地理位置信息的原因输出在控制台中
*/

    function geocodeAddress(geocoder, resultsMap) {
        geocoder.geocode({ 'address': requestMade.location }, function (results, status) {
            //成功获取
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location); 
                request.location = results[0].geometry.location; 
                if (requestMade.type[0] == null) {
                    listview.inputStatus = false;
                } else{
                    listview.inputStatus = true;
                    nearbySearchInit();
                }
            }
            //不成功获取 
            else {
                listview.inputStatus = false;
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
/*
    nearbySearchInit 方法：

    成功获取临近地点信息时：
        1.将函数内返回的 result 信息赋给 listview 类中的 elements 函数，并呈现在列表项中
        2.将返回的 result 信息传入 MarkerInit 函数，以进行地图上 marker 的标记

    未能成功获取临近地点信息时：
        1. 将未能获取临近地点信息的原因输出在控制台中
*/

    function nearbySearchInit(){
        service.nearbySearch(request, function (result, status) {
            listview.initStatus = true;
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                var i = 0;
                result.forEach(function (element) {
                    listview.inputStatus = true;
                    Vue.set(listview.elements, i, element.name);
                    i++;
                })
                MarkerInit(result);
            } else {
                console.log('nearbySearch was not successful for the following reason: ' + status);
            }
        });
    }
}

var MarkerInit = function(data){
    var i = 0;
    var infowindow = new google.maps.InfoWindow();
    setMarker(data);

    function setMarker(data) {
        data.forEach(function (element) {
            if (clickStatus.length == 20) {
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
    }

/*
    setMarker 方法：

    1.传入在 nearbySearchInit 函数中获取到的临近地点信息 result，并设为 data
    2.利用 forEach 方法遍历数组项 element，判断存储 marker 的数组 clickStatus 是否已满

    数组已满：
        调用 deleteMarkers 清除所有数组，并将 clickStatus 数组重置为空
    数组未满：
        1.调用 google maps 自带的 Marker 方法，将 Marker 呈现在地图上
        2.向 marker 添加 click 响应事件，并要求在点击时输出一个 infowindow（调用populateInfoWindow 函数）
        3.将 marker 加入 clickStatus 进行存放
*/

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
    /*
        populateInfoWindow方法：
        1.InfoWindow 打开时，设置动画为 BOUNCE，内容为 marker.title 中存储的内容（地点名称），并调用 open 方法将 InfoWindow 呈现在地图上。
        2.1200ms 后，自动停止 BOUNCE 动画
        3.设置 wikiUrl 为特定 URL 值，以便于后期运用 ajax 函数获取 wikiPedia 数据
        ·成功获取 WikiPedia 数据时：
            ·取出存放在 response 数组中的数据，并判断 url 是否为空
            url 为空时：
                ·将 infoWindow 中的内容设置为 HTML 标签， 内容为 No WikiPedia Datas!
            url不为空时：
                ·调用 Marker 自带的 setContent 方法，将编辑完成的 HTML 数据引入 infoWindow 中。
        ·未能成功获取 Wikipedia 数据时：
                ·调用 Marker 自带的 setContent 方法， 将 Foursquare info failed to load 引入 infoWindow 中
                调用 ajax 函数自带的 errorMessage 方法，输出错误信息。
        4.添加 infoWindow 中自带的 closeclick 方法，将 marker 设置为 null
    */
}



