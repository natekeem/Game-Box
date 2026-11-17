var GameBoxPlatform = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // platform-src/main.jsx
  var main_exports = {};
  __export(main_exports, {
    mountGamePlatform: () => mountGamePlatform
  });

  // node_modules/preact/dist/preact.module.js
  var n;
  var l;
  var u;
  var t;
  var i;
  var r;
  var o;
  var e;
  var f;
  var c;
  var a;
  var s;
  var h;
  var p;
  var v;
  var y;
  var d = {};
  var w = [];
  var _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  var g = Array.isArray;
  function m(n2, l3) {
    for (var u4 in l3) n2[u4] = l3[u4];
    return n2;
  }
  function b(n2) {
    n2 && n2.parentNode && n2.parentNode.removeChild(n2);
  }
  function k(l3, u4, t3) {
    var i3, r3, o3, e3 = {};
    for (o3 in u4) "key" == o3 ? i3 = u4[o3] : "ref" == o3 ? r3 = u4[o3] : e3[o3] = u4[o3];
    if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps) for (o3 in l3.defaultProps) void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
    return x(l3, e3, i3, r3, null);
  }
  function x(n2, t3, i3, r3, o3) {
    var e3 = { type: n2, props: t3, key: i3, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
    return null == o3 && null != l.vnode && l.vnode(e3), e3;
  }
  function S(n2) {
    return n2.children;
  }
  function C(n2, l3) {
    this.props = n2, this.context = l3;
  }
  function $(n2, l3) {
    if (null == l3) return n2.__ ? $(n2.__, n2.__i + 1) : null;
    for (var u4; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) return u4.__e;
    return "function" == typeof n2.type ? $(n2) : null;
  }
  function I(n2) {
    if (n2.__P && n2.__d) {
      var u4 = n2.__v, t3 = u4.__e, i3 = [], r3 = [], o3 = m({}, u4);
      o3.__v = u4.__v + 1, l.vnode && l.vnode(o3), q(n2.__P, o3, u4, n2.__n, n2.__P.namespaceURI, 32 & u4.__u ? [t3] : null, i3, null == t3 ? $(u4) : t3, !!(32 & u4.__u), r3), o3.__v = u4.__v, o3.__.__k[o3.__i] = o3, D(i3, o3, r3), u4.__e = u4.__ = null, o3.__e != t3 && P(o3);
    }
  }
  function P(n2) {
    if (null != (n2 = n2.__) && null != n2.__c) return n2.__e = n2.__c.base = null, n2.__k.some(function(l3) {
      if (null != l3 && null != l3.__e) return n2.__e = n2.__c.base = l3.__e;
    }), P(n2);
  }
  function A(n2) {
    (!n2.__d && (n2.__d = true) && i.push(n2) && !H.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(H);
  }
  function H() {
    try {
      for (var n2, l3 = 1; i.length; ) i.length > l3 && i.sort(e), n2 = i.shift(), l3 = i.length, I(n2);
    } finally {
      i.length = H.__r = 0;
    }
  }
  function L(n2, l3, u4, t3, i3, r3, o3, e3, f4, c3, a3) {
    var s3, h3, p3, v3, y3, _3, g4 = t3 && t3.__k || w, m3 = l3.length;
    for (f4 = T(u4, l3, g4, f4, m3), s3 = 0; s3 < m3; s3++) null != (p3 = u4.__k[s3]) && (h3 = -1 != p3.__i && g4[p3.__i] || d, p3.__i = s3, _3 = q(n2, p3, h3, i3, r3, o3, e3, f4, c3, a3), v3 = p3.__e, p3.ref && h3.ref != p3.ref && (h3.ref && J(h3.ref, null, p3), a3.push(p3.ref, p3.__c || v3, p3)), null == y3 && null != v3 && (y3 = v3), 4 & p3.__u ? (f4 = j(p3, f4, n2), h3.__e && (h3.__e = null)) : "function" == typeof p3.type && void 0 !== _3 ? f4 = _3 : v3 && (f4 = v3.nextSibling), p3.__u &= -7);
    return u4.__e = y3, f4;
  }
  function T(n2, l3, u4, t3, i3) {
    var r3, o3, e3, f4, c3, a3 = u4.length, s3 = a3, h3 = 0;
    for (n2.__k = new Array(i3), r3 = 0; r3 < i3; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? ("string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? o3 = n2.__k[r3] = x(null, o3, null, null, null) : g(o3) ? o3 = n2.__k[r3] = x(S, { children: o3 }, null, null, null) : void 0 === o3.constructor && o3.__b > 0 ? o3 = n2.__k[r3] = x(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : n2.__k[r3] = o3, f4 = r3 + h3, o3.__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = O(o3, u4, f4, s3)) && (s3--, (e3 = u4[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i3 > a3 ? h3-- : i3 < a3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f4 && (c3 == f4 - 1 ? h3-- : c3 == f4 + 1 ? h3++ : (c3 > f4 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
    if (s3) for (r3 = 0; r3 < a3; r3++) null != (e3 = u4[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = $(e3)), K(e3, e3));
    return t3;
  }
  function j(n2, l3, u4) {
    var t3, i3;
    if ("function" == typeof n2.type) {
      for (t3 = n2.__k, i3 = 0; t3 && i3 < t3.length; i3++) t3[i3] && (t3[i3].__ = n2, l3 = j(t3[i3], l3, u4));
      return l3;
    }
    n2.__e != l3 && (l3 && n2.type && !l3.parentNode && (l3 = $(n2)), l3 = u4.insertBefore(n2.__e, l3 || null));
    do {
      l3 = l3 && l3.nextSibling;
    } while (null != l3 && 8 == l3.nodeType);
    return l3;
  }
  function F(n2, l3) {
    return l3 = l3 || [], null == n2 || "boolean" == typeof n2 || (g(n2) ? n2.some(function(n3) {
      F(n3, l3);
    }) : l3.push(n2)), l3;
  }
  function O(n2, l3, u4, t3) {
    var i3, r3, o3, e3 = n2.key, f4 = n2.type, c3 = l3[u4], a3 = null != c3 && 0 == (2 & c3.__u);
    if (null === c3 && null == e3 || a3 && e3 == c3.key && f4 == c3.type) return u4;
    if (t3 > (a3 ? 1 : 0)) {
      for (i3 = u4 - 1, r3 = u4 + 1; i3 >= 0 || r3 < l3.length; ) if (null != (c3 = l3[o3 = i3 >= 0 ? i3-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f4 == c3.type) return o3;
    }
    return -1;
  }
  function z(n2, l3, u4) {
    "-" == l3[0] ? n2.setProperty(l3, null == u4 ? "" : u4) : n2[l3] = null == u4 ? "" : "number" != typeof u4 || _.test(l3) ? u4 : u4 + "px";
  }
  function N(n2, l3, u4, t3, i3) {
    var r3, o3;
    n: if ("style" == l3) if ("string" == typeof u4) n2.style.cssText = u4;
    else {
      if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u4 && l3 in u4 || z(n2.style, l3, "");
      if (u4) for (l3 in u4) t3 && u4[l3] == t3[l3] || z(n2.style, l3, u4[l3]);
    }
    else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(s, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u4, u4 ? t3 ? u4[a] = t3[a] : (u4[a] = h, n2.addEventListener(l3, r3 ? v : p, r3)) : n2.removeEventListener(l3, r3 ? v : p, r3);
    else {
      if ("http://www.w3.org/2000/svg" == i3) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
        n2[l3] = null == u4 ? "" : u4;
        break n;
      } catch (n3) {
      }
      "function" == typeof u4 || (null == u4 || false === u4 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u4 ? "" : u4));
    }
  }
  function V(n2) {
    return function(u4) {
      if (this.l) {
        var t3 = this.l[u4.type + n2];
        if (null == u4[c]) u4[c] = h++;
        else if (u4[c] < t3[a]) return;
        return t3(l.event ? l.event(u4) : u4);
      }
    };
  }
  function q(n2, u4, t3, i3, r3, o3, e3, f4, c3, a3) {
    var s3, h3, p3, v3, y3, d3, _3, k3, x3, M3, I2, P4, A4, H3, T4, j4, F3 = u4.type;
    if (void 0 !== u4.constructor) return null;
    128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f4 = u4.__e = t3.__e]), (s3 = l.__b) && s3(u4);
    n: if ("function" == typeof F3) {
      h3 = e3.length;
      try {
        if (x3 = u4.props, M3 = F3.prototype && F3.prototype.render, I2 = (s3 = F3.contextType) && i3[s3.__c], P4 = s3 ? I2 ? I2.props.value : s3.__ : i3, t3.__c ? k3 = (p3 = u4.__c = t3.__c).__ = p3.__E : (M3 ? u4.__c = p3 = new F3(x3, P4) : (u4.__c = p3 = new C(x3, P4), p3.constructor = F3, p3.render = Q), I2 && I2.sub(p3), p3.state || (p3.state = {}), p3.__n = i3, v3 = p3.__d = true, p3.__h = [], p3._sb = []), M3 && null == p3.__s && (p3.__s = p3.state), M3 && null != F3.getDerivedStateFromProps && (p3.__s == p3.state && (p3.__s = m({}, p3.__s)), m(p3.__s, F3.getDerivedStateFromProps(x3, p3.__s))), y3 = p3.props, d3 = p3.state, p3.__v = u4, v3) M3 && null == F3.getDerivedStateFromProps && null != p3.componentWillMount && p3.componentWillMount(), M3 && null != p3.componentDidMount && p3.__h.push(p3.componentDidMount);
        else {
          if (M3 && null == F3.getDerivedStateFromProps && x3 !== y3 && null != p3.componentWillReceiveProps && p3.componentWillReceiveProps(x3, P4), u4.__v == t3.__v || !p3.__e && null != p3.shouldComponentUpdate && false === p3.shouldComponentUpdate(x3, p3.__s, P4)) {
            u4.__v != t3.__v && (p3.props = x3, p3.state = p3.__s, p3.__d = false), u4.__e = t3.__e, u4.__k = t3.__k, u4.__k.some(function(n3) {
              n3 && (n3.__ = u4);
            }), w.push.apply(p3.__h, p3._sb), p3._sb = [], p3.__h.length && e3.push(p3), f4 = $(t3);
            break n;
          }
          null != p3.componentWillUpdate && p3.componentWillUpdate(x3, p3.__s, P4), M3 && null != p3.componentDidUpdate && p3.__h.push(function() {
            p3.componentDidUpdate(y3, d3, _3);
          });
        }
        if (p3.context = P4, p3.props = x3, p3.__P = n2, p3.__e = false, A4 = l.__r, H3 = 0, M3) p3.state = p3.__s, p3.__d = false, A4 && A4(u4), s3 = p3.render(p3.props, p3.state, p3.context), w.push.apply(p3.__h, p3._sb), p3._sb = [];
        else do {
          p3.__d = false, A4 && A4(u4), s3 = p3.render(p3.props, p3.state, p3.context), p3.state = p3.__s;
        } while (p3.__d && ++H3 < 25);
        p3.state = p3.__s, null != p3.getChildContext && (i3 = m(m({}, i3), p3.getChildContext())), M3 && !v3 && null != p3.getSnapshotBeforeUpdate && (_3 = p3.getSnapshotBeforeUpdate(y3, d3)), T4 = null != s3 && s3.type === S && null == s3.key ? E(s3.props.children) : s3, f4 = L(n2, g(T4) ? T4 : [T4], u4, t3, i3, r3, o3, e3, f4, c3, a3), p3.base = u4.__e, u4.__u &= -161, p3.__h.length && e3.push(p3), k3 && (p3.__E = p3.__ = null);
      } catch (n3) {
        if (e3.length = h3, u4.__v = null, c3 || null != o3) {
          if (n3.then) {
            for (u4.__u |= c3 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; ) f4 = f4.nextSibling;
            null != o3 && (o3[o3.indexOf(f4)] = null), u4.__e = f4;
          } else if (null != o3) for (j4 = o3.length; j4--; ) b(o3[j4]);
        } else u4.__e = t3.__e;
        null == u4.__k && (u4.__k = t3.__k || []), n3.then || B(u4), l.__e(n3, u4, t3);
      }
    } else null == o3 && u4.__v == t3.__v ? (u4.__k = t3.__k, u4.__e = t3.__e) : f4 = u4.__e = G(t3.__e, u4, t3, i3, r3, o3, e3, c3, a3);
    return (s3 = l.diffed) && s3(u4), 128 & u4.__u ? void 0 : f4;
  }
  function B(n2) {
    n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(B));
  }
  function D(n2, u4, t3) {
    for (var i3 = 0; i3 < t3.length; i3++) J(t3[i3], t3[++i3], t3[++i3]);
    l.__c && l.__c(u4, n2), n2.some(function(u5) {
      try {
        n2 = u5.__h, u5.__h = [], n2.some(function(n3) {
          n3.call(u5);
        });
      } catch (n3) {
        l.__e(n3, u5.__v);
      }
    });
  }
  function E(n2) {
    return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : g(n2) ? n2.map(E) : void 0 !== n2.constructor ? null : m({}, n2);
  }
  function G(u4, t3, i3, r3, o3, e3, f4, c3, a3) {
    var s3, h3, p3, v3, y3, w3, _3, m3 = i3.props || d, k3 = t3.props, x3 = t3.type;
    if ("svg" == x3 ? o3 = "http://www.w3.org/2000/svg" : "math" == x3 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
      for (s3 = 0; s3 < e3.length; s3++) if ((y3 = e3[s3]) && "setAttribute" in y3 == !!x3 && (x3 ? y3.localName == x3 : 3 == y3.nodeType)) {
        u4 = y3, e3[s3] = null;
        break;
      }
    }
    if (null == u4) {
      if (null == x3) return document.createTextNode(k3);
      u4 = document.createElementNS(o3, x3, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
    }
    if (null == x3) m3 === k3 || c3 && u4.data == k3 || (u4.data = k3);
    else {
      if (e3 = "textarea" == x3 && null != k3.defaultValue ? null : e3 && n.call(u4.childNodes), !c3 && null != e3) for (m3 = {}, s3 = 0; s3 < u4.attributes.length; s3++) m3[(y3 = u4.attributes[s3]).name] = y3.value;
      for (s3 in m3) y3 = m3[s3], "dangerouslySetInnerHTML" == s3 ? p3 = y3 : "children" == s3 || s3 in k3 || "value" == s3 && "defaultValue" in k3 || "checked" == s3 && "defaultChecked" in k3 || N(u4, s3, null, y3, o3);
      for (s3 in k3) y3 = k3[s3], "children" == s3 ? v3 = y3 : "dangerouslySetInnerHTML" == s3 ? h3 = y3 : "value" == s3 ? w3 = y3 : "checked" == s3 ? _3 = y3 : c3 && "function" != typeof y3 || m3[s3] === y3 || N(u4, s3, y3, m3[s3], o3);
      if (h3) c3 || p3 && (h3.__html == p3.__html || h3.__html == u4.innerHTML) || (u4.innerHTML = h3.__html), t3.__k = [];
      else if (p3 && (u4.innerHTML = ""), L("template" == t3.type ? u4.content : u4, g(v3) ? v3 : [v3], t3, i3, r3, "foreignObject" == x3 ? "http://www.w3.org/1999/xhtml" : o3, e3, f4, e3 ? e3[0] : i3.__k && $(i3, 0), c3, a3), null != e3) for (s3 = e3.length; s3--; ) b(e3[s3]);
      c3 && "textarea" != x3 || (s3 = "value", "progress" == x3 && null == w3 ? u4.removeAttribute("value") : null != w3 && (w3 !== u4[s3] || "progress" == x3 && !w3 || "option" == x3 && w3 != m3[s3]) && N(u4, s3, w3, m3[s3], o3), s3 = "checked", null != _3 && _3 != u4[s3] && N(u4, s3, _3, m3[s3], o3));
    }
    return u4;
  }
  function J(n2, u4, t3) {
    try {
      if ("function" == typeof n2) {
        var i3 = "function" == typeof n2.__u;
        i3 && n2.__u(), i3 && null == u4 || (n2.__u = n2(u4));
      } else n2.current = u4;
    } catch (n3) {
      l.__e(n3, t3);
    }
  }
  function K(n2, u4, t3) {
    var i3, r3;
    if (l.unmount && l.unmount(n2), (i3 = n2.ref) && (i3.current && i3.current != n2.__e || J(i3, null, u4)), null != (i3 = n2.__c)) {
      if (i3.componentWillUnmount) try {
        i3.componentWillUnmount();
      } catch (n3) {
        l.__e(n3, u4);
      }
      i3.base = i3.__P = i3.__n = null;
    }
    if (i3 = n2.__k) for (r3 = 0; r3 < i3.length; r3++) i3[r3] && K(i3[r3], u4, t3 || "function" != typeof n2.type);
    t3 || b(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
  }
  function Q(n2, l3, u4) {
    return this.constructor(n2, u4);
  }
  function R(u4, t3, i3) {
    var r3, o3, e3, f4;
    t3 == document && (t3 = document.documentElement), l.__ && l.__(u4, t3), o3 = (r3 = "function" == typeof i3) ? null : i3 && i3.__k || t3.__k, e3 = [], f4 = [], q(t3, u4 = (!r3 && i3 || t3).__k = k(S, null, [u4]), o3 || d, d, t3.namespaceURI, !r3 && i3 ? [i3] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i3 ? i3 : o3 ? o3.__e : t3.firstChild, r3, f4), D(e3, u4, f4), u4.props.children = null;
  }
  n = w.slice, l = { __e: function(n2, l3, u4, t3) {
    for (var i3, r3, o3; l3 = l3.__; ) if ((i3 = l3.__c) && !i3.__) try {
      if ((r3 = i3.constructor) && null != r3.getDerivedStateFromError && (i3.setState(r3.getDerivedStateFromError(n2)), o3 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n2, t3 || {}), o3 = i3.__d), o3) return i3.__E = i3;
    } catch (l4) {
      n2 = l4;
    }
    throw n2;
  } }, u = 0, t = function(n2) {
    return null != n2 && void 0 === n2.constructor;
  }, C.prototype.setState = function(n2, l3) {
    var u4;
    u4 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m({}, this.state), "function" == typeof n2 && (n2 = n2(m({}, u4), this.props)), n2 && m(u4, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), A(this));
  }, C.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), A(this));
  }, C.prototype.render = S, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
    return n2.__v.__b - l3.__v.__b;
  }, H.__r = 0, f = Math.random().toString(8), c = "__d" + f, a = "__a" + f, s = /(PointerCapture)$|Capture$/i, h = 0, p = V(false), v = V(true), y = 0;

  // node_modules/preact/hooks/dist/hooks.module.js
  var t2;
  var r2;
  var u2;
  var i2;
  var o2 = 0;
  var f2 = [];
  var c2 = l;
  var e2 = c2.__b;
  var a2 = c2.__r;
  var v2 = c2.diffed;
  var l2 = c2.__c;
  var m2 = c2.unmount;
  var p2 = c2.__;
  function s2(n2, t3) {
    c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
    var u4 = r2.__H || (r2.__H = { __: [], __h: [] });
    return n2 >= u4.__.length && u4.__.push({}), u4.__[n2];
  }
  function d2(n2) {
    return o2 = 1, y2(D2, n2);
  }
  function y2(n2, u4, i3) {
    var o3 = s2(t2++, 2);
    if (o3.t = n2, !o3.__c && (o3.__ = [i3 ? i3(u4) : D2(void 0, u4), function(n3) {
      var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
      t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
    }], o3.__c = r2, !r2.__f)) {
      var f4 = function(n3, t3, r3) {
        if (!o3.__c.__H) return true;
        var u5 = false, i4 = o3.__c.props !== n3;
        if (o3.__c.__H.__.some(function(n4) {
          if (n4.__N) {
            u5 = true;
            var t4 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i4 = true);
          }
        }), c3) {
          var f5 = c3.call(this, n3, t3, r3);
          return u5 ? f5 || i4 : f5;
        }
        return !u5 || i4;
      };
      r2.__f = true;
      var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
      r2.componentWillUpdate = function(n3, t3, r3) {
        if (this.__e) {
          var u5 = c3;
          c3 = void 0, f4(n3, t3, r3), c3 = u5;
        }
        e3 && e3.call(this, n3, t3, r3);
      }, r2.shouldComponentUpdate = f4;
    }
    return o3.__N || o3.__;
  }
  function h2(n2, u4) {
    var i3 = s2(t2++, 3);
    !c2.__s && C2(i3.__H, u4) && (i3.__ = n2, i3.u = u4, r2.__H.__h.push(i3));
  }
  function A2(n2) {
    return o2 = 5, T2(function() {
      return { current: n2 };
    }, []);
  }
  function T2(n2, r3) {
    var u4 = s2(t2++, 7);
    return C2(u4.__H, r3) && (u4.__ = n2(), u4.__H = r3, u4.__h = n2), u4.__;
  }
  function q2(n2, t3) {
    return o2 = 8, T2(function() {
      return n2;
    }, t3);
  }
  function j2() {
    for (var n2; n2 = f2.shift(); ) {
      var t3 = n2.__H;
      if (n2.__P && t3) try {
        t3.__h.some(z2), t3.__h.some(B2), t3.__h = [];
      } catch (r3) {
        t3.__h = [], c2.__e(r3, n2.__v);
      }
    }
  }
  c2.__b = function(n2) {
    r2 = null, e2 && e2(n2);
  }, c2.__ = function(n2, t3) {
    n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), p2 && p2(n2, t3);
  }, c2.__r = function(n2) {
    a2 && a2(n2), t2 = 0;
    var i3 = (r2 = n2.__c).__H;
    i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.some(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
    })) : (i3.__h.some(z2), i3.__h.some(B2), i3.__h = [], t2 = 0)), u2 = r2;
  }, c2.diffed = function(n2) {
    v2 && v2(n2);
    var t3 = n2.__c;
    t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.some(function(n3) {
      n3.u && (n3.__H = n3.u, n3.u = void 0);
    })), u2 = r2 = null;
  }, c2.__c = function(n2, t3) {
    t3.some(function(n3) {
      try {
        n3.__h.some(z2), n3.__h = n3.__h.filter(function(n4) {
          return !n4.__ || B2(n4);
        });
      } catch (r3) {
        t3.some(function(n4) {
          n4.__h && (n4.__h = []);
        }), t3 = [], c2.__e(r3, n3.__v);
      }
    }), l2 && l2(n2, t3);
  }, c2.unmount = function(n2) {
    m2 && m2(n2);
    var t3, r3 = n2.__c;
    r3 && r3.__H && (r3.__H.__.some(function(n3) {
      try {
        z2(n3);
      } catch (n4) {
        t3 = n4;
      }
    }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
  };
  var k2 = "function" == typeof requestAnimationFrame;
  function w2(n2) {
    var t3, r3 = function() {
      clearTimeout(u4), k2 && cancelAnimationFrame(t3), setTimeout(n2);
    }, u4 = setTimeout(r3, 35);
    k2 && (t3 = requestAnimationFrame(r3));
  }
  function z2(n2) {
    var t3 = r2, u4 = n2.__c;
    "function" == typeof u4 && (n2.__c = void 0, u4()), r2 = t3;
  }
  function B2(n2) {
    var t3 = r2;
    n2.__c = n2.__(), r2 = t3;
  }
  function C2(n2, t3) {
    return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
      return t4 !== n2[r3];
    });
  }
  function D2(n2, t3) {
    return "function" == typeof t3 ? t3(n2) : t3;
  }

  // node_modules/preact/compat/dist/compat.module.js
  function g3(n2, t3) {
    for (var e3 in t3) n2[e3] = t3[e3];
    return n2;
  }
  function E2(n2, t3) {
    for (var e3 in n2) if ("__source" !== e3 && !(e3 in t3)) return true;
    for (var r3 in t3) if ("__source" !== r3 && n2[r3] !== t3[r3]) return true;
    return false;
  }
  function M2(n2, t3) {
    this.props = n2, this.context = t3;
  }
  (M2.prototype = new C()).isPureReactComponent = true, M2.prototype.shouldComponentUpdate = function(n2, t3) {
    return E2(this.props, n2) || E2(this.state, t3);
  };
  var T3 = l.__b;
  l.__b = function(n2) {
    n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T3 && T3(n2);
  };
  var A3 = "undefined" != typeof Symbol && Symbol.for && /* @__PURE__ */ Symbol.for("react.forward_ref") || 3911;
  var O2 = l.__e;
  l.__e = function(n2, t3, e3, r3) {
    if (n2.then) {
      for (var u4, o3 = t3; o3 = o3.__; ) if ((u4 = o3.__c) && u4.__c) return null == t3.__e && (t3.__e = e3.__e, t3.__k = e3.__k || []), u4.__c(n2, t3);
    }
    O2(n2, t3, e3, r3);
  };
  var U2 = l.unmount;
  function V2(n2, t3, e3) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g3({}, n2)).__c && (n2.__c.__P === e3 && (n2.__c.__P = t3), n2.__c.__e = true, n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return V2(n3, t3, e3);
    })), n2;
  }
  function W2(n2, t3, e3) {
    return n2 && e3 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return W2(n3, t3, e3);
    }), n2.__c && n2.__c.__P === t3 && (n2.__e && e3.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e3)), n2;
  }
  function P3() {
    this.__u = 0, this.o = null, this.__b = null;
  }
  function j3(n2) {
    var t3 = n2.__ && n2.__.__c;
    return t3 && t3.__a && t3.__a(n2);
  }
  function B3() {
    this.i = null, this.l = null;
  }
  l.unmount = function(n2) {
    var t3 = n2.__c;
    t3 && (t3.__z = true), t3 && t3.__R && t3.__R(), t3 && 32 & n2.__u && (n2.type = null), U2 && U2(n2);
  }, (P3.prototype = new C()).__c = function(n2, t3) {
    var e3 = t3.__c, r3 = this;
    null == r3.o && (r3.o = []), r3.o.push(e3);
    var u4 = j3(r3.__v), o3 = false, i3 = function() {
      o3 || r3.__z || (o3 = true, e3.__R = null, u4 ? u4(f4) : f4());
    };
    e3.__R = i3;
    var l3 = e3.__P;
    e3.__P = null;
    var f4 = function() {
      if (!--r3.__u) {
        if (r3.state.__a) {
          var n3 = r3.state.__a;
          r3.__v.__k[0] = W2(n3, n3.__c.__P, n3.__c.__O);
        }
        var t4;
        for (r3.setState({ __a: r3.__b = null }); t4 = r3.o.pop(); ) t4.__P = l3, t4.forceUpdate();
      }
    };
    r3.__u++ || 32 & t3.__u || r3.setState({ __a: r3.__b = r3.__v.__k[0] }), n2.then(i3, i3);
  }, P3.prototype.componentWillUnmount = function() {
    this.o = [];
  }, P3.prototype.render = function(n2, e3) {
    if (this.__b) {
      if (this.__v.__k) {
        var r3 = document.createElement("div"), o3 = this.__v.__k[0].__c;
        this.__v.__k[0] = V2(this.__b, r3, o3.__O = o3.__P);
      }
      this.__b = null;
    }
    var i3 = e3.__a && k(S, null, n2.fallback);
    return i3 && (i3.__u &= -33), [k(S, null, e3.__a ? null : n2.children), i3];
  };
  var H2 = function(n2, t3, e3) {
    if (++e3[1] === e3[0] && n2.l.delete(t3), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size)) for (e3 = n2.i; e3; ) {
      for (; e3.length > 3; ) e3.pop()();
      if (e3[1] < e3[0]) break;
      n2.i = e3 = e3[2];
    }
  };
  (B3.prototype = new C()).__a = function(n2) {
    var t3 = this, e3 = j3(t3.__v), r3 = t3.l.get(n2);
    return r3[0]++, function(u4) {
      var o3 = function() {
        t3.props.revealOrder ? (r3.push(u4), H2(t3, n2, r3)) : u4();
      };
      e3 ? e3(o3) : o3();
    };
  }, B3.prototype.render = function(n2) {
    this.i = null, this.l = /* @__PURE__ */ new Map();
    var t3 = F(n2.children);
    n2.revealOrder && "b" === n2.revealOrder[0] && t3.reverse();
    for (var e3 = t3.length; e3--; ) this.l.set(t3[e3], this.i = [1, 0, this.i]);
    return n2.children;
  }, B3.prototype.componentDidUpdate = B3.prototype.componentDidMount = function() {
    var n2 = this;
    this.l.forEach(function(t3, e3) {
      H2(n2, e3, t3);
    });
  };
  var q3 = "undefined" != typeof Symbol && Symbol.for && /* @__PURE__ */ Symbol.for("react.element") || 60103;
  var G2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
  var J2 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
  var K2 = /[A-Z0-9]/g;
  var Q2 = "undefined" != typeof document;
  var X2 = function(n2) {
    return ("undefined" != typeof Symbol && "symbol" == typeof /* @__PURE__ */ Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
  };
  function nn(n2, t3, e3) {
    return null == t3.__k && (t3.textContent = ""), R(n2, t3), "function" == typeof e3 && e3(), n2 ? n2.__c : null;
  }
  C.prototype.isReactComponent = true, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t3) {
    Object.defineProperty(C.prototype, t3, { configurable: true, get: function() {
      return this["UNSAFE_" + t3];
    }, set: function(n2) {
      Object.defineProperty(this, t3, { configurable: true, writable: true, value: n2 });
    } });
  });
  var en = l.event;
  l.event = function(n2) {
    return en && (n2 = en(n2)), n2.persist = function() {
    }, n2.isPropagationStopped = function() {
      return this.cancelBubble;
    }, n2.isDefaultPrevented = function() {
      return this.defaultPrevented;
    }, n2.nativeEvent = n2;
  };
  var rn;
  var un = { configurable: true, get: function() {
    return this.class;
  } };
  var on = l.vnode;
  l.vnode = function(n2) {
    "string" == typeof n2.type && (function(n3) {
      var t3 = n3.props, e3 = n3.type, u4 = {}, o3 = -1 == e3.indexOf("-");
      for (var i3 in t3) {
        var l3 = t3[i3];
        if (!("value" === i3 && "defaultValue" in t3 && null == l3 || Q2 && "children" === i3 && "noscript" === e3 || "class" === i3 || "className" === i3)) {
          var f4 = i3.toLowerCase();
          "defaultValue" === i3 && "value" in t3 && null == t3.value ? i3 = "value" : "download" === i3 && true === l3 ? l3 = "" : "translate" === f4 && "no" === l3 ? l3 = false : "o" === f4[0] && "n" === f4[1] ? "ondoubleclick" === f4 ? i3 = "ondblclick" : "onchange" !== f4 || "input" !== e3 && "textarea" !== e3 || X2(t3.type) ? "onfocus" === f4 ? i3 = "onfocusin" : "onblur" === f4 ? i3 = "onfocusout" : J2.test(i3) && (i3 = f4) : f4 = i3 = "oninput" : o3 && G2.test(i3) ? i3 = i3.replace(K2, "-$&").toLowerCase() : null === l3 && (l3 = void 0), "oninput" === f4 && u4[i3 = f4] && (i3 = "oninputCapture"), u4[i3] = l3;
        }
      }
      "select" == e3 && (u4.multiple && Array.isArray(u4.value) && (u4.value = F(t3.children).forEach(function(n4) {
        n4.props.selected = -1 != u4.value.indexOf(n4.props.value);
      })), null != u4.defaultValue && (u4.value = F(t3.children).forEach(function(n4) {
        n4.props.selected = u4.multiple ? -1 != u4.defaultValue.indexOf(n4.props.value) : u4.defaultValue == n4.props.value;
      }))), t3.class && !t3.className ? (u4.class = t3.class, Object.defineProperty(u4, "className", un)) : t3.className && (u4.class = u4.className = t3.className), n3.props = u4;
    })(n2), n2.$$typeof = q3, on && on(n2);
  };
  var ln = l.__r;
  l.__r = function(n2) {
    ln && ln(n2), rn = n2.__c;
  };
  var fn = l.diffed;
  l.diffed = function(n2) {
    fn && fn(n2);
    var t3 = n2.props, e3 = n2.__e;
    null != e3 && "textarea" === n2.type && "value" in t3 && t3.value !== e3.value && (e3.value = null == t3.value ? "" : t3.value), rn = null;
  };
  function pn(n2) {
    return !!n2.__k && (R(null, n2), true);
  }

  // node_modules/preact/compat/client.mjs
  function createRoot(container) {
    return {
      // eslint-disable-next-line
      render: function(children) {
        nn(children, container);
      },
      // eslint-disable-next-line
      unmount: function() {
        pn(container);
      }
    };
  }

  // platform-src/registry.js
  var GAME_REGISTRY = [
    {
      id: "roulette",
      name: "\uB9C8\uBE14 \uB8F0\uB81B",
      nameEn: "Marble Roulette",
      icon: "\u{1F52E}",
      badge: "Box2D \uBB3C\uB9AC \uCD94\uCCA8",
      category: "draw",
      tags: ["draw", "party"],
      minPlayers: 1,
      maxPlayers: 100,
      length: "1~3\uBD84",
      supportsSolo: true,
      supportsBot: false,
      supportsOnline: false,
      description: "Box2D \uBB3C\uB9AC \uC5D4\uC9C4 \uAE30\uBC18 \uAD6C\uC2AC \uB099\uD558 \uCD94\uCCA8 \uAC8C\uC784! \uC0AC\uB0B4 \uBD80\uC11C\uBCC4/\uC804\uCCB4 \uC9C1\uC6D0 \uBA85\uB2E8\uC744 \uBD88\uB7EC\uC640 \uACF5\uC815\uD558\uACE0 \uBC15\uC9C4\uAC10 \uB118\uCE58\uB294 \uCD94\uCCA8\uC744 \uC9C4\uD589\uD558\uACE0 \uACB0\uACFC\uB97C \uAE30\uB85D\uD569\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #ff0055, #ff7700)"
    },
    // ─── 15 Independent BattleBox Games ───
    {
      id: "reaction",
      name: "\uC21C\uBC1C\uB825 \uB300\uACB0",
      nameEn: "Reaction Battle",
      icon: "\u26A1",
      badge: "\uC21C\uBC1C\uB825 \xB7 5\uB77C\uC6B4\uB4DC",
      category: "speed",
      tags: ["bot", "online", "party"],
      minPlayers: 2,
      maxPlayers: 8,
      length: "5 \uB77C\uC6B4\uB4DC",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "\uC2E0\uD638\uAC00 \uCD08\uB85D\uC0C9(GO!)\uC73C\uB85C \uBC14\uB00C\uB294 \uC21C\uAC04 \uAC00\uC7A5 \uBE60\uB974\uAC8C \uD074\uB9AD\uD558\uC138\uC694! ms \uB2E8\uC704 \uBC18\uC751 \uC18D\uB3C4\uB85C \uC2B9\uBD80\uB97C \uACA8\uB8F9\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #00f0ff, #00ff88)"
    },
    {
      id: "speedtyping",
      name: "\uC2A4\uD53C\uB4DC \uD0C0\uC774\uD551",
      nameEn: "Speed Typing",
      icon: "\u2328\uFE0F",
      badge: "\uC601\uBB38 \uC18D\uD0C0 \xB7 10\uB2E8\uC5B4",
      category: "speed",
      tags: ["bot", "online"],
      minPlayers: 2,
      maxPlayers: 8,
      length: "10 \uB2E8\uC5B4",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "\uD654\uBA74\uC5D0 \uC81C\uC2DC\uB418\uB294 \uB2E8\uC5B4\uB97C \uAC00\uC7A5 \uBE60\uB974\uACE0 \uC815\uD655\uD558\uAC8C \uD0C0\uC774\uD551\uD558\uC5EC \uB192\uC740 WPM\uACFC \uC810\uC218\uB97C \uD68D\uB4DD\uD558\uC138\uC694.",
      gradient: "linear-gradient(135deg, #388bfd, #00f0ff)"
    },
    {
      id: "colormatch",
      name: "\uCEEC\uB7EC \uB9E4\uCE58",
      nameEn: "Color Match",
      icon: "\u{1F3A8}",
      badge: "\uC2A4\uD2B8\uB8F9 \uD6A8\uACFC \xB7 10\uB77C\uC6B4\uB4DC",
      category: "speed",
      tags: ["bot", "online", "party"],
      minPlayers: 2,
      maxPlayers: 8,
      length: "10 \uB77C\uC6B4\uB4DC",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "\uAE00\uC790\uC758 \uC758\uBBF8\uAC00 \uC544\uB2C8\uB77C \uAE00\uC790\uC5D0 \uCE60\uD574\uC9C4 \uC2E4\uC81C \uC0C9\uC0C1\uC744 \uBE60\uB974\uAC8C \uC120\uD0DD\uD558\uB294 \uB450\uB1CC \uC21C\uBC1C\uB825 \uAC8C\uC784\uC785\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #ff3366, #ffea00)"
    },
    {
      id: "tictactoe",
      name: "\uD2F1\uD0DD\uD1A0",
      nameEn: "Tic Tac Toe",
      icon: "\u2B55",
      badge: "\uC804\uB7B5 1:1 \xB7 \uBBF8\uB2C8\uB9E5\uC2A4 BOT",
      category: "strategy",
      tags: ["bot", "online"],
      minPlayers: 2,
      maxPlayers: 2,
      length: "1 \uAC8C\uC784",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "3\xD73 \uBCF4\uB4DC\uC5D0\uC11C \uAC00\uB85C\xB7\uC138\uB85C\xB7\uB300\uAC01\uC120 \uD55C \uC904\uC744 \uBA3C\uC800 \uC644\uC131\uD558\uB294 \uC815\uD1B5 1:1 \uC218\uC2F8\uC6C0 \uB300\uACB0\uC785\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #00f0ff, #ff00ff)"
    },
    {
      id: "connectfour",
      name: "\uC0AC\uBAA9 (Connect Four)",
      nameEn: "Connect Four",
      icon: "\u{1F534}",
      badge: "\uC804\uB7B5 1:1 \xB7 7\xD76 \uBCF4\uB4DC",
      category: "strategy",
      tags: ["bot", "online"],
      minPlayers: 2,
      maxPlayers: 2,
      length: "1 \uAC8C\uC784",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "7\uC5F4 \uBCF4\uB4DC\uC5D0 \uB514\uC2A4\uD06C\uB97C \uB5A8\uC5B4\uB728\uB824 \uAC00\uB85C\xB7\uC138\uB85C\xB7\uB300\uAC01\uC120\uC73C\uB85C 4\uAC1C\uB97C \uBA3C\uC800 \uC5F0\uACB0\uD558\uB294 \uC785\uCCB4 \uC804\uB7B5 \uAC8C\uC784\uC785\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #ff405d, #ffe34b)"
    },
    {
      id: "memorymatch",
      name: "\uAE30\uC5B5\uB825 \uB300\uACB0",
      nameEn: "Memory Match",
      icon: "\u{1F9E9}",
      badge: "\uAE30\uC5B5\uB825 \xB7 8\uC30D \uCE74\uB4DC",
      category: "strategy",
      tags: ["bot", "online", "party"],
      minPlayers: 2,
      maxPlayers: 8,
      length: "8 \uD398\uC5B4",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "\uB4A4\uC9D1\uD78C 16\uC7A5\uC758 \uCE74\uB4DC \uC704\uCE58\uB97C \uAE30\uC5B5\uD558\uC5EC \uAC19\uC740 \uADF8\uB9BC\uC758 \uC9DD\uC744 \uAC00\uC7A5 \uB9CE\uC774 \uCC3E\uB294 \uD50C\uB808\uC774\uC5B4\uAC00 \uC2B9\uB9AC\uD569\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #9b59b6, #00f0ff)"
    },
    {
      id: "simonsays",
      name: "\uC0AC\uC774\uBA3C \uC138\uC774\uC988",
      nameEn: "Simon Says",
      icon: "\u{1F3B5}",
      badge: "\uD328\uD134 \uAE30\uC5B5 \xB7 8\uB77C\uC6B4\uB4DC",
      category: "strategy",
      tags: ["bot", "online", "party"],
      minPlayers: 2,
      maxPlayers: 8,
      length: "8 \uB77C\uC6B4\uB4DC",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "\uC810\uC810 \uAE38\uC5B4\uC9C0\uB294 4\uC0C9 \uBD88\uBE5B \uC810\uB4F1 \uC21C\uC11C\uB97C \uAE30\uC5B5\uD558\uACE0 \uC2E4\uC218 \uC5C6\uC774 \uB05D\uAE4C\uC9C0 \uB530\uB77C \uC785\uB825\uD558\uC138\uC694!",
      gradient: "linear-gradient(135deg, #00ff88, #4488ff)"
    },
    {
      id: "wordchain",
      name: "\uB05D\uB9D0\uC787\uAE30 (\uC601\uB2E8\uC5B4)",
      nameEn: "Word Chain",
      icon: "\u{1F517}",
      badge: "\uC5B4\uD718\uB825 \xB7 \uD134\uC81C",
      category: "word",
      tags: ["bot", "online"],
      minPlayers: 2,
      maxPlayers: 8,
      length: "\uC778\uB2F9 5\uD134",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "\uC774\uC804 \uB2E8\uC5B4\uC758 \uB9C8\uC9C0\uB9C9 \uC54C\uD30C\uBCB3\uC73C\uB85C \uC2DC\uC791\uD558\uB294 \uC601\uB2E8\uC5B4\uB97C \uC774\uC5B4\uAC00\uB294 \uC5B4\uD718\uB825 \uB300\uACB0\uC785\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #00c4cc, #7ee787)"
    },
    {
      id: "anagram",
      name: "\uC544\uB098\uADF8\uB7A8 \uC2A4\uD504\uB9B0\uD2B8",
      nameEn: "Anagram Sprint",
      icon: "\u{1F524}",
      badge: "\uB2E8\uC5B4 \uC870\uD569 \xB7 10\uB77C\uC6B4\uB4DC",
      category: "word",
      tags: ["bot", "online"],
      minPlayers: 2,
      maxPlayers: 8,
      length: "10 \uD37C\uC990",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "\uBB34\uC791\uC704\uB85C \uB4A4\uC11E\uC778 \uC54C\uD30C\uBCB3 \uCCA0\uC790\uB97C \uBCF4\uACE0 \uC6D0\uB798\uC758 \uC601\uB2E8\uC5B4\uB97C \uCD94\uB9AC\uD574 \uC785\uB825\uD558\uB294 \uB450\uB1CC \uD68C\uC804 \uAC8C\uC784\uC785\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #f39c12, #e74c3c)"
    },
    {
      id: "mathduel",
      name: "\uC218\uD559 \uB300\uACB0",
      nameEn: "Math Duel",
      icon: "\u{1F522}",
      badge: "\uC554\uC0B0 \uB300\uACB0 \xB7 12\uD134",
      category: "math",
      tags: ["bot", "online"],
      minPlayers: 2,
      maxPlayers: 8,
      length: "12 \uD134",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "\uC0AC\uCE59\uC5F0\uC0B0 \uC554\uC0B0 \uBB38\uC81C\uB97C \uBE60\uB974\uACE0 \uC815\uD655\uD558\uAC8C \uD480\uC5B4 \uC810\uC218\uB97C \uC313\uB294 \uB450\uB1CC \uB300\uACB0\uC785\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #4488ff, #9b59b6)"
    },
    {
      id: "numberhunt",
      name: "\uB118\uBC84 \uD5CC\uD2B8",
      nameEn: "Number Hunt",
      icon: "\u{1F3AF}",
      badge: "\uC22B\uC790 \uCD94\uB9AC \xB7 6\uB77C\uC6B4\uB4DC",
      category: "math",
      tags: ["bot", "online", "party"],
      minPlayers: 2,
      maxPlayers: 8,
      length: "6 \uB77C\uC6B4\uB4DC",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "10\uBD80\uD130 30 \uC0AC\uC774\uC758 \uC228\uACA8\uC9C4 \uBAA9\uD45C \uC22B\uC790\uC5D0 \uAC00\uC7A5 \uAC00\uAE4C\uC6B4 \uC22B\uC790\uB97C \uC608\uCE21\uD55C \uD50C\uB808\uC774\uC5B4\uAC00 \uC810\uC218\uB97C \uC5BB\uC2B5\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #2ecc71, #1abc9c)"
    },
    {
      id: "rpsarena",
      name: "\uAC00\uC704\uBC14\uC704\uBCF4 \uC544\uB808\uB098",
      nameEn: "RPS Arena",
      icon: "\u270A",
      badge: "\uC2EC\uB9AC\uC804 1:1 \xB7 5\uD310",
      category: "classic",
      tags: ["bot", "online"],
      minPlayers: 2,
      maxPlayers: 2,
      length: "5 \uB77C\uC6B4\uB4DC",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "5\uB77C\uC6B4\uB4DC\uB85C \uC9C4\uD589\uB418\uB294 \uD074\uB798\uC2DD \uAC00\uC704\uBC14\uC704\uBCF4 \uC2EC\uB9AC\uC804! \uC0C1\uB300\uC758 \uC218\uB97C \uC77D\uACE0 \uC2B9\uC810\uC744 \uCC59\uAE30\uC138\uC694.",
      gradient: "linear-gradient(135deg, #ffaa00, #ff3366)"
    },
    {
      id: "trivia",
      name: "\uC2A4\uD53C\uB4DC \uD034\uC988",
      nameEn: "Trivia Challenge",
      icon: "\u2753",
      badge: "\uC0C1\uC2DD \uD034\uC988 \xB7 15\uBB38\uC81C",
      category: "trivia",
      tags: ["bot", "online", "party"],
      minPlayers: 2,
      maxPlayers: 8,
      length: "15 \uBB38\uC81C",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "\uACFC\uD559, \uC5ED\uC0AC, \uC9C0\uB9AC, \uC608\uC220 \uB4F1 \uB2E4\uC591\uD55C \uC0C1\uC2DD 4\uC9C0\uC120\uB2E4 \uD034\uC988\uB97C \uC81C\uD55C \uC2DC\uAC04 \uB0B4\uC5D0 \uAC00\uC7A5 \uBE68\uB9AC \uB9DE\uD788\uC138\uC694!",
      gradient: "linear-gradient(135deg, #ff00ff, #4488ff)"
    },
    {
      id: "higherlower",
      name: "\uD558\uC774 \uB85C\uC6B0",
      nameEn: "Higher or Lower",
      icon: "\u2195\uFE0F",
      badge: "\uD655\uB960 \uC608\uCE21 \xB7 10\uB77C\uC6B4\uB4DC",
      category: "speed",
      tags: ["bot", "online"],
      minPlayers: 2,
      maxPlayers: 2,
      length: "10 \uB77C\uC6B4\uB4DC",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "\uD604\uC7AC \uC22B\uC790(1~100)\uB97C \uBCF4\uACE0 \uB2E4\uC74C\uC5D0 \uB4F1\uC7A5\uD560 \uC22B\uC790\uAC00 \uB354 \uB192\uC744\uC9C0(Higher) \uB0AE\uC744\uC9C0(Lower) \uC21C\uBC1C\uB825 \uC788\uAC8C \uC120\uD0DD\uD558\uC138\uC694.",
      gradient: "linear-gradient(135deg, #00f0ff, #4488ff)"
    },
    {
      id: "oddoneout",
      name: "\uB2E4\uB978 \uADF8\uB9BC \uCC3E\uAE30",
      nameEn: "Odd One Out",
      icon: "\u{1F440}",
      badge: "\uAD00\uCC30\uB825 \xB7 6\uB77C\uC6B4\uB4DC",
      category: "strategy",
      tags: ["bot", "online"],
      minPlayers: 2,
      maxPlayers: 2,
      length: "6 \uB77C\uC6B4\uB4DC",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "9\uAC1C\uC758 \uD0C0\uC77C \uC911 \uBAA8\uC591\uC774\uB098 \uC0C9\uC0C1\uC774 \uBBF8\uC138\uD558\uAC8C \uB2E4\uB978 \uD558\uB098\uB97C \uAC00\uC7A5 \uBA3C\uC800 \uCC3E\uC544\uB0B4\uC138\uC694!",
      gradient: "linear-gradient(135deg, #ffea00, #00ff88)"
    },
    // ─── 4 Additional Online / BOT Games ───
    {
      id: "snakeduel",
      name: "\uC2A4\uB124\uC774\uD06C \uB4C0\uC5BC",
      nameEn: "Snake Duel",
      icon: "\u{1F40D}",
      badge: "\uC6D0\uBCF8 Canvas \xB7 30\xD720 \xB7 \uC2E4\uC2DC\uAC04",
      category: "arcade",
      tags: ["bot", "online"],
      minPlayers: 2,
      maxPlayers: 2,
      length: "\uC2E4\uC2DC\uAC04 \uB9E4\uCE58",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "PawelN93 Snake Duel\uC758 \uC6D0\uBCF8 30\xD720 \uC5D4\uC9C4\uACFC Canvas \uD654\uBA74\uC73C\uB85C \uD50C\uB808\uC774\uD569\uB2C8\uB2E4. \uD50C\uB7AB\uD3FC \uBC29\xB7BOT\xB7\uC628\uB77C\uC778 \uBAA8\uB4DC\uB9CC \uC5B4\uB311\uD130\uB85C \uC5F0\uACB0\uD588\uC2B5\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #00ff88, #00c4cc)"
    },
    {
      id: "bomberman",
      name: "\uBD04\uBC84\uB9E8 \uC544\uB808\uB098",
      nameEn: "Bomberman Arena",
      icon: "\u{1F4A3}",
      badge: "Blast Arena \uC6D0\uBCF8 \xB7 \uC2F1\uAE00 AI \xB7 \uC628\uB77C\uC778",
      category: "arcade",
      tags: ["bot", "online", "party"],
      minPlayers: 2,
      maxPlayers: 4,
      length: "\uC11C\uBC14\uC774\uBC8C",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "Blast Arena \uC6D0\uBCF8 \uC800\uC7A5\uC18C\uC758 \uD654\uBA74\xB7\uB300\uAE30\uC2E4\xB7\uCC44\uD305\xB7\uC544\uC774\uD15C\xB7\uAC8C\uC784 \uB8E8\uD504\uB97C \uADF8\uB300\uB85C \uC2E4\uD589\uD569\uB2C8\uB2E4. \uD63C\uC790\uC11C\uB294 \uCEF4\uD4E8\uD130 \uC0C1\uB300, \uC628\uB77C\uC778\uC740 \uC6D0\uBCF8 2~4\uC778 \uB300\uC804\uC73C\uB85C \uD50C\uB808\uC774\uD569\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #ff3366, #ffaa00)"
    },
    {
      id: "bombergirl",
      name: "\uBD04\uBC84\uAC78 \uD074\uB798\uC2DD",
      nameEn: "HTML5 Bombergirl",
      icon: "\u{1F467}",
      badge: "MattSkala \uC6D0\uBCF8 \xB7 AI 3\uBA85 \xB7 \uC628\uB77C\uC778 2\uC778",
      category: "arcade",
      tags: ["bot", "online", "original"],
      minPlayers: 1,
      maxPlayers: 2,
      length: "\uC11C\uBC14\uC774\uBC8C",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "MattSkala HTML5 Bombergirl\uC758 17\xD713 \uD654\uBA74\xB7\uC2A4\uD504\uB77C\uC774\uD2B8\xB7\uD3ED\uD0C4\xB7\uBCF4\uB108\uC2A4\xB7AI\uB97C \uADF8\uB300\uB85C \uC2E4\uD589\uD569\uB2C8\uB2E4. \uC6D0\uBCF8 \uC2F1\uAE00 AI 3\uBA85\uACFC \uD50C\uB7AB\uD3FC \uC628\uB77C\uC778 2\uC778 \uBAA8\uB4DC\uB97C \uC9C0\uC6D0\uD569\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #ff4444, #99cc00)"
    },
    {
      id: "drawing",
      name: "\uCE90\uCE58\uB9C8\uC778\uB4DC (\uADF8\uB9BC \uB9DE\uCD94\uAE30)",
      nameEn: "Doodle Dash",
      icon: "\u{1F58C}\uFE0F",
      badge: "\uD30C\uD2F0 3~8\uC778 \xB7 BOT \uB4DC\uB85C\uC789",
      category: "party",
      tags: ["bot", "online", "party"],
      minPlayers: 3,
      maxPlayers: 8,
      length: "\uB77C\uC6B4\uB4DC \uAD50\uB300",
      supportsSolo: true,
      supportsBot: true,
      supportsOnline: true,
      description: "\uB3CC\uC544\uAC00\uBA70 \uC81C\uC2DC\uC5B4\uB97C \uADF8\uB9AC\uACE0 \uC2E4\uC2DC\uAC04 \uCC44\uD305\uC73C\uB85C \uC815\uB2F5\uC744 \uB9DE\uD788\uB294 \uD30C\uD2F0 \uAC8C\uC784! \uD63C\uC790 \uC811\uC18D\uD574\uB3C4 BOT\uC774 \uC2E4\uC2DC\uAC04 \uC2A4\uD2B8\uB85C\uD06C\uB85C \uADF8\uB9BC\uC744 \uADF8\uB824\uC90D\uB2C8\uB2E4.",
      gradient: "linear-gradient(135deg, #ff00ff, #00f0ff)"
    }
  ];
  function getGameDefinition(gameId) {
    if (gameId === "marble-roulette") gameId = "roulette";
    return GAME_REGISTRY.find((g4) => g4.id === gameId) || null;
  }
  var PLATFORM_GAMES = GAME_REGISTRY.map((g4) => ({
    ...g4,
    subtitle: g4.nameEn || g4.badge || "",
    playersLabel: `${g4.minPlayers}~${g4.maxPlayers}\uC778`
  }));
  var GAME_CATEGORIES = [
    { id: "all", label: "\uC804\uCCB4 \uAC8C\uC784 (20)" },
    { id: "draw", label: "\uCD94\uCCA8 / \uC774\uBCA4\uD2B8" },
    { id: "speed", label: "\uC21C\uBC1C\uB825 / \uC2A4\uD53C\uB4DC" },
    { id: "strategy", label: "\uBCF4\uB4DC / \uC804\uB7B5" },
    { id: "word", label: "\uB2E8\uC5B4 / \uD034\uC988" },
    { id: "math", label: "\uC218\uB9AC / \uD37C\uC990" },
    { id: "trivia", label: "\uC0C1\uC2DD \uD034\uC988" },
    { id: "classic", label: "\uD074\uB798\uC2DD \uB300\uACB0" },
    { id: "arcade", label: "\uC544\uCF00\uC774\uB4DC \uC561\uC158" },
    { id: "party", label: "\uB4DC\uB85C\uC789 / \uD30C\uD2F0" }
  ];
  var getGameById = getGameDefinition;

  // platform-src/api-client.js
  var PlatformApiClient = class {
    constructor({ baseUrl = "", userProvider = null, getUser = null } = {}) {
      this.baseUrl = String(baseUrl || "").replace(/\/api\/platform\/?$/, "").replace(/\/$/, "");
      this.userProvider = userProvider;
      this.getUser = getUser;
      this.eventSource = null;
    }
    headers(extra = {}) {
      const providerHeaders = this.userProvider?.getHeaders?.() || {};
      const currentUser = this.getUser?.() || this.userProvider?.getCurrentUser?.();
      const fallbackMockHeader = !providerHeaders["X-Mock-User-Id"] && currentUser?.id ? { "X-Mock-User-Id": currentUser.id } : {};
      return {
        ...providerHeaders,
        ...fallbackMockHeader,
        ...extra
      };
    }
    async request(path, options = {}) {
      const res = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: this.headers({
          ...options.body ? { "Content-Type": "application/json" } : {},
          ...options.headers || {}
        }),
        cache: "no-store"
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `\uC694\uCCAD \uC2E4\uD328 (HTTP ${res.status})`);
      }
      return data;
    }
    bootstrap() {
      return this.request("/api/platform/bootstrap");
    }
    listUsers({ departmentId = "", q: q4 = "" } = {}) {
      const params = new URLSearchParams();
      if (departmentId) params.set("departmentId", departmentId);
      if (q4) params.set("q", q4);
      return this.request(`/api/platform/users?${params}`);
    }
    getDirectory({ departmentId = "", q: q4 = "" } = {}) {
      return this.listUsers({ departmentId, q: q4 });
    }
    listRooms(gameId = "") {
      const params = gameId ? `?gameId=${encodeURIComponent(gameId)}` : "";
      return this.request(`/api/platform/rooms${params}`);
    }
    createRoom(payload) {
      return this.request("/api/platform/rooms", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }
    getRoom(code) {
      return this.request(`/api/platform/rooms/${encodeURIComponent(code)}`);
    }
    roomAction(code, actionName, payload = {}) {
      return this.request(`/api/platform/rooms/${encodeURIComponent(code)}/${actionName}`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }
    joinRoom(code) {
      return this.roomAction(code, "join");
    }
    leaveRoom(code) {
      return this.roomAction(code, "leave");
    }
    setReady(code, ready) {
      return this.roomAction(code, "ready", { ready });
    }
    addBot(code, difficulty = "normal") {
      return this.roomAction(code, "add-bot", { difficulty });
    }
    removeBot(code, botId = null) {
      return this.roomAction(code, "remove-bot", { botId });
    }
    startRoom(code) {
      return this.roomAction(code, "start");
    }
    rematch(code) {
      return this.roomAction(code, "rematch");
    }
    sendGameAction(code, actionPayload = {}) {
      return this.roomAction(code, "action", actionPayload);
    }
    // Event Groups
    listEvents() {
      return this.request("/api/platform/events");
    }
    listEventGroups() {
      return this.listEvents();
    }
    createEvent(payload) {
      return this.request("/api/platform/events", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }
    createEventGroup(payload) {
      return this.createEvent(payload);
    }
    getEventDetail(eventId) {
      return this.request(`/api/platform/events/${encodeURIComponent(eventId)}`);
    }
    getEventGroup(eventId) {
      return this.getEventDetail(eventId);
    }
    getEventRankings(eventId) {
      return this.getEventDetail(eventId);
    }
    joinEvent(eventId, userId) {
      return this.request(`/api/platform/events/${encodeURIComponent(eventId)}/join`, {
        method: "POST",
        body: JSON.stringify({ userId })
      });
    }
    setEventStatus(eventId, status) {
      return this.request(`/api/platform/events/${encodeURIComponent(eventId)}/status`, {
        method: "POST",
        body: JSON.stringify({ status })
      });
    }
    updateEventStatus(eventId, status) {
      return this.setEventStatus(eventId, status);
    }
    // Rankings & Stats
    async getRankings({ gameId = "", includePractice = false, departmentId = "" } = {}) {
      const params = new URLSearchParams();
      if (gameId) params.set("gameId", gameId);
      if (includePractice) params.set("includePractice", "true");
      if (departmentId) params.set("departmentId", departmentId);
      const data = await this.request(`/api/platform/rankings?${params}`);
      return {
        ...data,
        rankings: data.rankings || data.individual || [],
        departments: data.departments || []
      };
    }
    async getDepartmentRankings({ gameId = "", includePractice = false } = {}) {
      return this.getRankings({ gameId, includePractice });
    }
    getUserStats(userId = "") {
      const params = userId ? `?userId=${encodeURIComponent(userId)}` : "";
      return this.request(`/api/platform/stats${params}`);
    }
    // Marble Roulette
    getRouletteData() {
      return this.request("/api/platform/roulette/history");
    }
    recordRouletteDraw(payload) {
      return this.request("/api/platform/roulette/history", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }
    saveRoulettePreset(payload) {
      return this.request("/api/platform/roulette/presets", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }
    // Realtime SSE
    subscribeRoomStream(_roomCode, { onEvent } = {}) {
      const currentUser = this.getUser?.() || this.userProvider?.getCurrentUser?.();
      const clientId = currentUser?.id || "emp-001";
      this.disconnectRealtime();
      const params = new URLSearchParams({ clientId, mockUserId: clientId });
      const es = new EventSource(`${this.baseUrl}/api/platform/stream?${params}`);
      this.eventSource = es;
      const events = [
        "connected",
        "roomSnapshot",
        "roomUpdated",
        "gameStarted",
        "updateGameState",
        "drawingRole",
        "drawingStroke",
        "drawingClear",
        "drawingGuessChat",
        "gameOver",
        "rematchReady",
        "gameAborted",
        "error"
      ];
      for (const evt of events) {
        es.addEventListener(evt, (e3) => {
          try {
            const parsed = JSON.parse(e3.data);
            onEvent?.(evt, parsed);
          } catch (err) {
            console.warn("[SSE parse error]", evt, err);
          }
        });
      }
      return () => this.disconnectRealtime();
    }
    disconnectRealtime() {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    }
  };

  // node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
  var f3 = 0;
  function u3(e3, t3, n2, o3, i3, u4) {
    t3 || (t3 = {});
    var a3, c3, p3 = t3;
    if ("ref" in p3) for (c3 in p3 = {}, t3) "ref" == c3 ? a3 = t3[c3] : p3[c3] = t3[c3];
    var l3 = { type: e3, props: p3, key: n2, ref: a3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i3, __self: u4 };
    if ("function" == typeof e3 && (a3 = e3.defaultProps)) for (c3 in a3) void 0 === p3[c3] && (p3[c3] = a3[c3]);
    return l.vnode && l.vnode(l3), l3;
  }

  // platform-src/components/MarbleRouletteView.jsx
  function MarbleRouletteView({ api, currentUser, users, departments, onBack }) {
    const iframeRef = A2(null);
    const [selectedDept, setSelectedDept] = d2("");
    const [selectedUserIds, setSelectedUserIds] = d2(/* @__PURE__ */ new Set());
    const [manualText, setManualText] = d2("\uAE40\uC131\uBBFC,\uC774\uC9C0\uD6C8,\uBC15\uC218\uC9C4,\uCD5C\uBBFC\uD638,\uC815\uD558\uB298");
    const [drawTitle, setDrawTitle] = d2("\uC0AC\uB0B4 \uC774\uBCA4\uD2B8 \uACBD\uD488 \uCD94\uCCA8");
    const [history, setHistory] = d2([]);
    const [presets, setPresets] = d2([]);
    const [presetTitle, setPresetTitle] = d2("");
    const [lastWinnerBanner, setLastWinnerBanner] = d2(null);
    const [sidebarOpen, setSidebarOpen] = d2(true);
    const loadHistory = async () => {
      try {
        const res = await api.getRouletteData();
        setHistory(res.history || []);
        setPresets(res.presets || []);
      } catch (e3) {
        console.warn(e3);
      }
    };
    h2(() => {
      loadHistory();
    }, []);
    h2(() => {
      const onMessage = async (e3) => {
        const data = e3?.data;
        if (!data || data.type !== "gamebox-roulette-goal") return;
        setLastWinnerBanner({
          winners: data.winners || [data.winner],
          mapTitle: data.mapTitle
        });
        try {
          await api.recordRouletteDraw({
            title: drawTitle || "\uB9C8\uBE14 \uB8F0\uB81B \uCD94\uCCA8",
            mapTitle: data.mapTitle || "\uAE30\uBCF8 \uB9F5",
            winnerType: data.winnerType || "first",
            participants: data.participants || [],
            winners: data.winners || [data.winner]
          });
          await loadHistory();
        } catch (err) {
          console.warn("Failed to save roulette history:", err);
        }
      };
      window.addEventListener("message", onMessage);
      return () => window.removeEventListener("message", onMessage);
    }, [api, drawTitle]);
    const filteredUsers = selectedDept ? users.filter((u4) => u4.departmentId === selectedDept) : users;
    const toggleUser = (id) => {
      const next = new Set(selectedUserIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelectedUserIds(next);
    };
    const selectAllFiltered = () => {
      const next = new Set(selectedUserIds);
      filteredUsers.forEach((u4) => next.add(u4.id));
      setSelectedUserIds(next);
    };
    const pushNamesToRoulette = (namesArray, append = false) => {
      const clean = namesArray.map((s3) => String(s3).trim()).filter(Boolean);
      if (!clean.length) return;
      const nextList = append ? [...manualText.split(/[,\r\n]+/).map((s3) => s3.trim()).filter(Boolean), ...clean] : clean;
      setManualText(nextList.join(", "));
      iframeRef.current?.contentWindow?.postMessage(
        { type: "gamebox-roulette-set-names", names: nextList },
        "*"
      );
    };
    const addSelectedEmployeesToRoulette = () => {
      const picked = users.filter((u4) => selectedUserIds.has(u4.id)).map((u4) => `${u4.name}(${u4.departmentName})`);
      if (!picked.length) return;
      pushNamesToRoulette(picked, true);
    };
    const replaceWithSelectedEmployees = () => {
      const picked = users.filter((u4) => selectedUserIds.has(u4.id)).map((u4) => u4.name);
      if (!picked.length) return;
      pushNamesToRoulette(picked, false);
    };
    const applyManualText = () => {
      const list = manualText.split(/[,\r\n]+/).map((s3) => s3.trim()).filter(Boolean);
      pushNamesToRoulette(list, false);
    };
    const handleSavePreset = async () => {
      const list = manualText.split(/[,\r\n]+/).map((s3) => s3.trim()).filter(Boolean);
      if (!list.length || !presetTitle.trim()) return;
      await api.saveRoulettePreset({ title: presetTitle.trim(), participants: list });
      setPresetTitle("");
      await loadHistory();
    };
    return /* @__PURE__ */ u3("div", { className: "gp-roulette-layout", children: [
      /* @__PURE__ */ u3("div", { className: "gp-roulette-topbar", children: [
        /* @__PURE__ */ u3("div", { className: "gp-roulette-title-wrap", children: [
          /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-outline", onClick: onBack, children: "\u2190 \uAC8C\uC784 \uBAA9\uB85D\uC73C\uB85C" }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("h2", { children: "\u{1F52E} \uB9C8\uBE14 \uB8F0\uB81B (Marble Roulette)" }),
            /* @__PURE__ */ u3("small", { children: "Box2D \uBB3C\uB9AC \uC5D4\uC9C4 \uC6D0\uBCF8 \xB7 \uC0AC\uB0B4 \uBD80\uC11C/\uC784\uC9C1\uC6D0 \uBA85\uB2E8 \uC5F0\uB3D9 \uBC0F \uCD94\uCCA8 \uACB0\uACFC \uC790\uB3D9 \uAE30\uB85D" })
          ] })
        ] }),
        /* @__PURE__ */ u3("div", { className: "gp-roulette-top-actions", children: /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            className: "gp-btn gp-btn-secondary",
            onClick: () => setSidebarOpen((v3) => !v3),
            children: sidebarOpen ? "\uBA85\uB2E8/\uAE30\uB85D \uD328\uB110 \uC811\uAE30 \u25B6" : "\u25C0 \uC0AC\uB0B4 \uBA85\uB2E8 & \uAE30\uB85D \uC5F4\uAE30"
          }
        ) })
      ] }),
      lastWinnerBanner && /* @__PURE__ */ u3("div", { className: "gp-winner-banner", children: [
        /* @__PURE__ */ u3("span", { children: [
          "\u{1F389} \uCD94\uCCA8 \uC644\uB8CC! \uB2F9\uCCA8\uC790: ",
          /* @__PURE__ */ u3("strong", { children: lastWinnerBanner.winners.join(", ") }),
          " (",
          lastWinnerBanner.mapTitle,
          ")"
        ] }),
        /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn-xs", onClick: () => setLastWinnerBanner(null), children: "\uB2EB\uAE30" })
      ] }),
      /* @__PURE__ */ u3("div", { className: "gp-roulette-body", children: [
        /* @__PURE__ */ u3("div", { className: "gp-roulette-stage", children: /* @__PURE__ */ u3(
          "iframe",
          {
            ref: iframeRef,
            src: "/roulette/index.html",
            title: "Marble Roulette Box2D",
            className: "gp-roulette-iframe"
          }
        ) }),
        sidebarOpen && /* @__PURE__ */ u3("aside", { className: "gp-roulette-sidebar", children: [
          /* @__PURE__ */ u3("div", { className: "gp-panel-block", children: [
            /* @__PURE__ */ u3("h3", { children: "1. \uCD94\uCCA8 \uC81C\uBAA9 \uC124\uC815" }),
            /* @__PURE__ */ u3(
              "input",
              {
                type: "text",
                className: "gp-input",
                value: drawTitle,
                onChange: (e3) => setDrawTitle(e3.target.value),
                placeholder: "\uC608: 11\uC6D4 \uC804\uC0AC \uAC04\uC2DD \uCD94\uCCA8"
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-panel-block", children: [
            /* @__PURE__ */ u3("h3", { children: "2. \uC0AC\uB0B4 \uC784\uC9C1\uC6D0 / \uBD80\uC11C\uBCC4 \uBD88\uB7EC\uC624\uAE30" }),
            /* @__PURE__ */ u3("div", { className: "gp-row-gap", children: [
              /* @__PURE__ */ u3(
                "select",
                {
                  className: "gp-select",
                  value: selectedDept,
                  onChange: (e3) => setSelectedDept(e3.target.value),
                  children: [
                    /* @__PURE__ */ u3("option", { value: "", children: [
                      "\uC804\uCCB4 \uBD80\uC11C (",
                      users.length,
                      "\uBA85)"
                    ] }),
                    departments.map((d3) => /* @__PURE__ */ u3("option", { value: d3.id, children: [
                      d3.name,
                      " (",
                      d3.memberCount,
                      "\uBA85)"
                    ] }, d3.id))
                  ]
                }
              ),
              /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn-xs", onClick: selectAllFiltered, children: "\uBD80\uC11C \uC804\uCCB4\uC120\uD0DD" })
            ] }),
            /* @__PURE__ */ u3("div", { className: "gp-emp-checklist", children: filteredUsers.map((u4) => /* @__PURE__ */ u3("label", { className: "gp-emp-check-item", children: [
              /* @__PURE__ */ u3(
                "input",
                {
                  type: "checkbox",
                  checked: selectedUserIds.has(u4.id),
                  onChange: () => toggleUser(u4.id)
                }
              ),
              /* @__PURE__ */ u3("span", { children: u4.name }),
              /* @__PURE__ */ u3("small", { children: u4.departmentName })
            ] }, u4.id)) }),
            /* @__PURE__ */ u3("div", { className: "gp-btn-row", children: [
              /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-primary gp-btn-sm", onClick: replaceWithSelectedEmployees, children: "\uC120\uD0DD \uC9C1\uC6D0\uC73C\uB85C \uAD50\uCCB4" }),
              /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-secondary gp-btn-sm", onClick: addSelectedEmployeesToRoulette, children: "+ \uBA85\uB2E8\uC5D0 \uCD94\uAC00" })
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-panel-block", children: [
            /* @__PURE__ */ u3("h3", { children: "3. \uCC38\uAC00\uC790 \uBA85\uB2E8 \uD3B8\uC9D1 / \uBD99\uC5EC\uB123\uAE30" }),
            /* @__PURE__ */ u3(
              "textarea",
              {
                className: "gp-textarea",
                rows: 3,
                value: manualText,
                onChange: (e3) => setManualText(e3.target.value),
                placeholder: "\uC774\uB984\uC744 \uC27C\uD45C(,) \uB610\uB294 \uC904\uBC14\uAFC8\uC73C\uB85C \uAD6C\uBD84\uD574 \uC785\uB825 (\uC608: \uAE40\uC131\uBBFC*2, \uC774\uC9C0\uD6C8/3)"
              }
            ),
            /* @__PURE__ */ u3("div", { className: "gp-btn-row", children: /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-primary gp-btn-sm", onClick: applyManualText, children: "\uB8F0\uB81B \uAD6C\uC2AC\uC5D0 \uC989\uC2DC \uBC18\uC601" }) }),
            /* @__PURE__ */ u3("div", { className: "gp-preset-save-row", children: [
              /* @__PURE__ */ u3(
                "input",
                {
                  type: "text",
                  className: "gp-input gp-input-sm",
                  placeholder: "\uBA85\uB2E8 \uD504\uB9AC\uC14B \uC774\uB984 \uC800\uC7A5...",
                  value: presetTitle,
                  onChange: (e3) => setPresetTitle(e3.target.value)
                }
              ),
              /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-outline gp-btn-sm", onClick: handleSavePreset, children: "\uBA85\uB2E8 \uC800\uC7A5" })
            ] }),
            presets.length > 0 && /* @__PURE__ */ u3("div", { className: "gp-preset-list", children: [
              /* @__PURE__ */ u3("small", { className: "gp-muted", children: "\uC800\uC7A5\uB41C \uCC38\uAC00\uC790 \uBA85\uB2E8 \uC7AC\uC0AC\uC6A9:" }),
              /* @__PURE__ */ u3("div", { className: "gp-chip-wrap", children: presets.map((p3) => /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  className: "gp-chip",
                  onClick: () => pushNamesToRoulette(p3.participants, false),
                  children: [
                    "\u{1F4CB} ",
                    p3.title,
                    " (",
                    p3.participants.length,
                    "\uBA85)"
                  ]
                },
                p3.id
              )) })
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-panel-block", children: [
            /* @__PURE__ */ u3("h3", { children: "4. \uCD5C\uADFC \uCD94\uCCA8 \uACB0\uACFC \uAE30\uB85D" }),
            history.length === 0 ? /* @__PURE__ */ u3("p", { className: "gp-muted", children: "\uC544\uC9C1 \uAE30\uB85D\uB41C \uCD94\uCCA8 \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) : /* @__PURE__ */ u3("ul", { className: "gp-history-list", children: history.slice(0, 8).map((h3) => /* @__PURE__ */ u3("li", { children: [
              /* @__PURE__ */ u3("div", { className: "gp-history-top", children: [
                /* @__PURE__ */ u3("strong", { children: h3.title }),
                /* @__PURE__ */ u3("small", { children: new Date(h3.occurredAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }) })
              ] }),
              /* @__PURE__ */ u3("div", { className: "gp-history-winner", children: [
                "\u{1F3C6} \uB2F9\uCCA8: ",
                /* @__PURE__ */ u3("span", { children: h3.winners.join(", ") })
              ] }),
              /* @__PURE__ */ u3("small", { className: "gp-muted", children: [
                "\uC9C4\uD589: ",
                h3.hostName,
                " \xB7 \uCC38\uAC00 ",
                h3.participants.length,
                "\uBA85"
              ] })
            ] }, h3.id)) })
          ] })
        ] })
      ] })
    ] });
  }

  // platform-src/components/OriginalArcadeArenas.jsx
  var SNAKE_COLORS = {
    bg: "#1f1a16",
    grid: "#2a221c",
    p1: "#e8b34a",
    p1Dim: "#7a6534",
    p2: "#4fd1c5",
    p2Dim: "#2f6b64",
    food: "#e85d4e"
  };
  var drawSnakeCell = (context, x3, y3, width, height, inset) => {
    const padding = Math.min(width, height) * inset * 0.5;
    context.fillRect(x3 * width + padding, y3 * height + padding, width - padding * 2, height - padding * 2);
  };
  var snakeList = (snakes) => Object.values(snakes || {}).sort((a3, b2) => (a3.role || 0) - (b2.role || 0));
  function OriginalSnakeDuelArena({ gs, room, currentUser, onAction }) {
    const canvasRef = A2(null);
    const animationRef = A2(null);
    const previousRef = A2(null);
    const width = gs.gridWidth || 30;
    const height = gs.gridHeight || 20;
    const snakes = T2(() => snakeList(gs.snakes), [gs.snakes]);
    const food = gs.food || { x: 15, y: 10 };
    h2(() => {
      const canvas = canvasRef.current;
      if (!canvas) return void 0;
      const context = canvas.getContext("2d");
      const next = { snakes, food, width, height };
      const previous = previousRef.current || next;
      const startedAt = performance.now();
      const duration = 135;
      const draw = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - (1 - progress) ** 3;
        const cellWidth = canvas.width / width;
        const cellHeight = canvas.height / height;
        context.fillStyle = SNAKE_COLORS.bg;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = SNAKE_COLORS.grid;
        context.lineWidth = 1;
        for (let x3 = 1; x3 < width; x3++) {
          context.beginPath();
          context.moveTo(x3 * cellWidth, 0);
          context.lineTo(x3 * cellWidth, canvas.height);
          context.stroke();
        }
        for (let y3 = 1; y3 < height; y3++) {
          context.beginPath();
          context.moveTo(0, y3 * cellHeight);
          context.lineTo(canvas.width, y3 * cellHeight);
          context.stroke();
        }
        context.fillStyle = SNAKE_COLORS.food;
        drawSnakeCell(context, food.x, food.y, cellWidth, cellHeight, 0.35);
        next.snakes.forEach((snake, snakeIndex) => {
          const oldSnake = previous.snakes.find((item) => item.role === snake.role) || snake;
          const [main, dim] = snake.role === 1 ? [SNAKE_COLORS.p1, SNAKE_COLORS.p1Dim] : [SNAKE_COLORS.p2, SNAKE_COLORS.p2Dim];
          snake.body.forEach((segment, index) => {
            const oldSegment = oldSnake.body[Math.min(index, oldSnake.body.length - 1)] || segment;
            const x3 = oldSegment.x + (segment.x - oldSegment.x) * eased;
            const y3 = oldSegment.y + (segment.y - oldSegment.y) * eased;
            context.fillStyle = snake.alive ? index === 0 ? main : dim : "#4a4239";
            drawSnakeCell(context, x3, y3, cellWidth, cellHeight, index === 0 ? 0.15 : 0.25);
          });
          if (!snake.alive && snakeIndex === 0) context.globalAlpha = 1;
        });
        if (progress < 1) animationRef.current = requestAnimationFrame(draw);
        else previousRef.current = next;
      };
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(draw);
      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }, [snakes, food.x, food.y, width, height]);
    h2(() => {
      const onKeyDown = (event) => {
        const direction = {
          ArrowUp: "up",
          KeyW: "up",
          ArrowDown: "down",
          KeyS: "down",
          ArrowLeft: "left",
          KeyA: "left",
          ArrowRight: "right",
          KeyD: "right"
        }[event.code];
        if (!direction) return;
        event.preventDefault();
        onAction({ dir: direction });
      };
      window.addEventListener("keydown", onKeyDown, { passive: false });
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [onAction]);
    const p1 = snakes[0] || { name: "Player 1", score: 0 };
    const p22 = snakes[1] || { name: "Player 2", score: 0 };
    return /* @__PURE__ */ u3("section", { className: "sd-shell", "aria-label": "\uC6D0\uBCF8 Snake Duel \uAC8C\uC784 \uD654\uBA74", children: [
      /* @__PURE__ */ u3("div", { className: "sd-scoreboard", children: [
        /* @__PURE__ */ u3("div", { className: `sd-badge sd-badge-p1 ${p1.id === currentUser.id ? "is-me" : ""}`, children: [
          /* @__PURE__ */ u3("span", { className: "sd-badge-role", children: "Player 1 \xB7 WASD" }),
          /* @__PURE__ */ u3("strong", { children: p1.name }),
          /* @__PURE__ */ u3("span", { className: "sd-score", children: [
            p1.score || 0,
            " pts"
          ] })
        ] }),
        /* @__PURE__ */ u3("div", { className: "sd-room-tag", children: [
          /* @__PURE__ */ u3("small", { children: "ROOM" }),
          /* @__PURE__ */ u3("strong", { children: room?.code || "LOCAL" })
        ] }),
        /* @__PURE__ */ u3("div", { className: `sd-badge sd-badge-p2 ${p22.id === currentUser.id ? "is-me" : ""}`, children: [
          /* @__PURE__ */ u3("span", { className: "sd-badge-role", children: "Player 2 \xB7 ARROWS" }),
          /* @__PURE__ */ u3("strong", { children: p22.name }),
          /* @__PURE__ */ u3("span", { className: "sd-score", children: [
            p22.score || 0,
            " pts"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { className: "sd-board-wrap", children: /* @__PURE__ */ u3("canvas", { ref: canvasRef, className: "sd-board", width: "600", height: "400", "aria-label": "30 x 20 Snake Duel \uCE94\uBC84\uC2A4" }) }),
      /* @__PURE__ */ u3("div", { className: "sd-footnote", children: [
        /* @__PURE__ */ u3("span", { children: "\uC6D0\uBCF8 \uC5D4\uC9C4 \xB7 30\xD720 \xB7 150ms tick" }),
        /* @__PURE__ */ u3("span", { children: "WASD \uB610\uB294 \uBC29\uD5A5\uD0A4" })
      ] }),
      /* @__PURE__ */ u3(ArcadeDpad, { onAction })
    ] });
  }
  function OriginalBombermanArena({ mode = "online" }) {
    return /* @__PURE__ */ u3("section", { className: "ba-original-shell", "aria-label": "Blast Arena \uC6D0\uBCF8 \uAC8C\uC784", children: /* @__PURE__ */ u3(
      "iframe",
      {
        className: "ba-original-frame",
        src: `/original-blast-arena/?mode=${encodeURIComponent(mode)}`,
        title: "Blast Arena original game",
        allow: "autoplay; fullscreen; gamepad"
      },
      mode
    ) });
  }
  function OriginalBombergirlArena({ mode = "single", room = null, currentUser = null }) {
    const src = T2(() => {
      const params = new URLSearchParams({ mode });
      if (mode === "online") {
        params.set("room", room?.code || "");
        params.set("player", currentUser?.id || "");
        params.set("name", currentUser?.name || "Player");
      }
      return `/original-bombergirl/?${params.toString()}`;
    }, [mode, room?.code, currentUser?.id, currentUser?.name]);
    return /* @__PURE__ */ u3("section", { className: "bg-original-shell", "aria-label": "HTML5 Bombergirl \uC6D0\uBCF8 \uAC8C\uC784", children: /* @__PURE__ */ u3(
      "iframe",
      {
        className: "bg-original-frame",
        src,
        title: mode === "online" ? "HTML5 Bombergirl online game" : "HTML5 Bombergirl original single player",
        allow: "autoplay; fullscreen; gamepad"
      },
      src
    ) });
  }
  function ArcadeDpad({ onAction }) {
    return /* @__PURE__ */ u3("div", { className: "oa-dpad", "aria-label": "\uD654\uBA74 \uBC29\uD5A5\uD0A4", children: [
      /* @__PURE__ */ u3("button", { type: "button", className: "up", onClick: () => onAction({ dir: "up" }), children: "\u25B2" }),
      /* @__PURE__ */ u3("button", { type: "button", className: "left", onClick: () => onAction({ dir: "left" }), children: "\u25C0" }),
      /* @__PURE__ */ u3("button", { type: "button", className: "down", onClick: () => onAction({ dir: "down" }), children: "\u25BC" }),
      /* @__PURE__ */ u3("button", { type: "button", className: "right", onClick: () => onAction({ dir: "right" }), children: "\u25B6" })
    ] });
  }

  // platform-src/components/GamePlayStage.jsx
  function GamePlayStage({ gameId, room, currentUser, gameStateData, onAction }) {
    const gs = gameStateData?.gameState || {};
    const status = gameStateData?.status || "\uAC8C\uC784 \uC900\uBE44 \uC911...";
    const scores = gameStateData?.scores || {};
    const currentPlayerId = gameStateData?.currentPlayerId || null;
    const isMyTurn = !currentPlayerId || currentPlayerId === currentUser.id;
    if (gameId === "bomberman") return /* @__PURE__ */ u3(OriginalBombermanArena, {});
    if (gameId === "bombergirl") {
      return /* @__PURE__ */ u3(OriginalBombergirlArena, { mode: "online", room, currentUser });
    }
    if (gameId === "snakeduel") {
      return /* @__PURE__ */ u3("div", { className: "gp-play-stage oa-stage-wrapper", "data-game-stage": gameId, children: [
        /* @__PURE__ */ u3("div", { className: "oa-live-status", role: "status", children: [
          /* @__PURE__ */ u3("span", {}),
          status
        ] }),
        /* @__PURE__ */ u3(OriginalSnakeDuelArena, { gs, room, currentUser, onAction })
      ] });
    }
    return /* @__PURE__ */ u3("div", { className: "gp-play-stage bb-stage-wrapper", "data-game-stage": gameId, children: [
      Object.keys(scores).length > 0 && /* @__PURE__ */ u3("div", { className: "bb-scoreboard-bar", "aria-label": "\uD604\uC7AC \uC810\uC218", children: Object.entries(scores).map(([name, score]) => /* @__PURE__ */ u3("div", { className: `bb-score-pill ${name === currentUser.name ? "me" : ""}`, children: [
        /* @__PURE__ */ u3("span", { children: [
          name === currentUser.name ? "\u{1F464}" : name.includes("BOT") ? "\u{1F916}" : "\u{1F3AE}",
          " ",
          name
        ] }),
        /* @__PURE__ */ u3("strong", { className: "bb-score-val", children: [
          score,
          "\uC810"
        ] })
      ] }, name)) }),
      /* @__PURE__ */ u3("div", { className: `gp-status-banner bb-status-banner ${isMyTurn ? "my-turn" : "wait-turn"}`, role: "status", children: status }),
      /* @__PURE__ */ u3("div", { className: "gp-stage-inner bb-arena-body", children: [
        gameId === "reaction" && /* @__PURE__ */ u3(ReactionArena, { status, onAction }),
        gameId === "tictactoe" && /* @__PURE__ */ u3(TicTacToeArena, { gs, isMyTurn, onAction }),
        gameId === "connectfour" && /* @__PURE__ */ u3(ConnectFourArena, { gs, isMyTurn, onAction }),
        gameId === "wordchain" && /* @__PURE__ */ u3(WordChainArena, { gs, isMyTurn, onAction }),
        gameId === "mathduel" && /* @__PURE__ */ u3(MathDuelArena, { gs, isMyTurn, onAction }),
        gameId === "rpsarena" && /* @__PURE__ */ u3(RpsArena, { gs, currentUser, onAction }),
        gameId === "anagram" && /* @__PURE__ */ u3(AnagramArena, { gs, isMyTurn, onAction }),
        gameId === "numberhunt" && /* @__PURE__ */ u3(NumberHuntArena, { gs, currentUser, onAction }),
        gameId === "memorymatch" && /* @__PURE__ */ u3(MemoryMatchArena, { gs, isMyTurn, onAction }),
        gameId === "speedtyping" && /* @__PURE__ */ u3(SpeedTypingArena, { gs, currentUser, onAction }),
        gameId === "colormatch" && /* @__PURE__ */ u3(ColorMatchArena, { gs, currentUser, onAction }),
        gameId === "simonsays" && /* @__PURE__ */ u3(SimonSaysArena, { gs, currentUser, onAction }),
        gameId === "trivia" && /* @__PURE__ */ u3(TriviaArena, { gs, currentUser, onAction }),
        gameId === "higherlower" && /* @__PURE__ */ u3(HigherLowerArena, { gs, isMyTurn, onAction }),
        gameId === "oddoneout" && /* @__PURE__ */ u3(OddOneOutArena, { gs, isMyTurn, onAction }),
        gameId === "drawing" && /* @__PURE__ */ u3(DrawingArena, { gs, currentUser, onAction })
      ] })
    ] });
  }
  function ReactionArena({ status, onAction }) {
    const isGo = status && status.includes("GO");
    return /* @__PURE__ */ u3("div", { className: "bb-reaction-wrap", children: [
      /* @__PURE__ */ u3("p", { className: "bb-hint", children: [
        "\uC6D0\uC774 ",
        /* @__PURE__ */ u3("strong", { style: { color: "#00ff88" }, children: "\uCD08\uB85D\uC0C9 (GO!)" }),
        "\uC73C\uB85C \uBC14\uB00C\uB294 \uC21C\uAC04 \uC989\uC2DC \uD074\uB9AD\uD558\uC138\uC694!"
      ] }),
      /* @__PURE__ */ u3(
        "button",
        {
          type: "button",
          className: `bb-reaction-circle ${isGo ? "go" : "ready"}`,
          onClick: () => isGo && onAction({ type: "click" }),
          children: [
            /* @__PURE__ */ u3("span", { className: "bb-reaction-icon", children: isGo ? "\u{1F3AF}" : "\u23F3" }),
            /* @__PURE__ */ u3("span", { className: "bb-reaction-label", children: isGo ? "\uC9C0\uAE08 \uD074\uB9AD!" : "\uB300\uAE30 \uC911..." })
          ]
        }
      )
    ] });
  }
  function TicTacToeArena({ gs, isMyTurn, onAction }) {
    const board = Array.isArray(gs.board) ? gs.board : Array(9).fill(null);
    return /* @__PURE__ */ u3("div", { className: "bb-ttt-board", children: board.map((cell, i3) => /* @__PURE__ */ u3(
      "button",
      {
        type: "button",
        className: `bb-ttt-cell ${cell === "X" ? "x-mark" : cell === "O" ? "o-mark" : ""}`,
        disabled: !isMyTurn || cell !== null,
        onClick: () => onAction({ pos: i3 }),
        children: cell || ""
      },
      i3
    )) });
  }
  function ConnectFourArena({ gs, isMyTurn, onAction }) {
    const board = Array.isArray(gs.board) ? gs.board : Array(42).fill(null);
    const done = Number.isInteger(gs.winner) || gs.draw;
    return /* @__PURE__ */ u3("div", { className: "bb-cf-wrap", children: [
      /* @__PURE__ */ u3("div", { className: "bb-cf-drops", children: [0, 1, 2, 3, 4, 5, 6].map((col) => /* @__PURE__ */ u3(
        "button",
        {
          type: "button",
          className: "gp-btn gp-btn-secondary gp-btn-sm",
          disabled: done || !isMyTurn,
          onClick: () => onAction({ column: col }),
          children: [
            "\u25BC ",
            col + 1,
            "\uC5F4"
          ]
        },
        col
      )) }),
      /* @__PURE__ */ u3("div", { className: "bb-cf-grid", children: board.map((cell, i3) => /* @__PURE__ */ u3(
        "div",
        {
          className: `bb-cf-cell ${cell === "R" ? "red" : cell === "Y" ? "yellow" : ""}`,
          onClick: () => !done && isMyTurn && onAction({ column: i3 % 7 })
        },
        i3
      )) })
    ] });
  }
  function WordChainArena({ gs, isMyTurn, onAction }) {
    const [word, setWord] = d2("");
    const chain = gs.chain || [];
    const lastLetter = (gs.lastLetter || "a").toUpperCase();
    const submit = (e3) => {
      e3.preventDefault();
      if (!word.trim()) return;
      onAction({ word: word.trim().toLowerCase() });
      setWord("");
    };
    return /* @__PURE__ */ u3("div", { className: "bb-prompt-wrap", children: [
      /* @__PURE__ */ u3("div", { className: "bb-prompt-card", children: [
        "\uC2DC\uC791 \uC54C\uD30C\uBCB3: ",
        /* @__PURE__ */ u3("strong", { children: [
          "\u201C",
          lastLetter,
          "\u201D"
        ] }),
        " \uB85C \uC2DC\uC791\uD558\uB294 \uC601\uB2E8\uC5B4 \uC785\uB825"
      ] }),
      /* @__PURE__ */ u3("form", { className: "bb-input-row", onSubmit: submit, children: [
        /* @__PURE__ */ u3(
          "input",
          {
            type: "text",
            className: "gp-input",
            placeholder: `"${lastLetter}"\uB85C \uC2DC\uC791\uD558\uB294 \uC601\uB2E8\uC5B4 (\uC608: apple, eagle...)`,
            value: word,
            disabled: !isMyTurn,
            onChange: (e3) => setWord(e3.target.value)
          }
        ),
        /* @__PURE__ */ u3("button", { type: "submit", className: "gp-btn gp-btn-primary", disabled: !isMyTurn, children: "\uC81C\uCD9C" })
      ] }),
      /* @__PURE__ */ u3("div", { className: "bb-chain-list", children: chain.length === 0 ? /* @__PURE__ */ u3("small", { className: "gp-muted", children: "\uC544\uC9C1 \uC5F0\uACB0\uB41C \uB2E8\uC5B4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }) : chain.map((w3, i3) => /* @__PURE__ */ u3("span", { className: "bb-chain-chip", children: i3 > 0 ? `\u2192 ${w3}` : w3 }, i3)) })
    ] });
  }
  function MathDuelArena({ gs, isMyTurn, onAction }) {
    const [ans, setAns] = d2("");
    const submit = (e3) => {
      e3.preventDefault();
      if (ans === "") return;
      onAction({ answer: Number(ans) });
      setAns("");
    };
    return /* @__PURE__ */ u3("div", { className: "bb-prompt-wrap", children: [
      /* @__PURE__ */ u3("div", { className: "bb-prompt-card bb-big-math", children: gs.prompt ? `${gs.prompt} = ?` : "\uBB38\uC81C \uCD9C\uC81C \uC911..." }),
      /* @__PURE__ */ u3("form", { className: "bb-input-row", onSubmit: submit, children: [
        /* @__PURE__ */ u3(
          "input",
          {
            type: "number",
            className: "gp-input",
            placeholder: "\uC815\uB2F5 \uC22B\uC790 \uC785\uB825...",
            value: ans,
            disabled: !isMyTurn,
            onChange: (e3) => setAns(e3.target.value)
          }
        ),
        /* @__PURE__ */ u3("button", { type: "submit", className: "gp-btn gp-btn-primary", disabled: !isMyTurn, children: "\uC815\uB2F5 \uC81C\uCD9C" })
      ] })
    ] });
  }
  function RpsArena({ gs, currentUser, onAction }) {
    const locked = Boolean(gs.choices && gs.choices[currentUser.id]);
    const items = [
      { id: "rock", icon: "\u{1FAA8}", label: "\uBC14\uC704 (Rock)" },
      { id: "paper", icon: "\u{1F4C4}", label: "\uBCF4 (Paper)" },
      { id: "scissors", icon: "\u2702\uFE0F", label: "\uAC00\uC704 (Scissors)" }
    ];
    return /* @__PURE__ */ u3("div", { className: "bb-choice-grid", children: items.map((it) => /* @__PURE__ */ u3(
      "button",
      {
        type: "button",
        className: "bb-choice-btn",
        disabled: locked,
        onClick: () => onAction({ choice: it.id }),
        children: [
          /* @__PURE__ */ u3("span", { className: "bb-choice-icon", children: it.icon }),
          /* @__PURE__ */ u3("span", { children: it.label })
        ]
      },
      it.id
    )) });
  }
  function AnagramArena({ gs, isMyTurn, onAction }) {
    const [guess, setGuess] = d2("");
    const submit = (e3) => {
      e3.preventDefault();
      if (!guess.trim()) return;
      onAction({ guess: guess.trim().toLowerCase() });
      setGuess("");
    };
    return /* @__PURE__ */ u3("div", { className: "bb-prompt-wrap", children: [
      /* @__PURE__ */ u3("div", { className: "bb-prompt-card bb-big-math", children: [
        "\uCCA0\uC790 \uBC30\uC5F4: ",
        /* @__PURE__ */ u3("span", { style: { letterSpacing: "6px", color: "#ffea00" }, children: (gs.scrambled || "...").toUpperCase() })
      ] }),
      /* @__PURE__ */ u3("form", { className: "bb-input-row", onSubmit: submit, children: [
        /* @__PURE__ */ u3(
          "input",
          {
            type: "text",
            className: "gp-input",
            placeholder: "\uC6D0\uB798 \uC601\uB2E8\uC5B4\uB97C \uC785\uB825\uD558\uC138\uC694...",
            value: guess,
            disabled: !isMyTurn,
            onChange: (e3) => setGuess(e3.target.value)
          }
        ),
        /* @__PURE__ */ u3("button", { type: "submit", className: "gp-btn gp-btn-primary", disabled: !isMyTurn, children: "\uC81C\uCD9C" })
      ] })
    ] });
  }
  function NumberHuntArena({ gs, currentUser, onAction }) {
    const [val, setVal] = d2("20");
    const locked = gs.guesses && gs.guesses[currentUser.id] !== void 0;
    const submit = (e3) => {
      e3.preventDefault();
      onAction({ guess: Number(val) });
    };
    return /* @__PURE__ */ u3("div", { className: "bb-prompt-wrap", children: [
      /* @__PURE__ */ u3("div", { className: "bb-prompt-card", children: [
        "10 ~ 30 \uC0AC\uC774\uC758 \uC228\uACA8\uC9C4 \uBAA9\uD45C \uC22B\uC790\uB97C \uCD94\uB9AC\uD558\uC138\uC694! (\uB77C\uC6B4\uB4DC ",
        gs.round || 1,
        "/",
        gs.maxRounds || 6,
        ")"
      ] }),
      /* @__PURE__ */ u3("form", { className: "bb-input-row", onSubmit: submit, children: [
        /* @__PURE__ */ u3(
          "input",
          {
            type: "number",
            min: 10,
            max: 30,
            className: "gp-input",
            value: val,
            disabled: locked,
            onChange: (e3) => setVal(e3.target.value)
          }
        ),
        /* @__PURE__ */ u3("button", { type: "submit", className: "gp-btn gp-btn-primary", disabled: locked, children: locked ? "\uC81C\uCD9C \uC644\uB8CC" : "\uC22B\uC790 \uC120\uD0DD" })
      ] })
    ] });
  }
  function MemoryMatchArena({ gs, isMyTurn, onAction }) {
    const cards = Array.isArray(gs.cards) ? gs.cards : Array(16).fill(null);
    const flipped = new Set(gs.flipped || []);
    const matched = new Set(gs.matched || []);
    return /* @__PURE__ */ u3("div", { className: "bb-memory-grid", children: cards.map((symbol, idx) => {
      const isUp = flipped.has(idx) || matched.has(idx);
      return /* @__PURE__ */ u3(
        "button",
        {
          type: "button",
          className: `bb-memory-card ${isUp ? "flipped" : ""} ${matched.has(idx) ? "matched" : ""}`,
          disabled: !isMyTurn || isUp || gs.lockBoard,
          onClick: () => onAction({ cardIndex: idx }),
          children: isUp ? symbol || "\u2753" : "\u{1F3B4}"
        },
        idx
      );
    }) });
  }
  function SpeedTypingArena({ gs, currentUser, onAction }) {
    const [typed, setTyped] = d2("");
    const word = gs.currentWord || "ready";
    const wIdx = gs.currentWordIndex || 0;
    const done = (gs.completed?.[currentUser.id] || 0) > wIdx;
    h2(() => {
      setTyped("");
    }, [word]);
    const submit = (e3) => {
      e3.preventDefault();
      if (!typed.trim()) return;
      onAction({ typed: typed.trim() });
      setTyped("");
    };
    return /* @__PURE__ */ u3("div", { className: "bb-prompt-wrap", children: [
      /* @__PURE__ */ u3("div", { className: "bb-typing-target", children: word }),
      /* @__PURE__ */ u3("form", { className: "bb-input-row", onSubmit: submit, children: [
        /* @__PURE__ */ u3(
          "input",
          {
            type: "text",
            className: "gp-input",
            placeholder: "\uC704 \uB2E8\uC5B4\uB97C \uADF8\uB300\uB85C \uBE60\uB974\uAC8C \uC785\uB825 \uD6C4 Enter!",
            value: typed,
            disabled: done,
            onChange: (e3) => setTyped(e3.target.value)
          }
        ),
        /* @__PURE__ */ u3("button", { type: "submit", className: "gp-btn gp-btn-primary", disabled: done, children: done ? "\uC644\uB8CC!" : "\uC785\uB825" })
      ] }),
      gs.wpm !== void 0 && /* @__PURE__ */ u3("div", { className: "bb-stat-pill", children: [
        "\uCD5C\uADFC \uC18D\uB3C4: ",
        /* @__PURE__ */ u3("strong", { children: [
          gs.wpm,
          " WPM"
        ] })
      ] })
    ] });
  }
  function ColorMatchArena({ gs, currentUser, onAction }) {
    const display = gs.currentDisplay || { word: "READY", color: "#00f0ff" };
    const locked = gs.answered && gs.answered[currentUser.id] !== void 0;
    const buttons = [
      { id: "red", label: "RED (\uBE68\uAC15)", bg: "#ff3366", fg: "#fff" },
      { id: "blue", label: "BLUE (\uD30C\uB791)", bg: "#4488ff", fg: "#fff" },
      { id: "green", label: "GREEN (\uCD08\uB85D)", bg: "#00ff88", fg: "#000" },
      { id: "yellow", label: "YELLOW (\uB178\uB791)", bg: "#ffea00", fg: "#000" }
    ];
    return /* @__PURE__ */ u3("div", { className: "bb-prompt-wrap", children: [
      /* @__PURE__ */ u3("p", { className: "bb-hint", children: [
        "\uB2E8\uC5B4\uC758 \uB73B\uC774 \uC544\uB2C8\uB77C ",
        /* @__PURE__ */ u3("strong", { children: "\uAE00\uC790\uC758 \uC2E4\uC81C \uC0C9\uC0C1" }),
        "\uC744 \uD074\uB9AD\uD558\uC138\uC694!"
      ] }),
      /* @__PURE__ */ u3("div", { className: "bb-color-word", style: { color: display.color }, children: display.word }),
      /* @__PURE__ */ u3("div", { className: "bb-color-grid", children: buttons.map((b2) => /* @__PURE__ */ u3(
        "button",
        {
          type: "button",
          className: "bb-color-btn",
          style: { background: b2.bg, color: b2.fg },
          disabled: locked,
          onClick: () => onAction({ color: b2.id }),
          children: b2.label
        },
        b2.id
      )) })
    ] });
  }
  function SimonSaysArena({ gs, currentUser, onAction }) {
    const [litColor, setLitColor] = d2(null);
    const seq = gs.sequence || [];
    const showing = !!gs.showingSequence;
    h2(() => {
      if (!showing || !seq.length) return;
      const timers = [];
      seq.forEach((col, i3) => {
        timers.push(setTimeout(() => setLitColor(col), i3 * 550));
        timers.push(setTimeout(() => setLitColor(null), i3 * 550 + 320));
      });
      return () => timers.forEach(clearTimeout);
    }, [showing, gs.round, seq.length]);
    const colors = ["red", "blue", "green", "yellow"];
    const myProgress = (gs.playerSequence?.[currentUser.id] || []).length;
    return /* @__PURE__ */ u3("div", { className: "bb-prompt-wrap", children: [
      /* @__PURE__ */ u3("p", { className: "bb-hint", children: showing ? "\u{1F440} \uC810\uB4F1\uB418\uB294 \uC0C9\uC0C1 \uC21C\uC11C\uB97C \uAE30\uC5B5\uD558\uC138\uC694!" : `\uC9C4\uD589\uB3C4: ${myProgress} / ${seq.length}` }),
      /* @__PURE__ */ u3("div", { className: "bb-simon-grid", children: colors.map((c3) => /* @__PURE__ */ u3(
        "button",
        {
          type: "button",
          className: `bb-simon-btn ${c3} ${litColor === c3 ? "active" : ""}`,
          disabled: showing || gs.eliminated?.[currentUser.id],
          onClick: () => {
            setLitColor(c3);
            setTimeout(() => setLitColor(null), 180);
            onAction({ sequence: [c3] });
          }
        },
        c3
      )) })
    ] });
  }
  function TriviaArena({ gs, currentUser, onAction }) {
    const options = gs.options || [];
    const locked = gs.answered && gs.answered[currentUser.id] !== void 0;
    return /* @__PURE__ */ u3("div", { className: "bb-prompt-wrap", children: [
      /* @__PURE__ */ u3("div", { className: "bb-prompt-card", children: gs.question || "\uBB38\uC81C \uC900\uBE44 \uC911..." }),
      gs.timer !== void 0 && /* @__PURE__ */ u3("div", { className: "bb-timer-bar-wrap", children: /* @__PURE__ */ u3("div", { className: "bb-timer-bar", style: { width: `${Math.max(0, gs.timer / 15 * 100)}%` } }) }),
      /* @__PURE__ */ u3("div", { className: "bb-trivia-list", children: options.map((opt, idx) => /* @__PURE__ */ u3(
        "button",
        {
          type: "button",
          className: "bb-trivia-option",
          disabled: locked,
          onClick: () => onAction({ option: idx }),
          children: [
            /* @__PURE__ */ u3("strong", { children: [
              String.fromCharCode(65 + idx),
              "."
            ] }),
            " ",
            opt
          ]
        },
        idx
      )) })
    ] });
  }
  function HigherLowerArena({ gs, isMyTurn, onAction }) {
    const locked = !isMyTurn || !!gs.answered;
    return /* @__PURE__ */ u3("div", { className: "bb-prompt-wrap", children: /* @__PURE__ */ u3("div", { className: "bb-hl-card", children: [
      /* @__PURE__ */ u3("small", { className: "gp-muted", children: "\uD604\uC7AC \uC22B\uC790 (1 ~ 100)" }),
      /* @__PURE__ */ u3("div", { className: "bb-hl-num", children: gs.current ?? "?" }),
      gs.next !== void 0 && /* @__PURE__ */ u3("div", { className: "bb-hl-next", children: [
        "\uB2E4\uC74C \uC22B\uC790 \uACB0\uACFC: ",
        /* @__PURE__ */ u3("strong", { children: gs.next })
      ] }),
      /* @__PURE__ */ u3("div", { className: "bb-hl-actions", children: [
        /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-primary", disabled: locked, onClick: () => onAction({ choice: "higher" }), children: "\u2B06\uFE0F \uB354 \uB192\uB2E4 (Higher)" }),
        /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-secondary", disabled: locked, onClick: () => onAction({ choice: "lower" }), children: "\u2B07\uFE0F \uB354 \uB0AE\uB2E4 (Lower)" })
      ] })
    ] }) });
  }
  function OddOneOutArena({ gs, isMyTurn, onAction }) {
    const grid = Array.isArray(gs.grid) ? gs.grid : Array(9).fill("\u2753");
    const locked = !isMyTurn || !!gs.answered;
    return /* @__PURE__ */ u3("div", { className: "bb-odd-grid", children: grid.map((item, idx) => /* @__PURE__ */ u3(
      "button",
      {
        type: "button",
        className: `bb-odd-tile ${gs.answered && gs.answer === idx ? "correct" : ""}`,
        disabled: locked,
        onClick: () => onAction({ index: idx }),
        children: item
      },
      idx
    )) });
  }
  function DrawingArena({ gs, currentUser, onAction }) {
    const canvasRef = A2(null);
    const [drawing, setDrawing] = d2(false);
    const [currentPoints, setCurrentPoints] = d2([]);
    const [color, setColor] = d2("#2c3e50");
    const [guessText, setGuessText] = d2("");
    const isDrawer = !!gs.isDrawer;
    const strokes = gs.strokes || [];
    h2(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const allStrokes = currentPoints.length > 1 ? [...strokes, { color, width: 5, points: currentPoints }] : strokes;
      for (const s3 of allStrokes) {
        if (!s3.points || s3.points.length < 2) continue;
        ctx.beginPath();
        ctx.strokeStyle = s3.color || "#2c3e50";
        ctx.lineWidth = s3.width || 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(s3.points[0][0], s3.points[0][1]);
        for (let i3 = 1; i3 < s3.points.length; i3++) {
          ctx.lineTo(s3.points[i3][0], s3.points[i3][1]);
        }
        ctx.stroke();
      }
    }, [strokes, currentPoints, color]);
    const getCoord = (e3) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      return [
        Math.round((e3.clientX - rect.left) * scaleX),
        Math.round((e3.clientY - rect.top) * scaleY)
      ];
    };
    const handlePointerDown = (e3) => {
      if (!isDrawer) return;
      setDrawing(true);
      setCurrentPoints([getCoord(e3)]);
    };
    const handlePointerMove = (e3) => {
      if (!isDrawer || !drawing) return;
      setCurrentPoints((prev) => [...prev, getCoord(e3)]);
    };
    const handlePointerUp = () => {
      if (!isDrawer || !drawing) return;
      setDrawing(false);
      if (currentPoints.length > 1) {
        onAction({ type: "stroke", stroke: { color, width: 5, points: currentPoints } });
      }
      setCurrentPoints([]);
    };
    const submitGuess = (e3) => {
      e3.preventDefault();
      if (!guessText.trim()) return;
      onAction({ type: "guess", text: guessText.trim() });
      setGuessText("");
    };
    return /* @__PURE__ */ u3("div", { className: "gp-drawing-layout", children: [
      /* @__PURE__ */ u3("div", { className: "gp-drawing-canvas-col", children: [
        /* @__PURE__ */ u3("div", { className: "gp-drawing-header", children: [
          /* @__PURE__ */ u3("span", { children: [
            "\uB77C\uC6B4\uB4DC ",
            gs.round || 1,
            "/",
            gs.maxRounds || 3,
            " \xB7 \uCD9C\uC81C\uC790: ",
            /* @__PURE__ */ u3("strong", { children: gs.drawerName })
          ] }),
          isDrawer ? /* @__PURE__ */ u3("span", { className: "gp-secret-word", children: [
            "\uC81C\uC2DC\uC5B4: ",
            /* @__PURE__ */ u3("strong", { children: gs.word })
          ] }) : /* @__PURE__ */ u3("span", { className: "gp-hint-badge", children: [
            "\uCE74\uD14C\uACE0\uB9AC: ",
            gs.category,
            " \xB7 \uCD08\uC131 \uD78C\uD2B8: ",
            /* @__PURE__ */ u3("strong", { children: gs.hint })
          ] })
        ] }),
        /* @__PURE__ */ u3(
          "canvas",
          {
            ref: canvasRef,
            width: 400,
            height: 340,
            className: `gp-drawing-canvas ${isDrawer ? "can-draw" : ""}`,
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: handlePointerUp
          }
        ),
        isDrawer && /* @__PURE__ */ u3("div", { className: "gp-drawing-toolbar", children: [
          ["#2c3e50", "#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6"].map((c3) => /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: `gp-color-swatch ${color === c3 ? "selected" : ""}`,
              style: { background: c3 },
              onClick: () => setColor(c3)
            },
            c3
          )),
          /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn-xs", onClick: () => onAction({ type: "clear" }), children: "\u{1F5D1}\uFE0F \uC804\uCCB4 \uC9C0\uC6B0\uAE30" })
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { className: "gp-drawing-chat-col", children: [
        /* @__PURE__ */ u3("div", { className: "gp-drawing-chat-log", children: (gs.chat || []).length === 0 ? /* @__PURE__ */ u3("p", { className: "gp-muted", children: "\uC815\uB2F5\uC744 \uC544\uB798 \uCC44\uD305\uCC3D\uC5D0 \uC785\uB825\uD574 \uBCF4\uC138\uC694!" }) : (gs.chat || []).map((msg) => /* @__PURE__ */ u3("div", { className: `gp-chat-msg ${msg.isCorrect ? "correct" : ""}`, children: [
          /* @__PURE__ */ u3("strong", { children: [
            msg.sender,
            ":"
          ] }),
          " ",
          msg.text
        ] }, msg.id)) }),
        !isDrawer && /* @__PURE__ */ u3("form", { className: "gp-drawing-guess-form", onSubmit: submitGuess, children: [
          /* @__PURE__ */ u3(
            "input",
            {
              type: "text",
              className: "gp-input",
              placeholder: "\uC815\uB2F5 \uC785\uB825...",
              value: guessText,
              disabled: !!gs.guessedIds?.[currentUser.id],
              onChange: (e3) => setGuessText(e3.target.value)
            }
          ),
          /* @__PURE__ */ u3("button", { type: "submit", className: "gp-btn gp-btn-primary", disabled: !!gs.guessedIds?.[currentUser.id], children: "\uC815\uB2F5!" })
        ] })
      ] })
    ] });
  }

  // platform-src/components/EventGroupsView.jsx
  function EventGroupsView({ api, currentUser, activeEventId, onSelectActiveEvent }) {
    const [events, setEvents] = d2([]);
    const [selectedEventId, setSelectedEventId] = d2(activeEventId || null);
    const [eventDetail, setEventDetail] = d2(null);
    const [eventRankings, setEventRankings] = d2(null);
    const [directoryUsers, setDirectoryUsers] = d2([]);
    const [departments, setDepartments] = d2([]);
    const [showCreateModal, setShowCreateModal] = d2(false);
    const [newEventName, setNewEventName] = d2("");
    const [newEventDesc, setNewEventDesc] = d2("");
    const [selectedUserIds, setSelectedUserIds] = d2(() => new Set([currentUser?.id].filter(Boolean)));
    const [selectedGameIds, setSelectedGameIds] = d2(() => /* @__PURE__ */ new Set(["marble-roulette", "reaction", "speedtyping", "bomberman", "drawing"]));
    const [deptFilter, setDeptFilter] = d2("");
    const [pointFirst, setPointFirst] = d2(10);
    const [pointSecond, setPointSecond] = d2(6);
    const [pointThird, setPointThird] = d2(3);
    const [pointPart, setPointPart] = d2(1);
    const [errorMsg, setErrorMsg] = d2("");
    const loadEvents = q2(async () => {
      try {
        const [evRes, dirRes] = await Promise.all([
          api.listEventGroups(),
          api.getDirectory()
        ]);
        const list = evRes.events || [];
        setEvents(list);
        setDirectoryUsers(dirRes.users || []);
        setDepartments(dirRes.departments || []);
        if (!selectedEventId && list.length > 0) {
          setSelectedEventId(list[0].id);
        }
      } catch (err) {
        setErrorMsg(err.message);
      }
    }, [api, selectedEventId]);
    const loadSelectedDetail = q2(async (id) => {
      if (!id) {
        setEventDetail(null);
        setEventRankings(null);
        return;
      }
      try {
        const [detailRes, rankRes] = await Promise.all([
          api.getEventGroup(id),
          api.getEventRankings(id)
        ]);
        setEventDetail(detailRes.event);
        setEventRankings(rankRes);
      } catch (err) {
        setErrorMsg(err.message);
      }
    }, [api]);
    h2(() => {
      loadEvents();
    }, [loadEvents]);
    h2(() => {
      if (selectedEventId) {
        loadSelectedDetail(selectedEventId);
      }
    }, [selectedEventId, loadSelectedDetail]);
    const handleCreateEvent = async (e3) => {
      e3.preventDefault();
      setErrorMsg("");
      if (!newEventName.trim()) {
        setErrorMsg("\uC774\uBCA4\uD2B8 \uADF8\uB8F9 \uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694.");
        return;
      }
      try {
        const res = await api.createEventGroup({
          name: newEventName.trim(),
          description: newEventDesc.trim(),
          participantIds: Array.from(selectedUserIds),
          gameIds: Array.from(selectedGameIds),
          pointPolicy: {
            first: Number(pointFirst) || 10,
            second: Number(pointSecond) || 6,
            third: Number(pointThird) || 3,
            participation: Number(pointPart) || 1
          }
        });
        setShowCreateModal(false);
        setNewEventName("");
        setNewEventDesc("");
        await loadEvents();
        if (res.event?.id) {
          setSelectedEventId(res.event.id);
          onSelectActiveEvent?.(res.event.id);
        }
      } catch (err) {
        setErrorMsg(err.message);
      }
    };
    const handleStatusChange = async (eventId, status) => {
      try {
        await api.updateEventStatus(eventId, status);
        await loadEvents();
        await loadSelectedDetail(eventId);
        if (status === "completed" && activeEventId === eventId) {
          onSelectActiveEvent?.(null);
        }
      } catch (err) {
        setErrorMsg(err.message);
      }
    };
    const toggleUserSelection = (uid) => {
      setSelectedUserIds((prev) => {
        const next = new Set(prev);
        if (next.has(uid)) next.delete(uid);
        else next.add(uid);
        return next;
      });
    };
    const selectAllFilteredUsers = () => {
      const filtered = directoryUsers.filter((u4) => !deptFilter || u4.departmentId === deptFilter);
      setSelectedUserIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((u4) => next.add(u4.id));
        return next;
      });
    };
    const toggleGameSelection = (gid) => {
      setSelectedGameIds((prev) => {
        const next = new Set(prev);
        if (next.has(gid)) next.delete(gid);
        else next.add(gid);
        return next;
      });
    };
    return /* @__PURE__ */ u3("div", { className: "gp-events-view", children: [
      /* @__PURE__ */ u3("div", { className: "gp-section-header", children: [
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("h2", { children: "\u{1F3C6} \uC0AC\uB0B4 \uC774\uBCA4\uD2B8 \uADF8\uB8F9 & \uD1A0\uB108\uBA3C\uD2B8" }),
          /* @__PURE__ */ u3("p", { className: "gp-muted", children: "\uC5EC\uB7EC \uBD80\uC11C\uC758 \uC784\uC9C1\uC6D0\uC744 \uD558\uB098\uC758 \uC774\uBCA4\uD2B8 \uADF8\uB8F9\uC73C\uB85C \uBB36\uC5B4 \uB300\uD68C \uC810\uC218\uC640 \uC774\uBCA4\uD2B8\uBCC4 \uB7AD\uD0B9\uC744 \uC9D1\uACC4\uD569\uB2C8\uB2E4." })
        ] }),
        /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-primary", onClick: () => setShowCreateModal(true), children: "+ \uC0C8 \uC774\uBCA4\uD2B8 \uADF8\uB8F9 \uC0DD\uC131" })
      ] }),
      errorMsg && /* @__PURE__ */ u3("div", { className: "gp-alert gp-alert-error", children: errorMsg }),
      /* @__PURE__ */ u3("div", { className: "gp-events-grid", children: [
        /* @__PURE__ */ u3("div", { className: "gp-panel gp-events-list-panel", children: [
          /* @__PURE__ */ u3("h3", { children: [
            "\uC774\uBCA4\uD2B8 \uADF8\uB8F9 \uBAA9\uB85D (",
            events.length,
            ")"
          ] }),
          events.length === 0 ? /* @__PURE__ */ u3("div", { className: "gp-empty-box", children: "\uC0DD\uC131\uB41C \uC774\uBCA4\uD2B8 \uADF8\uB8F9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC6B0\uCE21 \uC0C1\uB2E8 \uBC84\uD2BC\uC73C\uB85C \uB300\uD68C\uB098 \uCE5C\uC120\uC804\uC744 \uB9CC\uB4E4\uC5B4 \uBCF4\uC138\uC694!" }) : /* @__PURE__ */ u3("ul", { className: "gp-event-cards", children: events.map((ev) => {
            const isSelected = ev.id === selectedEventId;
            const isActive = ev.id === activeEventId;
            return /* @__PURE__ */ u3(
              "li",
              {
                className: `gp-event-card ${isSelected ? "selected" : ""}`,
                onClick: () => setSelectedEventId(ev.id),
                children: [
                  /* @__PURE__ */ u3("div", { className: "gp-event-card-top", children: [
                    /* @__PURE__ */ u3("strong", { children: ev.name }),
                    /* @__PURE__ */ u3("span", { className: `gp-status-badge status-${ev.status}`, children: ev.status === "active" ? "\uC9C4\uD589 \uC911" : "\uC885\uB8CC\uB428" })
                  ] }),
                  ev.description && /* @__PURE__ */ u3("p", { className: "gp-event-desc", children: ev.description }),
                  /* @__PURE__ */ u3("div", { className: "gp-event-meta", children: [
                    /* @__PURE__ */ u3("span", { children: [
                      "\uC0DD\uC131\uC790: ",
                      ev.creatorName
                    ] }),
                    /* @__PURE__ */ u3("span", { children: [
                      "\uCC38\uAC00\uC790: ",
                      ev.participantIds?.length || 0,
                      "\uBA85"
                    ] }),
                    /* @__PURE__ */ u3("span", { children: [
                      "\uC885\uBAA9: ",
                      ev.gameIds?.length || 0,
                      "\uAC1C"
                    ] })
                  ] }),
                  /* @__PURE__ */ u3("div", { className: "gp-event-card-actions", onClick: (e3) => e3.stopPropagation(), children: ev.status === "active" && /* @__PURE__ */ u3(
                    "button",
                    {
                      type: "button",
                      className: `gp-btn gp-btn-xs ${isActive ? "gp-btn-accent" : "gp-btn-secondary"}`,
                      onClick: () => onSelectActiveEvent?.(isActive ? null : ev.id),
                      children: isActive ? "\u2713 \uD604\uC7AC \uAC8C\uC784\uC5D0 \uC801\uC6A9 \uC911" : "\uD604\uC7AC \uAC8C\uC784\uC5D0 \uC774 \uC774\uBCA4\uD2B8 \uC801\uC6A9"
                    }
                  ) })
                ]
              },
              ev.id
            );
          }) })
        ] }),
        /* @__PURE__ */ u3("div", { className: "gp-panel gp-event-detail-panel", children: !eventDetail ? /* @__PURE__ */ u3("div", { className: "gp-empty-box", children: "\uC88C\uCE21\uC5D0\uC11C \uC774\uBCA4\uD2B8 \uADF8\uB8F9\uC744 \uC120\uD0DD\uD558\uBA74 \uC0C1\uC138 \uC815\uBCF4\uC640 \uC2E4\uC2DC\uAC04 \uB7AD\uD0B9\uC774 \uD45C\uC2DC\uB429\uB2C8\uB2E4." }) : /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("div", { className: "gp-event-detail-header", children: [
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("h3", { children: eventDetail.name }),
              /* @__PURE__ */ u3("p", { className: "gp-muted", children: [
                eventDetail.description || "\uC124\uBA85 \uC5C6\uC74C",
                " \xB7 \uC0DD\uC131\uC790: ",
                eventDetail.creatorName
              ] })
            ] }),
            /* @__PURE__ */ u3("div", { className: "gp-btn-row", children: eventDetail.status === "active" ? /* @__PURE__ */ u3(S, { children: [
              /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  className: `gp-btn gp-btn-sm ${activeEventId === eventDetail.id ? "gp-btn-accent" : "gp-btn-primary"}`,
                  onClick: () => onSelectActiveEvent?.(activeEventId === eventDetail.id ? null : eventDetail.id),
                  children: activeEventId === eventDetail.id ? "\u2713 \uD604\uC7AC \uD65C\uC131 \uC774\uBCA4\uD2B8 (\uD574\uC81C)" : "\uC774 \uC774\uBCA4\uD2B8\uB85C \uAC8C\uC784 \uC810\uC218 \uAE30\uB85D\uD558\uAE30"
                }
              ),
              /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  className: "gp-btn gp-btn-sm gp-btn-danger",
                  onClick: () => handleStatusChange(eventDetail.id, "completed"),
                  children: "\uC774\uBCA4\uD2B8 \uC885\uB8CC"
                }
              )
            ] }) : /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                className: "gp-btn gp-btn-sm gp-btn-secondary",
                onClick: () => handleStatusChange(eventDetail.id, "active"),
                children: "\uC774\uBCA4\uD2B8 \uB2E4\uC2DC \uC2DC\uC791"
              }
            ) })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-event-policy-bar", children: [
            /* @__PURE__ */ u3("span", { children: /* @__PURE__ */ u3("strong", { children: "\uBC30\uC810 \uC815\uCC45:" }) }),
            /* @__PURE__ */ u3("span", { children: [
              "\u{1F947} 1\uC704 +",
              eventDetail.pointPolicy?.first ?? 10,
              "\uC810"
            ] }),
            /* @__PURE__ */ u3("span", { children: [
              "\u{1F948} 2\uC704 +",
              eventDetail.pointPolicy?.second ?? 6,
              "\uC810"
            ] }),
            /* @__PURE__ */ u3("span", { children: [
              "\u{1F949} 3\uC704 +",
              eventDetail.pointPolicy?.third ?? 3,
              "\uC810"
            ] }),
            /* @__PURE__ */ u3("span", { children: [
              "\u{1F3AE} \uCC38\uAC00 +",
              eventDetail.pointPolicy?.participation ?? 1,
              "\uC810"
            ] }),
            /* @__PURE__ */ u3("span", { className: "gp-muted", children: "(* BOT \uB300\uACB0\uC744 \uC81C\uC678\uD55C \uACF5\uC2DD \uC628\uB77C\uC778 \uB300\uC804 \uACB0\uACFC\uAC00 \uC790\uB3D9 \uBC18\uC601\uB429\uB2C8\uB2E4)" })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-event-tags-section", children: /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("strong", { children: [
              "\uD3EC\uD568\uB41C \uAC8C\uC784 \uC885\uBAA9 (",
              eventDetail.gameIds?.length || 0,
              "\uAC1C):"
            ] }),
            /* @__PURE__ */ u3("div", { className: "gp-chip-list", children: (eventDetail.gameIds || []).map((gid) => {
              const g4 = PLATFORM_GAMES.find((item) => item.id === gid);
              return /* @__PURE__ */ u3("span", { className: "gp-chip", children: g4 ? `${g4.icon} ${g4.name}` : gid }, gid);
            }) })
          ] }) }),
          /* @__PURE__ */ u3("div", { className: "gp-event-rankings-split", children: [
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("h4", { children: "\uAC1C\uC778\uBCC4 \uC774\uBCA4\uD2B8 \uB7AD\uD0B9" }),
              /* @__PURE__ */ u3("table", { className: "gp-table", children: [
                /* @__PURE__ */ u3("thead", { children: /* @__PURE__ */ u3("tr", { children: [
                  /* @__PURE__ */ u3("th", { children: "\uC21C\uC704" }),
                  /* @__PURE__ */ u3("th", { children: "\uC774\uB984" }),
                  /* @__PURE__ */ u3("th", { children: "\uBD80\uC11C" }),
                  /* @__PURE__ */ u3("th", { children: "\uC2B9 / \uD328" }),
                  /* @__PURE__ */ u3("th", { children: "\uACBD\uAE30\uC218" }),
                  /* @__PURE__ */ u3("th", { children: "\uC774\uBCA4\uD2B8 \uC2B9\uC810" })
                ] }) }),
                /* @__PURE__ */ u3("tbody", { children: (eventRankings?.standings || []).length === 0 ? /* @__PURE__ */ u3("tr", { children: /* @__PURE__ */ u3("td", { colSpan: 6, className: "gp-muted", children: "\uCC38\uAC00\uC790\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }) }) : eventRankings.standings.map((row) => /* @__PURE__ */ u3("tr", { className: row.userId === currentUser?.id ? "gp-row-me" : "", children: [
                  /* @__PURE__ */ u3("td", { children: /* @__PURE__ */ u3("strong", { children: [
                    "#",
                    row.rank
                  ] }) }),
                  /* @__PURE__ */ u3("td", { children: row.name }),
                  /* @__PURE__ */ u3("td", { children: row.departmentName }),
                  /* @__PURE__ */ u3("td", { children: [
                    row.wins,
                    "\uC2B9 ",
                    row.losses,
                    "\uD328"
                  ] }),
                  /* @__PURE__ */ u3("td", { children: row.matchesPlayed }),
                  /* @__PURE__ */ u3("td", { children: /* @__PURE__ */ u3("strong", { className: "gp-points-cell", children: [
                    row.eventPoints,
                    "\uC810"
                  ] }) })
                ] }, row.userId)) })
              ] })
            ] }),
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("h4", { children: "\uBD80\uC11C\uBCC4 \uC774\uBCA4\uD2B8 \uD569\uC0B0 \uB7AD\uD0B9" }),
              /* @__PURE__ */ u3("table", { className: "gp-table", children: [
                /* @__PURE__ */ u3("thead", { children: /* @__PURE__ */ u3("tr", { children: [
                  /* @__PURE__ */ u3("th", { children: "\uC21C\uC704" }),
                  /* @__PURE__ */ u3("th", { children: "\uBD80\uC11C\uBA85" }),
                  /* @__PURE__ */ u3("th", { children: "\uCC38\uAC00 \uC778\uC6D0" }),
                  /* @__PURE__ */ u3("th", { children: "\uCD1D \uC2B9\uB9AC" }),
                  /* @__PURE__ */ u3("th", { children: "\uD569\uC0B0 \uC2B9\uC810" })
                ] }) }),
                /* @__PURE__ */ u3("tbody", { children: (eventRankings?.departmentStandings || []).length === 0 ? /* @__PURE__ */ u3("tr", { children: /* @__PURE__ */ u3("td", { colSpan: 5, className: "gp-muted", children: "\uBD80\uC11C \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }) }) : eventRankings.departmentStandings.map((dept) => /* @__PURE__ */ u3("tr", { children: [
                  /* @__PURE__ */ u3("td", { children: /* @__PURE__ */ u3("strong", { children: [
                    "#",
                    dept.rank
                  ] }) }),
                  /* @__PURE__ */ u3("td", { children: dept.departmentName }),
                  /* @__PURE__ */ u3("td", { children: [
                    dept.memberCount,
                    "\uBA85"
                  ] }),
                  /* @__PURE__ */ u3("td", { children: [
                    dept.wins,
                    "\uC2B9"
                  ] }),
                  /* @__PURE__ */ u3("td", { children: /* @__PURE__ */ u3("strong", { className: "gp-points-cell", children: [
                    dept.eventPoints,
                    "\uC810"
                  ] }) })
                ] }, dept.departmentId)) })
              ] })
            ] })
          ] })
        ] }) })
      ] }),
      showCreateModal && /* @__PURE__ */ u3("div", { className: "gp-modal-backdrop", onClick: () => setShowCreateModal(false), children: /* @__PURE__ */ u3("div", { className: "gp-modal gp-modal-lg", onClick: (e3) => e3.stopPropagation(), children: [
        /* @__PURE__ */ u3("div", { className: "gp-modal-header", children: [
          /* @__PURE__ */ u3("h3", { children: "\uC0C8 \uC774\uBCA4\uD2B8 \uADF8\uB8F9 \uC0DD\uC131" }),
          /* @__PURE__ */ u3("button", { type: "button", className: "gp-close-btn", onClick: () => setShowCreateModal(false), children: "\u2715" })
        ] }),
        /* @__PURE__ */ u3("form", { onSubmit: handleCreateEvent, className: "gp-modal-body", children: [
          /* @__PURE__ */ u3("div", { className: "gp-form-row", children: [
            /* @__PURE__ */ u3("label", { children: "\uC774\uBCA4\uD2B8 \uC774\uB984 *" }),
            /* @__PURE__ */ u3(
              "input",
              {
                type: "text",
                className: "gp-input",
                placeholder: "\uC608: 2026 \uBD04 \uC6CC\uD06C\uC20D \uBBF8\uB2C8\uAC8C\uC784 \uB300\uD68C / \uC790\uB3D9\uD654\uC6B4\uC601\uD300 vs \uC778\uD504\uB77C\uD300 \uCE5C\uC120\uC804",
                value: newEventName,
                onChange: (e3) => setNewEventName(e3.target.value),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-form-row", children: [
            /* @__PURE__ */ u3("label", { children: "\uC774\uBCA4\uD2B8 \uC124\uBA85" }),
            /* @__PURE__ */ u3(
              "input",
              {
                type: "text",
                className: "gp-input",
                placeholder: "\uC608: \uAE08\uC694\uC77C \uC624\uD6C4 4\uC2DC \uAC04\uC2DD \uB0B4\uAE30 \uD1A0\uB108\uBA3C\uD2B8",
                value: newEventDesc,
                onChange: (e3) => setNewEventDesc(e3.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-form-row", children: [
            /* @__PURE__ */ u3("label", { children: "\uC2B9\uC810 \uBC30\uC810 \uAE30\uC900 (1\uC704 / 2\uC704 / 3\uC704 / \uCC38\uAC00)" }),
            /* @__PURE__ */ u3("div", { className: "gp-points-inputs", children: [
              /* @__PURE__ */ u3("span", { children: [
                "1\uC704 ",
                /* @__PURE__ */ u3("input", { type: "number", className: "gp-input gp-input-xs", value: pointFirst, onChange: (e3) => setPointFirst(e3.target.value) })
              ] }),
              /* @__PURE__ */ u3("span", { children: [
                "2\uC704 ",
                /* @__PURE__ */ u3("input", { type: "number", className: "gp-input gp-input-xs", value: pointSecond, onChange: (e3) => setPointSecond(e3.target.value) })
              ] }),
              /* @__PURE__ */ u3("span", { children: [
                "3\uC704 ",
                /* @__PURE__ */ u3("input", { type: "number", className: "gp-input gp-input-xs", value: pointThird, onChange: (e3) => setPointThird(e3.target.value) })
              ] }),
              /* @__PURE__ */ u3("span", { children: [
                "\uCC38\uAC00 ",
                /* @__PURE__ */ u3("input", { type: "number", className: "gp-input gp-input-xs", value: pointPart, onChange: (e3) => setPointPart(e3.target.value) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-form-row", children: [
            /* @__PURE__ */ u3("div", { className: "gp-label-with-actions", children: [
              /* @__PURE__ */ u3("label", { children: [
                "\uCC38\uAC00 \uC784\uC9C1\uC6D0 \uC120\uD0DD (",
                selectedUserIds.size,
                "\uBA85 \uC120\uD0DD\uB428)"
              ] }),
              /* @__PURE__ */ u3("div", { className: "gp-btn-row", children: [
                /* @__PURE__ */ u3("select", { className: "gp-select gp-select-sm", value: deptFilter, onChange: (e3) => setDeptFilter(e3.target.value), children: [
                  /* @__PURE__ */ u3("option", { value: "", children: "\uC804\uCCB4 \uBD80\uC11C" }),
                  departments.map((d3) => /* @__PURE__ */ u3("option", { value: d3.departmentId, children: d3.departmentName }, d3.departmentId))
                ] }),
                /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-xs gp-btn-secondary", onClick: selectAllFilteredUsers, children: "\uD45C\uC2DC\uB41C \uC778\uC6D0 \uC804\uCCB4 \uC120\uD0DD" })
              ] })
            ] }),
            /* @__PURE__ */ u3("div", { className: "gp-checkbox-grid", children: directoryUsers.filter((u4) => !deptFilter || u4.departmentId === deptFilter).map((u4) => /* @__PURE__ */ u3("label", { className: "gp-check-item", children: [
              /* @__PURE__ */ u3(
                "input",
                {
                  type: "checkbox",
                  checked: selectedUserIds.has(u4.id),
                  onChange: () => toggleUserSelection(u4.id)
                }
              ),
              /* @__PURE__ */ u3("span", { children: [
                u4.name,
                " ",
                /* @__PURE__ */ u3("small", { children: [
                  "(",
                  u4.departmentName,
                  ")"
                ] })
              ] })
            ] }, u4.id)) })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-form-row", children: [
            /* @__PURE__ */ u3("label", { children: [
              "\uD3EC\uD568\uD560 \uAC8C\uC784 \uC885\uBAA9 \uC120\uD0DD (",
              selectedGameIds.size,
              "\uAC1C)"
            ] }),
            /* @__PURE__ */ u3("div", { className: "gp-checkbox-grid", children: PLATFORM_GAMES.map((g4) => /* @__PURE__ */ u3("label", { className: "gp-check-item", children: [
              /* @__PURE__ */ u3(
                "input",
                {
                  type: "checkbox",
                  checked: selectedGameIds.has(g4.id),
                  onChange: () => toggleGameSelection(g4.id)
                }
              ),
              /* @__PURE__ */ u3("span", { children: [
                g4.icon,
                " ",
                g4.name
              ] })
            ] }, g4.id)) })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-modal-footer", children: [
            /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-secondary", onClick: () => setShowCreateModal(false), children: "\uCDE8\uC18C" }),
            /* @__PURE__ */ u3("button", { type: "submit", className: "gp-btn gp-btn-primary", children: "\uC774\uBCA4\uD2B8 \uADF8\uB8F9 \uC0DD\uC131" })
          ] })
        ] })
      ] }) })
    ] });
  }

  // platform-src/components/RankingsAndStatsView.jsx
  function RankingsAndStatsView({ api, currentUser }) {
    const [selectedGameId, setSelectedGameId] = d2("");
    const [includePractice, setIncludePractice] = d2(false);
    const [rankings, setRankings] = d2([]);
    const [deptRankings, setDeptRankings] = d2([]);
    const [myStats, setMyStats] = d2(null);
    const [loading, setLoading] = d2(false);
    const loadData = q2(async () => {
      setLoading(true);
      try {
        const [rankRes, deptRes, statRes] = await Promise.all([
          api.getRankings({ gameId: selectedGameId || void 0, includePractice }),
          api.getDepartmentRankings({ gameId: selectedGameId || void 0 }),
          currentUser?.id ? api.getUserStats(currentUser.id) : Promise.resolve(null)
        ]);
        setRankings(rankRes.rankings || []);
        setDeptRankings(deptRes.departments || []);
        setMyStats(statRes);
      } catch {
      } finally {
        setLoading(false);
      }
    }, [api, selectedGameId, includePractice, currentUser?.id]);
    h2(() => {
      loadData();
    }, [loadData]);
    return /* @__PURE__ */ u3("div", { className: "gp-rankings-view", children: [
      /* @__PURE__ */ u3("div", { className: "gp-section-header", children: [
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("h2", { children: "\u{1F4CA} \uACF5\uC2DD \uB7AD\uD0B9 \uBC0F \uBD80\uC11C\uBCC4 \uC804\uC801" }),
          /* @__PURE__ */ u3("p", { className: "gp-muted", children: [
            "\uBAA8\uB4E0 \uAE30\uB85D\uC740 \uACE0\uC720 \uC0AC\uBC88/\uC0AC\uC6A9\uC790 ID(",
            /* @__PURE__ */ u3("code", { children: currentUser?.id }),
            ")\uB97C \uAE30\uC900\uC73C\uB85C \uC9D1\uACC4\uB418\uBA70, \uACF5\uC2DD \uB7AD\uD0B9\uC5D0\uC11C\uB294 AI BOT \uB300\uACB0 \uAE30\uB85D\uC774 \uC81C\uC678\uB429\uB2C8\uB2E4."
          ] })
        ] }),
        /* @__PURE__ */ u3("div", { className: "gp-filter-controls", children: [
          /* @__PURE__ */ u3(
            "select",
            {
              className: "gp-select",
              value: selectedGameId,
              onChange: (e3) => setSelectedGameId(e3.target.value),
              children: [
                /* @__PURE__ */ u3("option", { value: "", children: "\uC804\uCCB4 \uAC8C\uC784 \uC885\uD569" }),
                PLATFORM_GAMES.filter((g4) => g4.id !== "marble-roulette").map((g4) => /* @__PURE__ */ u3("option", { value: g4.id, children: [
                  g4.icon,
                  " ",
                  g4.name
                ] }, g4.id))
              ]
            }
          ),
          /* @__PURE__ */ u3("label", { className: "gp-check-inline", children: [
            /* @__PURE__ */ u3(
              "input",
              {
                type: "checkbox",
                checked: includePractice,
                onChange: (e3) => setIncludePractice(e3.target.checked)
              }
            ),
            /* @__PURE__ */ u3("span", { children: "\uC5F0\uC2B5 / BOT \uB300\uC804 \uAE30\uB85D \uD3EC\uD568\uD558\uC5EC \uBCF4\uAE30" })
          ] }),
          /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-sm gp-btn-secondary", onClick: loadData, children: "\uC0C8\uB85C\uACE0\uCE68" })
        ] })
      ] }),
      myStats && /* @__PURE__ */ u3("div", { className: "gp-my-stats-banner", children: [
        /* @__PURE__ */ u3("div", { className: "gp-my-stats-title", children: [
          /* @__PURE__ */ u3("span", { className: "gp-user-badge", children: currentUser?.departmentName }),
          /* @__PURE__ */ u3("strong", { children: currentUser?.name }),
          " \uB2D8\uC758 \uB204\uC801 \uC804\uC801"
        ] }),
        /* @__PURE__ */ u3("div", { className: "gp-my-stats-metrics", children: [
          /* @__PURE__ */ u3("div", { className: "gp-stat-pill", children: [
            /* @__PURE__ */ u3("span", { className: "gp-stat-label", children: "\uACF5\uC2DD \uACBD\uAE30\uC218" }),
            /* @__PURE__ */ u3("strong", { children: [
              myStats.official?.matchesPlayed || 0,
              "\uC804"
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-stat-pill", children: [
            /* @__PURE__ */ u3("span", { className: "gp-stat-label", children: "\uACF5\uC2DD \uC2B9 / \uD328" }),
            /* @__PURE__ */ u3("strong", { children: [
              myStats.official?.wins || 0,
              "\uC2B9 ",
              myStats.official?.losses || 0,
              "\uD328"
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-stat-pill", children: [
            /* @__PURE__ */ u3("span", { className: "gp-stat-label", children: "\uACF5\uC2DD \uCD5C\uACE0 \uC810\uC218" }),
            /* @__PURE__ */ u3("strong", { children: [
              myStats.official?.bestScore || 0,
              "\uC810"
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-stat-pill gp-stat-pill-muted", children: [
            /* @__PURE__ */ u3("span", { className: "gp-stat-label", children: "BOT / \uC5F0\uC2B5 \uACBD\uAE30" }),
            /* @__PURE__ */ u3("strong", { children: [
              myStats.practice?.matchesPlayed || 0,
              "\uC804 (",
              myStats.practice?.wins || 0,
              "\uC2B9)"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { className: "gp-rankings-grid", children: [
        /* @__PURE__ */ u3("div", { className: "gp-panel", children: [
          /* @__PURE__ */ u3("h3", { children: [
            "\u{1F464} \uAC1C\uC778\uBCC4 ",
            includePractice ? "\uC804\uCCB4(\uC5F0\uC2B5 \uD3EC\uD568)" : "\uACF5\uC2DD",
            " \uB7AD\uD0B9",
            selectedGameId && ` \u2014 ${PLATFORM_GAMES.find((g4) => g4.id === selectedGameId)?.name || selectedGameId}`
          ] }),
          loading ? /* @__PURE__ */ u3("div", { className: "gp-empty-box", children: "\uBD88\uB7EC\uC624\uB294 \uC911..." }) : rankings.length === 0 ? /* @__PURE__ */ u3("div", { className: "gp-empty-box", children: [
            "\uC544\uC9C1 \uAE30\uB85D\uB41C ",
            includePractice ? "" : "\uACF5\uC2DD ",
            "\uACBD\uAE30 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
            !includePractice && ' (\uD63C\uC790/BOT \uB300\uC804\uC744 \uD50C\uB808\uC774\uD588\uB2E4\uBA74 \uC0C1\uB2E8\uC758 "\uC5F0\uC2B5 / BOT \uB300\uC804 \uAE30\uB85D \uD3EC\uD568\uD558\uC5EC \uBCF4\uAE30"\uB97C \uCCB4\uD06C\uD574 \uBCF4\uC138\uC694)'
          ] }) : /* @__PURE__ */ u3("table", { className: "gp-table", children: [
            /* @__PURE__ */ u3("thead", { children: /* @__PURE__ */ u3("tr", { children: [
              /* @__PURE__ */ u3("th", { children: "\uC21C\uC704" }),
              /* @__PURE__ */ u3("th", { children: "\uC774\uB984" }),
              /* @__PURE__ */ u3("th", { children: "\uBD80\uC11C" }),
              /* @__PURE__ */ u3("th", { children: "\uC2B9 / \uD328 (\uC2B9\uB960)" }),
              /* @__PURE__ */ u3("th", { children: "\uACBD\uAE30\uC218" }),
              /* @__PURE__ */ u3("th", { children: "\uCD5C\uACE0 \uC810\uC218" }),
              /* @__PURE__ */ u3("th", { children: "\uB204\uC801 \uC810\uC218" })
            ] }) }),
            /* @__PURE__ */ u3("tbody", { children: rankings.map((row) => /* @__PURE__ */ u3("tr", { className: row.userId === currentUser?.id ? "gp-row-me" : "", children: [
              /* @__PURE__ */ u3("td", { children: /* @__PURE__ */ u3("strong", { children: [
                "#",
                row.rank
              ] }) }),
              /* @__PURE__ */ u3("td", { children: row.name }),
              /* @__PURE__ */ u3("td", { children: row.departmentName }),
              /* @__PURE__ */ u3("td", { children: [
                row.wins,
                "\uC2B9 ",
                row.losses,
                "\uD328 (",
                row.winRate,
                "%)"
              ] }),
              /* @__PURE__ */ u3("td", { children: row.matchesPlayed }),
              /* @__PURE__ */ u3("td", { children: /* @__PURE__ */ u3("strong", { children: row.bestScore }) }),
              /* @__PURE__ */ u3("td", { children: row.totalScore })
            ] }, row.userId)) })
          ] })
        ] }),
        /* @__PURE__ */ u3("div", { className: "gp-panel", children: [
          /* @__PURE__ */ u3("h3", { children: "\u{1F3E2} \uBD80\uC11C\uBCC4 \uACF5\uC2DD \uB300\uD56D\uC804 \uB7AD\uD0B9" }),
          deptRankings.length === 0 ? /* @__PURE__ */ u3("div", { className: "gp-empty-box", children: "\uC544\uC9C1 \uBD80\uC11C\uBCC4 \uACF5\uC2DD \uB300\uC804 \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) : /* @__PURE__ */ u3("table", { className: "gp-table", children: [
            /* @__PURE__ */ u3("thead", { children: /* @__PURE__ */ u3("tr", { children: [
              /* @__PURE__ */ u3("th", { children: "\uC21C\uC704" }),
              /* @__PURE__ */ u3("th", { children: "\uBD80\uC11C\uBA85" }),
              /* @__PURE__ */ u3("th", { children: "\uCC38\uC5EC \uC778\uC6D0" }),
              /* @__PURE__ */ u3("th", { children: "\uCD1D \uC2B9\uB9AC" }),
              /* @__PURE__ */ u3("th", { children: "\uCD1D \uACBD\uAE30\uC218" }),
              /* @__PURE__ */ u3("th", { children: "\uD569\uC0B0 \uC810\uC218" })
            ] }) }),
            /* @__PURE__ */ u3("tbody", { children: deptRankings.map((dept) => /* @__PURE__ */ u3("tr", { className: dept.departmentId === currentUser?.departmentId ? "gp-row-me" : "", children: [
              /* @__PURE__ */ u3("td", { children: /* @__PURE__ */ u3("strong", { children: [
                "#",
                dept.rank
              ] }) }),
              /* @__PURE__ */ u3("td", { children: dept.departmentName }),
              /* @__PURE__ */ u3("td", { children: [
                dept.activePlayers,
                "\uBA85"
              ] }),
              /* @__PURE__ */ u3("td", { children: /* @__PURE__ */ u3("strong", { children: [
                dept.wins,
                "\uC2B9"
              ] }) }),
              /* @__PURE__ */ u3("td", { children: dept.matchesPlayed }),
              /* @__PURE__ */ u3("td", { children: dept.totalScore })
            ] }, dept.departmentId)) })
          ] }),
          myStats?.byGame && myStats.byGame.length > 0 && /* @__PURE__ */ u3("div", { className: "gp-my-game-breakdown", children: [
            /* @__PURE__ */ u3("h4", { children: "\u{1F3AE} \uB0B4 \uC885\uBAA9\uBCC4 \uC0C1\uC138 \uAE30\uB85D" }),
            /* @__PURE__ */ u3("table", { className: "gp-table gp-table-compact", children: [
              /* @__PURE__ */ u3("thead", { children: /* @__PURE__ */ u3("tr", { children: [
                /* @__PURE__ */ u3("th", { children: "\uAC8C\uC784" }),
                /* @__PURE__ */ u3("th", { children: "\uACBD\uAE30\uC218" }),
                /* @__PURE__ */ u3("th", { children: "\uC2B9\uB9AC" }),
                /* @__PURE__ */ u3("th", { children: "\uCD5C\uACE0 \uC810\uC218" })
              ] }) }),
              /* @__PURE__ */ u3("tbody", { children: myStats.byGame.map((item) => {
                const g4 = PLATFORM_GAMES.find((x3) => x3.id === item.gameId);
                return /* @__PURE__ */ u3("tr", { children: [
                  /* @__PURE__ */ u3("td", { children: g4 ? `${g4.icon} ${g4.name}` : item.gameId }),
                  /* @__PURE__ */ u3("td", { children: item.matchesPlayed }),
                  /* @__PURE__ */ u3("td", { children: [
                    item.wins,
                    "\uC2B9"
                  ] }),
                  /* @__PURE__ */ u3("td", { children: /* @__PURE__ */ u3("strong", { children: item.bestScore }) })
                ] }, item.gameId);
              }) })
            ] })
          ] })
        ] })
      ] })
    ] });
  }

  // platform-src/GamePlatformApp.jsx
  function GamePlatformApp({ userProvider, apiBaseUrl = "/api/platform" }) {
    const [currentUser, setCurrentUser] = d2(() => userProvider.getCurrentUser());
    const [activeTab, setActiveTab] = d2("arcade");
    const [selectedCategory, setSelectedCategory] = d2("all");
    const [searchQuery, setSearchQuery] = d2("");
    const [activeEventId, setActiveEventId] = d2(null);
    const [activeEventsList, setActiveEventsList] = d2([]);
    const [activeGameId, setActiveGameId] = d2(null);
    const [originalBombermanMode, setOriginalBombermanMode] = d2("online");
    const [currentRoom, setCurrentRoom] = d2(null);
    const [publicGameState, setPublicGameState] = d2(null);
    const [privateRoleState, setPrivateRoleState] = d2(null);
    const [drawingStrokes, setDrawingStrokes] = d2([]);
    const [matchResult, setMatchResult] = d2(null);
    const [publicRooms, setPublicRooms] = d2([]);
    const [directoryUsers, setDirectoryUsers] = d2([]);
    const [departments, setDepartments] = d2([]);
    const [joinCodeInput, setJoinCodeInput] = d2("");
    const [toastMessage, setToastMessage] = d2("");
    const [botModalGame, setBotModalGame] = d2(null);
    const [botCountOption, setBotCountOption] = d2(1);
    const [botDiffOption, setBotDiffOption] = d2("normal");
    const [lobbyBotDiff, setLobbyBotDiff] = d2("normal");
    const apiRef = A2(null);
    const launchRequestRef = A2(0);
    if (!apiRef.current) {
      apiRef.current = new PlatformApiClient({
        baseUrl: apiBaseUrl,
        getUser: () => userProvider.getCurrentUser()
      });
    }
    const api = apiRef.current;
    const showToast = q2((msg) => {
      setToastMessage(msg);
      setTimeout(() => {
        setToastMessage((prev) => prev === msg ? "" : prev);
      }, 3500);
    }, []);
    h2(() => {
      return userProvider.subscribe((nextUser) => {
        setCurrentUser(nextUser);
      });
    }, [userProvider]);
    const refreshLobbyData = q2(async () => {
      try {
        const [roomsRes, eventsRes, usersRes] = await Promise.all([
          api.listRooms(),
          api.listEventGroups(),
          api.listUsers()
        ]);
        setPublicRooms(roomsRes.rooms || []);
        setActiveEventsList((eventsRes.events || []).filter((e3) => e3.status === "active"));
        setDirectoryUsers(usersRes.users || []);
        setDepartments(usersRes.departments || []);
      } catch {
      }
    }, [api]);
    h2(() => {
      refreshLobbyData();
      const timer = setInterval(refreshLobbyData, 5e3);
      return () => clearInterval(timer);
    }, [refreshLobbyData]);
    h2(() => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const urlMockUser = params.get("mockUser");
      if (urlMockUser && userProvider.allowMockUserSwitch) {
        userProvider.switchMockUser(urlMockUser);
      }
      const urlRoom = params.get("room");
      if (urlRoom) {
        setJoinCodeInput(urlRoom.toUpperCase());
      }
      const urlGame = params.get("game");
      if (urlGame) {
        const targetGame = getGameById(urlGame);
        if (targetGame) {
          setTimeout(() => {
            handleStartSoloPractice(targetGame);
          }, 60);
        }
      }
    }, [userProvider]);
    h2(() => {
      const roomCode = currentRoom?.code;
      if (!roomCode || !currentUser?.id) return void 0;
      const unsubscribe = api.subscribeRoomStream(roomCode, {
        onEvent: (event, data) => {
          const eventRoomCode = data?.roomCode || data?.code || null;
          if (eventRoomCode && eventRoomCode !== roomCode) return;
          if (event === "roomSnapshot" || event === "roomUpdated" || event === "rematchReady") {
            setCurrentRoom(data);
            if (event === "rematchReady") {
              setMatchResult(null);
              setPublicGameState(null);
              setPrivateRoleState(null);
              setDrawingStrokes([]);
            }
          } else if (event === "gameStarted") {
            setCurrentRoom(data);
            setMatchResult(null);
            setPrivateRoleState(null);
            setDrawingStrokes([]);
            if (data.lastPublicGameState) {
              setPublicGameState(data.lastPublicGameState);
            }
          } else if (event === "updateGameState") {
            setPublicGameState(data);
          } else if (event === "drawingRole") {
            setPrivateRoleState(data);
            setDrawingStrokes([]);
          } else if (event === "drawingStroke") {
            setDrawingStrokes((prev) => [...prev, data]);
          } else if (event === "drawingClear") {
            setDrawingStrokes([]);
          } else if (event === "drawingGuessChat") {
            setPublicGameState((prev) => ({ ...prev || {}, lastChat: data }));
          } else if (event === "gameOver") {
            setMatchResult(data);
            setCurrentRoom((prev) => prev ? { ...prev, state: "finished", lastResult: data } : prev);
          } else if (event === "gameAborted") {
            showToast(data?.reason || "\uAC8C\uC784\uC774 \uC911\uB2E8\uB418\uC5B4 \uB300\uAE30\uC2E4\uB85C \uB3CC\uC544\uAC11\uB2C8\uB2E4.");
            setCurrentRoom((prev) => prev ? { ...prev, state: "lobby" } : prev);
          } else if (event === "error") {
            showToast(typeof data === "string" ? data : data?.message || "\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.");
          }
        }
      });
      return () => unsubscribe();
    }, [api, currentRoom?.code, currentUser?.id, showToast]);
    const isRouletteGame = (gid) => gid === "roulette" || gid === "marble-roulette";
    const handleOpenMarbleRoulette = () => {
      launchRequestRef.current += 1;
      setActiveGameId("roulette");
      setCurrentRoom(null);
    };
    const handleOpenOriginalBomberman = (mode = "online") => {
      launchRequestRef.current += 1;
      setOriginalBombermanMode(mode);
      setActiveGameId("bomberman");
      setCurrentRoom(null);
      setMatchResult(null);
      setPublicGameState(null);
    };
    const handleOpenOriginalBombergirl = () => {
      launchRequestRef.current += 1;
      setActiveGameId("bombergirl");
      setCurrentRoom(null);
      setMatchResult(null);
      setPublicGameState(null);
    };
    const handleStartSoloPractice = async (game) => {
      if (isRouletteGame(game.id)) {
        handleOpenMarbleRoulette();
        return;
      }
      if (game.id === "bomberman") {
        handleOpenOriginalBomberman("bot");
        return;
      }
      if (game.id === "bombergirl") {
        handleOpenOriginalBombergirl();
        return;
      }
      const requestId = ++launchRequestRef.current;
      try {
        const res = await api.createRoom({
          gameId: game.id,
          mode: "solo",
          botCount: 0,
          botDifficulty: "easy",
          eventId: activeEventId
        });
        if (requestId !== launchRequestRef.current) return;
        const room = res.room;
        setCurrentRoom(room);
        setActiveGameId(game.id);
        setMatchResult(null);
        setPublicGameState(null);
        const started = await api.startRoom(room.code);
        if (requestId !== launchRequestRef.current) return;
        setCurrentRoom(started.room);
        if (started.room?.lastPublicGameState) {
          setPublicGameState(started.room.lastPublicGameState);
        }
      } catch (err) {
        showToast(err.message);
      }
    };
    const handleOpenBotModal = (game) => {
      if (isRouletteGame(game.id)) {
        handleOpenMarbleRoulette();
        return;
      }
      if (game.id === "bomberman") {
        handleOpenOriginalBomberman("bot");
        return;
      }
      if (game.id === "bombergirl") {
        handleOpenOriginalBombergirl();
        return;
      }
      const maxBots = Math.max(1, (game.maxPlayers || 2) - 1);
      setBotCountOption(Math.min(1, maxBots));
      setBotDiffOption("normal");
      setBotModalGame(game);
    };
    const handleLaunchBotMatch = async () => {
      if (!botModalGame) return;
      const game = botModalGame;
      const requestId = ++launchRequestRef.current;
      setBotModalGame(null);
      try {
        const maxBots = Math.max(1, (game.maxPlayers || 2) - 1);
        const count = Math.min(maxBots, Number(botCountOption) || 1);
        const res = await api.createRoom({
          gameId: game.id,
          mode: "bot",
          botCount: count,
          botDifficulty: botDiffOption,
          eventId: activeEventId
        });
        if (requestId !== launchRequestRef.current) return;
        const room = res.room;
        setCurrentRoom(room);
        setActiveGameId(game.id);
        setMatchResult(null);
        setPublicGameState(null);
        const started = await api.startRoom(room.code);
        if (requestId !== launchRequestRef.current) return;
        setCurrentRoom(started.room);
        if (started.room?.lastPublicGameState) {
          setPublicGameState(started.room.lastPublicGameState);
        }
      } catch (err) {
        showToast(err.message);
      }
    };
    const handleCreateOnlineRoom = async (game) => {
      if (isRouletteGame(game.id)) {
        handleOpenMarbleRoulette();
        return;
      }
      if (game.id === "bomberman") {
        handleOpenOriginalBomberman("online");
        return;
      }
      const requestId = ++launchRequestRef.current;
      try {
        const res = await api.createRoom({
          gameId: game.id,
          mode: "online",
          botCount: 0,
          botDifficulty: "normal",
          eventId: activeEventId
        });
        if (requestId !== launchRequestRef.current) return;
        setCurrentRoom(res.room);
        setActiveGameId(game.id);
        setMatchResult(null);
        setPublicGameState(null);
      } catch (err) {
        showToast(err.message);
      }
    };
    const handleJoinRoomByCode = async (codeToJoin) => {
      const clean = String(codeToJoin || joinCodeInput || "").trim().toUpperCase();
      if (!clean) {
        showToast("\uCC38\uAC00\uD560 \uBC29 \uCF54\uB4DC\uB97C \uC785\uB825\uD558\uC138\uC694.");
        return;
      }
      const requestId = ++launchRequestRef.current;
      try {
        const res = await api.joinRoom(clean);
        if (requestId !== launchRequestRef.current) return;
        setCurrentRoom(res.room);
        setActiveGameId(res.room.game);
        setMatchResult(res.room.lastResult || null);
        setPublicGameState(res.room.lastPublicGameState || null);
        setJoinCodeInput("");
      } catch (err) {
        showToast(err.message);
      }
    };
    const handleLeaveCurrentRoom = async () => {
      launchRequestRef.current += 1;
      if (currentRoom?.code) {
        try {
          await api.leaveRoom(currentRoom.code);
        } catch {
        }
      }
      setCurrentRoom(null);
      setActiveGameId(null);
      setPublicGameState(null);
      setPrivateRoleState(null);
      setMatchResult(null);
      setDrawingStrokes([]);
      refreshLobbyData();
    };
    const handleCopyInviteLink = () => {
      if (!currentRoom?.code || typeof window === "undefined") return;
      const url = `${window.location.origin}${window.location.pathname}?room=${currentRoom.code}`;
      navigator.clipboard?.writeText(url);
      showToast(`\uCD08\uB300 \uB9C1\uD06C\uAC00 \uBCF5\uC0AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4! (\uBC29 \uCF54\uB4DC: ${currentRoom.code})`);
    };
    const handleSendGameAction = async (actionPayload) => {
      if (!currentRoom?.code) return;
      try {
        const res = await api.sendGameAction(currentRoom.code, actionPayload);
        if (res && res.ok === false && res.error) {
          showToast(res.error);
        }
      } catch (err) {
        showToast(err.message);
      }
    };
    const filteredGames = T2(() => {
      return PLATFORM_GAMES.filter((g4) => {
        if (selectedCategory !== "all" && g4.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q4 = searchQuery.trim().toLowerCase();
          return g4.name.toLowerCase().includes(q4) || g4.subtitle.toLowerCase().includes(q4) || g4.description.toLowerCase().includes(q4);
        }
        return true;
      });
    }, [selectedCategory, searchQuery]);
    const activeGameMeta = getGameById(currentRoom?.game || activeGameId);
    const roomHostId = currentRoom?.hostId || currentRoom?.host || null;
    const isRoomHost = !!currentRoom && roomHostId === currentUser?.id;
    const myRoomPlayer = currentRoom?.players?.find((p3) => p3.id === currentUser?.id);
    const supportsRoomBots = currentRoom?.game !== "bombergirl" && activeGameMeta?.supportsBot;
    const isDeckEmbed = T2(() => {
      if (typeof window === "undefined") return false;
      const params = new URLSearchParams(window.location.search);
      return params.get("embed") === "deck" || window.self !== window.top;
    }, []);
    return /* @__PURE__ */ u3("div", { className: `gp-root ${isDeckEmbed ? "gp-deck-embed" : ""}`, children: [
      !isDeckEmbed && /* @__PURE__ */ u3("header", { className: "gp-topbar", children: [
        /* @__PURE__ */ u3("div", { className: "gp-topbar-brand", onClick: handleLeaveCurrentRoom, style: { cursor: "pointer" }, children: [
          /* @__PURE__ */ u3("span", { className: "gp-brand-logo", children: "\u{1F3AF}" }),
          /* @__PURE__ */ u3("div", { children: [
            /* @__PURE__ */ u3("h1", { className: "gp-brand-title", children: "GAME-BOX \uC0AC\uB0B4 \uBBF8\uB2C8\uAC8C\uC784 \uD50C\uB7AB\uD3FC" }),
            /* @__PURE__ */ u3("span", { className: "gp-brand-sub", children: "Marble Roulette \xB7 BattleBox 15\uC885 \xB7 Snake Duel \xB7 Bomberman \xB7 Bombergirl \xB7 CatchMind" })
          ] })
        ] }),
        /* @__PURE__ */ u3("nav", { className: "gp-topbar-nav", children: [
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: `gp-nav-btn ${activeTab === "arcade" && !activeGameId ? "active" : ""}`,
              onClick: () => {
                handleLeaveCurrentRoom();
                setActiveTab("arcade");
              },
              children: "\u{1F3AE} \uBBF8\uB2C8\uAC8C\uC784 \uB85C\uBE44 (20\uC885)"
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: `gp-nav-btn ${activeTab === "events" ? "active" : ""}`,
              onClick: () => {
                handleLeaveCurrentRoom();
                setActiveTab("events");
              },
              children: "\u{1F3C6} \uC774\uBCA4\uD2B8 \uADF8\uB8F9 / \uB300\uD68C"
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: `gp-nav-btn ${activeTab === "rankings" ? "active" : ""}`,
              onClick: () => {
                handleLeaveCurrentRoom();
                setActiveTab("rankings");
              },
              children: "\u{1F4CA} \uACF5\uC2DD \uB7AD\uD0B9 / \uC804\uC801"
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: `gp-nav-btn ${activeTab === "win98" ? "active" : ""}`,
              onClick: () => {
                handleLeaveCurrentRoom();
                setActiveTab("win98");
              },
              style: { border: "1px solid #38bdf8" },
              children: "\u{1FA9F} \uD55C\uAE00 Windows 98 (\uD0C0\uC7902\uC885\xB7\uD53C\uCE74\uCE04\uBC30\uAD6C)"
            }
          )
        ] }),
        /* @__PURE__ */ u3("div", { className: "gp-topbar-user", children: [
          /* @__PURE__ */ u3("div", { className: "gp-active-event-picker", children: [
            /* @__PURE__ */ u3("label", { title: "\uC120\uD0DD \uC2DC \uACF5\uC2DD \uC628\uB77C\uC778 \uACBD\uAE30 \uACB0\uACFC\uAC00 \uD574\uB2F9 \uC774\uBCA4\uD2B8 \uADF8\uB8F9 \uC810\uC218\uB85C\uB3C4 \uC9D1\uACC4\uB429\uB2C8\uB2E4.", children: "\u{1F3C6} \uD65C\uC131 \uC774\uBCA4\uD2B8:" }),
            /* @__PURE__ */ u3(
              "select",
              {
                className: "gp-select gp-select-sm",
                value: activeEventId || "",
                onChange: (e3) => setActiveEventId(e3.target.value || null),
                children: [
                  /* @__PURE__ */ u3("option", { value: "", children: "\uC77C\uBC18 \uACF5\uC2DD\uC804 (\uC774\uBCA4\uD2B8 \uBBF8\uC9C0\uC815)" }),
                  activeEventsList.map((ev) => /* @__PURE__ */ u3("option", { value: ev.id, children: ev.name }, ev.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-user-card", title: `\uC0AC\uBC88/\uACE0\uC720ID: ${currentUser?.id}`, children: [
            /* @__PURE__ */ u3("span", { className: "gp-user-dept", children: currentUser?.departmentName }),
            /* @__PURE__ */ u3("strong", { className: "gp-user-name", children: currentUser?.name })
          ] }),
          userProvider.allowMockUserSwitch && /* @__PURE__ */ u3("div", { className: "gp-mock-switcher", children: [
            /* @__PURE__ */ u3("label", { htmlFor: "gp-mock-user-select", children: "\u{1F9EA} \uD14C\uC2A4\uD2B8 \uACC4\uC815:" }),
            /* @__PURE__ */ u3(
              "select",
              {
                id: "gp-mock-user-select",
                className: "gp-select gp-select-sm",
                value: currentUser?.id || "",
                onChange: (e3) => userProvider.switchMockUser(e3.target.value),
                children: userProvider.listAvailableMockUsers().map((u4) => /* @__PURE__ */ u3("option", { value: u4.id, children: [
                  u4.name,
                  " (",
                  u4.departmentName,
                  ")"
                ] }, u4.id))
              }
            )
          ] })
        ] })
      ] }),
      toastMessage && /* @__PURE__ */ u3("div", { className: "gp-toast-banner", role: "status", children: toastMessage }),
      /* @__PURE__ */ u3("main", { className: "gp-main", children: isRouletteGame(activeGameId) ? /* @__PURE__ */ u3(
        MarbleRouletteView,
        {
          api,
          currentUser,
          users: directoryUsers,
          departments,
          activeEventId,
          onBack: handleLeaveCurrentRoom
        }
      ) : activeGameId === "bomberman" && !currentRoom ? /* @__PURE__ */ u3("div", { className: "gp-room-container gp-original-game-container", children: [
        /* @__PURE__ */ u3("div", { className: "gp-room-topbar", children: [
          /* @__PURE__ */ u3("div", { className: "gp-room-title-group", children: [
            /* @__PURE__ */ u3("span", { className: "gp-game-icon-lg", children: "\u{1F4A3}" }),
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("h2", { children: [
                "Blast Arena",
                " ",
                /* @__PURE__ */ u3("span", { className: `gp-mode-badge mode-${originalBombermanMode === "bot" ? "bot" : "online"}`, children: originalBombermanMode === "bot" ? "\u{1F916} SINGLE VS COM" : "ORIGINAL ONLINE" })
              ] }),
              /* @__PURE__ */ u3("p", { className: "gp-muted", children: [
                "\uC6D0\uBCF8 \uB300\uAE30\uC2E4\xB7\uCC44\uD305\xB7\uAC8C\uC784 \uD654\uBA74\xB7\uC544\uC774\uD15C\xB7\uADDC\uCE59\uC744 \uADF8\uB300\uB85C \uC2E4\uD589\uD569\uB2C8\uB2E4.",
                originalBombermanMode === "bot" ? " COM-BOT\uC774 \uC790\uB3D9\uC73C\uB85C \uCC38\uAC00\uD569\uB2C8\uB2E4." : ""
              ] })
            ] })
          ] }),
          /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-secondary", onClick: handleLeaveCurrentRoom, children: "\u2190 \uAC8C\uC784 \uB85C\uBE44\uB85C" })
        ] }),
        /* @__PURE__ */ u3(OriginalBombermanArena, { mode: originalBombermanMode })
      ] }) : activeGameId === "bombergirl" && !currentRoom ? /* @__PURE__ */ u3("div", { className: "gp-room-container gp-original-game-container", children: [
        /* @__PURE__ */ u3("div", { className: "gp-room-topbar", children: [
          /* @__PURE__ */ u3("div", { className: "gp-room-title-group", children: [
            /* @__PURE__ */ u3("span", { className: "gp-game-icon-lg", children: "\u{1F467}" }),
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("h2", { children: [
                "HTML5 Bombergirl ",
                /* @__PURE__ */ u3("span", { className: "gp-mode-badge mode-bot", children: "\uC6D0\uBCF8 \uC2F1\uAE00 \xB7 AI 3\uBA85" })
              ] }),
              /* @__PURE__ */ u3("p", { className: "gp-muted", children: "MattSkala \uC6D0\uBCF8\uC758 17\xD713 \uD654\uBA74\xB7\uC2A4\uD504\uB77C\uC774\uD2B8\xB7\uD3ED\uD0C4\xB7\uBCF4\uB108\uC2A4\xB7AI\uB97C \uADF8\uB300\uB85C \uC2E4\uD589\uD569\uB2C8\uB2E4." })
            ] })
          ] }),
          /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-secondary", onClick: handleLeaveCurrentRoom, children: "\u2190 \uAC8C\uC784 \uB85C\uBE44\uB85C" })
        ] }),
        /* @__PURE__ */ u3(OriginalBombergirlArena, { mode: "single", currentUser })
      ] }) : currentRoom ? (
        /* 2. Active Room Lobby or Gameplay Stage */
        /* @__PURE__ */ u3("div", { className: "gp-room-container", children: [
          /* @__PURE__ */ u3("div", { className: "gp-room-topbar", children: [
            /* @__PURE__ */ u3("div", { className: "gp-room-title-group", children: [
              /* @__PURE__ */ u3("span", { className: "gp-game-icon-lg", children: activeGameMeta?.icon || "\u{1F3AE}" }),
              /* @__PURE__ */ u3("div", { children: [
                /* @__PURE__ */ u3("h2", { children: [
                  activeGameMeta?.name || currentRoom.game,
                  /* @__PURE__ */ u3("span", { className: "gp-room-code-badge", children: [
                    "\uBC29 \uCF54\uB4DC: ",
                    currentRoom.code
                  ] }),
                  /* @__PURE__ */ u3("span", { className: `gp-mode-badge mode-${currentRoom.mode}`, children: currentRoom.mode === "solo" ? "\uD63C\uC790 \uC5F0\uC2B5" : currentRoom.mode === "bot" ? "\u{1F916} AI BOT \uB300\uACB0" : "\u{1F310} \uC628\uB77C\uC778 \uB300\uC804" })
                ] }),
                /* @__PURE__ */ u3("p", { className: "gp-muted", children: activeGameMeta?.description })
              ] })
            ] }),
            /* @__PURE__ */ u3("div", { className: "gp-btn-row", children: [
              currentRoom.mode === "online" && /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-secondary gp-btn-sm", onClick: handleCopyInviteLink, children: [
                "\u{1F517} \uCD08\uB300 \uB9C1\uD06C \uBCF5\uC0AC (",
                currentRoom.code,
                ")"
              ] }),
              /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-danger gp-btn-sm", onClick: handleLeaveCurrentRoom, children: "\u2190 \uBC29 \uB098\uAC00\uAE30" })
            ] })
          ] }),
          currentRoom.state === "lobby" ? /* @__PURE__ */ u3("div", { className: "gp-room-lobby-grid", children: [
            /* @__PURE__ */ u3("div", { className: "gp-panel", children: [
              /* @__PURE__ */ u3("h3", { children: [
                "\uCC38\uAC00\uC790 \uBAA9\uB85D (",
                currentRoom.players.length,
                " / ",
                activeGameMeta?.maxPlayers || 8,
                "\uBA85)"
              ] }),
              /* @__PURE__ */ u3("ul", { className: "gp-room-player-list", children: currentRoom.players.map((p3) => /* @__PURE__ */ u3("li", { className: `gp-room-player-item ${p3.id === currentUser?.id ? "is-me" : ""}`, children: [
                /* @__PURE__ */ u3("div", { className: "gp-room-player-info", children: [
                  /* @__PURE__ */ u3("span", { className: "gp-player-avatar", children: p3.isBot ? "\u{1F916}" : "\u{1F464}" }),
                  /* @__PURE__ */ u3("div", { children: [
                    /* @__PURE__ */ u3("strong", { children: p3.name }),
                    p3.id === roomHostId && /* @__PURE__ */ u3("span", { className: "gp-host-tag", children: "\uBC29\uC7A5" }),
                    /* @__PURE__ */ u3("div", { className: "gp-muted-sm", children: p3.isBot ? `AI BOT \xB7 \uB09C\uC774\uB3C4: ${(p3.botDifficulty || "normal").toUpperCase()}` : p3.departmentName })
                  ] })
                ] }),
                /* @__PURE__ */ u3("div", { className: "gp-room-player-actions", children: [
                  /* @__PURE__ */ u3("span", { className: `gp-ready-pill ${p3.ready ? "ready" : "waiting"}`, children: p3.ready ? "\uC900\uBE44 \uC644\uB8CC" : "\uB300\uAE30 \uC911" }),
                  isRoomHost && p3.isBot && /* @__PURE__ */ u3(
                    "button",
                    {
                      type: "button",
                      className: "gp-btn gp-btn-xs gp-btn-danger",
                      onClick: async () => {
                        try {
                          const res = await api.removeBot(currentRoom.code, p3.id);
                          setCurrentRoom(res.room);
                        } catch (err) {
                          showToast(err.message);
                        }
                      },
                      children: "\uC81C\uAC70"
                    }
                  )
                ] })
              ] }, p3.id)) })
            ] }),
            /* @__PURE__ */ u3("div", { className: "gp-panel gp-room-controls-panel", children: [
              /* @__PURE__ */ u3("h3", { children: "\uBC29 \uC124\uC815 \uBC0F \uC2DC\uC791" }),
              supportsRoomBots && /* @__PURE__ */ u3("p", { className: "gp-muted", children: "\uC628\uB77C\uC778 \uBC29\uC5D0\uC11C\uB3C4 \uC778\uC6D0\uC774 \uBD80\uC871\uD560 \uB54C AI BOT\uC744 \uC790\uC720\uB86D\uAC8C \uCD94\uAC00\uD558\uC5EC \uD568\uAED8 \uD50C\uB808\uC774\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. (\uB2E8, BOT\uC774 \uD3EC\uD568\uB41C \uACBD\uAE30\uB294 \uC5F0\uC2B5 \uACBD\uAE30\uB85C \uBD84\uB958\uB418\uC5B4 \uACF5\uC2DD \uC0AC\uB0B4 \uB7AD\uD0B9\uC5D0\uB294 \uC601\uD5A5\uC744 \uC8FC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.)" }),
              isRoomHost && supportsRoomBots && /* @__PURE__ */ u3("div", { className: "gp-bot-adder-box", children: [
                /* @__PURE__ */ u3("label", { children: "\u{1F916} \uB300\uAE30\uC2E4\uC5D0 AI BOT \uCD94\uAC00" }),
                /* @__PURE__ */ u3("div", { className: "gp-btn-row", children: [
                  /* @__PURE__ */ u3(
                    "select",
                    {
                      className: "gp-select gp-select-sm",
                      value: lobbyBotDiff,
                      onChange: (e3) => setLobbyBotDiff(e3.target.value),
                      children: [
                        /* @__PURE__ */ u3("option", { value: "easy", children: "\uC26C\uC6C0 (Easy)" }),
                        /* @__PURE__ */ u3("option", { value: "normal", children: "\uBCF4\uD1B5 (Normal)" }),
                        /* @__PURE__ */ u3("option", { value: "hard", children: "\uC5B4\uB824\uC6C0 (Hard)" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      type: "button",
                      className: "gp-btn gp-btn-sm gp-btn-secondary",
                      disabled: currentRoom.players.length >= (activeGameMeta?.maxPlayers || 8),
                      onClick: async () => {
                        try {
                          const res = await api.addBot(currentRoom.code, lobbyBotDiff);
                          setCurrentRoom(res.room);
                        } catch (err) {
                          showToast(err.message);
                        }
                      },
                      children: "+ BOT 1\uBA85 \uCD94\uAC00"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ u3("div", { className: "gp-lobby-main-actions", children: [
                myRoomPlayer && /* @__PURE__ */ u3(
                  "button",
                  {
                    type: "button",
                    className: "gp-btn gp-btn-secondary gp-btn-lg",
                    onClick: async () => {
                      try {
                        const res = await api.setReady(currentRoom.code, !myRoomPlayer.ready);
                        setCurrentRoom(res.room);
                      } catch (err) {
                        showToast(err.message);
                      }
                    },
                    children: myRoomPlayer.ready ? "\uC900\uBE44 \uD574\uC81C" : "\u2713 \uC900\uBE44 \uC644\uB8CC"
                  }
                ),
                isRoomHost && /* @__PURE__ */ u3(
                  "button",
                  {
                    type: "button",
                    className: "gp-btn gp-btn-primary gp-btn-lg",
                    onClick: async () => {
                      try {
                        const res = await api.startRoom(currentRoom.code);
                        setCurrentRoom(res.room);
                        if (res.room?.lastPublicGameState) {
                          setPublicGameState(res.room.lastPublicGameState);
                        }
                      } catch (err) {
                        showToast(err.message);
                      }
                    },
                    children: "\u{1F680} \uAC8C\uC784 \uC2DC\uC791\uD558\uAE30"
                  }
                )
              ] })
            ] })
          ] }) : (
            /* Playing or Finished State */
            /* @__PURE__ */ u3("div", { className: "gp-active-match-area", children: [
              matchResult && /* @__PURE__ */ u3("div", { className: "gp-match-result-banner", children: [
                /* @__PURE__ */ u3("div", { className: "gp-match-result-header", children: [
                  /* @__PURE__ */ u3("h3", { children: [
                    "\u{1F3C1} \uAC8C\uC784 \uC885\uB8CC!",
                    " ",
                    matchResult.winner ? `\u{1F3C6} \uC6B0\uC2B9: ${matchResult.winner}` : "\uBB34\uC2B9\uBD80 / \uACBD\uAE30 \uC644\uB8CC"
                  ] }),
                  /* @__PURE__ */ u3("span", { className: `gp-official-pill ${matchResult.isOfficial ? "official" : "practice"}`, children: matchResult.isOfficial ? "\u2713 \uACF5\uC2DD \uB7AD\uD0B9 \uBC18\uC601\uB428" : "\uC5F0\uC2B5 / BOT \uB300\uACB0 (\uACF5\uC2DD \uB7AD\uD0B9 \uC81C\uC678)" })
                ] }),
                matchResult.standings && matchResult.standings.length > 0 && /* @__PURE__ */ u3("div", { className: "gp-podium-list", children: matchResult.standings.map((st) => /* @__PURE__ */ u3("div", { className: `gp-podium-item rank-${st.rank}`, children: [
                  /* @__PURE__ */ u3("span", { className: "gp-podium-rank", children: [
                    "#",
                    st.rank
                  ] }),
                  /* @__PURE__ */ u3("strong", { children: st.name }),
                  /* @__PURE__ */ u3("span", { className: "gp-muted-sm", children: st.isBot ? "AI BOT" : st.departmentName }),
                  /* @__PURE__ */ u3("span", { className: "gp-podium-score", children: [
                    st.score,
                    "\uC810"
                  ] })
                ] }, st.id)) }),
                /* @__PURE__ */ u3("div", { className: "gp-btn-row", children: [
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      type: "button",
                      className: "gp-btn gp-btn-primary",
                      onClick: async () => {
                        try {
                          const res = await api.rematch(currentRoom.code);
                          setCurrentRoom(res.room);
                          setMatchResult(null);
                          if (currentRoom.mode !== "online") {
                            const started = await api.startRoom(currentRoom.code);
                            setCurrentRoom(started.room);
                            if (started.room?.lastPublicGameState) {
                              setPublicGameState(started.room.lastPublicGameState);
                            }
                          }
                        } catch (err) {
                          showToast(err.message);
                        }
                      },
                      children: "\u{1F504} \uC989\uC2DC \uC7AC\uB300\uACB0 (Rematch)"
                    }
                  ),
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      type: "button",
                      className: "gp-btn gp-btn-secondary",
                      onClick: handleLeaveCurrentRoom,
                      children: "\uBA54\uC778 \uB85C\uBE44\uB85C \uC774\uB3D9"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ u3(
                GamePlayStage,
                {
                  gameId: currentRoom.game,
                  room: currentRoom,
                  currentUser,
                  gameStateData: publicGameState || currentRoom.lastPublicGameState,
                  publicState: publicGameState || currentRoom.lastPublicGameState,
                  privateRole: privateRoleState,
                  drawingStrokes,
                  onAction: handleSendGameAction
                }
              )
            ] })
          )
        ] })
      ) : activeTab === "win98" ? /* @__PURE__ */ u3("div", { className: "gp-room-container gp-original-game-container", style: { height: "calc(100vh - 90px)", display: "flex", flexDirection: "column" }, children: [
        /* @__PURE__ */ u3("div", { className: "gp-room-topbar", children: [
          /* @__PURE__ */ u3("div", { className: "gp-room-title-group", children: [
            /* @__PURE__ */ u3("span", { className: "gp-game-icon-lg", children: "\u{1FA9F}" }),
            /* @__PURE__ */ u3("div", { children: [
              /* @__PURE__ */ u3("h2", { children: [
                "\uD55C\uAE00 Windows 98 \uCD94\uC5B5\uC758 \uCEF4\uD4E8\uD130 ",
                /* @__PURE__ */ u3("span", { className: "gp-mode-badge mode-online", children: "WIN98 DESKTOP" })
              ] }),
              /* @__PURE__ */ u3("p", { className: "gp-muted", children: "\uBC14\uD0D5 \uD654\uBA74\uC5D0\uC11C [\uD55C\uCEF4\uD0C0\uC790\uC5F0\uC2B5 97], [\uD55C\uBA54\uD0C0\uC790\uAD50\uC0AC 3.0], [\uD53C\uCE74\uCE04 \uBC30\uAD6C], [\uC9C0\uB8B0 \uCC3E\uAE30], [3D \uD540\uBCFC] \uC544\uC774\uCF58\uC744 \uB354\uBE14\uD074\uB9AD\uD574 \uC2E4\uD589\uD558\uC138\uC694." })
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { style: { display: "flex", gap: "8px" }, children: [
            /* @__PURE__ */ u3(
              "a",
              {
                href: "/win98-web/",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "gp-btn gp-btn-primary",
                style: { textDecoration: "none" },
                children: "\u2197 \uC804\uCCB4 \uD654\uBA74 \uD0ED\uC73C\uB85C \uC5F4\uAE30 (/win98-web/)"
              }
            ),
            /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-secondary", onClick: () => setActiveTab("arcade"), children: "\u2190 \uBBF8\uB2C8\uAC8C\uC784 \uB85C\uBE44\uB85C (20\uC885)" })
          ] })
        ] }),
        /* @__PURE__ */ u3(
          "iframe",
          {
            src: "/win98-web/",
            title: "\uD55C\uAE00 Windows 98 \uB370\uC2A4\uD06C\uD1B1",
            style: { width: "100%", flex: "1 1 auto", border: "2px solid #008080", borderRadius: "8px", background: "#008080" },
            allow: "autoplay; fullscreen"
          }
        )
      ] }) : activeTab === "events" ? (
        /* 3. Event Groups Tab */
        /* @__PURE__ */ u3(
          EventGroupsView,
          {
            api,
            currentUser,
            activeEventId,
            onSelectActiveEvent: (id) => {
              setActiveEventId(id);
              showToast(id ? "\uD65C\uC131 \uC774\uBCA4\uD2B8 \uADF8\uB8F9\uC774 \uC124\uC815\uB418\uC5C8\uC2B5\uB2C8\uB2E4." : "\uD65C\uC131 \uC774\uBCA4\uD2B8 \uADF8\uB8F9\uC774 \uD574\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
            }
          }
        )
      ) : activeTab === "rankings" ? (
        /* 4. Rankings & Stats Tab */
        /* @__PURE__ */ u3(RankingsAndStatsView, { api, currentUser })
      ) : (
        /* 5. Main Arcade Game Catalog (20 Games) */
        /* @__PURE__ */ u3("div", { className: "gp-arcade-lobby", children: [
          /* @__PURE__ */ u3("section", { className: "gp-quick-online-bar", children: [
            /* @__PURE__ */ u3("div", { className: "gp-join-code-box", children: [
              /* @__PURE__ */ u3("strong", { children: "\u{1F511} \uBC29 \uCF54\uB4DC\uB85C \uC785\uC7A5:" }),
              /* @__PURE__ */ u3(
                "input",
                {
                  type: "text",
                  className: "gp-input gp-input-code",
                  placeholder: "6\uC790\uB9AC \uCF54\uB4DC (\uC608: AB12CD)",
                  maxLength: 8,
                  value: joinCodeInput,
                  onChange: (e3) => setJoinCodeInput(e3.target.value.toUpperCase())
                }
              ),
              /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  className: "gp-btn gp-btn-primary gp-btn-sm",
                  onClick: () => handleJoinRoomByCode(joinCodeInput),
                  children: "\uC785\uC7A5\uD558\uAE30"
                }
              )
            ] }),
            /* @__PURE__ */ u3("div", { className: "gp-open-rooms-strip", children: [
              /* @__PURE__ */ u3("span", { className: "gp-muted-sm", children: [
                "\uD604\uC7AC \uC5F4\uB9B0 \uC628\uB77C\uC778 \uB300\uAE30\uC2E4 (",
                publicRooms.length,
                "):"
              ] }),
              publicRooms.length === 0 ? /* @__PURE__ */ u3("span", { className: "gp-muted-sm", children: "\uB300\uAE30 \uC911\uC778 \uBC29\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC6D0\uD558\uB294 \uAC8C\uC784 \uCE74\uB4DC\uC5D0\uC11C [\uC628\uB77C\uC778 \uB300\uC804]\uC744 \uB20C\uB7EC \uBC29\uC744 \uB9CC\uB4E4\uC5B4 \uBCF4\uC138\uC694!" }) : /* @__PURE__ */ u3("div", { className: "gp-open-room-pills", children: publicRooms.map((r3) => {
                const g4 = getGameById(r3.game);
                return /* @__PURE__ */ u3(
                  "button",
                  {
                    type: "button",
                    className: "gp-open-room-pill",
                    onClick: () => handleJoinRoomByCode(r3.code),
                    children: [
                      /* @__PURE__ */ u3("span", { children: [
                        g4?.icon || "\u{1F3AE}",
                        " ",
                        g4?.name || r3.game
                      ] }),
                      /* @__PURE__ */ u3("code", { children: r3.code }),
                      /* @__PURE__ */ u3("span", { children: [
                        "(",
                        r3.players.length,
                        "/",
                        g4?.maxPlayers || 8,
                        "\uBA85 \xB7 ",
                        r3.state === "playing" ? "\uC9C4\uD589\uC911" : "\uB300\uAE30\uC911",
                        ")"
                      ] })
                    ]
                  },
                  r3.code
                );
              }) })
            ] })
          ] }),
          /* @__PURE__ */ u3("section", { className: "gp-catalog-toolbar", children: [
            /* @__PURE__ */ u3("div", { className: "gp-category-tabs", children: GAME_CATEGORIES.map((cat) => /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                className: `gp-cat-pill ${selectedCategory === cat.id ? "active" : ""}`,
                onClick: () => setSelectedCategory(cat.id),
                children: cat.label
              },
              cat.id
            )) }),
            /* @__PURE__ */ u3(
              "input",
              {
                type: "search",
                className: "gp-input gp-search-input",
                placeholder: "\uAC8C\uC784 \uC774\uB984, \uC7A5\uB974, \uD0A4\uC6CC\uB4DC \uAC80\uC0C9...",
                value: searchQuery,
                onChange: (e3) => setSearchQuery(e3.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ u3("section", { className: "gp-games-grid", children: filteredGames.map((game) => /* @__PURE__ */ u3("article", { className: "gp-game-card", "data-game-id": game.id, children: [
            /* @__PURE__ */ u3("div", { className: "gp-game-card-header", children: [
              /* @__PURE__ */ u3("span", { className: "gp-game-card-icon", children: game.icon }),
              /* @__PURE__ */ u3("div", { className: "gp-game-card-titles", children: [
                /* @__PURE__ */ u3("h3", { children: game.name }),
                /* @__PURE__ */ u3("span", { className: "gp-game-card-sub", children: game.subtitle })
              ] }),
              /* @__PURE__ */ u3("span", { className: "gp-players-badge", children: game.playersLabel })
            ] }),
            /* @__PURE__ */ u3("p", { className: "gp-game-card-desc", children: game.description }),
            /* @__PURE__ */ u3("div", { className: "gp-game-card-tags", children: [
              game.supportsSolo && /* @__PURE__ */ u3("span", { className: "gp-tag gp-tag-solo", children: "\uD63C\uC790 \uD50C\uB808\uC774" }),
              game.supportsBot && /* @__PURE__ */ u3("span", { className: "gp-tag gp-tag-bot", children: "\u{1F916} AI BOT \uC9C0\uC6D0" }),
              game.supportsOnline && /* @__PURE__ */ u3("span", { className: "gp-tag gp-tag-online", children: "\u{1F310} \uC2E4\uC2DC\uAC04 \uC628\uB77C\uC778" })
            ] }),
            /* @__PURE__ */ u3("div", { className: "gp-game-card-actions", children: isRouletteGame(game.id) ? /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                className: "gp-btn gp-btn-primary gp-btn-block",
                onClick: handleOpenMarbleRoulette,
                children: "\u{1F3A1} \uB9C8\uBE14 \uB8F0\uB81B \uCD94\uCCA8\uAE30 \uC5F4\uAE30 (\uC0AC\uB0B4 \uBA85\uB2E8 \uC5F0\uB3D9)"
              }
            ) : game.id === "bomberman" ? /* @__PURE__ */ u3(S, { children: [
              /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  className: "gp-btn gp-btn-accent gp-btn-sm",
                  onClick: () => handleOpenOriginalBomberman("bot"),
                  children: "\u{1F916} \uC2F1\uAE00 vs \uCEF4\uD4E8\uD130"
                }
              ),
              /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  className: "gp-btn gp-btn-primary gp-btn-sm",
                  onClick: () => handleOpenOriginalBomberman("online"),
                  children: "\u{1F310} \uC6D0\uBCF8 \uBA40\uD2F0 (2~4\uC778)"
                }
              )
            ] }) : game.id === "bombergirl" ? /* @__PURE__ */ u3(S, { children: [
              /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  className: "gp-btn gp-btn-accent gp-btn-sm",
                  onClick: handleOpenOriginalBombergirl,
                  children: "\u{1F3AE} \uC6D0\uBCF8 \uC2F1\uAE00 + AI 3\uBA85"
                }
              ),
              /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  className: "gp-btn gp-btn-primary gp-btn-sm",
                  onClick: () => handleCreateOnlineRoom(game),
                  children: "\u{1F310} \uC628\uB77C\uC778 2\uC778 \uBC29"
                }
              )
            ] }) : /* @__PURE__ */ u3(S, { children: [
              /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  className: "gp-btn gp-btn-secondary gp-btn-sm",
                  onClick: () => handleStartSoloPractice(game),
                  children: "\uD63C\uC790 \uC5F0\uC2B5"
                }
              ),
              /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  className: "gp-btn gp-btn-accent gp-btn-sm",
                  onClick: () => handleOpenBotModal(game),
                  children: "\u{1F916} BOT \uB300\uACB0"
                }
              ),
              /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  className: "gp-btn gp-btn-primary gp-btn-sm",
                  onClick: () => handleCreateOnlineRoom(game),
                  children: "\u{1F310} \uC628\uB77C\uC778 \uBC29"
                }
              )
            ] }) })
          ] }, game.id)) })
        ] })
      ) }),
      botModalGame && /* @__PURE__ */ u3("div", { className: "gp-modal-backdrop", onClick: () => setBotModalGame(null), children: /* @__PURE__ */ u3("div", { className: "gp-modal", onClick: (e3) => e3.stopPropagation(), children: [
        /* @__PURE__ */ u3("div", { className: "gp-modal-header", children: [
          /* @__PURE__ */ u3("h3", { children: [
            botModalGame.icon,
            " ",
            botModalGame.name,
            " \u2014 \uCEF4\uD4E8\uD130(BOT)\uC640 \uB300\uACB0"
          ] }),
          /* @__PURE__ */ u3("button", { type: "button", className: "gp-close-btn", onClick: () => setBotModalGame(null), children: "\u2715" })
        ] }),
        /* @__PURE__ */ u3("div", { className: "gp-modal-body", children: [
          /* @__PURE__ */ u3("p", { className: "gp-muted", children: [
            "\uB2E4\uB978 \uC784\uC9C1\uC6D0\uC774 \uC811\uC18D\uD558\uC9C0 \uC54A\uC544\uB3C4 \uC989\uC2DC AI BOT\uACFC \uB300\uACB0\uC744 \uC2DC\uC791\uD569\uB2C8\uB2E4. (\uCD5C\uB300 \uC815\uC6D0: ",
            botModalGame.maxPlayers,
            "\uBA85)"
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-form-row", children: [
            /* @__PURE__ */ u3("label", { children: "\uD568\uAED8 \uD50C\uB808\uC774\uD560 BOT \uC218" }),
            /* @__PURE__ */ u3("div", { className: "gp-option-buttons", children: [1, 3, 7].map((cnt) => {
              const maxAllowed = Math.max(1, (botModalGame.maxPlayers || 2) - 1);
              const effective = Math.min(cnt, maxAllowed);
              const disabled = cnt > maxAllowed && cnt !== 1;
              return /* @__PURE__ */ u3(
                "button",
                {
                  type: "button",
                  disabled,
                  className: `gp-btn ${botCountOption === effective && !disabled ? "gp-btn-primary" : "gp-btn-secondary"}`,
                  onClick: () => setBotCountOption(effective),
                  children: [
                    "\u{1F916} BOT ",
                    cnt,
                    "\uBA85 ",
                    disabled ? `(\uCD5C\uB300 ${maxAllowed}\uBA85)` : ""
                  ]
                },
                cnt
              );
            }) })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-form-row", children: [
            /* @__PURE__ */ u3("label", { children: "BOT \uC778\uACF5\uC9C0\uB2A5 \uB09C\uC774\uB3C4" }),
            /* @__PURE__ */ u3("div", { className: "gp-option-buttons", children: [
              { id: "easy", label: "\u{1F331} \uC26C\uC6C0 (Easy)", desc: "\uB290\uB9B0 \uBC18\uC751\uACFC \uC785\uBB38\uC790\uC6A9 \uC2E4\uC218 \uD3EC\uD568" },
              { id: "normal", label: "\u26A1 \uBCF4\uD1B5 (Normal)", desc: "\uC790\uC5F0\uC2A4\uB7EC\uC6B4 \uC77C\uBC18 \uD50C\uB808\uC774\uC5B4 \uC218\uC900" },
              { id: "hard", label: "\u{1F525} \uC5B4\uB824\uC6C0 (Hard)", desc: "\uBE60\uB978 \uD310\uB2E8\uACFC \uCD5C\uC801 \uC804\uB7B5 (Minimax/\uD0D0\uC0C9)" }
            ].map((lv) => /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                className: `gp-btn gp-btn-block ${botDiffOption === lv.id ? "gp-btn-accent" : "gp-btn-secondary"}`,
                onClick: () => setBotDiffOption(lv.id),
                children: [
                  /* @__PURE__ */ u3("strong", { children: lv.label }),
                  " \u2014 ",
                  /* @__PURE__ */ u3("small", { children: lv.desc })
                ]
              },
              lv.id
            )) })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gp-modal-footer", children: [
            /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-secondary", onClick: () => setBotModalGame(null), children: "\uCDE8\uC18C" }),
            /* @__PURE__ */ u3("button", { type: "button", className: "gp-btn gp-btn-primary", onClick: handleLaunchBotMatch, children: "\u{1F680} \uC989\uC2DC BOT \uB300\uACB0 \uC2DC\uC791" })
          ] })
        ] })
      ] }) })
    ] });
  }

  // platform-src/user-provider.js
  var MOCK_USER_STORAGE_KEY = "gamePlatformMockUserId";
  var DEFAULT_MOCK_USERS = Object.freeze([
    { id: "emp-001", name: "\uAE40\uC131\uBBFC", departmentId: "dept-auto", departmentName: "\uC790\uB3D9\uD654\uC6B4\uC601\uD300" },
    { id: "emp-002", name: "\uC774\uC9C0\uD6C8", departmentId: "dept-infra", departmentName: "\uC778\uD504\uB77C\uD300" },
    { id: "emp-003", name: "\uBC15\uC218\uC9C4", departmentId: "dept-dev", departmentName: "\uAC1C\uBC1C\uD300" },
    { id: "emp-004", name: "\uCD5C\uBBFC\uD638", departmentId: "dept-auto", departmentName: "\uC790\uB3D9\uD654\uC6B4\uC601\uD300" },
    { id: "emp-005", name: "\uC815\uD558\uB298", departmentId: "dept-plan", departmentName: "\uAE30\uD68D\uD300" },
    { id: "emp-006", name: "\uD55C\uC9C0\uC6B0", departmentId: "dept-dev", departmentName: "\uAC1C\uBC1C\uD300" },
    { id: "emp-007", name: "\uC1A1\uC720\uC9C4", departmentId: "dept-infra", departmentName: "\uC778\uD504\uB77C\uD300" },
    { id: "emp-008", name: "\uAC15\uB3C4\uC724", departmentId: "dept-plan", departmentName: "\uAE30\uD68D\uD300" }
  ]);
  function adaptCorporateUser(raw) {
    if (!raw || typeof raw !== "object") return null;
    const id = String(raw.id || raw.userId || raw.empNo || raw.subject || "").trim();
    const name = String(raw.name || raw.userName || raw.displayName || raw.nickname || "").trim();
    const org = Array.isArray(raw.organizations) && raw.organizations[0] ? raw.organizations[0] : raw.organization || {};
    const departmentId = String(raw.departmentId || raw.deptId || org.id || org.subject || "dept-general").trim();
    const departmentName = String(raw.departmentName || raw.deptName || org.name || "\uC0AC\uB0B4\uACF5\uD1B5").trim();
    if (!id || !name) return null;
    return { id, name, departmentId, departmentName };
  }
  var MockUserProvider = class {
    constructor(options = {}) {
      this.mode = "mock";
      this.allowMockUserSwitch = true;
      this.mockUsers = options.mockUsers || DEFAULT_MOCK_USERS;
      this.listeners = /* @__PURE__ */ new Set();
      this.selectedUserId = options.initialUserId || null;
      if (options.initialUserId) {
        this.setSelectedMockUserId(options.initialUserId);
      }
    }
    getSelectedMockUserId() {
      if (this.selectedUserId) return this.selectedUserId;
      try {
        return localStorage.getItem(MOCK_USER_STORAGE_KEY) || "emp-001";
      } catch {
        return "emp-001";
      }
    }
    setSelectedMockUserId(userId) {
      this.selectedUserId = String(userId);
      try {
        localStorage.setItem(MOCK_USER_STORAGE_KEY, String(userId));
      } catch {
      }
      const current = this.getCurrentUser();
      this.listeners.forEach((fn2) => fn2(current));
    }
    switchMockUser(userId) {
      this.setSelectedMockUserId(userId);
      return this.getCurrentUser();
    }
    listAvailableMockUsers() {
      return this.mockUsers;
    }
    getCurrentUser() {
      let guestNickname = "";
      let guestId = "";
      try {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          guestNickname = (params.get("nickname") || "").trim();
          guestId = (params.get("guestId") || "").trim();
          if (!guestNickname) {
            const raw = localStorage.getItem("gameBox_guest_identity_v1");
            if (raw) {
              const parsed = JSON.parse(raw);
              guestNickname = (parsed.nickname || "").trim();
              guestId = (parsed.guestId || "").trim();
            }
          }
        }
      } catch {
      }
      const id = this.getSelectedMockUserId();
      const base = this.mockUsers.find((u4) => u4.id === id) || this.mockUsers[0];
      if (guestNickname) {
        return {
          ...base,
          id: guestId || base.id,
          name: guestNickname,
          departmentName: "\uAC8C\uC2A4\uD2B8 \uD50C\uB808\uC774\uC5B4"
        };
      }
      return base;
    }
    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }
    getHeaders() {
      const cur = this.getCurrentUser();
      return {
        "X-Mock-User-Id": this.getSelectedMockUserId(),
        "X-GameBox-Nickname": encodeURIComponent(cur.name || "")
      };
    }
  };
  var ExternalUserProvider = class {
    /**
     * @param {{ user?: any, externalUser?: any, getUserFn?: () => any, getAuthHeaders?: () => Record<string, string> }} options
     */
    constructor(options = {}) {
      this.mode = "external";
      this.allowMockUserSwitch = false;
      const rawUser = options.user || options.externalUser || (typeof options.getUserFn === "function" ? options.getUserFn() : null);
      this.externalUser = rawUser ? adaptCorporateUser(rawUser) : null;
      this.getUserFn = options.getUserFn || null;
      this.getAuthHeaders = options.getAuthHeaders || (() => ({}));
      this.listeners = /* @__PURE__ */ new Set();
    }
    getSelectedMockUserId() {
      return null;
    }
    setSelectedMockUserId() {
      throw new Error("\uC6B4\uC601 \uD658\uACBD(ExternalUserProvider)\uC5D0\uC11C\uB294 \uC784\uC758 \uD14C\uC2A4\uD2B8 \uC0AC\uC6A9\uC790 \uC804\uD658\uC774 \uBE44\uD65C\uC131\uD654\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    }
    switchMockUser() {
      throw new Error("\uC6B4\uC601 \uD658\uACBD(ExternalUserProvider)\uC5D0\uC11C\uB294 \uC784\uC758 \uD14C\uC2A4\uD2B8 \uC0AC\uC6A9\uC790 \uC804\uD658\uC774 \uBE44\uD65C\uC131\uD654\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    }
    listAvailableMockUsers() {
      return [];
    }
    getCurrentUser() {
      if (typeof this.getUserFn === "function") {
        const adapted = adaptCorporateUser(this.getUserFn());
        if (adapted) return adapted;
      }
      return this.externalUser;
    }
    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }
    getHeaders() {
      return {
        ...this.getAuthHeaders()
      };
    }
  };
  function createUserProvider(config = {}) {
    if (config.mode === "external" || config.externalUser || config.user) {
      return new ExternalUserProvider({
        user: config.externalUser || config.user,
        getUserFn: config.getUserFn,
        getAuthHeaders: config.getAuthHeaders
      });
    }
    return new MockUserProvider({
      initialUserId: config.initialUserId,
      mockUsers: config.mockUsers
    });
  }

  // platform-src/main.jsx
  function mountGamePlatform(container, options = {}) {
    const hostConfig = typeof window !== "undefined" && window.__GAMEBOX_PLATFORM_CONFIG__ || {};
    const merged = { ...hostConfig, ...options };
    const userProvider = merged.userProvider || createUserProvider({
      mode: merged.mode || "mock",
      externalUser: merged.externalUser || null,
      getUserFn: merged.getUserFn || null,
      initialUserId: merged.initialUserId || null
    });
    const root = createRoot(container);
    root.render(
      /* @__PURE__ */ u3(
        GamePlatformApp,
        {
          userProvider,
          apiBaseUrl: merged.apiBaseUrl || "/api/platform"
        }
      )
    );
    return { root, userProvider };
  }
  if (typeof document !== "undefined") {
    const el = document.getElementById("gamebox-platform-root");
    if (el) {
      mountGamePlatform(el);
    }
  }
  return __toCommonJS(main_exports);
})();
