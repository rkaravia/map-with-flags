!function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e(require("leaflet")) : "function" == typeof define && define.amd ? define(["leaflet"], e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).VectorTileLayer = e(t.L)
}(this, (function(t) {
    "use strict";
    var e = i;
    function i(t, e) {
        this.x = t,
        this.y = e
    }
    i.prototype = {
        clone: function() {
            return new i(this.x,this.y)
        },
        add: function(t) {
            return this.clone()._add(t)
        },
        sub: function(t) {
            return this.clone()._sub(t)
        },
        multByPoint: function(t) {
            return this.clone()._multByPoint(t)
        },
        divByPoint: function(t) {
            return this.clone()._divByPoint(t)
        },
        mult: function(t) {
            return this.clone()._mult(t)
        },
        div: function(t) {
            return this.clone()._div(t)
        },
        rotate: function(t) {
            return this.clone()._rotate(t)
        },
        rotateAround: function(t, e) {
            return this.clone()._rotateAround(t, e)
        },
        matMult: function(t) {
            return this.clone()._matMult(t)
        },
        unit: function() {
            return this.clone()._unit()
        },
        perp: function() {
            return this.clone()._perp()
        },
        round: function() {
            return this.clone()._round()
        },
        mag: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y)
        },
        equals: function(t) {
            return this.x === t.x && this.y === t.y
        },
        dist: function(t) {
            return Math.sqrt(this.distSqr(t))
        },
        distSqr: function(t) {
            var e = t.x - this.x
              , i = t.y - this.y;
            return e * e + i * i
        },
        angle: function() {
            return Math.atan2(this.y, this.x)
        },
        angleTo: function(t) {
            return Math.atan2(this.y - t.y, this.x - t.x)
        },
        angleWith: function(t) {
            return this.angleWithSep(t.x, t.y)
        },
        angleWithSep: function(t, e) {
            return Math.atan2(this.x * e - this.y * t, this.x * t + this.y * e)
        },
        _matMult: function(t) {
            var e = t[0] * this.x + t[1] * this.y
              , i = t[2] * this.x + t[3] * this.y;
            return this.x = e,
            this.y = i,
            this
        },
        _add: function(t) {
            return this.x += t.x,
            this.y += t.y,
            this
        },
        _sub: function(t) {
            return this.x -= t.x,
            this.y -= t.y,
            this
        },
        _mult: function(t) {
            return this.x *= t,
            this.y *= t,
            this
        },
        _div: function(t) {
            return this.x /= t,
            this.y /= t,
            this
        },
        _multByPoint: function(t) {
            return this.x *= t.x,
            this.y *= t.y,
            this
        },
        _divByPoint: function(t) {
            return this.x /= t.x,
            this.y /= t.y,
            this
        },
        _unit: function() {
            return this._div(this.mag()),
            this
        },
        _perp: function() {
            var t = this.y;
            return this.y = this.x,
            this.x = -t,
            this
        },
        _rotate: function(t) {
            var e = Math.cos(t)
              , i = Math.sin(t)
              , r = e * this.x - i * this.y
              , n = i * this.x + e * this.y;
            return this.x = r,
            this.y = n,
            this
        },
        _rotateAround: function(t, e) {
            var i = Math.cos(t)
              , r = Math.sin(t)
              , n = e.x + i * (this.x - e.x) - r * (this.y - e.y)
              , s = e.y + r * (this.x - e.x) + i * (this.y - e.y);
            return this.x = n,
            this.y = s,
            this
        },
        _round: function() {
            return this.x = Math.round(this.x),
            this.y = Math.round(this.y),
            this
        }
    },
    i.convert = function(t) {
        return t instanceof i ? t : Array.isArray(t) ? new i(t[0],t[1]) : t
    }
    ;
    var r = e
      , n = s;
    function s(t, e, i, r, n) {
        this.properties = {},
        this.extent = i,
        this.type = 0,
        this._pbf = t,
        this._geometry = -1,
        this._keys = r,
        this._values = n,
        t.readFields(o, this, e)
    }
    function o(t, e, i) {
        1 == t ? e.id = i.readVarint() : 2 == t ? function(t, e) {
            var i = t.readVarint() + t.pos;
            for (; t.pos < i; ) {
                var r = e._keys[t.readVarint()]
                  , n = e._values[t.readVarint()];
                e.properties[r] = n
            }
        }(i, e) : 3 == t ? e.type = i.readVarint() : 4 == t && (e._geometry = i.pos)
    }
    function a(t) {
        for (var e, i, r = 0, n = 0, s = t.length, o = s - 1; n < s; o = n++)
            e = t[n],
            r += ((i = t[o]).x - e.x) * (e.y + i.y);
        return r
    }
    s.types = ["Unknown", "Point", "LineString", "Polygon"],
    s.prototype.loadGeometry = function() {
        var t = this._pbf;
        t.pos = this._geometry;
        for (var e, i = t.readVarint() + t.pos, n = 1, s = 0, o = 0, a = 0, u = []; t.pos < i; ) {
            if (s <= 0) {
                var h = t.readVarint();
                n = 7 & h,
                s = h >> 3
            }
            if (s--,
            1 === n || 2 === n)
                o += t.readSVarint(),
                a += t.readSVarint(),
                1 === n && (e && u.push(e),
                e = []),
                e.push(new r(o,a));
            else {
                if (7 !== n)
                    throw new Error("unknown command " + n);
                e && e.push(e[0].clone())
            }
        }
        return e && u.push(e),
        u
    }
    ,
    s.prototype.bbox = function() {
        var t = this._pbf;
        t.pos = this._geometry;
        for (var e = t.readVarint() + t.pos, i = 1, r = 0, n = 0, s = 0, o = 1 / 0, a = -1 / 0, u = 1 / 0, h = -1 / 0; t.pos < e; ) {
            if (r <= 0) {
                var f = t.readVarint();
                i = 7 & f,
                r = f >> 3
            }
            if (r--,
            1 === i || 2 === i)
                (n += t.readSVarint()) < o && (o = n),
                n > a && (a = n),
                (s += t.readSVarint()) < u && (u = s),
                s > h && (h = s);
            else if (7 !== i)
                throw new Error("unknown command " + i)
        }
        return [o, u, a, h]
    }
    ,
    s.prototype.toGeoJSON = function(t, e, i) {
        var r, n, o = this.extent * Math.pow(2, i), u = this.extent * t, h = this.extent * e, f = this.loadGeometry(), l = s.types[this.type];
        function c(t) {
            for (var e = 0; e < t.length; e++) {
                var i = t[e]
                  , r = 180 - 360 * (i.y + h) / o;
                t[e] = [360 * (i.x + u) / o - 180, 360 / Math.PI * Math.atan(Math.exp(r * Math.PI / 180)) - 90]
            }
        }
        switch (this.type) {
        case 1:
            var d = [];
            for (r = 0; r < f.length; r++)
                d[r] = f[r][0];
            c(f = d);
            break;
        case 2:
            for (r = 0; r < f.length; r++)
                c(f[r]);
            break;
        case 3:
            for (f = function(t) {
                var e = t.length;
                if (e <= 1)
                    return [t];
                for (var i, r, n = [], s = 0; s < e; s++) {
                    var o = a(t[s]);
                    0 !== o && (void 0 === r && (r = o < 0),
                    r === o < 0 ? (i && n.push(i),
                    i = [t[s]]) : i.push(t[s]))
                }
                i && n.push(i);
                return n
            }(f),
            r = 0; r < f.length; r++)
                for (n = 0; n < f[r].length; n++)
                    c(f[r][n])
        }
        1 === f.length ? f = f[0] : l = "Multi" + l;
        var p = {
            type: "Feature",
            geometry: {
                type: l,
                coordinates: f
            },
            properties: this.properties
        };
        return "id"in this && (p.id = this.id),
        p
    }
    ;
    var u = n
      , h = f;
    function f(t, e) {
        this.version = 1,
        this.name = null,
        this.extent = 4096,
        this.length = 0,
        this._pbf = t,
        this._keys = [],
        this._values = [],
        this._features = [],
        t.readFields(l, this, e),
        this.length = this._features.length
    }
    function l(t, e, i) {
        15 === t ? e.version = i.readVarint() : 1 === t ? e.name = i.readString() : 5 === t ? e.extent = i.readVarint() : 2 === t ? e._features.push(i.pos) : 3 === t ? e._keys.push(i.readString()) : 4 === t && e._values.push(function(t) {
            var e = null
              , i = t.readVarint() + t.pos;
            for (; t.pos < i; ) {
                var r = t.readVarint() >> 3;
                e = 1 === r ? t.readString() : 2 === r ? t.readFloat() : 3 === r ? t.readDouble() : 4 === r ? t.readVarint64() : 5 === r ? t.readVarint() : 6 === r ? t.readSVarint() : 7 === r ? t.readBoolean() : null
            }
            return e
        }(i))
    }
    f.prototype.feature = function(t) {
        if (t < 0 || t >= this._features.length)
            throw new Error("feature index out of bounds");
        this._pbf.pos = this._features[t];
        var e = this._pbf.readVarint() + this._pbf.pos;
        return new u(this._pbf,e,this.extent,this._keys,this._values)
    }
    ;
    var c = h
      , d = function(t, e) {
        this.layers = t.readFields(p, {}, e)
    };
    function p(t, e, i) {
        if (3 === t) {
            var r = new c(i,i.readVarint() + i.pos);
            r.length && (e[r.name] = r)
        }
    }
    var y = d
      , v = n;
    var w, g = Object.freeze((function(e, i, r, n, s) {
        var o = new t.Layer(s)
          , a = t.SVG.create("path")
          , u = v.types[e.type];
        s = t.extend({}, s),
        o.feature = e,
        o.layerName = i,
        o.properties = e.properties,
        o.addTo = function(t) {
            o._map = t,
            o.addInteractiveTarget(a)
        }
        ,
        o.removeFrom = function() {
            o.removeInteractiveTarget(a),
            delete o._map
        }
        ,
        o.setStyle = function(e) {
            var i = a;
            return (e = t.extend({}, "Polygon" === u ? t.Polygon.prototype.options : t.Path.prototype.options, e)).stroke ? (i.setAttribute("stroke", e.color),
            i.setAttribute("stroke-opacity", e.opacity),
            i.setAttribute("stroke-width", e.weight),
            i.setAttribute("stroke-linecap", e.lineCap),
            i.setAttribute("stroke-linejoin", e.lineJoin),
            e.dashArray ? i.setAttribute("stroke-dasharray", e.dashArray) : i.removeAttribute("stroke-dasharray"),
            e.dashOffset ? i.setAttribute("stroke-dashoffset", e.dashOffset) : i.removeAttribute("stroke-dashoffset")) : i.setAttribute("stroke", "none"),
            e.fill ? (i.setAttribute("fill", e.fillColor || e.color),
            i.setAttribute("fill-opacity", e.fillOpacity),
            i.setAttribute("fill-rule", e.fillRule || "evenodd")) : i.setAttribute("fill", "none"),
            e.interactive ? (i.setAttribute("pointer-events", "auto"),
            t.DomUtil.addClass(i, "leaflet-interactive")) : (t.DomUtil.removeClass(i, "leaflet-interactive"),
            i.removeAttribute("pointer-events")),
            i
        }
        ;
        var h = function(e) {
            return t.point(e).scaleBy(n)
        };
        switch (o.bbox = function() {
            var i = e.bbox()
              , r = i[0]
              , n = i[1]
              , s = i[2]
              , o = i[3];
            return t.bounds(h([r, n]), h([s, o]))
        }
        ,
        u) {
        case "Point":
            break;
        case "LineString":
        case "Polygon":
            a.setAttribute("d", t.SVG.pointsToPath(e.loadGeometry().map((function(t) {
                return t.map(h)
            }
            )), "Polygon" === u)),
            s.className && t.DomUtil.addClass(a, s.className),
            o.setStyle(s),
            r.appendChild(a)
        }
        return o
    }
    )), x = Object.freeze((function(e, i) {
        var coords = e;
        var r = {}
          , n = i.getTileSize()
          , s = t.SVG.create("svg")
          , o = t.SVG.create("g")
          , a = [];
        function u(t, e, r) {
            var n = i.getFeatureStyle(t, e, coords.z);
            if (n) {
                var s = g(t, e, o, r, n);
                a.push(s),
                i.addFeatureLayer(s)
            }
        }
        return s.setAttribute("viewBox", "0 0 " + n.x + " " + n.y),
        s.appendChild(o),
        r.addVectorTile = function(t) {
            return Object.keys(t.layers).forEach((function(e) {
                for (var i = t.layers[e], r = n.divideBy(i.extent), s = 0; s !== i.length; )
                    u(i.feature(s), e, r),
                    s += 1
            }
            )),
            r
        }
        ,
        r.global = function(t) {
            return e.scaleBy(n).add(t)
        }
        ,
        r.eachFeatureLayer = function(t) {
            return a.forEach((function() {
                for (var e = [], i = arguments.length; i--; )
                    e[i] = arguments[i];
                return t.apply(void 0, e.concat([r]))
            }
            ))
        }
        ,
        r.domElement = function() {
            return s
        }
        ,
        r.coords = function() {
            return e
        }
        ,
        r
    }
    ));
    w = "function" == typeof window.fetch ? window.fetch : function(t) {
        var e = new XMLHttpRequest;
        return e.open("GET", t),
        e.responseType = "arraybuffer",
        new Promise((function(t) {
            e.onload = function() {
                return t({
                    ok: 200 === e.status,
                    status: e.status,
                    statusText: e.statusText,
                    arrayBuffer: function() {
                        return e.response
                    }
                })
            }
            ,
            e.send()
        }
        ))
    }
    ;
    var b = Object.freeze(w)
      , m = {
        /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
        read: function(t, e, i, r, n) {
            var s, o, a = 8 * n - r - 1, u = (1 << a) - 1, h = u >> 1, f = -7, l = i ? n - 1 : 0, c = i ? -1 : 1, d = t[e + l];
            for (l += c,
            s = d & (1 << -f) - 1,
            d >>= -f,
            f += a; f > 0; s = 256 * s + t[e + l],
            l += c,
            f -= 8)
                ;
            for (o = s & (1 << -f) - 1,
            s >>= -f,
            f += r; f > 0; o = 256 * o + t[e + l],
            l += c,
            f -= 8)
                ;
            if (0 === s)
                s = 1 - h;
            else {
                if (s === u)
                    return o ? NaN : 1 / 0 * (d ? -1 : 1);
                o += Math.pow(2, r),
                s -= h
            }
            return (d ? -1 : 1) * o * Math.pow(2, s - r)
        },
        write: function(t, e, i, r, n, s) {
            var o, a, u, h = 8 * s - n - 1, f = (1 << h) - 1, l = f >> 1, c = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = r ? 0 : s - 1, p = r ? 1 : -1, y = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
            for (e = Math.abs(e),
            isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0,
            o = f) : (o = Math.floor(Math.log(e) / Math.LN2),
            e * (u = Math.pow(2, -o)) < 1 && (o--,
            u *= 2),
            (e += o + l >= 1 ? c / u : c * Math.pow(2, 1 - l)) * u >= 2 && (o++,
            u /= 2),
            o + l >= f ? (a = 0,
            o = f) : o + l >= 1 ? (a = (e * u - 1) * Math.pow(2, n),
            o += l) : (a = e * Math.pow(2, l - 1) * Math.pow(2, n),
            o = 0)); n >= 8; t[i + d] = 255 & a,
            d += p,
            a /= 256,
            n -= 8)
                ;
            for (o = o << n | a,
            h += n; h > 0; t[i + d] = 255 & o,
            d += p,
            o /= 256,
            h -= 8)
                ;
            t[i + d - p] |= 128 * y
        }
    }
      , F = V
      , S = m;
    function V(t) {
        this.buf = ArrayBuffer.isView && ArrayBuffer.isView(t) ? t : new Uint8Array(t || 0),
        this.pos = 0,
        this.type = 0,
        this.length = this.buf.length
    }
    V.Varint = 0,
    V.Fixed64 = 1,
    V.Bytes = 2,
    V.Fixed32 = 5;
    var _ = 4294967296
      , M = 1 / _
      , B = "undefined" == typeof TextDecoder ? null : new TextDecoder("utf8");
    function k(t) {
        return t.type === V.Bytes ? t.readVarint() + t.pos : t.pos + 1
    }
    function P(t, e, i) {
        return i ? 4294967296 * e + (t >>> 0) : 4294967296 * (e >>> 0) + (t >>> 0)
    }
    function T(t, e, i) {
        var r = e <= 16383 ? 1 : e <= 2097151 ? 2 : e <= 268435455 ? 3 : Math.floor(Math.log(e) / (7 * Math.LN2));
        i.realloc(r);
        for (var n = i.pos - 1; n >= t; n--)
            i.buf[n + r] = i.buf[n]
    }
    function A(t, e) {
        for (var i = 0; i < t.length; i++)
            e.writeVarint(t[i])
    }
    function D(t, e) {
        for (var i = 0; i < t.length; i++)
            e.writeSVarint(t[i])
    }
    function L(t, e) {
        for (var i = 0; i < t.length; i++)
            e.writeFloat(t[i])
    }
    function z(t, e) {
        for (var i = 0; i < t.length; i++)
            e.writeDouble(t[i])
    }
    function E(t, e) {
        for (var i = 0; i < t.length; i++)
            e.writeBoolean(t[i])
    }
    function O(t, e) {
        for (var i = 0; i < t.length; i++)
            e.writeFixed32(t[i])
    }
    function N(t, e) {
        for (var i = 0; i < t.length; i++)
            e.writeSFixed32(t[i])
    }
    function C(t, e) {
        for (var i = 0; i < t.length; i++)
            e.writeFixed64(t[i])
    }
    function U(t, e) {
        for (var i = 0; i < t.length; i++)
            e.writeSFixed64(t[i])
    }
    function j(t, e) {
        return (t[e] | t[e + 1] << 8 | t[e + 2] << 16) + 16777216 * t[e + 3]
    }
    function G(t, e, i) {
        t[i] = e,
        t[i + 1] = e >>> 8,
        t[i + 2] = e >>> 16,
        t[i + 3] = e >>> 24
    }
    function Z(t, e) {
        return (t[e] | t[e + 1] << 8 | t[e + 2] << 16) + (t[e + 3] << 24)
    }
    function R(t) {
        return b(t).then((function(e) {
            if (e.ok)
                return e.arrayBuffer();
            if (404 !== e.status)
                throw function() {
                    for (var t = [], e = arguments.length; e--; )
                        t[e] = arguments[e];
                    return new Error(t.join(": "))
                }(t, e.status, e.statusText)
        }
        ))
    }
    function q(t) {
        return t.x + "|" + t.y + "|" + t.z
    }
    V.prototype = {
        destroy: function() {
            this.buf = null
        },
        readFields: function(t, e, i) {
            for (i = i || this.length; this.pos < i; ) {
                var r = this.readVarint()
                  , n = r >> 3
                  , s = this.pos;
                this.type = 7 & r,
                t(n, e, this),
                this.pos === s && this.skip(r)
            }
            return e
        },
        readMessage: function(t, e) {
            return this.readFields(t, e, this.readVarint() + this.pos)
        },
        readFixed32: function() {
            var t = j(this.buf, this.pos);
            return this.pos += 4,
            t
        },
        readSFixed32: function() {
            var t = Z(this.buf, this.pos);
            return this.pos += 4,
            t
        },
        readFixed64: function() {
            var t = j(this.buf, this.pos) + j(this.buf, this.pos + 4) * _;
            return this.pos += 8,
            t
        },
        readSFixed64: function() {
            var t = j(this.buf, this.pos) + Z(this.buf, this.pos + 4) * _;
            return this.pos += 8,
            t
        },
        readFloat: function() {
            var t = S.read(this.buf, this.pos, !0, 23, 4);
            return this.pos += 4,
            t
        },
        readDouble: function() {
            var t = S.read(this.buf, this.pos, !0, 52, 8);
            return this.pos += 8,
            t
        },
        readVarint: function(t) {
            var e, i, r = this.buf;
            return e = 127 & (i = r[this.pos++]),
            i < 128 ? e : (e |= (127 & (i = r[this.pos++])) << 7,
            i < 128 ? e : (e |= (127 & (i = r[this.pos++])) << 14,
            i < 128 ? e : (e |= (127 & (i = r[this.pos++])) << 21,
            i < 128 ? e : function(t, e, i) {
                var r, n, s = i.buf;
                if (n = s[i.pos++],
                r = (112 & n) >> 4,
                n < 128)
                    return P(t, r, e);
                if (n = s[i.pos++],
                r |= (127 & n) << 3,
                n < 128)
                    return P(t, r, e);
                if (n = s[i.pos++],
                r |= (127 & n) << 10,
                n < 128)
                    return P(t, r, e);
                if (n = s[i.pos++],
                r |= (127 & n) << 17,
                n < 128)
                    return P(t, r, e);
                if (n = s[i.pos++],
                r |= (127 & n) << 24,
                n < 128)
                    return P(t, r, e);
                if (n = s[i.pos++],
                r |= (1 & n) << 31,
                n < 128)
                    return P(t, r, e);
                throw new Error("Expected varint not more than 10 bytes")
            }(e |= (15 & (i = r[this.pos])) << 28, t, this))))
        },
        readVarint64: function() {
            return this.readVarint(!0)
        },
        readSVarint: function() {
            var t = this.readVarint();
            return t % 2 == 1 ? (t + 1) / -2 : t / 2
        },
        readBoolean: function() {
            return Boolean(this.readVarint())
        },
        readString: function() {
            var t = this.readVarint() + this.pos
              , e = this.pos;
            return this.pos = t,
            t - e >= 12 && B ? function(t, e, i) {
                return B.decode(t.subarray(e, i))
            }(this.buf, e, t) : function(t, e, i) {
                var r = ""
                  , n = e;
                for (; n < i; ) {
                    var s, o, a, u = t[n], h = null, f = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
                    if (n + f > i)
                        break;
                    1 === f ? u < 128 && (h = u) : 2 === f ? 128 == (192 & (s = t[n + 1])) && (h = (31 & u) << 6 | 63 & s) <= 127 && (h = null) : 3 === f ? (s = t[n + 1],
                    o = t[n + 2],
                    128 == (192 & s) && 128 == (192 & o) && ((h = (15 & u) << 12 | (63 & s) << 6 | 63 & o) <= 2047 || h >= 55296 && h <= 57343) && (h = null)) : 4 === f && (s = t[n + 1],
                    o = t[n + 2],
                    a = t[n + 3],
                    128 == (192 & s) && 128 == (192 & o) && 128 == (192 & a) && ((h = (15 & u) << 18 | (63 & s) << 12 | (63 & o) << 6 | 63 & a) <= 65535 || h >= 1114112) && (h = null)),
                    null === h ? (h = 65533,
                    f = 1) : h > 65535 && (h -= 65536,
                    r += String.fromCharCode(h >>> 10 & 1023 | 55296),
                    h = 56320 | 1023 & h),
                    r += String.fromCharCode(h),
                    n += f
                }
                return r
            }(this.buf, e, t)
        },
        readBytes: function() {
            var t = this.readVarint() + this.pos
              , e = this.buf.subarray(this.pos, t);
            return this.pos = t,
            e
        },
        readPackedVarint: function(t, e) {
            if (this.type !== V.Bytes)
                return t.push(this.readVarint(e));
            var i = k(this);
            for (t = t || []; this.pos < i; )
                t.push(this.readVarint(e));
            return t
        },
        readPackedSVarint: function(t) {
            if (this.type !== V.Bytes)
                return t.push(this.readSVarint());
            var e = k(this);
            for (t = t || []; this.pos < e; )
                t.push(this.readSVarint());
            return t
        },
        readPackedBoolean: function(t) {
            if (this.type !== V.Bytes)
                return t.push(this.readBoolean());
            var e = k(this);
            for (t = t || []; this.pos < e; )
                t.push(this.readBoolean());
            return t
        },
        readPackedFloat: function(t) {
            if (this.type !== V.Bytes)
                return t.push(this.readFloat());
            var e = k(this);
            for (t = t || []; this.pos < e; )
                t.push(this.readFloat());
            return t
        },
        readPackedDouble: function(t) {
            if (this.type !== V.Bytes)
                return t.push(this.readDouble());
            var e = k(this);
            for (t = t || []; this.pos < e; )
                t.push(this.readDouble());
            return t
        },
        readPackedFixed32: function(t) {
            if (this.type !== V.Bytes)
                return t.push(this.readFixed32());
            var e = k(this);
            for (t = t || []; this.pos < e; )
                t.push(this.readFixed32());
            return t
        },
        readPackedSFixed32: function(t) {
            if (this.type !== V.Bytes)
                return t.push(this.readSFixed32());
            var e = k(this);
            for (t = t || []; this.pos < e; )
                t.push(this.readSFixed32());
            return t
        },
        readPackedFixed64: function(t) {
            if (this.type !== V.Bytes)
                return t.push(this.readFixed64());
            var e = k(this);
            for (t = t || []; this.pos < e; )
                t.push(this.readFixed64());
            return t
        },
        readPackedSFixed64: function(t) {
            if (this.type !== V.Bytes)
                return t.push(this.readSFixed64());
            var e = k(this);
            for (t = t || []; this.pos < e; )
                t.push(this.readSFixed64());
            return t
        },
        skip: function(t) {
            var e = 7 & t;
            if (e === V.Varint)
                for (; this.buf[this.pos++] > 127; )
                    ;
            else if (e === V.Bytes)
                this.pos = this.readVarint() + this.pos;
            else if (e === V.Fixed32)
                this.pos += 4;
            else {
                if (e !== V.Fixed64)
                    throw new Error("Unimplemented type: " + e);
                this.pos += 8
            }
        },
        writeTag: function(t, e) {
            this.writeVarint(t << 3 | e)
        },
        realloc: function(t) {
            for (var e = this.length || 16; e < this.pos + t; )
                e *= 2;
            if (e !== this.length) {
                var i = new Uint8Array(e);
                i.set(this.buf),
                this.buf = i,
                this.length = e
            }
        },
        finish: function() {
            return this.length = this.pos,
            this.pos = 0,
            this.buf.subarray(0, this.length)
        },
        writeFixed32: function(t) {
            this.realloc(4),
            G(this.buf, t, this.pos),
            this.pos += 4
        },
        writeSFixed32: function(t) {
            this.realloc(4),
            G(this.buf, t, this.pos),
            this.pos += 4
        },
        writeFixed64: function(t) {
            this.realloc(8),
            G(this.buf, -1 & t, this.pos),
            G(this.buf, Math.floor(t * M), this.pos + 4),
            this.pos += 8
        },
        writeSFixed64: function(t) {
            this.realloc(8),
            G(this.buf, -1 & t, this.pos),
            G(this.buf, Math.floor(t * M), this.pos + 4),
            this.pos += 8
        },
        writeVarint: function(t) {
            (t = +t || 0) > 268435455 || t < 0 ? function(t, e) {
                var i, r;
                t >= 0 ? (i = t % 4294967296 | 0,
                r = t / 4294967296 | 0) : (r = ~(-t / 4294967296),
                4294967295 ^ (i = ~(-t % 4294967296)) ? i = i + 1 | 0 : (i = 0,
                r = r + 1 | 0));
                if (t >= 0x10000000000000000 || t < -0x10000000000000000)
                    throw new Error("Given varint doesn't fit into 10 bytes");
                e.realloc(10),
                function(t, e, i) {
                    i.buf[i.pos++] = 127 & t | 128,
                    t >>>= 7,
                    i.buf[i.pos++] = 127 & t | 128,
                    t >>>= 7,
                    i.buf[i.pos++] = 127 & t | 128,
                    t >>>= 7,
                    i.buf[i.pos++] = 127 & t | 128,
                    t >>>= 7,
                    i.buf[i.pos] = 127 & t
                }(i, 0, e),
                function(t, e) {
                    var i = (7 & t) << 4;
                    if (e.buf[e.pos++] |= i | ((t >>>= 3) ? 128 : 0),
                    !t)
                        return;
                    if (e.buf[e.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0),
                    !t)
                        return;
                    if (e.buf[e.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0),
                    !t)
                        return;
                    if (e.buf[e.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0),
                    !t)
                        return;
                    if (e.buf[e.pos++] = 127 & t | ((t >>>= 7) ? 128 : 0),
                    !t)
                        return;
                    e.buf[e.pos++] = 127 & t
                }(r, e)
            }(t, this) : (this.realloc(4),
            this.buf[this.pos++] = 127 & t | (t > 127 ? 128 : 0),
            t <= 127 || (this.buf[this.pos++] = 127 & (t >>>= 7) | (t > 127 ? 128 : 0),
            t <= 127 || (this.buf[this.pos++] = 127 & (t >>>= 7) | (t > 127 ? 128 : 0),
            t <= 127 || (this.buf[this.pos++] = t >>> 7 & 127))))
        },
        writeSVarint: function(t) {
            this.writeVarint(t < 0 ? 2 * -t - 1 : 2 * t)
        },
        writeBoolean: function(t) {
            this.writeVarint(Boolean(t))
        },
        writeString: function(t) {
            t = String(t),
            this.realloc(4 * t.length),
            this.pos++;
            var e = this.pos;
            this.pos = function(t, e, i) {
                for (var r, n, s = 0; s < e.length; s++) {
                    if ((r = e.charCodeAt(s)) > 55295 && r < 57344) {
                        if (!n) {
                            r > 56319 || s + 1 === e.length ? (t[i++] = 239,
                            t[i++] = 191,
                            t[i++] = 189) : n = r;
                            continue
                        }
                        if (r < 56320) {
                            t[i++] = 239,
                            t[i++] = 191,
                            t[i++] = 189,
                            n = r;
                            continue
                        }
                        r = n - 55296 << 10 | r - 56320 | 65536,
                        n = null
                    } else
                        n && (t[i++] = 239,
                        t[i++] = 191,
                        t[i++] = 189,
                        n = null);
                    r < 128 ? t[i++] = r : (r < 2048 ? t[i++] = r >> 6 | 192 : (r < 65536 ? t[i++] = r >> 12 | 224 : (t[i++] = r >> 18 | 240,
                    t[i++] = r >> 12 & 63 | 128),
                    t[i++] = r >> 6 & 63 | 128),
                    t[i++] = 63 & r | 128)
                }
                return i
            }(this.buf, t, this.pos);
            var i = this.pos - e;
            i >= 128 && T(e, i, this),
            this.pos = e - 1,
            this.writeVarint(i),
            this.pos += i
        },
        writeFloat: function(t) {
            this.realloc(4),
            S.write(this.buf, t, this.pos, !0, 23, 4),
            this.pos += 4
        },
        writeDouble: function(t) {
            this.realloc(8),
            S.write(this.buf, t, this.pos, !0, 52, 8),
            this.pos += 8
        },
        writeBytes: function(t) {
            var e = t.length;
            this.writeVarint(e),
            this.realloc(e);
            for (var i = 0; i < e; i++)
                this.buf[this.pos++] = t[i]
        },
        writeRawMessage: function(t, e) {
            this.pos++;
            var i = this.pos;
            t(e, this);
            var r = this.pos - i;
            r >= 128 && T(i, r, this),
            this.pos = i - 1,
            this.writeVarint(r),
            this.pos += r
        },
        writeMessage: function(t, e, i) {
            this.writeTag(t, V.Bytes),
            this.writeRawMessage(e, i)
        },
        writePackedVarint: function(t, e) {
            e.length && this.writeMessage(t, A, e)
        },
        writePackedSVarint: function(t, e) {
            e.length && this.writeMessage(t, D, e)
        },
        writePackedBoolean: function(t, e) {
            e.length && this.writeMessage(t, E, e)
        },
        writePackedFloat: function(t, e) {
            e.length && this.writeMessage(t, L, e)
        },
        writePackedDouble: function(t, e) {
            e.length && this.writeMessage(t, z, e)
        },
        writePackedFixed32: function(t, e) {
            e.length && this.writeMessage(t, O, e)
        },
        writePackedSFixed32: function(t, e) {
            e.length && this.writeMessage(t, N, e)
        },
        writePackedFixed64: function(t, e) {
            e.length && this.writeMessage(t, C, e)
        },
        writePackedSFixed64: function(t, e) {
            e.length && this.writeMessage(t, U, e)
        },
        writeBytesField: function(t, e) {
            this.writeTag(t, V.Bytes),
            this.writeBytes(e)
        },
        writeFixed32Field: function(t, e) {
            this.writeTag(t, V.Fixed32),
            this.writeFixed32(e)
        },
        writeSFixed32Field: function(t, e) {
            this.writeTag(t, V.Fixed32),
            this.writeSFixed32(e)
        },
        writeFixed64Field: function(t, e) {
            this.writeTag(t, V.Fixed64),
            this.writeFixed64(e)
        },
        writeSFixed64Field: function(t, e) {
            this.writeTag(t, V.Fixed64),
            this.writeSFixed64(e)
        },
        writeVarintField: function(t, e) {
            this.writeTag(t, V.Varint),
            this.writeVarint(e)
        },
        writeSVarintField: function(t, e) {
            this.writeTag(t, V.Varint),
            this.writeSVarint(e)
        },
        writeStringField: function(t, e) {
            this.writeTag(t, V.Bytes),
            this.writeString(e)
        },
        writeFloatField: function(t, e) {
            this.writeTag(t, V.Fixed32),
            this.writeFloat(e)
        },
        writeDoubleField: function(t, e) {
            this.writeTag(t, V.Fixed64),
            this.writeDouble(e)
        },
        writeBooleanField: function(t, e) {
            this.writeVarintField(t, Boolean(e))
        }
    };
    var I = {
        filter: void 0,
        minZoom: 0,
        maxZoom: 18,
        maxDetailZoom: void 0,
        minDetailZoom: void 0,
        subdomains: "abc",
        zoomOffset: 0,
        zoomReverse: !1
    }
      , W = Object.freeze((function(e, i) {
        var r = new t.GridLayer(i)
          , n = Object.getPrototypeOf(r)
          , s = {};
        "string" == typeof (i = t.Util.extend({}, I, i)).subdomains && (i.subdomains = i.subdomains.split("")),
        i.vectorTileLayerStyles && (i.style = function(t, e, r) {
            var n = i.getFeatureId
              , o = i.vectorTileLayerStyles[e];
            if (n) {
                var a = n(t);
                s[a] && (o = s[a])
            }
            if ("function" == typeof o && (o = o(t.properties, r)),
            Array.isArray(o)) {
                if (!o.length)
                    return;
                o = o[0]
            }
            return o
        }
        );
        var o, a, u = {};
        function h() {
            a = o.getZoom()
        }
        function f(t) {
            var e = i.minDetailZoom
              , r = i.maxDetailZoom;
            return void 0 !== e && t < e ? e : void 0 !== r && r < t ? r : t
        }
        function l(t) {
            Object.keys(u).forEach((function(e) {
                return u[e].eachFeatureLayer(t)
            }
            ))
        }
        return r.on("tileunload", (function(t) {
            var e = q(t.coords)
              , i = u[e];
            i && (i.eachFeatureLayer((function(t) {
                return r.removeFeatureLayer(t)
            }
            )),
            delete u[e])
        }
        )),
        r.onAdd = function(t) {
            for (var e, i = [], s = arguments.length - 1; s-- > 0; )
                i[s] = arguments[s + 1];
            return (o = t).on("zoomend", h),
            h(),
            (e = n.onAdd).call.apply(e, [r, t].concat(i))
        }
        ,
        r.onRemove = function() {
            for (var t, e = [], i = arguments.length; i--; )
                e[i] = arguments[i];
            return o.off("zoomend", h),
            o = void 0,
            (t = n.onRemove).call.apply(t, [r].concat(e))
        }
        ,
        r.createTile = function(t, e) {
            var i = q(t)
              , n = x(t, r);
            return u[i] = n,
            R(r.getTileUrl(t)).then((function(t) {
                n.addVectorTile(new y(new F(t))),
                e(null, n)
            }
            ), (function(t) {
                e(t, n)
            }
            )),
            n.domElement()
        }
        ,
        r.getTileUrl = function(n) {
            var s, a, u, h, l = {
                s: (u = n,
                h = Math.abs(u.x + u.y) % i.subdomains.length,
                i.subdomains[h]),
                x: n.x,
                y: n.y,
                z: (s = n.z,
                a = i.maxZoom,
                i.zoomReverse && (s = a - s),
                f(s + i.zoomOffset))
            };
            return o.options.crs.infinite || (l["-y"] = r._globalTileRange.max.y - n.y),
            t.Util.template(e, t.Util.extend(l, i))
        }
        ,
        r.setStyle = function(t) {
            return i.style = t,
            l((function(t) {
                var e = t.feature
                  , i = t.layerName
                  , n = r.getFeatureStyle(e, i);
                t.setStyle(n)
            }
            )),
            r
        }
        ,
        r.setFeatureStyle = function(t, e) {
            return s[t] = e,
            r.setStyle(i.style),
            r
        }
        ,
        r.resetFeatureStyle = function(t) {
            return delete s[t],
            r.setStyle(i.style),
            r
        }
        ,
        r.getTileSize = function() {
            var t = n.getTileSize.call(r)
              , e = r._tileZoom;
            return t.divideBy(o.getZoomScale(f(e), e)).round()
        }
        ,
        r.getFeatureStyle = function(t, e, zoom) {
            zoom = zoom === undefined ? a : zoom;
            if (!i.filter || i.filter(t, e, zoom)) {
                var r = i.style;
                return "function" == typeof r ? r(t, e, zoom) : r
            }
        }
        ,
        r.addFeatureLayer = function(t) {
            return t.addTo(o),
            t.addEventParent(r),
            r
        }
        ,
        r.removeFeatureLayer = function(t) {
            return t.removeEventParent(r),
            t.removeFrom(o),
            r
        }
        ,
        r.getBounds = function() {
            var e;
            return l((function(i, r, n, s) {
                var a = function(t) {
                    return o.unproject(s.global(t), s.coords().z)
                }
                  , u = i.bbox()
                  , h = t.latLngBounds(a(u.min), a(u.max));
                e ? e.extend(h) : e = h
            }
            )),
            e
        }
        ,
        r
    }
    ));
    return W
}
));
