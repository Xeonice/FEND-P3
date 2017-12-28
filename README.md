# FEND P3 项目说明

该项目采用 Vue.js 与 jQuery 库进行基础开发，使用 Google Maps API 作为数据存储，开发了一个简单的地图项目

* [FEND P3 项目说明](#fend-p3-项目说明)
  * [变量](#变量)
     * [全局变量](#全局变量)
     * [Vue 类](#vue-类)
        * [Vue.method](#vuemethod)
           * [requestMade.getData 方法](#requestmadegetdata-方法)
           * [listview.clicked 方法](#listviewclicked-方法)
  * [函数调用方向](#函数调用方向)
  * [代码逻辑](#代码逻辑)

## 变量

### 全局变量

该项目包括 map，pyrmont，wikiElm，clickStatus 变量以及 request 对象

request 对象用于向 nearbySearchInit 函数传输符合函数接口规定的数据类型

### Vue 类

该项目包括利用 Vue.js 创建的 requestMade 类和 listview 类，其中 requestMade 类负责追踪 input 的输入值，listview 类负责将返回的数据双向绑定至 HTML 文件

#### Vue.method

##### requestMade.getData 方法

清空 listview 中绑定至 HTML 文件的数据，生成符合规定的 request 对象，传入 geocodeAddress 函数

##### listview.clicked 方法

监听 HTML 列表项的点击事件，点击时触发 marker 的 click 方法

## 函数调用方向

initMap -> geocodeAddress -> nearbySearchInit -> MarkerInit -> setMarker -> populateInfoWindow -> ajax 请求

## 代码逻辑

具体逻辑可以参见 app.js 中的详细注释


