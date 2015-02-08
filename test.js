/*globals Amy, console */

(function () {
    console.log("In test...");
    function z() {
        console.log("Called z back");
    }
    Amy.add("/a/:id/", function (params) {
        console.log(params);
        z();
    });
    Amy.add("/b/:id/#:view", function (params) {
        console.log(params);
        z();
    });
    Amy.init();
})();

