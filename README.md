# FEND P3项目说明
该项目利用Knockout.js与Google Maps API完成了一个简单的街区地图项目

   * [FEND P3项目说明](#fend-p3项目说明)
      * [全局变量](#全局变量)
      * [ViewModal](#viewmodal)
         * [inputTrack](#inputtrack)
      * [Subscrible函数](#subscrible函数)
      * [ajax](#ajax)
      * [点击打开窗口](#点击打开窗口)

## 全局变量
该项目包括`map`，`infowindow`，`wikiElm[]`，`DataArray`四个全局变量。其中，`map`，`infowindow`为Google API中用于接收地图数据／视窗数据的变量，`wikiElm[]`为接收Wiki API返回的数据的变量，DataArray则是从Google Maps Place库中接收返回数值的变量。
## ViewModal
ViewModal包含一个智能数组`dataArray`用于临时存储数据，一个observalbe对象`inputData`以检测用户输入值，还有一个函数用于处理filter按钮点击后的运行事件。
### `inputTrack`
函数`inputTrack`接收之前存储在全局变量`DataArray`中的数据，并与对象`inputData`中的数据进行对比，并隐藏对比结果不一致的`<li></li>`
## Subscrible函数
由于Javascript自带异步特性，因此，需要利用knockout框架中带有的Subscribe函数同步在CallBack函数中返回的地点数据。
## ajax
在ajax请求中设定`url`,`datatype`，当请求成功时，取出返回数据中的第一个数据的`url`与`name`，并push进`wikiElm[]`中。
## 点击打开窗口
遍历`wikiElm`，取出与当前Click请求相同名称的数组对象，并在`content`中加入`wikiUrl`

