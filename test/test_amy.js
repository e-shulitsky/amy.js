/*globals Amy, describe, it, expect, toBe, toBeDefined, toEqual, afterEach*/
describe("check adding routes", function () {
    var callback = function () {},
        pattern = "/a/";
    Amy.add(pattern, callback);
    it("route in routes", function () {
        expect(Amy.routes.length).toBe(1);
    });
    it("route has pattern,", function () {
        expect(Amy.routes[0].pattern).toEqual(pattern);
    });
    it("route has pattern_regexp", function () {
        expect(Amy.routes[0].pattern_regexp).toBeDefined();
    });
    it("route has callback ", function () {
        expect(Amy.routes[0].callback).toEqual(callback);
    });
});


describe("check combine objects", function () {
    it("one empty", function () {
        var a = {},
            b = {1: 2};
        expect(Amy.combine_obj(a, b)).toEqual(b);
    });
    it("two different objects", function () {
        var a = {3: 4},
            b = {1: 2},
            expected = {3: 4, 1: 2};
        expect(Amy.combine_obj(a, b)).toEqual(expected);
    });
    it("two objects with the same keys", function () {
        var a = {1: 4},
            b = {1: 2},
            expected = {1: 2};
        expect(Amy.combine_obj(a, b)).toEqual(expected);
    });
});


describe("check parsing query string", function () {
    it("parse with one pair only", function () {
        var key = "a",
            value = "1",
            query = key + "=" + value,
            expected = {};
        expected[key] = value;
        expect(Amy.parse_query_string(query)).toEqual(expected);
    });
    it("parse two pairs", function () {
        var key = "a",
            value = "1",
            key2 = "b",
            value2 = "2",
            query = key + "=" + value + "&" + key2 + "=" + value2,
            expected = {};
        expected[key] = value;
        expected[key2] = value2;
        expect(Amy.parse_query_string(query)).toEqual(expected);
    });
    it("replace + with space", function () {
        var key = "a",
            value = "o+la+la",
            query = key + "=" + value,
            expected = {};
        expected[key] = value.replace("+", " ", "g");
        expect(Amy.parse_query_string(query)).toEqual(expected);
    });
    it("decode url component", function () {
        var key = "a",
            value = "la%20",
            query = key + "=" + value,
            expected = {};
        expected[key] = value.replace("%20", " ", "g");
        expect(Amy.parse_query_string(query)).toEqual(expected);
    });
});

describe("pattern_to_regexp", function () {
    it("escape slashes", function () {
        var pattern = "/a/b/";
        expect(Amy.pattern_to_regexp(pattern)).toEqual(new RegExp("^\/a\/b\/$"));
    });
    it("escape slashes with hash", function () {
        var pattern = "/a/#b/c/";
        expect(Amy.pattern_to_regexp(pattern)).toEqual(new RegExp("^\/a\/#b\/c\/$"));
    });
    it("escape slashes with hash and cut query string", function () {
        var pattern = "/a/#b/c?g=h";
        expect(Amy.pattern_to_regexp(pattern)).toEqual(new RegExp("^\/a\/#b\/c$"));
    });
    it("capturing groups in path", function () {
        var pattern = "/a/:b/";
        expect(Amy.pattern_to_regexp(pattern)).toEqual(new RegExp("^\/a\/([\\w]*)\/$"));
    });
    it("capturing groups in hash", function () {
        var pattern = "/a/#:b/";
        expect(Amy.pattern_to_regexp(pattern)).toEqual(new RegExp("^\/a\/#([\\w]*)\/$"));
    });
    it("capturing groups in both", function () {
        var pattern = "/:a/#:b/";
        expect(Amy.pattern_to_regexp(pattern)).toEqual(new RegExp("^\/([\\w]*)\/#([\\w]*)\/$"));
    });
});


describe("run route", function () {
    var g_params;
    afterEach(function () {
        Amy.routes = [];
        g_params = {};
    });

    it("check '/' vs '/'", function () {
        Amy.add("/", function (params) {
            g_params = params;
        });
        Amy.run_route("/");
        expect(g_params).toEqual({location: "/"});
    });

    it("check '/' vs '/a/'", function () {
        Amy.add("/", function (params) {
            g_params = params;
        });
        Amy.run_route("/a/");
        expect(g_params).toEqual({});
    });
    it("check '/' vs '/#a'", function () {
        Amy.add("/", function (params) {
            g_params = params;
        });
        Amy.run_route("/#a");
        expect(g_params).toEqual({});
    });
    it("check '/' vs '/#'", function () {
        Amy.add("/", function (params) {
            g_params = params;
        });
        Amy.run_route("/#");
        expect(g_params).toEqual({});
    });
    it("check '/' vs '/?a=b'", function () {
        Amy.add("/", function (params) {
            g_params = params;
        });
        Amy.run_route("/?a=b");
        expect(g_params).toEqual({location: "/?a=b", a: "b"});
    });


    it("check '/a/' vs '/'", function () {
        Amy.add("/a/", function (params) {
            g_params = params;
        });
        Amy.run_route("/");
        expect(g_params).toEqual({});
    });
    it("check '/a/' vs '/a/?b=c&g=f'", function () {
        Amy.add("/a/", function (params) {
            g_params = params;
        });
        Amy.run_route("/a/?b=c&g=f");
        expect(g_params).toEqual({location: "/a/?b=c&g=f", b: "c", g: "f"});
    });
    it("check '/a/' vs '/a/#b'", function () {
        Amy.add("/a/", function (params) {
            g_params = params;
        });
        Amy.run_route("/a/#b");
        expect(g_params).toEqual({});
    });


    it("check '/a/#b/' vs '/a/#b/'", function () {
        Amy.add("/a/#b/", function (params) {
            g_params = params;
        });
        Amy.run_route("/a/#b/");
        expect(g_params).toEqual({location: "/a/#b/"});
    });


    it("check '/a/#b/c/' vs '/a/#b'", function () {
        Amy.add("/a/#b/c/", function (params) {
            g_params = params;
        });
        Amy.run_route("/a/#b");
        expect(g_params).toEqual({});
    });
    it("check '/a/#b/c/' vs '/a/#b/c/?a=b'", function () {
        Amy.add("/a/#b/c/", function (params) {
            g_params = params;
        });
        Amy.run_route("/a/#b/c/?a=b");
        expect(g_params).toEqual({location: "/a/#b/c/?a=b", a: "b"});
    });


    it("check '/:name/' vs '/amy/'", function () {
        Amy.add("/:name/", function (params) {
            g_params = params;
        });
        Amy.run_route("/amy/");
        expect(g_params).toEqual({location: "/amy/", name: "amy"});
    });
    it("check '/:name/:age/' vs '/amy/23/'", function () {
        Amy.add("/:name/:age/", function (params) {
            g_params = params;
        });
        Amy.run_route("/amy/23/");
        expect(g_params).toEqual({location: "/amy/23/", name: "amy", age: "23"});
    });
    it("check '/:name/#:age/' vs '/amy/#23/'", function () {
        Amy.add("/:name/#:age/", function (params) {
            g_params = params;
        });
        Amy.run_route("/amy/#23/");
        expect(g_params).toEqual({location: "/amy/#23/", name: "amy", age: "23"});
    });
    it("check '/:name/#:age/:gender/' vs '/amy/#23/f/'", function () {
        Amy.add("/:name/#:age/:gender/", function (params) {
            g_params = params;
        });
        Amy.run_route("/amy/#23/f/");
        expect(g_params).toEqual({location: "/amy/#23/f/", name: "amy", age: "23", gender: "f"});
    });
    it("check '/:name/#:age/:gender/' vs '/amy/#23/f/?a=b&c=d'", function () {
        Amy.add("/:name/#:age/:gender/", function (params) {
            g_params = params;
        });
        Amy.run_route("/amy/#23/f/?a=b&c=d");
        expect(g_params).toEqual({location: "/amy/#23/f/?a=b&c=d", name: "amy", age: "23", gender: "f", a: "b", c: "d"});
    });
});

