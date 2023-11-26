/*!
 * VERSION: 1.6.5
 * DATE: 2020-09-20
 * https://leon-sans.com
 *
 * @license Copyright (c) 2019-2020, Jongmin Kim. All rights reserved.
 **/
var LeonSans = (function (t) {
  var r = {};
  function i(e) {
    if (r[e]) return r[e].exports;
    var a = (r[e] = { i: e, l: !1, exports: {} });
    return t[e].call(a.exports, a, a.exports, i), (a.l = !0), a.exports;
  }
  return (
    (i.m = t),
    (i.c = r),
    (i.d = function (t, r, e) {
      i.o(t, r) || Object.defineProperty(t, r, { enumerable: !0, get: e });
    }),
    (i.r = function (t) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(t, '__esModule', { value: !0 });
    }),
    (i.t = function (t, r) {
      if ((1 & r && (t = i(t)), 8 & r)) return t;
      if (4 & r && 'object' == typeof t && t && t.__esModule) return t;
      var e = Object.create(null);
      if (
        (i.r(e),
        Object.defineProperty(e, 'default', { enumerable: !0, value: t }),
        2 & r && 'string' != typeof t)
      )
        for (var a in t)
          i.d(
            e,
            a,
            function (r) {
              return t[r];
            }.bind(null, a),
          );
      return e;
    }),
    (i.n = function (t) {
      var r =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return i.d(r, 'a', r), r;
    }),
    (i.o = function (t, r) {
      return Object.prototype.hasOwnProperty.call(t, r);
    }),
    (i.p = ''),
    i((i.s = 0))
  );
})([
  function (t, r, i) {
    var e = i(1).default;
    t.exports = e;
  },
  function (t, r, i) {
    'use strict';
    i.r(r),
      i.d(r, 'default', function () {
        return Zt;
      });
    var e = 1,
      a = 2 * Math.PI;
    function s(t, r) {
      var i =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
        e = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0,
        a = 0.49 * t.rect.w * r,
        s = 0.49 * (t.rect.h + 220) * r;
      return { x: i, y: e, w: a, h: s };
    }
    function n(t, r, i) {
      return { x: t / 2, y: (r - 130 * 0.49 * i) / 2 };
    }
    function l(t, r, i) {
      return {
        r: r,
        cr: i,
        fr1: 1,
        fr2: 0.78,
        gx1: t.ratio.x1,
        gx2: t.ratio.x2,
        gy1: t.ratio.y1,
        gy2: t.ratio.y2,
      };
    }
    function f(t, r, i, e, a) {
      var s = ((e - a) / (r - i)) * (t - i) + a;
      return s < a ? (s = a) : s > e && (s = e), s;
    }
    function o(t) {
      var r,
        i,
        e,
        a,
        s,
        n,
        l,
        o,
        h,
        y,
        d,
        c = t.typo.p.length,
        p = [];
      for (r = 0; r < c; r++)
        for (a = (s = t.typo.p[r]).cv.length, i = 0; i < a; i++) {
          if (
            ((l = (n = s.cv[i]).addRect(t.rect)),
            (o = s.d),
            (y = (h = t.pointsLength.lengths[r]) / t.pointsLength.max),
            (d = 0),
            r > 0)
          )
            for (e = 0; e < r; e++)
              d += t.pointsLength.lengths[e] / t.pointsLength.max;
          (y += d),
            p.push({
              pos: l,
              drawing: t.drawing,
              direction: o,
              lengths: h,
              maxDrawing: y,
              minDrawing: d,
              closePath: n.ratio.c,
              stroke: (t, r) => {
                var i = f(r.drawing.value, r.maxDrawing, r.minDrawing, 1, 0);
                if (i > 0 && 'a' != r.pos.type) {
                  var e = r.lengths * i;
                  t.setLineDash([r.lengths]),
                    (t.lineDashOffset = r.direction * (e + r.lengths)),
                    t.stroke();
                }
              },
            });
        }
      return p;
    }
    function h(t, r) {
      var i,
        e,
        a = t.length,
        s = [];
      for (i = 0; i < a; i++) (e = t[i].addRect(r.rect)), s.push(e);
      return s;
    }
    function y(t, r) {
      var i,
        e,
        s,
        n = r.lines.length;
      for (i = 0; i < n; i++)
        'a' == (s = (e = r.lines[i]).pos).type
          ? (t.beginPath(),
            t.arc(s.x, s.y, s.radius * e.drawing.value, 0, a),
            t.fill(),
            t.closePath())
          : 'm' == s.type
            ? (t.beginPath(), t.moveTo(s.x, s.y))
            : 'l' == s.type
              ? (t.lineTo(s.x, s.y), e.stroke(t, e))
              : 'b' == s.type &&
                (t.bezierCurveTo(s.x, s.y, s.x2, s.y2, s.x3, s.y3),
                e.stroke(t, e));
    }
    function d(t, r) {
      t.save(), (t.lineWidth = 1);
      var i,
        e = r.lines.length;
      for (i = 0; i < e; i++) p(t, r.lines[i]);
      for (
        t.restore(), t.save(), t.lineWidth = 1, e = r.typo.p.length, i = 0;
        i < e;
        i++
      )
        c(t, r.typo.p[i], r);
      t.restore();
    }
    function c(t, r, i) {
      var e,
        s,
        n,
        l = r.v.length;
      for (e = 0; e < l; e++)
        (n = (s = r.cv[e]).addRect(i.rect)),
          'b' == s.type
            ? ((t.fillStyle = '#ff2a00'),
              t.beginPath(),
              t.arc(n.x3 + (n.x3 - n.x2), n.y3 + (n.y3 - n.y2), 1.5, 0, a),
              t.fill(),
              t.beginPath(),
              t.arc(n.x2, n.y2, 1.5, 0, a),
              t.fill(),
              t.beginPath(),
              t.moveTo(n.x2, n.y2),
              t.lineTo(n.x3, n.y3),
              t.lineTo(n.x3 + (n.x3 - n.x2), n.y3 + (n.y3 - n.y2)),
              t.stroke(),
              t.beginPath(),
              (t.fillStyle = '#ffffff'),
              t.arc(n.x3, n.y3, 2.5, 0, a),
              t.fill(),
              t.stroke())
            : (t.beginPath(),
              (t.fillStyle = '#ffffff'),
              (t.strokeStyle = '#ff2a00'),
              t.arc(n.x, n.y, 2.5, 0, a),
              t.fill(),
              t.stroke());
    }
    function p(t, r) {
      var i = r.pos;
      'a' != i.type &&
        ('m' == i.type
          ? ((t.strokeStyle = '#ff2a00'), t.beginPath(), t.moveTo(i.x, i.y))
          : 'l' == i.type
            ? t.lineTo(i.x, i.y)
            : 'b' == i.type &&
              t.bezierCurveTo(i.x, i.y, i.x2, i.y2, i.x3, i.y3),
        t.stroke());
    }
    function v(t, r) {
      t.save(), t.beginPath(), (t.lineWidth = 1), (t.strokeStyle = '#aaaaaa');
      var i,
        e,
        a = r.guide.length;
      for (i = 0; i < a; i++)
        (e = r.rect.y + r.grid[i]),
          t.moveTo(r.rect.x, e),
          t.lineTo(r.rect.x + r.rect.w, e);
      t.stroke(),
        (t.lineWidth = 1),
        t.beginPath(),
        (t.strokeStyle = '#aaaaaa'),
        t.rect(r.rect.x, r.rect.y, r.rect.w, r.rect.h),
        t.stroke(),
        t.restore();
    }
    var x,
      u = Math.cos,
      g = Math.sin;
    function b(t, r, i, e, s, n) {
      var l,
        f,
        o,
        h,
        y,
        d = r.wavePaths.length,
        c = (function (t, r) {
          return 120 * t * r;
        })(e, i),
        p = [];
      for (t.beginPath(), l = 0; l < d; l++) {
        if (((f = r.wavePaths[l]), n)) {
          var v = Math.random() * c - c / 2,
            x = Math.random() * c - c / 2;
          (f.rx = f.x + v * u(f.rotation)),
            (f.ry = f.y + v * g(f.rotation)),
            (f.sx = f.x + v),
            (f.sy = f.y + x);
        }
        'a' == f.type
          ? p.push(f)
          : 1 == f.start
            ? t.moveTo(f.x, f.y)
            : f.fix
              ? t.lineTo(f.x, f.y)
              : s < 110
                ? (o = r.wavePaths[l - 1]) &&
                  ((h = o.x + 0.5 * (f.x - o.x)),
                  (y = o.y + 0.5 * (f.y - o.y)),
                  t.quadraticCurveTo(h, y, f.rx, f.ry))
                : t.lineTo(f.rx, f.ry);
      }
      for (t.stroke(), l = 0; l < p.length; l++)
        (f = p[l]), t.beginPath(), t.arc(f.x, f.y, f.radius, 0, a), t.fill();
    }
    function S(t, r, i, e) {
      var s,
        n,
        l = Math.round(r.paths.length * r.drawing.value),
        f = i / 2,
        o = i / 3,
        h = e / 2;
      for (s = 0; s < l; s++)
        1 == (n = r.paths[s]).num
          ? (t.fillStyle = '#ff00c5')
          : (t.fillStyle = '#ff95f8'),
          'a' == n.type
            ? (t.beginPath(), t.arc(n.x, n.y, o, 0, a), t.fill())
            : (t.beginPath(),
              t.save(),
              t.translate(n.x, n.y),
              t.rotate(n.rotation),
              t.fillRect(-f, -h, i, e),
              t.restore());
    }
    function m(t, r, i, e) {
      var a = e.length,
        s = (r + a * (Math.abs((r / 10) | 0) + 1)) % a;
      if (Array.isArray(e[s])) {
        var n,
          l = 1 / ((a = e[s].length) + 1),
          f = t.createLinearGradient(
            i.rect.x,
            i.rect.y,
            i.rect.x,
            i.rect.y + i.rect.h,
          );
        for (f.addColorStop(l, e[s][0]), n = 0; n < a; n++)
          f.addColorStop(l * (n + 1), e[s][n]);
        f.addColorStop(l * (a + 1), e[s][a - 1]),
          (t.strokeStyle = f),
          (t.fillStyle = f);
      } else (t.strokeStyle = e[s]), (t.fillStyle = e[s]);
    }
    function O(t, r) {
      var i,
        e,
        a = t.typo.p.length,
        s = [],
        n = [],
        l = 0;
      for (e = 0; e < a; e++)
        (l += (i = J(t, t.typo.p[e].v, r)).l), s.push(i.v), n.push(i.l);
      return { max: l, lines: s, lengths: n };
    }
    function J(t, r, i) {
      var e,
        a,
        s,
        n,
        l,
        f,
        o = r.length,
        h = [],
        y = 0;
      for (e = 0; e < o; e++)
        (s = {}),
          (l = (a = r[e]).convert(t, i)),
          0 == e || 'a' == a.type
            ? ((s.x1 = l.x),
              (s.y1 = l.y),
              (s.distance = 0),
              (s.radius = l.radius))
            : ((n = f.convert(t, i)),
              'b' == f.type
                ? ((s.x1 = n.x3), (s.y1 = n.y3))
                : ((s.x1 = n.x), (s.y1 = n.y)),
              (s.x2 = l.x),
              (s.y2 = l.y),
              'b' == a.type
                ? ((s.x3 = l.x2),
                  (s.y3 = l.y2),
                  (s.x4 = l.x3),
                  (s.y4 = l.y3),
                  (s.distance = N(
                    s.x1,
                    s.y1,
                    s.x2,
                    s.y2,
                    s.x3,
                    s.y3,
                    s.x4,
                    s.y4,
                  )))
                : (s.distance = w(s.x1, s.y1, s.x2, s.y2))),
          (s.type = a.type),
          (s.rotation = a.ratio.r),
          (s.pat = a.ratio.p),
          (s.fix = a.ratio.f),
          (s.vt = a.ratio.v),
          h.push(s),
          (y += s.distance),
          (f = a);
      return { v: h, l: y };
    }
    function N(t, r, i, e, a, s, n, l, f) {
      var o,
        h,
        y,
        d,
        c = f || 40,
        p = 0,
        v = t,
        x = r;
      for (y = 1; y < c; y++)
        (o = (d = _(y / c, t, r, i, e, a, s, n, l)).x - v),
          (h = d.y - x),
          (p += Math.sqrt(o * o + h * h)),
          (v = d.x),
          (x = d.y);
      return (o = n - v), (h = l - x), (p += Math.sqrt(o * o + h * h));
    }
    function _(t, r, i, e, a, s, n, l, f) {
      return (
        (r += (e - r) * t),
        (i += (a - i) * t),
        {
          x:
            (r += ((e += (s - e) * t) - r) * t) +
            ((e += ((s += (l - s) * t) - e) * t) - r) * t,
          y:
            (i += ((a += (n - a) * t) - i) * t) +
            ((a += ((n += (f - n) * t) - a) * t) - i) * t,
        }
      );
    }
    function w(t, r, i, e) {
      var a = i - t,
        s = e - r;
      return Math.sqrt(a * a + s * s);
    }
    var P,
      W = -1;
    function k(t) {
      var r = (function () {
        ++W == P && (W = 0);
        return x[W];
      })();
      (t.fillStyle = r), (t.strokeStyle = r);
    }
    function D(t, r, i, e, a, s) {
      var n = i / e,
        l = f(a.drawing.value, s + n, s, 1, 0);
      if (
        (1 == r.direction && (l = f(1 - a.drawing.value, s, s + n, 1, 0)),
        l > 0)
      ) {
        var o = i * l;
        t.setLineDash([i]),
          (t.lineDashOffset = r.direction * (o + i)),
          t.stroke();
      }
      return n;
    }
    function T(t, r, i, e) {
      var a, s;
      if (1 == r.drawing.value)
        for (a = r.lines.length, s = 0; s < a; s++) I(t, r.lines[s], i, e);
      else
        for (a = r.drawingPaths.length * r.drawing.value, s = 0; s < a; s++)
          R(t, r.drawingPaths[s], i, e, r.drawing.value);
    }
    function I(t, r, i, e) {
      var a = r.pos;
      'a' == a.type
        ? (t.lineStyle(0, e, 0),
          t.beginFill(e),
          t.drawCircle(a.x, a.y, a.radius),
          t.endFill())
        : 'm' == a.type
          ? (t.lineStyle(i, e, 1), t.moveTo(a.x, a.y))
          : 'l' == a.type
            ? t.lineTo(a.x, a.y)
            : 'b' == a.type &&
              t.bezierCurveTo(a.x, a.y, a.x2, a.y2, a.x3, a.y3),
        r.closePath && t.closePath();
    }
    function R(t, r, i, e, a) {
      'a' == r.type
        ? (t.lineStyle(0, e, 0),
          t.beginFill(e),
          t.drawCircle(r.x, r.y, r.radius * a),
          t.endFill())
        : 1 == r.start
          ? (t.lineStyle(i, e, 1), t.moveTo(r.x, r.y))
          : t.lineTo(r.x, r.y, 1);
    }
    function F(t, r, i) {
      var e = i.length,
        a = (t + e * (Math.abs((t / 10) | 0) + 1)) % e;
      if (!Array.isArray(i[a])) return i[a];
    }
    function M(t, r) {
      var i,
        e,
        a,
        s = [];
      for (i = 0; i < 6; i++)
        (e = 10 * i + 20),
          (a = 10 * i + 90),
          (s[i] = {
            x1: 0.49 * e * r,
            x2: 0.49 * (t.rect.w - 2 * e) * r,
            y1: 0.49 * a * r,
            y2: 0.49 * (t.rect.h - a) * r - 10 * i * 0.49 * r,
          });
      return s;
    }
    function G(t, r) {
      var i,
        e = [],
        a = [98, 340, 815];
      for (i = 0; i < 3; i++) e[i] = 0.49 * a[i] * r;
      return e;
    }
    function z(t) {
      Object.assign(this, t);
    }
    function L(t) {
      (this.type = t[0]),
        (this.x = t[1] || 0),
        (this.y = t[2] || 0),
        'b' == this.type
          ? ((this.x2 = t[3] || 0),
            (this.y2 = t[4] || 0),
            (this.x3 = t[5] || 0),
            (this.y3 = t[6] || 0),
            null == t[7]
              ? (this.ratio = { x: 1, y: 1, r: 0, p: 0, f: 0, c: 0, v: 0 })
              : ((this.ratio = {}),
                (this.ratio.x = null == t[7].x ? 1 : t[7].x),
                (this.ratio.y = null == t[7].y ? 1 : t[7].y),
                (this.ratio.r = t[7].r || 0),
                (this.ratio.p = t[7].p || 0),
                (this.ratio.f = t[7].f || 0),
                (this.ratio.c = t[7].c || 0),
                (this.ratio.v = t[7].v || 0)))
          : null == t[3]
            ? (this.ratio = { x: 1, y: 1, r: 0, p: 0, f: 0, c: 0, v: 0 })
            : ((this.ratio = {}),
              (this.ratio.x = null == t[3].x ? 1 : t[3].x),
              (this.ratio.y = null == t[3].y ? 1 : t[3].y),
              (this.ratio.r = t[3].r || 0),
              (this.ratio.p = t[3].p || 0),
              (this.ratio.f = t[3].f || 0),
              (this.ratio.c = t[3].c || 0),
              (this.ratio.v = t[3].v || 0));
    }
    function j(t, r, i, e) {
      var a = r.range.r * i.x,
        s = (r.range.gx2 - r.range.gx1) * a + r.range.gx1,
        n = (r.range.fr2 - r.range.fr1) * a + r.range.fr1;
      return r.center.x + (t - s) * e.scale * n;
    }
    function C(t, r, i, e) {
      var a = r.range.r * i.y,
        s = (r.range.gy2 - r.range.gy1) * a + r.range.gy1,
        n = (r.range.fr2 - r.range.fr1) * a + r.range.fr1;
      return r.center.y + (t - s) * e.scale * n;
    }
    Object.assign(z.prototype, {
      addRect: function (t) {
        var r = new z(this);
        return (
          (r.x = this.x + t.x),
          (r.y = this.y + t.y),
          (r.x2 = this.x2 + t.x),
          (r.y2 = this.y2 + t.y),
          (r.x3 = this.x3 + t.x),
          (r.y3 = this.y3 + t.y),
          (r.rx = this.rx + t.x),
          (r.ry = this.ry + t.y),
          (r.sx = this.sx + t.x),
          (r.sy = this.sy + t.y),
          r.radius < 0.5 && (r.radius = 0.5),
          r
        );
      },
    }),
      Object.assign(L.prototype, {
        convert: function (t, r) {
          var i = j(this.x, t, this.ratio, r),
            e = C(this.y, t, this.ratio, r),
            a = j(this.x2, t, this.ratio, r),
            s = C(this.y2, t, this.ratio, r),
            n = j(this.x3, t, this.ratio, r),
            l = C(this.y3, t, this.ratio, r),
            f = (function (t, r, i) {
              var e = 0;
              'a' == t && (e = r.range.cr * i.scale * i.fontRatio);
              return e;
            })(this.type, t, r),
            o = new z(this);
          return (
            (o.x = i),
            (o.y = e),
            (o.x2 = a),
            (o.y2 = s),
            (o.x3 = n),
            (o.y3 = l),
            (o.radius = f),
            o
          );
        },
      });
    var A = null;
    function q(t, r, i, e) {
      var a,
        s,
        n,
        l,
        f,
        o = r.pointsLength.lines,
        h = t.scale,
        y = o.length,
        d = [],
        c = [],
        p = [];
      for (a = 0; a < y; a++) (l = o[a]), (A = null), d.push(X(l, i, h));
      for (y = d.length, a = 0; a < y; a++) {
        for (s = (f = d[a]).length, p = [], n = 0; n < s; n++)
          (l = f[n]).rotation != V && ((e && l.pat) || p.push(l));
        1 == r.typo.p[a].d && p.reverse(),
          p.length > 0 && ((p[0].start = 1), Array.prototype.push.apply(c, p));
      }
      return c;
    }
    function X(t, r, i) {
      var e,
        a,
        s,
        n,
        l,
        o,
        h,
        y = t.length,
        d = [],
        c = 1,
        p = 1;
      for (r > -1 && (p = f(r, 1, 0, 80, 10) * i), e = 0; e < y; e++)
        if ('a' == (n = t[e]).type)
          d.push(
            new z({
              x: n.x1,
              y: n.y1,
              rotation: 0,
              type: 'a',
              pat: n.pat,
              fix: n.fix,
              radius: n.radius,
            }),
          );
        else if (0 == n.distance)
          null !=
            (h = E(
              (l = new z({
                x: n.x1,
                y: n.y1,
                rotation: n.rotation,
                type: n.type,
                pat: n.pat,
                fix: n.fix,
              })),
              A,
              n,
              1,
            )) && (c && ((h.type = 'm'), (c = 0)), d.push(h)),
            (A = new z(l));
        else
          for (
            (s = Math.ceil(n.distance / p)) < 3 && (s = 3),
              n.vt && (s = 2),
              a = 1;
            a < s;
            a++
          )
            (o = a / (s - 1)),
              (l =
                'b' == n.type
                  ? B(n, o)
                  : new z({
                      x: n.x1 + (n.x2 - n.x1) * o,
                      y: n.y1 + (n.y2 - n.y1) * o,
                      type: n.type,
                    })),
              0 != n.rotation && 1 == o && (l.rotation = n.rotation),
              n.pat && 1 == o && (l.pat = n.pat),
              n.fix && 1 == o && (l.fix = n.fix),
              s > 0 &&
                null != (h = E(l, A, n, o)) &&
                (c && ((h.type = 'm'), (c = 0)), d.push(h)),
              (A = new z(l));
      return d;
    }
    function E(t, r, i, e) {
      if (
        ((t.type = i.type),
        (t.distance = i.distance),
        (t.num = e),
        r && null == t.rotation)
      ) {
        var a = t.x - r.x,
          s = t.y - r.y,
          n = Math.atan2(a, s);
        t.rotation = -n;
      } else t.rotation = t.rotation;
      return t.rotation == V ? null : t;
    }
    function B(t, r) {
      var i = H(t.x1, t.x2, t.x3, t.x4, r),
        e = H(t.y1, t.y2, t.y3, t.y4, r),
        a = K(t.x1, t.x2, t.x3, t.x4, r),
        s = K(t.y1, t.y2, t.y3, t.y4, r);
      return new z({ x: i, y: e, rotation: -Math.atan2(a, s) });
    }
    function H(t, r, i, e, a) {
      var s = a * a;
      return (
        t +
        (3 * -t + a * (3 * t - t * a)) * a +
        (3 * r + a * (-6 * r + 3 * r * a)) * a +
        (3 * i - 3 * i * a) * s +
        e * (s * a)
      );
    }
    function K(t, r, i, e, a) {
      return (
        3 * a * a * (3 * r - t - 3 * i + e) +
        6 * a * (t - 2 * r + i) +
        3 * (-t + r)
      );
    }
    var Q = (Math.PI / 180) * 180,
      U = (Math.PI / 180) * 90,
      V = -100;
    function Y(t, r, i, e, a, s, n, l) {
      var f,
        o = [],
        h = l.length;
      for (f = 0; f < h; f++) o.push({ d: l[f].d, v: Z(l[f].v, r, i) });
      return {
        rect: { w: t, h: 824, fw: r, fh: i },
        ratio: { x1: e, x2: a, y1: s, y2: n },
        p: o,
        clone: () => {
          for (var l = [], f = 0; f < o.length; f++)
            l[f] = { d: o[f].d, v: o[f].v };
          return {
            rect: { w: t, h: 824, fw: r, fh: i },
            ratio: { x1: e, x2: a, y1: s, y2: n },
            p: l,
          };
        },
      };
    }
    function Z(t, r, i) {
      var e,
        a,
        s = t.length,
        n = r / 2,
        l = i / 2,
        f = [];
      for (a = 0; a < s; a++)
        ((e = t[a])[1] -= n),
          (e[2] -= l),
          'b' == e[0] && ((e[3] -= n), (e[4] -= l), (e[5] -= n), (e[6] -= l)),
          f.push(new L(e));
      return f;
    }
    function $(t, r, i, e) {
      var a = t - i,
        s = r - e;
      return -Math.atan2(a, s);
    }
    function tt(t, r, i, e, a, s, n, l, f) {
      var o = K(t, i, a, n, f),
        h = K(r, e, s, l, f);
      return -Math.atan2(o, h);
    }
    var rt = [
        {
          d: -1,
          v: [
            ['m', 0, 352, { x: 0.55, y: 0.3, r: $(0, 352, 143.5, 0) }],
            ['l', 143.5, 0, { r: $(0, 352, 143.5, 0), f: 1 }],
            ['l', 146.5, 0, { r: $(290, 352, 146.5, 0), f: 1, v: 1 }],
            ['l', 290, 352, { x: 0.55, y: 0.3, f: 1 }],
          ],
        },
        {
          d: -1,
          v: [
            ['m', 47, 237, { r: U, p: 1 }],
            ['l', 243, 237, { r: U, p: 1, f: 1 }],
          ],
        },
      ],
      it = [
        {
          d: 1,
          v: [
            [
              'm',
              293.1,
              320.1,
              {
                r: tt(293.1, 320.1, 262.2, 345, 222.8, 360, 180, 360, 0),
                f: 1,
              },
            ],
            ['b', 262.2, 345, 222.8, 360, 180, 360],
            ['b', 80.6, 360, 0, 279.4, 0, 180],
            ['b', 0, 80.6, 80.6, 0, 180, 0],
            ['b', 222.8, 0, 262.2, 15, 293.1, 39.9],
          ],
        },
      ],
      et = [
        {
          d: -1,
          v: [
            ['m', 95, 352, { r: U, f: 1 }],
            ['b', 191.6, 352, 270, 271.6, 270, 175, { r: Q }],
            ['b', 270, 78.4, 191.6, 0, 95, 0, { r: U }],
            ['l', 0, 0, { r: Q, f: 1 }],
            ['l', 0, 352, { r: Q, f: 1 }],
            ['l', 95, 352, { r: U, f: 1 }],
          ],
        },
      ],
      at = [
        {
          d: -1,
          v: [
            ['m', 192, 0, { x: 0, r: U }],
            ['l', 0, 0, { r: Q, f: 1, x: 0.5 }],
            ['l', 0, 352, { f: 1, x: 0.5 }],
            ['l', 192, 352, { x: 0, r: U, f: 1 }],
          ],
        },
        {
          d: -1,
          v: [
            ['m', 0, 164, { r: U, p: 1, x: 0.5 }],
            ['l', 180, 164, { x: 0, r: U, f: 1 }],
          ],
        },
      ],
      st = [
        {
          d: 1,
          v: [
            ['m', 202, 180, { r: U, f: 1 }],
            ['l', 352, 180, { f: 1 }],
            ['b', 352, 279.4, 279.4, 360, 180, 360, { r: U }],
            ['b', 80.6, 360, 0, 279.4, 0, 180, { r: Q }],
            ['b', 0, 80.6, 80.6, 0, 180, 0, { r: U }],
            ['b', 222.8, 0, 262.1, 14.9, 293, 39.9],
          ],
        },
      ],
      nt = [
        {
          d: -1,
          v: [
            ['m', 0, 0, { y: 0, r: Q }],
            ['l', 0, 352, { y: 0, r: Q, f: 1 }],
          ],
        },
        {
          d: -1,
          v: [
            ['m', 232, 0, { y: 0, r: Q }],
            ['l', 232, 352, { y: 0, r: Q, f: 1 }],
          ],
        },
        {
          d: -1,
          v: [
            ['m', 0, 164, { r: U, p: 1 }],
            ['l', 232, 164, { r: U, f: 1, p: 1 }],
          ],
        },
      ],
      lt = [
        {
          d: 1,
          v: [
            ['m', 0, 352, { y: 0, r: Q, f: 1 }],
            ['l', 0, 0, { y: 0, r: Q }],
          ],
        },
      ],
      ft = [
        {
          d: 1,
          v: [
            [
              'm',
              0,
              311,
              { r: tt(0, 311, 16.2, 341.6, 49.3, 356, 86, 356, 0), f: 1 },
            ],
            ['b', 16.2, 341.6, 49.3, 356, 86, 356, { r: U }],
            ['b', 133.5, 356, 172, 317.5, 172, 270],
            ['l', 172.5, 0, { y: 0, r: Q }],
          ],
        },
      ],
      ot = [
        {
          d: -1,
          v: [
            ['m', 0, 352, { y: 0, r: Q }],
            ['l', 0, 0, { r: Q, f: 1 }],
            ['l', 3, 0, { r: Q, p: 1, f: 1, v: 1 }],
            ['l', 247, 351, { r: Q, p: 1, f: 1 }],
            ['l', 250, 351, { r: Q, f: 1, v: 1 }],
            ['l', 250, 0, { y: 0, r: Q, f: 1 }],
          ],
        },
      ],
      ht = [
        {
          d: 1,
          v: [
            ['m', 360, 180, { r: Q, p: 1, f: 1 }],
            ['b', 360, 279.4, 279.4, 360, 180, 360, { r: U }],
            ['b', 80.6, 360, 0, 279.4, 0, 180, { r: Q }],
            ['b', 0, 80.6, 80.6, 0, 180, 0, { r: U }],
            ['b', 279.4, 0, 360, 80.6, 360, 180, { r: Q, c: 1 }],
          ],
        },
      ],
      yt = [
        {
          d: 1,
          v: [
            [
              'm',
              0,
              295.4,
              { r: tt(0, 295.4, 17.6, 332.1, 58.3, 360, 110.3, 360, 0), f: 1 },
            ],
            ['b', 17.6, 332.1, 58.3, 360, 110.3, 360],
            ['b', 173.9, 360, 223.8, 329.6, 224, 271],
            ['b', 224.2, 214.7, 180.7, 189.6, 112.4, 173.3],
            ['b', 47.3, 157.7, 10.9, 130.6, 12, 84.4],
            ['b', 13.3, 29.8, 57.3, 0, 114.8, 0],
            ['b', 158.4, 0, 196.5, 20.5, 212, 51.3],
          ],
        },
      ],
      dt = [
        {
          d: 1,
          v: [
            ['m', 250, 0, { y: 0, r: Q }],
            ['l', 250, 231, { r: Q }],
            ['b', 250, 300, 194, 356, 125, 356, { r: U }],
            ['b', 56, 356, 0, 300, 0, 231, { r: Q }],
            ['l', 0, 0, { y: 0, r: Q }],
          ],
        },
      ],
      ct = [
        {
          d: -1,
          v: [
            ['m', 0, 0, { x: 0.6, y: 0.3, r: $(0, 0, 135, 186) }],
            ['l', 135, 186, { r: Q, f: 1 }],
            ['l', 270, 0, { x: 0.6, y: 0.3, f: 1 }],
          ],
        },
        {
          d: -1,
          v: [
            ['m', 135, 186, { r: Q, p: 1 }],
            ['l', 135, 352, { y: 0, f: 1 }],
          ],
        },
      ],
      pt = {
        A: Y(620, 290, 352, 0, 0, 0, 0, JSON.parse(JSON.stringify(rt))),
        B: Y(596, 209, 352, -10, -10, 0, 0, [
          {
            d: 1,
            v: [
              ['m', 0, 164, { r: U, p: 1 }],
              ['l', 116, 164, { r: U, p: 1, f: 1 }],
              ['b', 167.4, 164, 209, 205.6, 209, 257, { r: Q }],
              ['b', 209, 308.4, 167.4, 352, 116, 352, { r: U }],
              ['l', 0, 352, { r: Q, f: 1 }],
              ['l', 0, 0, { r: Q, f: 1 }],
              ['l', 116, 0, { r: U }],
              ['b', 161.3, 0, 198, 36.7, 198, 82, { r: Q }],
              ['b', 198, 127.3, 161.3, 164, 116, 164, { r: U }],
            ],
          },
        ]),
        C: Y(700, 293.1, 360, 0, 0, 0, 0, JSON.parse(JSON.stringify(it))),
        D: Y(721, 270, 352, -10, -10, 0, 0, JSON.parse(JSON.stringify(et))),
        E: Y(520, 192, 352, -5, -80, 0, 0, JSON.parse(JSON.stringify(at))),
        F: Y(510, 192, 352, -5, -80, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 192, 0, { x: 0, r: U }],
              ['l', 0, 0, { r: Q, f: 1, x: 0.5 }],
              ['l', 0, 352, { y: 0, f: 1, x: 0.5 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 0, 164, { r: U, p: 1, x: 0.5 }],
              ['l', 180, 164, { x: 0, r: U, f: 1 }],
            ],
          },
        ]),
        G: Y(840, 352, 360, 0, 0, 0, 0, JSON.parse(JSON.stringify(st))),
        H: Y(684, 232, 352, 0, 0, 0, 0, JSON.parse(JSON.stringify(nt))),
        I: Y(249, 0, 352, 0, 0, 0, 0, JSON.parse(JSON.stringify(lt))),
        J: Y(472, 172.5, 355.5, 10, 20, -2, -2, JSON.parse(JSON.stringify(ft))),
        K: Y(616, 232, 352, -10, -20, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { y: 0, r: Q }],
              ['l', 0, 352, { y: 0, r: Q, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 212, 0, { x: 0.7, y: 0.7, r: $(212, 0, 0, 162.5) }],
              ['l', 0, 162.5, { r: U, p: 1 }],
              ['l', 0, 165.5, { r: U, p: 1, v: 1 }],
              ['l', 232, 352, { x: 0.7, y: 0.7, f: 1 }],
            ],
          },
        ]),
        L: Y(529, 192, 352, -10, -20, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { y: 0 }],
              ['l', 0, 352, { f: 1 }],
              ['l', 192, 352, { x: 0, f: 1 }],
            ],
          },
        ]),
        M: Y(885, 330, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 352, { y: 0, r: Q }],
              ['l', 0, 0, { r: Q, f: 1 }],
              ['l', 3, 0, { r: Q, p: 1, f: 1, v: 1 }],
              ['l', 163.5, 330, { r: $(163.5, 330, 163.5, 330), f: 1 }],
              ['l', 166.5, 330, { r: $(166.5, 330, 327, 0), f: 1, v: 1 }],
              ['l', 327, 0, { r: Q, p: 1, f: 1 }],
              ['l', 330, 0, { r: Q, f: 1, v: 1 }],
              ['l', 330, 352, { y: 0, r: Q, f: 1 }],
            ],
          },
        ]),
        N: Y(721, 250, 352, 0, 0, 0, 0, JSON.parse(JSON.stringify(ot))),
        O: Y(850, 360, 360, 0, 0, 0, 0, JSON.parse(JSON.stringify(ht))),
        P: Y(568, 210, 352, -10, -10, -0.5, -0.5, [
          {
            d: 1,
            v: [
              ['m', 0, 352, { y: 0, f: 1 }],
              ['l', 0, 0, { f: 1 }],
              ['l', 117, 0, { r: U }],
              ['b', 168.4, 0, 210, 41.6, 210, 93, { r: Q }],
              ['b', 210, 144.4, 168.4, 186, 117, 186, { r: U }],
              ['l', 0, 186, { r: U, p: 1 }],
            ],
          },
        ]),
        Q: Y(850, 360, 360, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 360, 180, { r: U, p: 1, f: 1 }],
              ['b', 360, 80.6, 279.4, 0, 180, 0, { r: U }],
              ['b', 80.6, 0, 0, 80.6, 0, 180, { r: Q }],
              ['b', 0, 279.4, 80.6, 360, 180, 360, { r: U }],
              ['b', 279.4, 360, 360, 279.4, 360, 180, { r: Q, c: 1, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 222, 222, { x: 0.5, y: 0.5, r: $(222, 222, 360, 360) }],
              ['l', 360, 360, { x: 0.5, y: 0.5, f: 1 }],
            ],
          },
        ]),
        R: Y(634, 232, 352, -10, -10, -0.5, -0.5, [
          {
            d: -1,
            v: [
              ['m', 0, 186, { r: U, p: 1 }],
              ['l', 139, 186, { r: U }],
              ['b', 190.4, 186, 232, 144.4, 232, 93, { r: Q }],
              ['b', 232, 41.6, 190.4, 0, 139, 0, { r: U }],
              ['l', 0, 0, { r: Q, f: 1 }],
              ['l', 0, 352, { y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 139, 186, { p: 1, r: $(139, 186, 232, 352) }],
              ['l', 232, 352, { x: 0.5, y: 0.39, f: 1 }],
            ],
          },
        ]),
        S: Y(560, 224, 360, 0, 0, 0, 0, JSON.parse(JSON.stringify(yt))),
        T: Y(568, 232, 352, 0, 0, -0.5, -0.5, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: 0, r: U }],
              ['l', 232, 0, { x: 0, r: U, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 116, 0, { r: Q, p: 1 }],
              ['l', 116, 352, { y: 0, r: Q, f: 1 }],
            ],
          },
        ]),
        U: Y(712, 250, 355, 0, 0, -0.5, -0.5, JSON.parse(JSON.stringify(dt))),
        V: Y(650, 270, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: 0.6, y: 0.1, r: $(0, 0, 133.5, 352) }],
              ['l', 133.5, 352, { r: $(0, 0, 133.5, 352), f: 1 }],
              ['l', 136.5, 352, { r: $(136.5, 352, 270, 0), f: 1, v: 1 }],
              ['l', 270, 0, { x: 0.6, y: 0.1, f: 1 }],
            ],
          },
        ]),
        W: Y(894, 390, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: 0.6, y: 0.05, r: $(0, 0, 84.5, 352) }],
              ['l', 84.5, 352, { r: $(0, 0, 84.5, 352), f: 1 }],
              ['l', 87.5, 352, { r: $(87.5, 352, 193.5, 0), f: 1, v: 1 }],
              ['l', 193.5, 0, { r: $(87.5, 352, 193.5, 0), f: 1 }],
              ['l', 196.5, 0, { r: $(196.5, 0, 302.5, 352), f: 1, v: 1 }],
              ['l', 302.5, 352, { r: $(196.5, 0, 302.5, 352), f: 1 }],
              ['l', 305.5, 352, { r: $(305.5, 352, 390, 0), f: 1, v: 1 }],
              ['l', 390, 0, { x: 0.6, y: 0.05, f: 1 }],
            ],
          },
        ]),
        X: Y(660, 270, 352, 0, 0, 0, -7, [
          {
            d: -1,
            v: [
              ['m', 10, 0, { x: 0.5, y: 0.3, r: $(10, 0, 270, 352) }],
              ['l', 270, 352, { x: 0.5, y: 0.5, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 260, 0, { x: 0.5, y: 0.3, r: $(260, 0, 0, 352) }],
              ['l', 0, 352, { x: 0.5, y: 0.5, f: 1 }],
            ],
          },
        ]),
        Y: Y(673, 270, 352, 0, 0, 0, 0, JSON.parse(JSON.stringify(ct))),
        Z: Y(558, 232, 352, 0, -5, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 8, 0, { x: 0, r: U }],
              ['l', 224, 0, { r: U, f: 1 }],
              ['l', 224, 3, { r: Q, p: 1, v: 1 }],
              ['l', 0, 349, { r: Q, p: 1 }],
              ['l', 0, 352, { r: U, f: 1, v: 1 }],
              ['l', 232, 352, { x: 0, r: U, f: 1 }],
            ],
          },
        ]),
      },
      vt = [
        {
          d: -1,
          v: [
            ['m', 232, 8, { y: -3.4, r: Q }],
            ['l', 232, 116, { r: V }],
            ['b', 232, 180.1, 180.1, 232, 116, 232, { r: U }],
            ['b', 51.9, 232, 0, 180.1, 0, 116, { r: Q }],
            ['b', 0, 51.9, 51.9, 0, 116, 0, { r: U }],
            ['b', 180.1, 0, 232, 51.9, 232, 116, { r: Q }],
            ['l', 232, 224, { y: -0.1, r: Q, f: 1 }],
          ],
        },
      ],
      xt = [
        {
          d: 1,
          v: [
            [
              'm',
              212.1,
              182.9,
              {
                r: tt(
                  212.1,
                  182.9,
                  191.1,
                  213.2,
                  156.1,
                  233.1,
                  116.5,
                  233.1,
                  0,
                ),
                f: 1,
              },
            ],
            ['b', 191.1, 213.2, 156.1, 233.1, 116.5, 233.1, { r: U }],
            ['b', 52.4, 233.1, 0.5, 181.2, 0.5, 117.1, { r: Q }],
            ['b', 0.5, 53, 52.4, 1.1, 116.5, 1.1, { r: U }],
            ['b', 156.1, 1.1, 191.1, 21, 212.1, 51.3],
          ],
        },
      ],
      ut = [
        {
          d: -1,
          v: [
            ['m', 232, 0, { y: 0 }],
            ['l', 232, 239, { r: V }],
            ['b', 232, 303.1, 180.1, 355, 116, 355, { r: U }],
            ['b', 51.9, 355, 0, 303.1, 0, 239, { r: Q }],
            ['b', 0, 174.9, 51.9, 123, 116, 123, { r: U }],
            ['b', 180.1, 123, 232, 174.9, 232, 239, { r: Q }],
            ['l', 232, 352, { y: 0, f: 1 }],
          ],
        },
      ],
      gt = [
        {
          d: 1,
          v: [
            [
              'm',
              211.6,
              182.9,
              {
                r: tt(
                  211.6,
                  182.9,
                  191.1,
                  213.2,
                  156.1,
                  233.1,
                  116.5,
                  233.1,
                  0,
                ),
                f: 1,
              },
            ],
            ['b', 191.1, 213.2, 156.1, 233.1, 116.5, 233.1, { r: U }],
            ['b', 52.4, 233.1, 0.5, 181.2, 0.5, 117.1, { r: Q }],
            ['b', 0.5, 53, 52.4, 1.1, 116.5, 1.1, { r: U }],
            ['b', 176.4, 1.1, 224.9, 47.2, 225.5, 106.1, { r: Q }],
            ['l', 0.5, 106.1, { r: Q, p: 1 }],
          ],
        },
      ],
      bt = [
        {
          d: -1,
          v: [
            ['m', 232, 5, { y: -2.8 }],
            ['l', 232, 116, { r: V }],
            ['b', 232, 180.1, 180.1, 232, 116, 232, { r: U }],
            ['b', 51.9, 232, 0, 180.1, 0, 116, { r: Q }],
            ['b', 0, 51.9, 51.9, 0, 116, 0, { r: U }],
            ['b', 180.1, 0, 232, 51.9, 232, 116, { r: Q }],
            ['l', 232, 222],
            ['b', 234.5, 300.3, 180.2, 338.5, 116, 338, { y: 0.64, r: U }],
            ['b', 76.2, 337.7, 36.6, 320.7, 15.7, 290.1, { y: 0.64, f: 1 }],
          ],
        },
      ],
      St = [
        {
          d: -1,
          v: [
            ['m', 0, 0, { y: 0, r: Q }],
            ['l', 0, 352, { y: 0, f: 1 }],
          ],
        },
        {
          d: -1,
          v: [
            ['m', 0, 214, { r: V }],
            ['b', 0, 163.7, 40.7, 123, 91, 123, { r: U }],
            ['b', 141.3, 123, 182, 163.7, 182, 214, { r: Q }],
            ['l', 182, 352, { y: 0, f: 1 }],
          ],
        },
      ],
      mt = [
        {
          d: -1,
          v: [
            ['m', 0, 130, { y: -3.3 }],
            ['l', 0, 352, { y: 0, f: 1 }],
          ],
        },
        {
          d: -1,
          v: [
            ['m', 0, 214, { y: 0, r: Q, p: 1 }],
            ['b', 0, 163.7, 40.7, 123, 91, 123, { r: U }],
            ['b', 141.3, 123, 182, 163.7, 182, 214, { r: Q }],
            ['l', 182, 352, { y: 0, f: 1 }],
          ],
        },
      ],
      Ot = [
        {
          d: 1,
          v: [
            ['m', 232, 116, { r: Q, p: 1, f: 1 }],
            ['b', 232, 180.1, 180.1, 232, 116, 232, { r: U }],
            ['b', 51.9, 232, 0, 180.1, 0, 116, { r: Q }],
            ['b', 0, 51.9, 51.9, 0, 116, 0, { r: U }],
            ['b', 180.1, 0, 232, 51.9, 232, 116, { r: Q, c: 1 }],
          ],
        },
      ],
      Jt = [
        {
          d: 1,
          v: [
            [
              'm',
              0,
              295.4 * 0.642,
              {
                r: tt(
                  0,
                  295.4 * 0.642,
                  11.2992,
                  332.1 * 0.642,
                  58.3 * 0.642,
                  231.12,
                  70.8126,
                  231.12,
                  0,
                ),
                f: 1,
              },
            ],
            [
              'b',
              11.2992,
              332.1 * 0.642,
              58.3 * 0.642,
              231.12,
              70.8126,
              231.12,
            ],
            [
              'b',
              173.9 * 0.642,
              231.12,
              223.8 * 0.642,
              329.6 * 0.642,
              143.808,
              173.982,
            ],
            [
              'b',
              143.9364,
              137.8374,
              116.0094,
              121.7232,
              112.4 * 0.642,
              173.3 * 0.642,
            ],
            [
              'b',
              30.3666,
              101.2434,
              10.9 * 0.642,
              130.6 * 0.642,
              12 * 0.642,
              54.1848,
            ],
            ['b', 8.5386, 29.8 * 0.642, 36.7866, 0, 73.7016, 0],
            ['b', 101.6928, 0, 126.153, 13.161, 136.104, 51.3 * 0.642],
          ],
        },
      ],
      Nt = [
        {
          d: -1,
          v: [
            ['m', 0, 130, { y: -3 }],
            ['l', 0, 265, { r: Q }],
            ['b', 0, 315.3, 40.7, 356, 91, 356, { r: U }],
            ['b', 141.3, 356, 182, 315.3, 182, 265, { r: Q, p: 1, f: 1 }],
          ],
        },
        {
          d: -1,
          v: [
            ['m', 182, 130, { y: -3 }],
            ['l', 182, 352, { y: 0, f: 1 }],
          ],
        },
      ],
      _t = [
        {
          d: -1,
          v: [
            ['m', 225.5, 0, { y: -3, r: $(225.5, 0, 116.3, 248.8) }],
            ['l', 116.3, 248.8, { x: 0.5, y: 0.64 }],
            [
              'b',
              71.8,
              349.6,
              0,
              331.5,
              0,
              331.5,
              {
                x: 0.5,
                y: 0.64,
                r: tt(0, 331.5, 71.8, 349.6, 116.3, 248.8, 0, 331.5, 0),
                f: 1,
              },
            ],
          ],
        },
        {
          d: -1,
          v: [
            ['m', 3.2, 0, { y: -3, r: $(3.2, 0, 125.7, 226.6) }],
            ['l', 125.7, 226.6, { p: 1, f: 1 }],
          ],
        },
      ],
      wt = {
        a: Y(600, 232, 232, 10, 2, -64, -64, JSON.parse(JSON.stringify(vt))),
        b: Y(600, 232, 352, -10, -2, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { y: 0, r: Q }],
              ['l', 0, 239, { r: V }],
              ['b', 0, 303.1, 51.9, 355, 116, 355, { r: U }],
              ['b', 180.1, 355, 232, 303.1, 232, 239, { r: Q }],
              ['b', 232, 174.9, 180.1, 123, 116, 123, { r: U }],
              ['b', 51.9, 123, 0, 174.9, 0, 239, { r: Q }],
              ['l', 0, 352, { y: 0, r: Q, f: 1 }],
            ],
          },
        ]),
        c: Y(
          520,
          212.1,
          233.1,
          2,
          -10,
          -64,
          -64,
          JSON.parse(JSON.stringify(xt)),
        ),
        d: Y(600, 232, 352, 10, 2, 0, 0, JSON.parse(JSON.stringify(ut))),
        e: Y(570, 225.5, 233.1, 0, 0, -64, -64, JSON.parse(JSON.stringify(gt))),
        f: Y(356, 232, 352, -40, -40, 0, 0, [
          {
            d: -1,
            v: [
              [
                'm',
                166.6,
                33,
                {
                  x: 0.5,
                  r: tt(166.6, 33, 159.3, 13.1, 139.2, 0, 116.9, 0, 0),
                },
              ],
              ['b', 159.3, 13.1, 139.2, 0, 116.9, 0, { r: U }],
              ['b', 88.2, 0, 65, 23.2, 65, 51.9, { r: Q }],
              ['l', 65, 352, { y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 0, 130, { x: 0, r: U }],
              ['l', 154, 130, { x: 0, f: 1 }],
            ],
          },
        ]),
        g: Y(600, 232, 338, 10, 2, -117, -117, JSON.parse(JSON.stringify(bt))),
        h: Y(520, 182, 352, 0, 0, 0, 0, JSON.parse(JSON.stringify(St))),
        i: Y(200, 0, 352, 0, 0, 0, 0, [
          { d: 1, v: [['a', 0, 90, { y: -3 }]] },
          {
            d: 1,
            v: [
              ['m', 0, 352, { y: 0, f: 1 }],
              ['l', 0, 130, { y: -3 }],
            ],
          },
        ]),
        j: Y(220, 115.9, 352, -60, -60, 0, 0, [
          { d: 1, v: [['a', 0, 90, { y: -3 }]] },
          {
            d: 1,
            v: [
              [
                'm',
                -115.9,
                444,
                {
                  x: 0.4,
                  y: 0.63,
                  r: tt(
                    -115.9,
                    444,
                    12.6 - 115.9,
                    454.4,
                    29.6 - 115.9,
                    460.2,
                    -70,
                    461.2,
                    0,
                  ),
                  f: 1,
                },
              ],
              [
                'b',
                12.6 - 115.9,
                454.4,
                29.6 - 115.9,
                460.2,
                -70,
                461.2,
                { x: 0.4, y: 0.63, r: U },
              ],
              [
                'b',
                84.5 - 115.9,
                463.5,
                0,
                435.1,
                0,
                396.4,
                { x: 0.4, y: 0.63, r: Q },
              ],
              ['l', 0, 130, { y: -3 }],
            ],
          },
        ]),
        k: Y(450, 164, 352, -10, -10, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { y: 0, r: Q }],
              ['l', 0, 352, { y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 160, 130, { x: 0.7, y: 0, r: $(164, 130, 0, 234.5), f: 1 }],
              ['l', 0, 234.5, { r: U, p: 1 }],
              ['l', 0, 237.5, { r: U, p: 1, v: 1 }],
              ['l', 164, 352, { x: 0.7, y: 0.7, f: 1 }],
            ],
          },
        ]),
        l: Y(200, 0, 352, 0, 0, 0, 0, [
          {
            d: 1,
            v: [
              ['m', 0, 352, { y: 0, f: 1 }],
              ['l', 0, 0, { y: 0 }],
            ],
          },
        ]),
        m: Y(740, 300, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 130, { y: -3.6 }],
              ['l', 0, 352, { y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 0, 198, { y: 0, r: Q, p: 1 }],
              ['b', 0, 156.6, 33.6, 123, 75, 123, { r: U }],
              ['b', 116.4, 123, 150, 156.6, 150, 198, { r: Q }],
              ['l', 150, 352, { y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 150, 198, { y: 0, r: Q, p: 1 }],
              ['b', 150, 156.6, 183.6, 123, 225, 123, { r: U }],
              ['b', 266.4, 123, 300, 156.6, 300, 198, { r: Q }],
              ['l', 300, 352, { y: 0, f: 1 }],
            ],
          },
        ]),
        n: Y(520, 182, 352, 0, 0, 0, 0, JSON.parse(JSON.stringify(mt))),
        o: Y(580, 232, 232, 0, 0, -64, -64, JSON.parse(JSON.stringify(Ot))),
        p: Y(600, 232, 338, -10, -2, -117, -117, [
          {
            d: -1,
            v: [
              ['m', 0, 5, { y: -2.8 }],
              ['l', 0, 116, { r: V }],
              ['b', 0, 180.1, 51.9, 232, 116, 232, { r: U }],
              ['b', 180.1, 232, 232, 180.1, 232, 116, { r: Q }],
              ['b', 232, 51.9, 180.1, 0, 116, 0, { r: U }],
              ['b', 51.9, 0, 0, 51.9, 0, 116, { r: Q }],
              ['l', 0, 338, { y: 0, f: 1 }],
            ],
          },
        ]),
        q: Y(600, 232, 338, 10, 2, -117, -117, [
          {
            d: -1,
            v: [
              ['m', 232, 5, { y: -2.8 }],
              ['l', 232, 116, { r: V }],
              ['b', 232, 180.1, 180.1, 232, 116, 232, { r: U }],
              ['b', 51.9, 232, 0, 180.1, 0, 116, { r: Q }],
              ['b', 0, 51.9, 51.9, 0, 116, 0, { r: U }],
              ['b', 180.1, 0, 232, 51.9, 232, 116, { r: Q }],
              ['l', 232, 338, { y: 0, f: 1 }],
            ],
          },
        ]),
        r: Y(340, 119.2, 352, -20, -20, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 130, { y: -3.3 }],
              ['l', 0, 352, { y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 0, 181, { r: Q, p: 1 }],
              [
                'b',
                0,
                181,
                41.9,
                101.2,
                119.2,
                128.5,
                {
                  x: 0,
                  y: 2,
                  r: tt(119.2, 128.5, 41.9, 101.2, 0, 181, 119.2, 128.5, 0),
                  f: 1,
                },
              ],
            ],
          },
        ]),
        s: Y(
          400,
          143.808,
          231.12,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(Jt)),
        ),
        t: Y(356, 232, 352, -30, -30, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 65, 0, { y: 0 }],
              ['l', 65, 304.2],
              ['b', 65, 332.9, 88.2, 356.1, 116.9, 356.1, { r: U }],
              ['b', 139.2, 356.1, 159.3, 343, 166.6, 317.1, { x: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 0, 130, { x: 0, r: U }],
              ['l', 154, 130, { x: 0, f: 1 }],
            ],
          },
        ]),
        u: Y(520, 182, 352, 0, 0, 0, 0, JSON.parse(JSON.stringify(Nt))),
        v: Y(500, 200, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 130, { x: 0.6, y: -3, r: $(0, 130, 98.5, 352) }],
              ['l', 98.5, 352, { r: $(0, 130, 98.5, 352), f: 1 }],
              ['l', 101.5, 352, { r: $(101.5, 352, 200, 130), f: 1, v: 1 }],
              ['l', 200, 130, { x: 0.6, y: -3, f: 1 }],
            ],
          },
        ]),
        w: Y(700, 310, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 130, { x: 0.6, y: -3, r: $(0, 130, 76.5, 352) }],
              ['l', 76.5, 352, { r: $(0, 130, 76.5, 352), f: 1 }],
              ['l', 79.5, 352, { r: $(79.5, 352, 153.5, 130), f: 1, v: 1 }],
              ['l', 153.5, 130, { y: 1, r: $(79.5, 352, 153.5, 130), f: 1 }],
              [
                'l',
                156.5,
                130,
                { y: 1, r: $(156.5, 130, 231.5, 352), f: 1, v: 1 },
              ],
              ['l', 231.5, 352, { r: $(156.5, 130, 231.5, 352), f: 1 }],
              ['l', 234.5, 352, { r: $(234.5, 352, 310, 130), f: 1, v: 1 }],
              ['l', 310, 130, { x: 0.6, y: -3, f: 1 }],
            ],
          },
        ]),
        x: Y(490, 210, 352, 0, 0, 0, -7, [
          {
            d: -1,
            v: [
              ['m', 10, 130, { x: 0.5, y: -1, r: $(10, 130, 210, 352) }],
              ['l', 210, 352, { x: 0.5, y: 0.5, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 200, 130, { x: 0.5, y: -1, r: $(200, 130, 0, 352) }],
              ['l', 0, 352, { x: 0.5, y: 0.5, f: 1 }],
            ],
          },
        ]),
        y: Y(
          500,
          225.5,
          331.5,
          10,
          10,
          -119,
          -119,
          JSON.parse(JSON.stringify(_t)),
        ),
        z: Y(420, 172, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 6, 130, { x: -0.5, y: 1, r: U }],
              ['l', 166, 130, { x: 1.8, y: 1, r: U, f: 1 }],
              ['l', 166, 133, { x: 1.8, y: 1, r: Q, p: 1, v: 1 }],
              ['l', 0, 349, { x: 1.7, r: Q, p: 1 }],
              ['l', 0, 352, { x: 1.7, r: U, f: 1, v: 1 }],
              ['l', 172, 352, { x: -0.4, r: U, f: 1 }],
            ],
          },
        ]),
      },
      Pt = {
        0: Y(660, 270, 360, 0, 0, 0, 0, [
          {
            d: 1,
            v: [
              ['m', 270, 180, { r: Q, p: 1, f: 1 }],
              ['b', 270, 279.4, 209.6, 360, 135, 360, { r: U }],
              ['b', 60.4, 360, 0, 279.4, 0, 180, { r: Q }],
              ['b', 0, 80.6, 60.4, 0, 135, 0, { r: U }],
              ['b', 209.6, 0, 270, 80.6, 270, 180, { r: Q, c: 1 }],
            ],
          },
        ]),
        1: Y(380, 76, 352, 15, 15, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 51, { x: -2, y: 2, r: $(0, 51, 73, 0) }],
              ['l', 73, 0, { r: Q, p: 1 }],
              ['l', 76, 0, { r: Q, f: 1, v: 1 }],
              ['l', 76, 352, { y: 0, f: 1 }],
            ],
          },
        ]),
        2: Y(580, 210, 356, 0, 0, 2, 2, [
          {
            d: -1,
            v: [
              [
                'm',
                3.9,
                68.8,
                {
                  x: 1.2,
                  y: 1.2,
                  r: tt(3.9, 68.8, 16.7, 29, 54.2, 3.1, 98.2, 0.2, 0),
                },
              ],
              ['b', 16.7, 29, 54.2, 3.1, 98.2, 0.2],
              ['b', 151.8, -3.3, 208.5, 38.3, 198.9, 100.1],
              ['b', 197.1, 111.8, 196.4, 142.4, 101.5, 235.2],
              ['b', 11.4, 323.2, 0, 353, 0, 353, { r: V }],
              ['l', 0, 353, { r: U, p: 1 }],
              ['l', 0, 356, { r: U, f: 1, v: 1 }],
              ['l', 210, 356, { x: -0.5, f: 1 }],
            ],
          },
        ]),
        3: Y(580, 222.1, 360, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              [
                'm',
                10.7,
                66.3,
                { r: tt(10.7, 66.3, 11.2, 64.8, 11.7, 63.3, 12.3, 61.8, 0) },
              ],
              ['b', 11.2, 64.8, 11.7, 63.3, 12.3, 61.8, { r: V }],
              ['b', 25.8, 25.9, 64.5, 0, 110.1, 0, { r: U }],
              ['b', 167, 0, 213.1, 40.3, 213.1, 90, { r: Q }],
              ['b', 213.1, 139.7, 167, 180, 110.1, 179.9, { r: U, f: 1 }],
              ['l', 100.1, 179.9, { x: -5, y: 1, r: U, f: 1 }],
              ['l', 110.1, 180, { r: U, p: 1 }],
              ['b', 172, 180, 222.1, 220.3, 222.1, 270, { r: Q }],
              ['b', 222.1, 319.7, 172, 360, 110.1, 360, { r: U }],
              ['b', 56.9, 360, 12.4, 330.2, 1, 290.3, { f: 1 }],
            ],
          },
        ]),
        4: Y(596, 236, 352, 0, 0, 0, 0, [
          {
            d: 1,
            v: [
              ['m', 175, 352, { y: 0, f: 1 }],
              ['l', 175, 0, { f: 1 }],
              ['l', 172, 0, { r: U, p: 1, v: 1 }],
              ['l', 0, 273, { r: Q, p: 1 }],
              ['l', 0, 276, { r: U, f: 1, v: 1 }],
              ['l', 236, 276, { x: -0.5 }],
            ],
          },
        ]),
        5: Y(596, 208.5, 356, 0, -5, -2, -2, [
          {
            d: 1,
            v: [
              [
                'm',
                0,
                295.7,
                {
                  r: tt(0, 295.7, 15.3, 333.8, 52.2, 356.2, 97.5, 356, 0),
                  f: 1,
                },
              ],
              ['b', 15.3, 333.8, 52.2, 356.2, 97.5, 356, { r: U }],
              ['b', 159.1, 355.7, 206.1, 306.9, 208.5, 240.8, { r: Q }],
              ['b', 210.9, 173.9, 162.7, 120.8, 97.5, 125.6, { r: U }],
              ['b', 59.4, 128.4, 25.5, 145.8, 5.6, 176.4, { f: 1 }],
              ['l', 5.6, 176.4, { r: V }],
              ['l', 5.6 - 3, 176.4, { r: Q, p: 1, v: 1 }],
              ['l', 11.5, 0, { r: U, f: 1 }],
              ['l', 193.5, 0, { x: -0.5 }],
            ],
          },
        ]),
        6: Y(596, 215.8, 360, 0, -2, 0, 0, [
          {
            d: 1,
            v: [
              ['m', 7.6, 272.3, { r: Q, p: 1, f: 1 }],
              ['b', 6.4, 265.8, 5.8, 259.1, 5.8, 252.2, { r: Q }],
              ['b', 5.8, 192.6, 52.8, 144.2, 110.8, 144.2, { r: U }],
              ['b', 168.7, 144.2, 215.8, 192.6, 215.8, 252.2, { r: Q }],
              ['b', 215.8, 311.9, 168.7, 360, 110.8, 360, { r: U }],
              ['b', 59.5, 360, 16.8, 322.4, 7.6, 272.4, { r: V }],
              ['b', 7.6, 272.4, -44.1, 8.8, 122.2, 0.2],
              ['b', 165.5, -2.1, 193.8, 21, 212.1, 56.4],
            ],
          },
        ]),
        7: Y(540, 213, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: 0, r: U }],
              ['l', 213, 0, { r: U, f: 1 }],
              ['l', 213, 0.1, { r: V }],
              ['l', 72.7, 352, { y: 0.1, f: 1 }],
            ],
          },
        ]),
        8: Y(596, 224, 360, 0, 0, 0, 0, [
          {
            d: 1,
            v: [
              ['m', 112, 180, { r: Q, p: 1, f: 1 }],
              ['b', 50.1, 180, 0, 220.3, 0, 270, { r: Q }],
              ['b', 0, 319.7, 50.1, 360, 112, 360, { r: U }],
              ['b', 173.9, 360, 224, 319.7, 224, 270, { r: Q }],
              ['b', 224, 220.3, 173.9, 180, 112, 180, { r: U }],
              ['b', 55.1, 180, 9, 139.7, 9, 90, { r: Q }],
              ['b', 9, 40.3, 55.1, 0, 112, 0, { r: U }],
              ['b', 168.9, 0, 215, 40.3, 215, 90, { r: Q }],
              ['b', 215, 139.7, 168.9, 180, 112, 180, { r: Q, p: 1, f: 1 }],
            ],
          },
        ]),
        9: Y(596, 215.8, 360, 0, -2, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 208.2, 88, { r: Q, p: 1, f: 1 }],
              ['b', 209.4, 94.5, 210, 101.2, 210, 108, { r: Q }],
              ['b', 210, 167.6, 163, 216, 105, 216, { r: U }],
              ['b', 47, 216, -0, 167.6, 0, 108, { r: Q }],
              ['b', 0, 48.4, 47, -0, 105, 0, { r: U }],
              ['b', 156.3, 0, 199, 37.8, 208.2, 87.8, { r: V }],
              ['b', 208.2, 87.8, 259.8, 351.4, 93.5, 360],
              ['b', 50.3, 362.3, 21.9, 339.2, 3.6, 303.8, { f: 1 }],
            ],
          },
        ]),
      },
      Wt = {
        ' ': Y(336, 0, 0, 0, 0, 0, 0, [{ d: 1, v: [] }]),
        tofu: Y(672, 232, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { r: Q }],
              ['l', 232, 0, { r: Q, f: 1 }],
              ['l', 232, 352, { r: Q, f: 1 }],
              ['l', 0, 352, { r: Q, f: 1 }],
              ['l', 0, 0, { r: Q, p: 1, f: 1, c: 1 }],
            ],
          },
          {
            d: 1,
            v: [
              ['m', 0, 0, { r: Q, p: 1, f: 1 }],
              ['l', 232, 352, { r: V }],
            ],
          },
        ]),
        '?': Y(520, 190.348, 360, 0, -5, 0, 0, [
          { d: 1, v: [['a', 89.174, 356]] },
          {
            d: -1,
            v: [
              ['m', 0, 87.8, { r: tt(0, 87.8, 12, -2.3, 99.1, 0, 0, 87.8, 0) }],
              ['b', 0, 87.8, 12, -2.3, 99.1, 0, { r: U }],
              ['b', 186.2, 2.4, 204.5, 75.2, 180.9, 121.4],
              ['b', 157.3, 167.6, 119.7, 178.3, 97.4, 223.2],
              ['b', 90.5, 237.1, 88.1, 249.8, 88, 260.8, { r: Q, f: 1 }],
            ],
          },
        ]),
        '¿': Y(520, 190.348, 360, 0, -5, 0, 0, [
          { d: 1, v: [['a', 101.174, 93]] },
          {
            d: -1,
            v: [
              [
                'm',
                190.3,
                361,
                { r: tt(190.3, 361, 178.3, 451.1, 91.2, 448.8, 190.3, 361, 0) },
              ],
              ['b', 190.3, 361, 178.3, 451.1, 91.2, 448.8, { r: U }],
              ['b', 4.1, 446.4, -14.2, 373.6, 9.4, 327.4],
              ['b', 33, 281.2, 70.6, 270.5, 92.9, 225.6],
              ['b', 99.8, 211.7, 102.2, 199, 102.3, 188, { r: Q, f: 1 }],
            ],
          },
        ]),
        '!': Y(465, 8, 355, 0, -5, 0, 0, [
          { d: 1, v: [['a', 4, 356]] },
          {
            d: -1,
            v: [
              ['m', 4, 0, { y: 0 }],
              ['l', 4, 260.8, { f: 1 }],
            ],
          },
        ]),
        '¡': Y(465, 8, 355, 0, -5, 0, 0, [
          { d: 1, v: [['a', 4, 93]] },
          {
            d: -1,
            v: [
              ['m', 4, 188],
              ['l', 4, 448.8, { f: 1, y: 0.3 }],
            ],
          },
        ]),
        $: Y(568, 224, 360, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              [
                'm',
                212,
                51.3,
                {
                  r: tt(0, 295.4, 17.6, 332.1, 58.3, 360, 110.3, 360, 0),
                  f: 1,
                },
              ],
              ['b', 196.5, 20.5, 158.4, 0, 114.8, 0],
              ['b', 57.3, 0, 13.3, 29.8, 12, 84.4],
              ['b', 10.9, 130.6, 47.3, 157.7, 112.4, 173.3],
              ['b', 180.7, 189.6, 224.2, 214.7, 224, 271],
              ['b', 223.8, 329.6, 173.9, 360, 110.3, 360],
              ['b', 58.3, 360, 17.6, 332.1, 0, 295.4, { f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 112, -30, { y: 0 }],
              ['l', 112, 390, { y: 0, f: 1 }],
            ],
          },
        ]),
        '@': Y(820, 343.425, 360, 0, 0, -30, -30, [
          {
            d: -1,
            v: [
              ['m', 251.9, 92.9, { r: $(251.9, 92.9, 238.5, 181.7) }],
              ['l', 238.5, 181.7, { r: V }],
              ['b', 227.8, 236, 194.7, 267.2, 143.7, 259.2],
              ['b', 99.1, 252.2, 87.7, 208.5, 90.1, 177.5],
              ['b', 92.5, 148.4, 118.1, 91, 183.3, 99.1],
              ['b', 251, 107.5, 238.5, 181.7, 238.5, 181.7, { r: V }],
              ['l', 232.5, 221.5],
              ['b', 232.5, 221.5, 227.2, 257.6, 256, 263.6],
              ['b', 284.9, 269.7, 309, 241.3, 309, 241.3, { r: V }],
              ['b', 309, 241.3, 343.4, 209, 343.4, 146.7],
              ['b', 343.4, 84.3, 297.4, 3.5, 178.6, 0.1],
              ['b', 59.7, -3.4, -5.3, 105.2, 0.3, 203.4],
              ['b', 6.1, 303.7, 93.2, 354.5, 175.5, 359.5],
              ['b', 175.5, 359.5, 246.5, 364.9, 302.7, 339.8, { f: 1 }],
            ],
          },
        ]),
        '#': Y(760, 314, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 117, 0, { y: 0, r: $(117, 0, 47, 352) }],
              ['l', 47, 352, { y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 267, 0, { y: 0, r: $(267, 0, 197, 352) }],
              ['l', 197, 352, { y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 24, 117, { x: 0, r: U }],
              ['l', 314, 117, { x: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 0, 235, { x: 0, r: U }],
              ['l', 290, 235, { x: 0, f: 1 }],
            ],
          },
        ]),
        '%': Y(920, 388, 360, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 307.1, 5.1, { x: 0, y: 0, r: $(307.1, 5.1, 80.9, 354.9) }],
              ['l', 80.9, 354.9, { x: 0, y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 146, 73, { r: Q, p: 1 }],
              ['b', 146, 113.3, 113.3, 146, 73, 146, { r: U }],
              ['b', 32.7, 146, 0, 113.3, 0, 73, { r: Q }],
              ['b', 0, 32.7, 32.7, 0, 73, 0, { r: U }],
              ['b', 113.3, 0, 146, 32.7, 146, 73, { r: Q, c: 1, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 388, 287, { r: Q, p: 1 }],
              ['b', 388, 327.3, 355.3, 360, 315, 360, { r: U }],
              ['b', 274.7, 360, 242, 327.3, 242, 287, { r: Q }],
              ['b', 242, 246.7, 274.7, 214, 315, 214, { r: U }],
              ['b', 355.3, 214, 388, 246.7, 388, 287, { r: Q, c: 1, f: 1 }],
            ],
          },
        ]),
        '^': Y(596, 176, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 150, { r: $(0, 150, 86.5, 0) }],
              ['l', 86.5, 0, { r: $(0, 150, 86.5, 0), f: 1 }],
              ['l', 89.5, 0, { r: $(89.5, 0, 176, 150), f: 1, v: 1 }],
              ['l', 176, 150, { f: 1 }],
            ],
          },
        ]),
        '·': Y(231, 8, 355, 0, 0, 0, 0, [{ d: 1, v: [['a', 4, 183.5]] }]),
        '×': Y(712, 176.8, 176.8, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: 0, y: 0, r: $(0, 0, 176.8, 176.8) }],
              ['l', 176.8, 176.8, { x: 0, y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 176.8, 0, { x: 0, y: 0, r: $(176.8, 0, 0, 176.88) }],
              ['l', 0, 176.8, { x: 0, y: 0, f: 1 }],
            ],
          },
        ]),
        '÷': Y(712, 188, 0, 0, 0, 0, 0, [
          { d: 1, v: [['a', 94, 110]] },
          { d: 1, v: [['a', 94, -110]] },
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: 0, y: 0, r: U }],
              ['l', 188, 0, { x: 0, y: 0, f: 1 }],
            ],
          },
        ]),
        '«': Y(896, 310, 236, 0, 0, 0, 0, [
          {
            d: 1,
            v: [
              ['m', 150, 236, { r: $(150, 236, 0, 119.5), f: 1 }],
              ['l', 0, 119.5, { r: $(150, 236, 0, 119.5), f: 1 }],
              ['l', 0, 116.5, { r: $(0, 116.5, 150, 0), f: 1, v: 1 }],
              ['l', 150, 0],
            ],
          },
          {
            d: 1,
            v: [
              ['m', 310, 236, { r: $(310, 236, 160, 119.5), f: 1 }],
              ['l', 160, 119.5, { r: $(310, 236, 160, 119.5), f: 1 }],
              ['l', 160, 116.5, { r: $(160, 116.5, 310, 0), f: 1, v: 1 }],
              ['l', 310, 0],
            ],
          },
        ]),
        '»': Y(896, 310, 236, 0, 0, 0, 0, [
          {
            d: 1,
            v: [
              ['m', 0, 236, { r: $(0, 236, 150, 119.5), f: 1 }],
              ['l', 150, 119.5, { r: $(0, 236, 0, 119.5), f: 1 }],
              ['l', 150, 116.5, { r: $(150, 116.5, 0, 0), f: 1, v: 1 }],
              ['l', 0, 0],
            ],
          },
          {
            d: 1,
            v: [
              ['m', 160, 236, { r: $(160, 236, 310, 119.5), f: 1 }],
              ['l', 310, 119.5, { r: $(0, 236, 0, 119.5), f: 1 }],
              ['l', 310, 116.5, { r: $(310, 116.5, 160, 0), f: 1, v: 1 }],
              ['l', 160, 0],
            ],
          },
        ]),
        '&': Y(660, 259.191, 360, 0, 0, 0, 0, [
          {
            d: 1,
            v: [
              [
                'm',
                257.9,
                355,
                { x: 0.5, y: 0.5, r: $(257.9, 355, 52.8, 135.3), f: 1 },
              ],
              ['l', 52.8, 135.3],
              ['b', 52.8, 135.3, -2.2, 79.5, 46.6, 26.7],
              ['b', 46.6, 26.7, 68.1, 0, 101.8, 0, { r: U }],
              ['b', 137.2, 0, 174.1, 21.1, 181.2, 65.3],
              ['b', 188.6, 111.7, 142.6, 142.9, 108.9, 162.9],
              ['b', 75.2, 182.8, 40.8, 211.4, 40.8, 211.4, { r: V }],
              ['b', 35, 217.1, -34.7, 273.7, 22.2, 330.5],
              ['b', 22.2, 330.5, 48.1, 360, 93.4, 360, { r: U }],
              ['b', 138.6, 360, 212.2, 322, 259.2, 200.5],
            ],
          },
        ]),
        '*': Y(558, 183.597, 212, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 91.8, 0, { x: 0, y: 0 }],
              ['l', 91.8, 212, { x: 0, y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 0, 53, { x: 0, y: 0, r: $(0, 53, 183.6, 159) }],
              ['l', 183.6, 159, { x: 0, y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 0, 159, { x: 0, y: 0, r: $(0, 159, 183.6, 53) }],
              ['l', 183.6, 53, { x: 0, y: 0, f: 1 }],
            ],
          },
        ]),
        '+': Y(712, 250, 250, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 125, 0, { x: 0, y: 0 }],
              ['l', 125, 250, { x: 0, y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 0, 125, { x: 0, y: 0, r: U }],
              ['l', 250, 125, { x: 0, y: 0, f: 1 }],
            ],
          },
        ]),
        '=': Y(712, 216, 86, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: 0, y: 0, r: U }],
              ['l', 216, 0, { x: 0, y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 0, 86, { x: 0, y: 0, r: U }],
              ['l', 216, 86, { x: 0, y: 0, f: 1 }],
            ],
          },
        ]),
        '-': Y(712, 188, 0, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: 0, y: 0, r: U }],
              ['l', 188, 0, { x: 0, y: 0, f: 1 }],
            ],
          },
        ]),
        _: Y(481, 235, 400, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 400, { x: 0, y: 0, r: U }],
              ['l', 235, 400, { x: 0, y: 0, f: 1 }],
            ],
          },
        ]),
        ':': Y(231, 8, 355, 0, 0, 0, 0, [
          { d: 1, v: [['a', 4, 183.5]] },
          { d: 1, v: [['a', 4, 353.5]] },
        ]),
        ';': Y(231, 8, 355, 0, 0, 0, 0, [
          { d: 1, v: [['a', 4, 183.5]] },
          {
            d: -1,
            v: [
              ['m', 4, 350, { x: 0, y: 2, r: $(4, 350, -6, 430) }],
              ['l', -6, 430, { x: 0, y: 0.5, f: 1 }],
            ],
          },
        ]),
        '.': Y(231, 8, 355, 0, 0, 0, 0, [{ d: 1, v: [['a', 4, 353.5]] }]),
        ',': Y(231, 10, 355, 10, 10, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 10, 350, { x: 0, y: 2, r: $(10, 350, 0, 430) }],
              ['l', 0, 430, { x: 0, y: 0.5, f: 1 }],
            ],
          },
        ]),
        "'": Y(173, 0, 360, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: 0, y: 0 }],
              ['l', 0, 80, { x: 0, y: 0, f: 1 }],
            ],
          },
        ]),
        '"': Y(297, 60, 360, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: -1.5, y: 0 }],
              ['l', 0, 80, { x: -1.5, y: 0, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 60, 0, { x: -1.5, y: 0 }],
              ['l', 60, 80, { x: -1.5, y: 0, f: 1 }],
            ],
          },
        ]),
        '~': Y(731, 199.391, 47.063, 0, 0, 0, 0, [
          {
            d: 1,
            v: [
              [
                'm',
                199.4,
                20.7,
                {
                  x: 0,
                  y: 0,
                  r: tt(199.4, 20.7, 187.6, 36.6, 168.2, 47.1, 148.2, 47.1, 0),
                  f: 1,
                },
              ],
              [
                'b',
                187.6,
                36.6,
                168.2,
                47.1,
                148.2,
                47.1,
                { x: 0, y: 0, r: U },
              ],
              ['b', 129.1, 47.1, 112.1, 36.6, 95.3, 25.5, { x: 0, y: 0 }],
              ['b', 76.8, 13.2, 59.1, 0, 39.6, 0, { x: 0, y: 0, r: U }],
              ['b', 22.3, 0, 10.9, 8.9, 0, 20, { x: 0, y: 0 }],
            ],
          },
        ]),
        '(': Y(365, 107.865, 360, 0, 0, 0, 0, [
          {
            d: 1,
            v: [
              [
                'm',
                107.9,
                360,
                {
                  y: 0.8,
                  r: tt(107.9, 360, 39.7, 321.1, 0, 259.8, 0, 182.9, 0),
                  f: 1,
                },
              ],
              ['b', 39.7, 321.1, 0, 259.8, 0, 182.9, { y: 0.8, r: Q }],
              ['b', 0, 100.2, 39.7, 38.9, 107.9, 0, { y: 0.8 }],
            ],
          },
        ]),
        ')': Y(365, 107.865, 360, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              [
                'm',
                0,
                0,
                {
                  y: 0.8,
                  r: tt(0, 0, 68.2, 38.9, 107.9, 100.2, 107.9, 177, 0),
                },
              ],
              ['b', 68.2, 38.9, 107.9, 100.2, 107.9, 177, { y: 0.8, r: Q }],
              ['b', 107.9, 259.8, 68.2, 321.1, 0, 360, { y: 0.8, f: 1 }],
            ],
          },
        ]),
        '{': Y(385, 107.865, 360, 0, 0, 0, 0, [
          {
            d: 1,
            v: [
              ['m', 94.5, 360, { x: -0.5, r: U }],
              ['l', 77.9, 360, { x: -0.5 }],
              ['b', 57.4, 360, 37, 343, 37, 310.7, { x: -0.5 }],
              ['l', 37, 233.4, { x: -0.5 }],
              ['b', 37, 207.9, 24.3, 183.7, 3.8, 180.7, { x: -0.5, r: U }],
              ['l', 3.8, 179.8, { x: -0.5, r: U, p: 1 }],
              ['b', 24.3, 176.8, 37, 153.1, 37, 126.7, { x: -0.5 }],
              ['l', 37, 49.4, { x: -0.5 }],
              ['b', 37, 17.1, 57.4, 0.1, 77.9, 0.1, { x: -0.5 }],
              ['l', 94.5, 0.1, { x: -0.5 }],
            ],
          },
        ]),
        '}': Y(385, 107.865, 360, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 13.4, 0.1, { x: -0.5, r: U }],
              ['l', 30, 0.1, { x: -0.5 }],
              ['b', 50.4, 0.1, 70.8, 17.1, 70.8, 49.4, { x: -0.5 }],
              ['l', 70.8, 126.7, { x: -0.5 }],
              ['b', 70.8, 153.1, 83.6, 176.8, 104, 179.8, { x: -0.5, r: U }],
              ['l', 104, 180.7, { x: -0.5, r: U, p: 1 }],
              ['b', 83.6, 183.7, 70.8, 207.9, 70.8, 233.4, { x: -0.5 }],
              ['l', 70.8, 310.7, { x: -0.5 }],
              ['b', 70.8, 343, 50.4, 360, 30, 360, { x: -0.5 }],
              ['l', 13.4, 360, { x: -0.5 }],
            ],
          },
        ]),
        '[': Y(365, 66, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 66, 0, { x: -1, r: U }],
              ['l', 0, 0, { r: Q, f: 1 }],
              ['l', 0, 352, { r: Q, f: 1 }],
              ['l', 66, 352, { x: -1, f: 1 }],
            ],
          },
        ]),
        ']': Y(365, 66, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: -1, r: U }],
              ['l', 66, 0, { r: Q, f: 1 }],
              ['l', 66, 352, { r: Q, f: 1 }],
              ['l', 0, 352, { x: -1, f: 1 }],
            ],
          },
        ]),
        '<': Y(423, 90, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 90, 0, { x: -1, y: 0.3, r: $(90, 0, 0, 176) }],
              ['l', 0, 176, { r: Q, f: 1 }],
              ['l', 90, 352, { x: -1, y: 0.3, f: 1 }],
            ],
          },
        ]),
        '>': Y(423, 90, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: -1, y: 0.3, r: $(0, 0, 90, 176) }],
              ['l', 90, 176, { r: Q, f: 1 }],
              ['l', 0, 352, { x: -1, y: 0.3, f: 1 }],
            ],
          },
        ]),
        '/': Y(433, 130, 352, 0, 0, 0, 0, [
          {
            d: 1,
            v: [
              ['m', 0, 352, { r: $(0, 352, 130, 0), f: 1, y: 0 }],
              ['l', 130, 0, { y: 0 }],
            ],
          },
        ]),
        þ: Y(600, 232, 338, -10, -2, -117, -117, [
          {
            d: -1,
            v: [
              ['m', 0, -106, { y: 0 }],
              ['l', 0, 116, { r: V }],
              ['b', 0, 180.1, 51.9, 232, 116, 232, { r: U }],
              ['b', 180.1, 232, 232, 180.1, 232, 116, { r: Q }],
              ['b', 232, 51.9, 180.1, 0, 116, 0, { r: U }],
              ['b', 51.9, 0, 0, 51.9, 0, 116, { r: Q }],
              ['l', 0, 338, { y: 0, f: 1 }],
            ],
          },
        ]),
        Þ: Y(520, 162, 352, -5, -70, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 0, 0, { x: 0, y: 0, r: Q }],
              ['l', 0, 352, { x: 0, y: 0, r: Q, f: 1 }],
            ],
          },
          {
            d: 1,
            v: [
              ['m', 0, 281.6, { x: 0, r: U, f: 1, p: 1 }],
              ['l', 57, 281.6, { x: -0.5, r: U, f: 1 }],
              ['b', 115, 281.6, 162, 233.4, 162, 175.4, { x: -0.5, r: Q }],
              ['b', 162, 117.4, 115, 70.4, 57, 70.4, { x: -0.5, r: U }],
              ['l', 0, 70.4, { x: 0, r: U, f: 1, p: 1 }],
            ],
          },
        ]),
        ß: Y(596, 209, 352, -10, -10, 0, 0, [
          {
            d: 1,
            v: [
              ['m', 0, 348.3, { r: Q, f: 1, x: 0, y: 0 }],
              ['l', 0, 104.3, { x: 0 }],
              ['b', 0, 46, 36, 0, 98.9, 0, { x: 0 }],
              ['b', 145.2, 0, 191, 27.9, 191, 81, { x: 1 }],
              ['b', 191, 110.7, 165.6, 131.8, 151.8, 140.9],
              ['l', 140, 148.8],
              ['b', 120.6, 161.7, 110.8, 172.8, 110.8, 185.5],
              ['b', 110.8, 206.7, 131.6, 213.8, 140, 217.5],
              ['b', 190.6, 241.1, 211, 262.7, 211, 289.6],
              ['b', 211, 329.5, 174.8, 352, 142.5, 352],
              ['b', 97.3, 352, 75.2, 319.7, 72.3, 289.3],
            ],
          },
        ]),
      };
    function kt(t, r) {
      var i = t,
        e = -60 + r;
      return [
        {
          d: -1,
          v: [
            ['m', -40 + i, e, { x: 0, y: 0, r: $(-40 + i, e, 0 + i, 60 + e) }],
            ['l', 0 + i, 60 + e, { x: 0, y: 0, f: 1 }],
          ],
        },
      ];
    }
    function Dt(t, r) {
      var i = t,
        e = -60 + r;
      return [
        {
          d: -1,
          v: [
            ['m', 40 + i, e, { x: 0, y: 0, r: $(40 + i, e, 0 + i, 60 + e) }],
            ['l', 0 + i, 60 + e, { x: 0, y: 0, f: 1 }],
          ],
        },
      ];
    }
    function Tt(t, r) {
      var i = -68 + t,
        e = 0 + r;
      return [
        {
          d: -1,
          v: [
            [
              'm',
              0 + i,
              50 + e,
              { r: $(0 + i, 50 + e, 66.5 + i, 0 + e), y: 0, x: 0 },
            ],
            [
              'l',
              66.5 + i,
              0 + e,
              { r: $(0 + i, 50 + e, 66.5 + i, 0 + e), y: 0, x: 0, f: 1 },
            ],
            [
              'l',
              69.5 + i,
              0 + e,
              {
                r: $(69.5 + i, 0 + e, 136 + i, 50 + e),
                y: 0,
                x: 0,
                f: 1,
                v: 1,
              },
            ],
            ['l', 136 + i, 50 + e, { y: 0, x: 0, f: 1 }],
          ],
        },
      ];
    }
    function It(t, r) {
      var i = t - 76.24,
        e = r;
      return [
        {
          d: 1,
          v: [
            [
              'm',
              159.52 + i,
              16.56 + e,
              {
                x: -1,
                y: -0.2,
                r: tt(
                  159.52 + i,
                  16.56 + e,
                  150.08 + i,
                  29.28 + e,
                  134.56 + i,
                  37.68 + e,
                  118.56 + i,
                  37.68 + e,
                  0,
                ),
                f: 1,
              },
            ],
            [
              'b',
              150.08 + i,
              29.28 + e,
              134.56 + i,
              37.68 + e,
              118.56 + i,
              37.68 + e,
              { x: -1, y: -0.2, r: U },
            ],
            [
              'b',
              103.28 + i,
              37.68 + e,
              89.68 + i,
              29.28 + e,
              76.24 + i,
              20.4 + e,
              { x: -1, y: -0.2 },
            ],
            [
              'b',
              61.44 + i,
              10.56 + e,
              47.28 + i,
              0 + e,
              31.68 + i,
              0 + e,
              { x: -1, y: -0.2, r: U },
            ],
            [
              'b',
              17.84 + i,
              0 + e,
              8.72 + i,
              7.12 + e,
              0 + i,
              16 + e,
              { x: -1, y: -0.2 },
            ],
          ],
        },
      ];
    }
    function Rt(t, r) {
      return [
        { d: 1, v: [['a', -50 + t, r, { x: 0, y: 0 }]] },
        { d: 1, v: [['a', 50 + t, r, { x: 0, y: 0 }]] },
      ];
    }
    function Ft(t, r) {
      var i = t - 57,
        e = r;
      return [
        {
          d: 1,
          v: [
            [
              'm',
              112.7 + i,
              0 + e,
              {
                r: tt(
                  112.7 + i,
                  0 + e + i,
                  10.1 + e,
                  110.1 + i,
                  19.3 + e,
                  105 + i,
                  27.7 + e,
                  0,
                ),
                x: 0,
                y: 0,
                f: 1,
              },
            ],
            [
              'b',
              112.7 + i,
              10.1 + e,
              110.1 + i,
              19.3 + e,
              105 + i,
              27.7 + e,
              { x: 0, y: 0 },
            ],
            [
              'b',
              99.8 + i,
              36.1 + e,
              92.9 + i,
              42.8 + e,
              84.3 + i,
              47.7 + e,
              { x: 0, y: 0 },
            ],
            [
              'b',
              75.7 + i,
              52.6 + e,
              66.7 + i,
              55 + e,
              57.3 + i,
              55 + e,
              { x: 0, y: 0 },
            ],
            [
              'b',
              47.5 + i,
              55 + e,
              38.3 + i,
              52.6 + e,
              29.6 + i,
              47.7 + e,
              { x: 0, y: 0 },
            ],
            [
              'b',
              20.8 + i,
              42.8 + e,
              13.8 + i,
              36.1 + e,
              8.5 + i,
              27.7 + e,
              { x: 0, y: 0 },
            ],
            [
              'b',
              3.2 + i,
              19.3 + e,
              0.5 + i,
              10.1 + e,
              0.5 + i,
              0 + e,
              { x: 0, y: 0 },
            ],
          ],
        },
      ];
    }
    function Mt(t, r) {
      var i = 88 + t,
        e = -116 + r;
      return [
        {
          d: 1,
          v: [
            ['m', 116 + i, 58 + e, { r: Q, p: 1, f: 1 }],
            [
              'b',
              116 + i,
              90.05 + e,
              90.05 + i,
              116 + e,
              58 + i,
              116 + e,
              { r: U },
            ],
            [
              'b',
              25.95 + i,
              116 + e,
              0 + i,
              90.05 + e,
              0 + i,
              58 + e,
              { r: Q },
            ],
            ['b', 0 + i, 25.95 + e, 25.95 + i, 0 + e, 58 + i, 0 + e, { r: U }],
            [
              'b',
              90.05 + i,
              0 + e,
              116 + i,
              25.95 + e,
              116 + i,
              58 + e,
              { r: Q, c: 1 },
            ],
          ],
        },
      ];
    }
    function Gt(t, r) {
      return [
        {
          d: 1,
          v: [
            ['m', t - 40, r, { x: 0, y: 1, r: U }],
            ['l', 100 + t, r, { x: 0, y: 1, f: 1 }],
          ],
        },
      ];
    }
    function zt(t, r) {
      return [
        {
          d: -1,
          v: [
            ['m', t, r, { p: 1 }],
            ['b', 9.3 + t, 11.6 + r, 15.6 + t, 27.1 + r, 15.6 + t, 40.9 + r],
            [
              'b',
              15.6 + t,
              83.3 + r,
              -18.2 + t,
              107.8 + r,
              -59.5 + t,
              107.8 + r,
            ],
            [
              'b',
              -70.9 + t,
              107.8 + r,
              -82.9 + t,
              106.2 + r,
              -93.7 + t,
              102.7 + r,
              { x: 0.5, f: 1 },
            ],
          ],
        },
      ];
    }
    function Lt(t, r) {
      return [
        {
          d: -1,
          v: [
            ['m', t, r, { p: 1 }],
            [
              'b',
              -19.6 + t,
              14.8 + r,
              -42.2 + t,
              37.9 + r,
              -42.2 + t,
              64.1 + r,
            ],
            [
              'b',
              -42.2 + t,
              100.3 + r,
              30.2 - 42.2 + t,
              118.8 + r,
              21.4 + t,
              118.8 + r,
            ],
            [
              'b',
              68.3 - 42.2 + t,
              118.8 + r,
              72.9 - 42.2 + t,
              118.4 + r,
              35.2 + t,
              117.6 + r,
              { x: 0.5, f: 1 },
            ],
          ],
        },
      ];
    }
    function jt(t, r) {
      return [{ d: 1, v: [['a', t, r, { x: 0, y: 0 }]] }];
    }
    function Ct(t, r) {
      var i = -68 + t,
        e = r;
      return [
        {
          d: -1,
          v: [
            ['m', 0 + i, e, { r: $(0 + i, e, 66.5 + i, 50 + e), y: 0, x: 0 }],
            [
              'l',
              66.5 + i,
              50 + e,
              { r: $(0 + i, e, 66.5 + i, 50 + e), y: 0, x: 0, f: 1 },
            ],
            [
              'l',
              69.5 + i,
              50 + e,
              { r: $(69.5 + i, 50 + e, 136 + i, e), y: 0, x: 0, f: 1, v: 1 },
            ],
            ['l', 136 + i, e, { y: 0, x: 0, f: 1 }],
          ],
        },
      ];
    }
    function At(t, r) {
      return [
        {
          d: 1,
          v: [
            ['m', t - 50, r, { x: 0, y: 0 }],
            ['l', t + 50, r, { x: 0, y: 0, f: 1 }],
          ],
        },
      ];
    }
    var qt,
      Xt,
      Et = [
        {
          d: 1,
          v: [
            ['m', 0, 352, { y: 0, f: 1 }],
            ['l', 0, 130, { y: -3 }],
          ],
        },
      ],
      Bt = [
        {
          d: 1,
          v: [
            [
              'm',
              -115.9,
              444,
              {
                x: 0.4,
                y: 0.63,
                r: tt(
                  -115.9,
                  444,
                  12.6 - 115.9,
                  454.4,
                  29.6 - 115.9,
                  460.2,
                  -70,
                  461.2,
                  0,
                ),
                f: 1,
              },
            ],
            [
              'b',
              12.6 - 115.9,
              454.4,
              29.6 - 115.9,
              460.2,
              -70,
              461.2,
              { x: 0.4, y: 0.63, r: U },
            ],
            [
              'b',
              84.5 - 115.9,
              463.5,
              0,
              435.1,
              0,
              396.4,
              { x: 0.4, y: 0.63, r: Q },
            ],
            ['l', 0, 130, { y: -3 }],
          ],
        },
      ],
      Ht = {
        Æ: Y(996, 426, 352, 0, 0, 0, 0, [
          {
            d: -1,
            v: [
              ['m', 426, 0, { x: 0, r: U }],
              ['l', 234, 0, { x: 0.5, f: 1, r: $(234, 0, 0, 352) }],
              ['l', 0, 352, { x: 0.5, y: 0.5, f: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 234, 0, { x: 0.5, p: 1 }],
              ['l', 234, 352, { f: 1, x: 0.5 }],
              ['l', 426, 352, { f: 1, x: 0 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 76.4, 237, { r: U, p: 1 }],
              ['l', 234, 237, { f: 1, r: U, p: 1 }],
            ],
          },
          {
            d: -1,
            v: [
              ['m', 234, 164, { r: U, p: 1, x: 0.5 }],
              ['l', 414, 164, { f: 1, x: 0 }],
            ],
          },
        ]),
        æ: Y(1e3, 457.5, 232, 0, 0, -64, -64, [
          {
            d: -1,
            v: [
              ['m', 232, 8, { y: -3.4, r: Q }],
              ['l', 232, 116, { r: V }],
              ['b', 232, 180.1, 180.1, 232, 116, 232, { r: U }],
              ['b', 51.9, 232, 0, 180.1, 0, 116, { r: Q }],
              ['b', 0, 51.9, 51.9, 0, 116, 0, { r: U }],
              ['b', 180.1, 0, 232, 51.9, 232, 116, { r: Q }],
              ['l', 232, 224, { y: -0.1, r: Q, f: 1 }],
            ],
          },
          {
            d: 1,
            v: [
              [
                'm',
                443.6,
                182.9,
                {
                  r: tt(
                    443.6,
                    182.9,
                    423.1,
                    213.2,
                    388.1,
                    233.1,
                    348.5,
                    233.1,
                    0,
                  ),
                  f: 1,
                },
              ],
              ['b', 423.1, 213.2, 388.1, 233.1, 348.5, 233.1, { r: U }],
              ['b', 284.4, 233.1, 232.5, 181.2, 232.5, 117.1, { r: Q }],
              ['b', 232.5, 53, 284.4, 1.1, 348.5, 1.1, { r: U }],
              ['b', 408.4, 1.1, 456.9, 47.2, 457.5, 106.1, { r: Q }],
              ['l', 232.5, 106.1, { r: Q, p: 1 }],
            ],
          },
        ]),
        À: Y(
          620,
          290,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(rt)).concat(kt(145, -50)),
        ),
        Á: Y(
          620,
          290,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(rt)).concat(Dt(145, -50)),
        ),
        Â: Y(
          620,
          290,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(rt)).concat(Tt(145, -100)),
        ),
        Ã: Y(
          620,
          290,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(rt)).concat(It(145, -90)),
        ),
        Ä: Y(
          620,
          290,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(rt)).concat(Rt(145, -70)),
        ),
        Å: Y(
          620,
          290,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(rt)).concat(Mt(0, 0)),
        ),
        Ă: Y(
          620,
          290,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(rt)).concat(Ft(145, -110)),
        ),
        Ą: Y(
          620,
          290,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(rt)).concat(Lt(290, 352)),
        ),
        à: Y(
          600,
          232,
          232,
          10,
          2,
          -64,
          -64,
          JSON.parse(JSON.stringify(vt)).concat(kt(116, -60)),
        ),
        á: Y(
          600,
          232,
          232,
          10,
          2,
          -64,
          -64,
          JSON.parse(JSON.stringify(vt)).concat(Dt(116, -60)),
        ),
        â: Y(
          600,
          232,
          232,
          10,
          2,
          -64,
          -64,
          JSON.parse(JSON.stringify(vt)).concat(Tt(116, -110)),
        ),
        ã: Y(
          600,
          232,
          232,
          10,
          2,
          -64,
          -64,
          JSON.parse(JSON.stringify(vt)).concat(It(116, -100)),
        ),
        ä: Y(
          600,
          232,
          232,
          10,
          2,
          -64,
          -64,
          JSON.parse(JSON.stringify(vt)).concat(Rt(116, -80)),
        ),
        å: Y(
          600,
          232,
          232,
          10,
          2,
          -64,
          -64,
          JSON.parse(JSON.stringify(vt)).concat(Mt(-30, 0)),
        ),
        ă: Y(
          600,
          232,
          232,
          10,
          2,
          -64,
          -64,
          JSON.parse(JSON.stringify(vt)).concat(Ft(116, -120)),
        ),
        ą: Y(
          600,
          232,
          232,
          10,
          2,
          -64,
          -64,
          JSON.parse(JSON.stringify(vt)).concat(Lt(232, 224)),
        ),
        Ć: Y(
          700,
          293.1,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(it)).concat(kt(180, -60)),
        ),
        Ĉ: Y(
          700,
          293.1,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(it)).concat(Tt(180, -110)),
        ),
        Ċ: Y(
          700,
          293.1,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(it)).concat(jt(180, -80)),
        ),
        Č: Y(
          700,
          293.1,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(it)).concat(Ct(180, -110)),
        ),
        Ç: Y(
          700,
          293.1,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(it)).concat(zt(180, 360)),
        ),
        ć: Y(
          520,
          212.1,
          233.1,
          2,
          -10,
          -64,
          -64,
          JSON.parse(JSON.stringify(xt)).concat(kt(116.5, -68.9)),
        ),
        ĉ: Y(
          520,
          212.1,
          233.1,
          2,
          -10,
          -64,
          -64,
          JSON.parse(JSON.stringify(xt)).concat(Tt(116.5, -118.9)),
        ),
        ċ: Y(
          520,
          212.1,
          233.1,
          2,
          -10,
          -64,
          -64,
          JSON.parse(JSON.stringify(xt)).concat(jt(116.5, -88.9)),
        ),
        č: Y(
          520,
          212.1,
          233.1,
          2,
          -10,
          -64,
          -64,
          JSON.parse(JSON.stringify(xt)).concat(Ct(116.5, -118.9)),
        ),
        ç: Y(
          520,
          212.1,
          233.1,
          2,
          -10,
          -64,
          -64,
          JSON.parse(JSON.stringify(xt)).concat(zt(116.5, 233.1)),
        ),
        Đ: Y(
          721,
          270,
          352,
          -10,
          -10,
          0,
          0,
          JSON.parse(JSON.stringify(et)).concat(Gt(0, 176)),
        ),
        Ď: Y(
          721,
          270,
          352,
          -10,
          -10,
          0,
          0,
          JSON.parse(JSON.stringify(et)).concat(Ct(100, -110)),
        ),
        ď: Y(
          600,
          232,
          352,
          10,
          2,
          0,
          0,
          JSON.parse(JSON.stringify(ut)).concat(
            ((qt = 300),
            (Xt = 0),
            [
              {
                d: -1,
                v: [
                  ['m', qt, Xt, { x: 0, y: 0 }],
                  ['l', qt, 80 + Xt, { x: 0, y: 0, f: 1 }],
                ],
              },
            ]),
          ),
        ),
        đ: Y(
          600,
          232,
          352,
          10,
          2,
          0,
          0,
          JSON.parse(JSON.stringify(ut)).concat(Gt(180, 40)),
        ),
        È: Y(
          520,
          192,
          352,
          -5,
          -80,
          0,
          0,
          JSON.parse(JSON.stringify(at)).concat(kt(96, -60)),
        ),
        É: Y(
          520,
          192,
          352,
          -5,
          -80,
          0,
          0,
          JSON.parse(JSON.stringify(at)).concat(Dt(96, -60)),
        ),
        Ê: Y(
          520,
          192,
          352,
          -5,
          -80,
          0,
          0,
          JSON.parse(JSON.stringify(at)).concat(Tt(96, -110)),
        ),
        Ë: Y(
          520,
          192,
          352,
          -5,
          -80,
          0,
          0,
          JSON.parse(JSON.stringify(at)).concat(Rt(96, -80)),
        ),
        Ē: Y(
          520,
          192,
          352,
          -5,
          -80,
          0,
          0,
          JSON.parse(JSON.stringify(at)).concat(At(96, -80)),
        ),
        Ĕ: Y(
          520,
          192,
          352,
          -5,
          -80,
          0,
          0,
          JSON.parse(JSON.stringify(at)).concat(Ft(96, -120)),
        ),
        Ė: Y(
          520,
          192,
          352,
          -5,
          -80,
          0,
          0,
          JSON.parse(JSON.stringify(at)).concat(jt(96, -80)),
        ),
        Ě: Y(
          520,
          192,
          352,
          -5,
          -80,
          0,
          0,
          JSON.parse(JSON.stringify(at)).concat(Ct(96, -110)),
        ),
        è: Y(
          570,
          225.5,
          233.1,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(gt)).concat(kt(112, -60)),
        ),
        é: Y(
          570,
          225.5,
          233.1,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(gt)).concat(Dt(112, -60)),
        ),
        ê: Y(
          570,
          225.5,
          233.1,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(gt)).concat(Tt(112, -110)),
        ),
        ë: Y(
          570,
          225.5,
          233.1,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(gt)).concat(Rt(112, -80)),
        ),
        ē: Y(
          570,
          225.5,
          233.1,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(gt)).concat(At(112, -80)),
        ),
        ĕ: Y(
          570,
          225.5,
          233.1,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(gt)).concat(Ft(112, -120)),
        ),
        ė: Y(
          570,
          225.5,
          233.1,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(gt)).concat(jt(112, -90)),
        ),
        ě: Y(
          570,
          225.5,
          233.1,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(gt)).concat(Ct(112, -120)),
        ),
        Ĝ: Y(
          840,
          352,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(st)).concat(Tt(180, -110)),
        ),
        Ğ: Y(
          840,
          352,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(st)).concat(Ft(180, -120)),
        ),
        Ġ: Y(
          840,
          352,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(st)).concat(jt(180, -80)),
        ),
        Ģ: Y(
          840,
          352,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(st)).concat(zt(180, 360)),
        ),
        ĝ: Y(
          600,
          232,
          338,
          10,
          2,
          -117,
          -117,
          JSON.parse(JSON.stringify(bt)).concat(Tt(116, -118.9)),
        ),
        ğ: Y(
          600,
          232,
          338,
          10,
          2,
          -117,
          -117,
          JSON.parse(JSON.stringify(bt)).concat(Ft(116, -120)),
        ),
        ġ: Y(
          600,
          232,
          338,
          10,
          2,
          -117,
          -117,
          JSON.parse(JSON.stringify(bt)).concat(jt(116, -90)),
        ),
        ģ: Y(
          600,
          232,
          338,
          10,
          2,
          -117,
          -117,
          JSON.parse(JSON.stringify(bt)).concat(Dt(116, -70)),
        ),
        Ĥ: Y(
          684,
          232,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(nt)).concat(Tt(116, -110)),
        ),
        ĥ: Y(
          520,
          182,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(St)).concat(Tt(91, -110)),
        ),
        Ì: Y(
          249,
          0,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(lt)).concat(kt(0, -60)),
        ),
        Í: Y(
          249,
          0,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(lt)).concat(Dt(0, -60)),
        ),
        Î: Y(
          249,
          0,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(lt)).concat(Tt(0, -110)),
        ),
        Ï: Y(
          249,
          0,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(lt)).concat(Rt(0, -80)),
        ),
        ì: Y(
          200,
          0,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(Et)).concat(kt(0, 70)),
        ),
        í: Y(
          200,
          0,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(Et)).concat(Dt(0, 70)),
        ),
        î: Y(
          200,
          0,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(Et)).concat(Tt(0, 10)),
        ),
        ï: Y(
          200,
          0,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(Et)).concat(Rt(0, 50)),
        ),
        Ĵ: Y(
          472,
          172.5,
          355.5,
          10,
          20,
          -2,
          -2,
          JSON.parse(JSON.stringify(ft)).concat(Tt(172.5, -110)),
        ),
        ĵ: Y(
          220,
          115.9,
          352,
          -60,
          -60,
          0,
          0,
          JSON.parse(JSON.stringify(Bt)).concat(Tt(0, 20)),
        ),
        Ñ: Y(
          721,
          250,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(ot)).concat(It(125, -100)),
        ),
        ñ: Y(
          520,
          182,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(mt)).concat(It(91, 30)),
        ),
        Ò: Y(
          850,
          360,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(ht)).concat(kt(180, -60)),
        ),
        Ó: Y(
          850,
          360,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(ht)).concat(Dt(180, -60)),
        ),
        Ô: Y(
          850,
          360,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(ht)).concat(Tt(180, -110)),
        ),
        Õ: Y(
          850,
          360,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(ht)).concat(It(180, -100)),
        ),
        Ö: Y(
          850,
          360,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(ht)).concat(Rt(180, -80)),
        ),
        Ø: Y(
          850,
          360,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(ht)).concat([
            {
              d: 1,
              v: [
                ['m', 0, 360, { r: $(0, 360, 360, 0), f: 1, x: 0, y: 1 }],
                ['l', 360, 0, { x: 0, y: 1 }],
              ],
            },
          ]),
        ),
        ò: Y(
          580,
          232,
          232,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(Ot)).concat(kt(116, -60)),
        ),
        ó: Y(
          580,
          232,
          232,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(Ot)).concat(Dt(116, -60)),
        ),
        ô: Y(
          580,
          232,
          232,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(Ot)).concat(Tt(116, -110)),
        ),
        õ: Y(
          580,
          232,
          232,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(Ot)).concat(It(116, -100)),
        ),
        ö: Y(
          580,
          232,
          232,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(Ot)).concat(Rt(116, -80)),
        ),
        ø: Y(
          580,
          232,
          232,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(Ot)).concat([
            {
              d: 1,
              v: [
                ['m', 0, 232, { r: $(0, 232, 232, 0), f: 1, x: 0, y: 1 }],
                ['l', 232, 0, { x: 0, y: 1 }],
              ],
            },
          ]),
        ),
        Ŝ: Y(
          560,
          224,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(yt)).concat(Tt(112.4, -110)),
        ),
        ŝ: Y(
          400,
          143.808,
          231.12,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(Jt)).concat(Tt(112.4 * 0.642, -110)),
        ),
        Ş: Y(
          560,
          224,
          360,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(yt)).concat(zt(110.3, 360)),
        ),
        ş: Y(
          400,
          143.808,
          231.12,
          0,
          0,
          -64,
          -64,
          JSON.parse(JSON.stringify(Jt)).concat(zt(70.8126, 231.12)),
        ),
        Ù: Y(
          712,
          250,
          355,
          0,
          0,
          -0.5,
          -0.5,
          JSON.parse(JSON.stringify(dt)).concat(kt(125, -50)),
        ),
        Ú: Y(
          712,
          250,
          355,
          0,
          0,
          -0.5,
          -0.5,
          JSON.parse(JSON.stringify(dt)).concat(Dt(125, -50)),
        ),
        Û: Y(
          712,
          250,
          355,
          0,
          0,
          -0.5,
          -0.5,
          JSON.parse(JSON.stringify(dt)).concat(Tt(125, -100)),
        ),
        Ŭ: Y(
          712,
          250,
          355,
          0,
          0,
          -0.5,
          -0.5,
          JSON.parse(JSON.stringify(dt)).concat(Ft(125, -110)),
        ),
        Ü: Y(
          712,
          250,
          355,
          0,
          0,
          -0.5,
          -0.5,
          JSON.parse(JSON.stringify(dt)).concat(Rt(125, -70)),
        ),
        ù: Y(
          520,
          182,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(Nt)).concat(kt(91, 70)),
        ),
        ú: Y(
          520,
          182,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(Nt)).concat(Dt(91, 70)),
        ),
        û: Y(
          520,
          182,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(Nt)).concat(Tt(91, 20)),
        ),
        ŭ: Y(
          520,
          182,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(Nt)).concat(Ft(91, 10)),
        ),
        ü: Y(
          520,
          182,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(Nt)).concat(Rt(91, 50)),
        ),
        Ý: Y(
          673,
          270,
          352,
          0,
          0,
          0,
          0,
          JSON.parse(JSON.stringify(ct)).concat(Dt(135, -60)),
        ),
        ý: Y(
          500,
          225.5,
          331.5,
          10,
          10,
          -119,
          -119,
          JSON.parse(JSON.stringify(_t)).concat(Dt(116.3, -60)),
        ),
        ÿ: Y(
          500,
          225.5,
          331.5,
          10,
          10,
          -119,
          -119,
          JSON.parse(JSON.stringify(_t)).concat(Rt(116.3, -90)),
        ),
      },
      Kt = Object.assign({}, pt, wt, Pt, Wt, Ht);
    function Qt(t) {
      var r = (Kt[t] || Kt.tofu).clone();
      return (r.v = t), r;
    }
    function Ut(t, r, i, e) {
      var a;
      return (
        (a =
          t.indexOf('\n') > 0
            ? t.split('\n')
            : t.indexOf('\\n') > 0
              ? t.split('\\n')
              : [t]),
        0 == i
          ? (function (t) {
              var r,
                i = [],
                e = t.length;
              for (r = 0; r < e; r++) i[r] = t[r].split('');
              return i;
            })(a)
          : e
            ? (function (t, r, i) {
                var e,
                  a,
                  n,
                  l,
                  f,
                  o,
                  h,
                  y,
                  d = 0,
                  c = 0,
                  p = [];
                for (n = t.length, a = 0; a < n; a++) {
                  for (
                    h = t[a], d = 0, 0, p[c] = [], f = h.length, l = 0;
                    l < f;
                    l++
                  )
                    (y = h[l]),
                      (e = Qt(y)),
                      (o = s(e, r)),
                      (d += o.w),
                      p[c].push(y),
                      d >= i && ((c += 1), (d = o.w), (p[c] = []));
                  c += 1;
                }
                var v = [];
                for (n = p.length, a = 0; a < n; a++)
                  (e = p[a]).length > 0 &&
                    (' ' == e[0] && e.shift(),
                    ' ' == e[e.length - 1] && e.pop(),
                    e.length > 0 && v.push(e));
                return v;
              })(a, r, i)
            : (function (t, r, i) {
                var e,
                  a,
                  n,
                  l,
                  f,
                  o,
                  h,
                  y,
                  d,
                  c,
                  p = 0,
                  v = 0,
                  x = 0,
                  u = [];
                for (y = t.length, f = 0; f < y; f++) {
                  for (
                    e = t[f].split(' '), u[x] = [], d = e.length, o = 0;
                    o < d;
                    o++
                  ) {
                    for (v = 0, a = e[o], c = a.length, h = 0; h < c; h++)
                      (n = Qt(a[h])), (l = s(n, r)), (v += l.w);
                    (n = Qt(' ')),
                      (l = s(n, r)),
                      (v += l.w),
                      (p += v) > i && ((p = v), (u[(x += 1)] = [])),
                      u[x].push(a);
                  }
                  (x += 1), (p = 0);
                }
                y = u.length;
                var g = [];
                for (f = 0; f < y; f++)
                  (n = u[f].join(' ').split('')).length > 0 && g.push(n);
                return g;
              })(a, r, i)
      );
    }
    function Vt(t, r) {
      return { c: (t - r) / 2, r: t - r, l: 0 };
    }
    class Yt {
      constructor() {
        (this.lineWidth_ = 1),
          (this.drawing_ = []),
          (this.data_ = null),
          (this.paths_ = null),
          (this.lines_ = null),
          (this.rect_ = { x: 0, y: 0, w: 0, h: 0 }),
          (this.align_ = 'left'),
          (this.scale_ = 1),
          (this.fontRatio_ = 1);
      }
      get data() {
        return this.data_;
      }
      get paths() {
        return this.paths_;
      }
      get lines() {
        return this.lines_;
      }
      set lines(t) {
        this.lines_ = t;
      }
      get lineWidth() {
        return this.lineWidth_;
      }
      get fontRatio() {
        return this.fontRatio_;
      }
      get scale() {
        return this.scale_;
      }
      get rect() {
        return this.rect_;
      }
      get drawing() {
        return this.drawing_;
      }
      set align(t) {
        this.align_ != t && ((this.align_ = t), this.setPosition());
      }
      get align() {
        return this.align_;
      }
      position(t, r) {
        return (
          (this.rect_.x != t || this.rect_.y != r) &&
          ((this.rect_.x = t), (this.rect_.y = r), this.setPosition(), !0)
        );
      }
      setPosition() {
        var t,
          r,
          i,
          e,
          a = this.data_.length;
        for (t = 0; t < a; t++)
          ((r = this.data_[t]).rect.x =
            r.originPos.x +
            this.rect_.x +
            ((i = this.align_),
            (e = r.alignGapX),
            'center' == i ? e.c : 'right' == i ? e.r : e.l)),
            (r.rect.y = r.originPos.y + this.rect_.y);
      }
      updateDrawingPaths() {
        var t,
          r,
          i = this.data_.length;
        for (t = 0; t < i; t++)
          (r = this.data_[t]).drawingPaths = h(q(this, r, -1, !1), r);
      }
      updatePatternPaths(t) {
        var r,
          i,
          e = this.data_.length;
        for (r = 0; r < e; r++)
          (i = this.data_[r]).rawPaths = q(this, i, t, !0);
      }
      updateWavePaths(t) {
        var r,
          i,
          e = this.data_.length;
        for (r = 0; r < e; r++)
          (i = this.data_[r]).rawWavePaths = q(this, i, t, !1);
      }
      updateGuide() {
        var t,
          r,
          i = this.data_.length;
        for (t = 0; t < i; t++)
          ((r = this.data_[t]).guide = M(r.typo, this.scale)),
            (r.grid = G(r.typo, this.scale));
      }
      update(t, r, i, a, f, o, h) {
        var y = (function (t) {
            return ((70 - e) / (900 - e)) * (t - e) + e;
          })(a),
          d = (function (t) {
            return (1 / (80 - e)) * (t - e);
          })(y),
          c = (function (t) {
            return (54 / (80 - e)) * (t - e) + 4;
          })(y),
          p = (function (t) {
            return t / 500;
          })(f),
          v = (function (t, r) {
            return 50 * t * r;
          })(o, p),
          x = (function (t, r) {
            return 50 * t * r;
          })(h, p),
          u = (function (t) {
            return (0.78 - 1) * t + 1;
          })(d);
        (this.fontRatio_ = u),
          (this.scale_ = p),
          (this.lineWidth_ = (function (t, r) {
            var i = t * r;
            return i < 1 && (i = 1), i;
          })(y, p));
        var g,
          b,
          S,
          m,
          J,
          N,
          _,
          w,
          P,
          W = Ut(t, p, r, i),
          k = W.length,
          D = k - 1,
          T = 0,
          I = 0,
          R = 0,
          F = 0,
          M = 0,
          G = 0,
          z = [];
        for (g = 0; g < k; g++) {
          for (
            m = (S = (J = W[g]).length) - 1,
              T = 0,
              R = 0,
              z[g] = { tw: 0, arr: [] },
              b = 0;
            b < S;
            b++
          )
            (T += (w = s((N = Qt((_ = J[b]))), p)).w),
              (I = w.h),
              b < m && (T += v),
              g < D && (I += x),
              (w.x = R),
              (w.y = F),
              (P = { x: R, y: F }),
              (z[g].arr[b] = {
                str: _,
                typo: N,
                rect: w,
                originPos: P,
                center: n(w.w, w.h, p),
                range: l(N, d, c),
              }),
              (R = T);
          (F += I), (z[g].tw = T), (M = Math.max(M, T)), (G += I);
        }
        (this.rect_.w = M), (this.rect_.h = G), (this.drawing_ = []);
        var L,
          j,
          C = [];
        for (var A of z)
          for (var q of ((L = Vt(M, A.tw)), A.arr))
            for (var X of ((q.alignGapX = L),
            (q.pointsLength = O(q, this)),
            C.push(q),
            (j = { value: 1 }),
            this.drawing_.push(j),
            (q.drawing = j),
            q.typo.p))
              for (var E of ((X.cv = []), X.v)) X.cv.push(E.convert(q, this));
        (this.data_ = C), this.setPosition();
      }
      updatePathsForRect() {
        var t,
          r,
          i = this.data_.length,
          e = [];
        for (t = 0; t < i; t++)
          (r = this.data_[t]).rawWavePaths &&
            (r.wavePaths = h(r.rawWavePaths, r)),
            r.rawPaths &&
              ((r.paths = h(r.rawPaths, r)),
              Array.prototype.push.apply(e, r.paths));
        this.paths_ = e;
      }
      updateLinesForRect() {
        var t,
          r,
          i = this.data_.length;
        for (t = 0; t < i; t++) (r = this.data_[t]).lines = o(r);
      }
      reset() {
        (this.lineWidth_ = 1),
          (this.drawing_ = []),
          (this.data_ = null),
          (this.paths_ = null),
          (this.lines_ = null),
          (this.rect_ = { x: 0, y: 0, w: 0, h: 0 }),
          (this.align_ = 'left'),
          (this.scale_ = 1),
          (this.fontRatio_ = 1);
      }
    }
    class Zt extends class {
      constructor() {
        this.handlers_ = { update: { listeners: [] } };
      }
      on(t, r) {
        return 'function' != typeof r
          ? (console.error(
              'The listener callback must be a function, the given type is '.concat(
                typeof r,
              ),
            ),
            !1)
          : 'string' != typeof t
            ? (console.error(
                'The event name must be a string, the given type is '.concat(
                  typeof t,
                ),
              ),
              !1)
            : (void 0 === this.handlers_[t] &&
                (this.handlers_[t] = { listeners: [] }),
              void this.handlers_[t].listeners.push(r));
      }
      off(t, r) {
        if (void 0 === this.handlers_[t])
          return console.error('This event: '.concat(t, ' does not exist')), !1;
        this.handlers_[t].listeners = this.handlers_[t].listeners.filter(
          (t) => t.toString() !== r.toString(),
        );
      }
      dispatch(t, r) {
        this.handlers_[t].listeners.forEach((t) => {
          t(r);
        });
      }
    } {
      constructor() {
        var {
          text: t = '',
          size: r = 500,
          weight: i = e,
          color: a = ['#000000'],
          colorful: s = [
            '#c5d73f',
            '#9d529c',
            '#49a9db',
            '#fec330',
            '#5eb96e',
            '#fc5356',
            '#f38f31',
          ],
          tracking: n = 0,
          leading: l = 0,
          align: f = 'left',
          pathGap: o = 0.5,
          amplitude: h = 0.5,
          width: y = 0,
          breakWord: d = !1,
          fps: c = 30,
          isPath: p = !1,
          isWave: v = !1,
        } = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        super(),
          (this.size_ = r),
          (this.weight_ = i),
          (this.color_ = a),
          (this.colorful_ = (function (t) {
            for (var r, i, e = t.slice(), a = e.length, s = a; s--; )
              (r = (Math.random() * a) | 0),
                (i = e[s]),
                (e[s] = e[r]),
                (e[r] = i);
            return e;
          })(s)),
          (this.tracking_ = n),
          (this.leading_ = l),
          (this.pathGap_ = o),
          (this.amplitude_ = h),
          (this.width_ = y),
          (this.breakWord_ = d),
          (this.fps_ = c),
          (this.fpsTime_ = 1e3 / this.fps_),
          (this.isPath_ = p),
          (this.isWave_ = v),
          (this.model = new Yt()),
          (this.str_ = null),
          (this.time_ = null),
          (this.isFps_ = !1),
          (this.isForceRander_ = !1),
          (this.updateID_ = 0),
          (this.dPathsID_ = null),
          (this.pPathsID_ = null),
          (this.wPathsID_ = null),
          (this.guideID_ = null),
          (this.text = t),
          (this.model.align = f);
      }
      on(t, r) {
        super.on(t, r), this.update();
      }
      off(t, r) {
        super.off(t, r);
      }
      get text() {
        return this.str_;
      }
      set text(t) {
        this.str_ != t && ((this.str_ = t), this.update());
      }
      get size() {
        return this.size_;
      }
      set size(t) {
        this.size_ != t &&
          ((this.size_ = t), this.update(), (this.isForceRander_ = !0));
      }
      get weight() {
        return this.weight_;
      }
      set weight(t) {
        t < e ? (t = e) : t > 900 && (t = 900),
          this.weight_ != t &&
            ((this.weight_ = t), this.update(), (this.isForceRander_ = !0));
      }
      get color() {
        return this.color_;
      }
      set color(t) {
        this.color_ != t && (this.color_ = t);
      }
      get tracking() {
        return this.tracking_;
      }
      set tracking(t) {
        this.tracking_ != t &&
          ((this.tracking_ = t), this.update(), (this.isForceRander_ = !0));
      }
      get leading() {
        return this.leading_;
      }
      set leading(t) {
        this.leading_ != t &&
          ((this.leading_ = t), this.update(), (this.isForceRander_ = !0));
      }
      get align() {
        return this.model.align;
      }
      set align(t) {
        this.model.align != t &&
          ((this.model.align = t), this.updateID_++, this.updateSignal());
      }
      get pathGap() {
        return this.pathGap_;
      }
      set pathGap(t) {
        this.pathGap_ != t &&
          ((this.pathGap_ = t),
          this.updatePatternPaths(!0),
          this.updateWavePaths(!0),
          (this.isForceRander_ = !0));
      }
      get amplitude() {
        return this.amplitude_;
      }
      set amplitude(t) {
        this.amplitude_ = t;
      }
      get rect() {
        return this.model.rect;
      }
      set maxWidth(t) {
        this.width_ != t && ((this.width_ = t), this.update());
      }
      get maxWidth() {
        return this.width_;
      }
      set breakWord(t) {
        this.breakWord_ != t && ((this.breakWord_ = t), this.update());
      }
      get breakWord() {
        return this.breakWord_;
      }
      get isPath() {
        return this.isPath_;
      }
      set isPath(t) {
        (this.isPath_ = t), this.updatePatternPaths(!0);
      }
      get isWave() {
        return this.isWave_;
      }
      set isWave(t) {
        (this.isWave_ = t), this.updateWavePaths(!0);
      }
      get fps() {
        return this.fps_;
      }
      set fps(t) {
        (this.fps_ = t), (this.fpsTime_ = 1e3 / this.fps_);
      }
      get lineWidth() {
        return this.model.lineWidth;
      }
      get scale() {
        return this.model.scale;
      }
      get drawing() {
        return this.model.drawing;
      }
      get data() {
        return this.model.data;
      }
      get paths() {
        return this.model.paths;
      }
      get drawingPaths() {
        return this.model.drawingPaths;
      }
      get wavePaths() {
        return this.model.wavePaths;
      }
      position() {
        var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
          r =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        this.model.position(t, r) && (this.updateID_++, this.updateSignal());
      }
      update() {
        this.updateID_++,
          this.model.update(
            this.str_,
            this.width_,
            this.breakWord_,
            this.weight_,
            this.size_,
            this.tracking_,
            this.leading_,
          ),
          this.isPath_ || this.isWave_
            ? (this.updatePatternPaths(), this.updateWavePaths())
            : this.updateSignal();
      }
      updateGuide() {
        this.guideID_ != this.updateID_ &&
          ((this.guideID_ = this.updateID_), this.model.updateGuide());
      }
      updateDrawingPaths() {
        this.dPathsID_ != this.updateID_ &&
          ((this.dPathsID_ = this.updateID_), this.model.updateDrawingPaths());
      }
      updatePatternPaths(t) {
        this.isPath_ &&
          (t || this.pPathsID_ != this.updateID_) &&
          ((this.pPathsID_ = this.updateID_),
          this.model.updatePatternPaths(this.pathGap_),
          (this.isForceRander_ = !0),
          this.updateSignal());
      }
      updateWavePaths(t) {
        this.isWave_ &&
          (t || this.wPathsID_ != this.updateID_) &&
          ((this.wPathsID_ = this.updateID_),
          this.model.updateWavePaths(this.pathGap_),
          (this.isForceRander_ = !0),
          this.updateSignal());
      }
      updateSignal() {
        this.model.updateLinesForRect(),
          this.model.updatePathsForRect(),
          this.dispatch('update', this.model);
      }
      reset() {
        (this.size_ = 500),
          (this.weight_ = e),
          (this.color_ = ['#000000']),
          (this.tracking_ = 0),
          (this.leading_ = 0),
          (this.pathGap_ = 0.5),
          (this.amplitude_ = 0.5),
          (this.width_ = 0),
          (this.breakWord_ = !1),
          (this.fps_ = 30),
          (this.fpsTime_ = 1e3 / this.fps_),
          (this.isPath_ = !1),
          (this.isWave_ = !1),
          (this.str_ = null),
          (this.time_ = null),
          (this.isFps_ = !1),
          (this.isForceRander_ = !1),
          (this.updateID_ = 0),
          (this.dPathsID_ = null),
          (this.pPathsID_ = null),
          (this.wPathsID_ = null),
          (this.guideID_ = null),
          this.model.reset();
      }
      dispose() {
        this.reset(), (this.model = null);
      }
      drawPixi(t) {
        var r,
          i,
          e,
          a = this.model.data.length;
        for (r = 0; r < a; r++)
          (i = this.model.data[r]),
            (e = F(r, 0, this.color_)),
            T(t, i, this.lineWidth, e);
      }
      draw(t) {
        t.lineWidth = this.lineWidth;
        var r,
          i,
          e = this.model.data.length;
        for (r = 0; r < e; r++)
          m(t, r, (i = this.model.data[r]), this.color_), y(t, i);
      }
      drawColorful(t) {
        (t.lineWidth = this.lineWidth),
          (function (t, r, i) {
            (W = -1), (P = (x = i).length);
            var e,
              s,
              n,
              l,
              f,
              o,
              h,
              y,
              d,
              c,
              p = r.data.length;
            for (e = 0; e < p; e++)
              for (
                y = (s = r.data[e]).pointsLength.max,
                  c = 0,
                  l = s.lines.length,
                  h = null,
                  n = 0;
                n < l;
                n++
              )
                'a' == (o = (f = s.lines[n]).pos).type
                  ? (k(t),
                    t.beginPath(),
                    t.arc(o.x, o.y, o.radius * s.drawing.value, 0, a),
                    t.fill(),
                    t.closePath())
                  : 'm' == o.type
                    ? (h = o)
                    : 'l' == o.type
                      ? ((d = w(h.x, h.y, o.x, o.y)) / r.scale > 10 &&
                          (k(t),
                          t.beginPath(),
                          h && t.moveTo(h.x, h.y),
                          t.lineTo(o.x, o.y),
                          (c += D(t, f, d, y, s, c))),
                        (h = o))
                      : 'b' == o.type &&
                        ((d = N(h.x, h.y, o.x, o.y, o.x2, o.y2, o.x3, o.y3)) /
                          r.scale >
                          10 &&
                          (k(t),
                          t.beginPath(),
                          h && t.moveTo(h.x, h.y),
                          t.bezierCurveTo(o.x, o.y, o.x2, o.y2, o.x3, o.y3),
                          (c += D(t, f, d, y, s, c))),
                        (h = { x: o.x3, y: o.y3 }));
          })(t, this.model, this.colorful_);
      }
      wave(t, r) {
        ((t.lineWidth = this.lineWidth), r) &&
          (this.time_ || (this.time_ = r),
          r - this.time_ > this.fpsTime_ || this.isForceRander_
            ? ((this.time_ = r), (this.isFps_ = !0))
            : (this.isFps_ = !1));
        this.isForceRander_ = !1;
        var i,
          e,
          a = this.model.data.length;
        for (i = 0; i < a; i++)
          m(t, i, (e = this.model.data[i]), this.color_),
            b(
              t,
              e,
              this.model.scale,
              this.amplitude_,
              this.weight_,
              this.isFps_,
            );
      }
      pattern(t, r, i) {
        var e,
          a = r * this.model.scale,
          s = i * this.model.scale,
          n = this.model.data.length;
        for (e = 0; e < n; e++) S(t, this.model.data[e], a, s);
      }
      grid(t) {
        this.updateGuide();
        var r,
          i = this.model.data.length;
        for (r = 0; r < i; r++) v(t, this.model.data[r]);
      }
      point(t) {
        var r,
          i = this.model.data.length;
        for (r = 0; r < i; r++) d(t, this.model.data[r]);
      }
      box(t) {
        (t.lineWidth = 1),
          t.beginPath(),
          (t.strokeStyle = '#0b90dc'),
          t.rect(
            this.model.rect.x,
            this.model.rect.y,
            this.model.rect.w,
            this.model.rect.h,
          ),
          t.stroke();
      }
    }
  },
]);

export default LeonSans;
