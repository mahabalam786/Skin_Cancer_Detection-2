! function() {
    var e;
    e = function() {
        var e, n, t = (null === (e = window) || void 0 === e || null === (e = e.surecartComponents) || void 0 === e ? void 0 : e.url) || (null === (n = window) || void 0 === n || null === (n = n.parent) || void 0 === n || null === (n = n.surecartComponents) || void 0 === n ? void 0 : n.url);
        if (t) {
            var d = document.createElement("script");
            d.type = "module", d.src = t, document.getElementsByTagName("head")[0].appendChild(d)
        }
    }, "interactive" === document.readyState || "complete" === document.readyState ? e() : document.addEventListener("DOMContentLoaded", e)
}();