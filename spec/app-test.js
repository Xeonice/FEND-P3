describe("Javascript-app", function(){
    describe("initMap", function () {
        it("init 被成功定义", function () {
            expect(initMap).toBeDefined();
        });
    })
    describe("数据回传测试", function () {
        it("status 正常", function () {
            expect(initStatus).toBeDefined();
        })
        it("placeList 成功接收回传数据", function () {
            expect(placeList).toBeDefined();
        })
        it("wikiElm 成功接收回传数据", function () {
            expect(wikiElm).toBeDefined();
        })
        it("markers 成功接收数据", function () {
            expect(markers).toBeDefined();
        })
    })
})
