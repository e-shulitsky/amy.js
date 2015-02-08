[![Build Status](https://travis-ci.org/e-shulitsky/amy.js.svg)](https://travis-ci.org/e-shulitsky/amy.js)
[![Test Coverage](https://codeclimate.com/github/e-shulitsky/amy.js/badges/coverage.svg)](https://codeclimate.com/github/e-shulitsky/amy.js)
amy.js
============
###What is it
amy.js is a JavaScript routing library

###How to install
amy.js is designed to use in browser. Just add it somewhere in your html file:
```html
<script src="amy.js" type="text/javascript"></script>
```

###How to use
+ Start by adding routes:
```javascript
(function () {
    Amy.add("/", function (params) {
        some_function();
    });
})();
```
+ You can also use capturing groups:
```javascript
Amy.add("/:id/#:type/", function (params) {
    ...
});
```
+ `params` is the object, that contains capturing groups and query parameters. For the route from section 2 and link `/12/#week/?date=today` `params` object will look something like:
```javascript
params = {
    location: "/12/#week/?date=today",
    id: 12,
    type: "week",
    date: "today"
}
```
+ Set up what happens when location is not found in routes:
```javascript
Amy.not_found = function (location) {
    do_something();
}
```
+ When you finished with configuration, call init() method:
```javascript
Amy.init();
```
+ To manually run routes check:
```javascript
Amy.run_route("/new/location/");
```
