var ToolBoxGameBox = (() => {
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

  // tool-box/src/features/game-box/standalone-entry.jsx
  var standalone_entry_exports = {};
  __export(standalone_entry_exports, {
    mountGameBoxApp: () => mountGameBoxApp
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
  function X(n2) {
    function l3(n3) {
      var u4, t3;
      return this.getChildContext || (u4 = /* @__PURE__ */ new Set(), (t3 = {})[l3.__c] = this, this.getChildContext = function() {
        return t3;
      }, this.componentWillUnmount = function() {
        u4 = null;
      }, this.shouldComponentUpdate = function(n4) {
        this.props.value != n4.value && u4.forEach(function(n5) {
          n5.__e = true, A(n5);
        });
      }, this.sub = function(n4) {
        u4.add(n4);
        var l4 = n4.componentWillUnmount;
        n4.componentWillUnmount = function() {
          u4 && u4.delete(n4), l4 && l4.call(n4);
        };
      }), n3.children;
    }
    return l3.__c = "__cC" + y++, l3.__ = n2, l3.Provider = l3.__l = (l3.Consumer = function(n3, l4) {
      return n3.children(l4);
    }).contextType = l3, l3;
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
  function x2(n2) {
    var u4 = r2.context[n2.__c], i3 = s2(t2++, 9);
    return i3.c = n2, u4 ? (null == i3.__ && (i3.__ = true, u4.sub(r2)), u4.props.value) : n2.__;
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

  // tool-box/src/features/game-box/identity/guestIdentity.js
  var GUEST_IDENTITY_STORAGE_KEY = "gameBox_guest_identity_v1";
  function generateBrowserUuid() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `guest-${crypto.randomUUID()}`;
    }
    return "guest-" + "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c3) => {
      const r3 = Math.random() * 16 | 0;
      const v3 = c3 === "x" ? r3 : r3 & 3 | 8;
      return v3.toString(16);
    });
  }
  function sanitizeAndValidateNickname(rawInput) {
    if (typeof rawInput !== "string") {
      return { valid: false, value: "", error: "\uB2C9\uB124\uC784\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694." };
    }
    const trimmed = rawInput.replace(/\s+/g, " ").trim();
    if (trimmed.length < 2 || trimmed.length > 16) {
      return {
        valid: false,
        value: trimmed,
        error: "\uB2C9\uB124\uC784\uC740 \uACF5\uBC31 \uD3EC\uD568 2\uC790 \uC774\uC0C1 16\uC790 \uC774\uD558\uB85C \uC785\uB825\uD574\uC8FC\uC138\uC694."
      };
    }
    if (/[<>'"&`\\/\x00-\x1F\x7F]/.test(trimmed)) {
      return {
        valid: false,
        value: trimmed,
        error: "\uD2B9\uC218\uBB38\uC790(<, >, ', \", &, `, /, \\)\uB294 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."
      };
    }
    if (!/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 _-]+$/.test(trimmed)) {
      return {
        valid: false,
        value: trimmed,
        error: "\uB2C9\uB124\uC784\uC740 \uD55C\uAE00, \uC601\uBB38, \uC22B\uC790, \uACF5\uBC31, \uD558\uC774\uD508(-), \uBC11\uC904(_)\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
      };
    }
    return { valid: true, value: trimmed, error: null };
  }
  function loadGuestIdentity() {
    if (typeof window === "undefined" || !window.localStorage) {
      return {
        guestId: generateBrowserUuid(),
        nickname: "",
        createdAt: null,
        updatedAt: null,
        isRegistered: false,
        identityType: "guest"
      };
    }
    try {
      const raw = window.localStorage.getItem(GUEST_IDENTITY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const guestId = typeof parsed.guestId === "string" && parsed.guestId.length >= 8 ? parsed.guestId : generateBrowserUuid();
        const check = sanitizeAndValidateNickname(parsed.nickname || "");
        const nickname = check.valid ? check.value : "";
        return {
          guestId,
          nickname,
          createdAt: parsed.createdAt || null,
          updatedAt: parsed.updatedAt || parsed.createdAt || null,
          isRegistered: Boolean(nickname),
          identityType: "guest"
        };
      }
    } catch (err) {
      console.warn("[GameBox] Failed to read guest identity from localStorage:", err);
    }
    const freshGuestId = generateBrowserUuid();
    const initialRecord = {
      guestId: freshGuestId,
      nickname: "",
      createdAt: null,
      updatedAt: null
    };
    try {
      window.localStorage.setItem(GUEST_IDENTITY_STORAGE_KEY, JSON.stringify(initialRecord));
    } catch {
    }
    return {
      ...initialRecord,
      isRegistered: false,
      identityType: "guest"
    };
  }
  function saveGuestNickname(newNickname) {
    const validation = sanitizeAndValidateNickname(newNickname);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    const current = loadGuestIdentity();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updated = {
      guestId: current.guestId || generateBrowserUuid(),
      nickname: validation.value,
      createdAt: current.createdAt || now,
      updatedAt: now
    };
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(GUEST_IDENTITY_STORAGE_KEY, JSON.stringify(updated));
    }
    return {
      ...updated,
      isRegistered: true,
      identityType: "guest"
    };
  }

  // tool-box/src/features/game-box/ranking/rankingApi.js
  var API_BASE = "/api/game-box";
  var FAILED_RESULTS_QUEUE_KEY = "gameBox_pending_results_v1";
  async function requestJson(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers || {}
      },
      cache: "no-store"
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `\uC694\uCCAD \uCC98\uB9AC \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4 (HTTP ${response.status})`);
    }
    return data;
  }
  async function registerOrSyncPlayerApi({ playerId, guestId, nickname, identityType = "guest" }) {
    return requestJson(`${API_BASE}/players`, {
      method: "POST",
      body: JSON.stringify({
        playerId: playerId || guestId,
        guestId: guestId || playerId,
        nickname,
        identityType
      })
    });
  }
  async function recordSessionEventApi(eventPayload) {
    return requestJson(`${API_BASE}/sessions`, {
      method: "POST",
      body: JSON.stringify(eventPayload)
    });
  }
  function getPendingResultsQueue() {
    if (typeof window === "undefined" || !window.localStorage) return [];
    try {
      const raw = window.localStorage.getItem(FAILED_RESULTS_QUEUE_KEY);
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed.slice(-30) : [];
    } catch {
      return [];
    }
  }
  function savePendingResultsQueue(items) {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      if (items.length === 0) {
        window.localStorage.removeItem(FAILED_RESULTS_QUEUE_KEY);
      } else {
        window.localStorage.setItem(FAILED_RESULTS_QUEUE_KEY, JSON.stringify(items.slice(-30)));
      }
    } catch {
    }
  }
  async function flushPendingResultsApi() {
    const queue = getPendingResultsQueue();
    if (queue.length === 0) return { flushed: 0, remaining: 0 };
    const remaining = [];
    let flushed = 0;
    for (const item of queue) {
      try {
        await requestJson(`${API_BASE}/results`, {
          method: "POST",
          body: JSON.stringify(item)
        });
        flushed += 1;
      } catch {
        remaining.push(item);
      }
    }
    savePendingResultsQueue(remaining);
    return { flushed, remaining: remaining.length };
  }
  async function submitGameResultApi(resultPayload) {
    try {
      const response = await requestJson(`${API_BASE}/results`, {
        method: "POST",
        body: JSON.stringify(resultPayload)
      });
      return {
        savedToServer: true,
        queuedForRetry: false,
        duplicated: Boolean(response.duplicated),
        result: response.result,
        error: null
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const queue = getPendingResultsQueue();
      if (resultPayload.clientEventId && !queue.some((q4) => q4.clientEventId === resultPayload.clientEventId)) {
        queue.push(resultPayload);
        savePendingResultsQueue(queue);
      }
      return {
        savedToServer: false,
        queuedForRetry: true,
        duplicated: false,
        result: null,
        error: message
      };
    }
  }

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

  // tool-box/src/features/game-box/identity/GameIdentityProvider.js
  var GuestIdentityAdapter = class {
    getIdentity() {
      const data = loadGuestIdentity();
      return {
        playerId: data.guestId,
        guestId: data.guestId,
        nickname: data.nickname,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        isRegistered: data.isRegistered,
        identityType: "guest"
      };
    }
    async updateNickname(newNickname) {
      const saved = saveGuestNickname(newNickname);
      const identity = {
        playerId: saved.guestId,
        guestId: saved.guestId,
        nickname: saved.nickname,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
        isRegistered: true,
        identityType: "guest"
      };
      const synced = await registerOrSyncPlayerApi(identity);
      return {
        ...identity,
        ...synced?.player ? {
          nickname: synced.player.nickname,
          createdAt: synced.player.createdAt,
          updatedAt: synced.player.updatedAt
        } : {}
      };
    }
  };
  var GameIdentityContext = X(null);
  function GameIdentityProvider({ adapter = null, children }) {
    const activeAdapter = T2(() => adapter || new GuestIdentityAdapter(), [adapter]);
    const [identity, setIdentity] = d2(() => activeAdapter.getIdentity());
    const [syncStatus, setSyncStatus] = d2("idle");
    const [syncError, setSyncError] = d2(null);
    const [isNicknameModalOpen, setIsNicknameModalOpen] = d2(() => !activeAdapter.getIdentity().isRegistered);
    h2(() => {
      let cancelled = false;
      const current = activeAdapter.getIdentity();
      setIdentity(current);
      if (!current.isRegistered) {
        setIsNicknameModalOpen(true);
        return;
      }
      setSyncStatus("syncing");
      registerOrSyncPlayerApi(current).then((res) => {
        if (cancelled) return;
        if (res?.player) {
          setIdentity((prev) => ({
            ...prev,
            nickname: res.player.nickname || prev.nickname,
            createdAt: res.player.createdAt || prev.createdAt,
            updatedAt: res.player.updatedAt || prev.updatedAt,
            isRegistered: true
          }));
        }
        setSyncStatus("synced");
        setSyncError(null);
      }).catch((err) => {
        if (cancelled) return;
        setSyncStatus("error");
        setSyncError(err.message || "\uC11C\uBC84\uC640 \uC0AC\uC6A9\uC790 \uC815\uBCF4\uB97C \uB3D9\uAE30\uD654\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
      });
      return () => {
        cancelled = true;
      };
    }, [activeAdapter]);
    const registerOrChangeNickname = q2(async (rawNickname) => {
      setSyncStatus("syncing");
      setSyncError(null);
      try {
        const updated = await activeAdapter.updateNickname(rawNickname);
        setIdentity(updated);
        setSyncStatus("synced");
        setIsNicknameModalOpen(false);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("game-box:identity-changed", { detail: updated }));
        }
        return { ok: true, identity: updated };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setSyncStatus("error");
        setSyncError(message);
        return { ok: false, error: message };
      }
    }, [activeAdapter]);
    const openNicknameModal = q2(() => {
      setSyncError(null);
      setIsNicknameModalOpen(true);
    }, []);
    const closeNicknameModal = q2(() => {
      if (identity.isRegistered) {
        setIsNicknameModalOpen(false);
      }
    }, [identity.isRegistered]);
    const value = T2(() => ({
      identity,
      syncStatus,
      syncError,
      isNicknameModalOpen,
      openNicknameModal,
      closeNicknameModal,
      registerOrChangeNickname,
      validateNickname: sanitizeAndValidateNickname
    }), [
      identity,
      syncStatus,
      syncError,
      isNicknameModalOpen,
      openNicknameModal,
      closeNicknameModal,
      registerOrChangeNickname
    ]);
    return /* @__PURE__ */ u3(GameIdentityContext.Provider, { value, children });
  }
  function useGameIdentity() {
    const ctx = x2(GameIdentityContext);
    if (!ctx) {
      throw new Error("useGameIdentity must be used within a <GameIdentityProvider>");
    }
    return ctx;
  }

  // tool-box/src/features/game-box/runtime/GameEventBridge.js
  var ALLOWED_GAME_EVENT_TYPES = /* @__PURE__ */ new Set([
    "game:start",
    "game:progress",
    "game:complete",
    "game:abort"
  ]);
  var GAME_EVENT_MESSAGE_SOURCE = "game-box-runtime";
  function normalizeGameEvent(raw = {}, fallbackIdentity = null) {
    const identity = fallbackIdentity || loadGuestIdentity();
    const eventType = String(raw.eventType || raw.type || "").trim();
    if (!ALLOWED_GAME_EVENT_TYPES.has(eventType)) {
      return null;
    }
    const gameId = String(raw.gameId || "").trim();
    if (!gameId) return null;
    const gameMode = String(raw.gameMode || "general").trim();
    const gameSessionId = String(raw.gameSessionId || raw.sessionId || `sess-${Date.now()}`).trim();
    const clientEventId = String(
      raw.clientEventId || `${gameSessionId}-${eventType}-${raw.timestamp || Date.now()}`
    ).trim();
    return {
      playerId: raw.playerId || identity.guestId,
      guestId: raw.guestId || identity.guestId,
      nickname: raw.nickname || identity.nickname || "\uAC8C\uC2A4\uD2B8",
      gameId,
      gameSessionId,
      clientEventId,
      gameMode,
      eventType,
      timestamp: raw.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
      score: raw.score !== void 0 && raw.score !== null ? Number(raw.score) : null,
      accuracy: raw.accuracy !== void 0 && raw.accuracy !== null ? Number(raw.accuracy) : null,
      typingSpeed: raw.typingSpeed !== void 0 && raw.typingSpeed !== null ? Number(raw.typingSpeed) : null,
      errorCount: raw.errorCount !== void 0 && raw.errorCount !== null ? Number(raw.errorCount) : null,
      durationMs: Math.max(0, Math.round(Number(raw.durationMs) || 0)),
      outcome: raw.outcome || raw.winLoseDraw || (eventType === "game:abort" ? "aborted" : "completed"),
      opponentType: raw.opponentType || "none",
      recordClassification: raw.recordClassification || (eventType === "game:abort" ? "practice" : "ranking"),
      trustLevel: raw.trustLevel || "client-guest-telemetry",
      metadata: raw.metadata && typeof raw.metadata === "object" ? raw.metadata : {}
    };
  }
  var GameEventBridge = class {
    constructor({ getIdentity = loadGuestIdentity, onEventProcessed = null } = {}) {
      this.getIdentity = getIdentity;
      this.onEventProcessed = onEventProcessed;
      this.processedEventIds = /* @__PURE__ */ new Set();
      this._boundOnMessage = this._handleWindowMessage.bind(this);
      this._boundOnCustom = this._handleCustomEvent.bind(this);
      this.active = false;
    }
    start() {
      if (this.active || typeof window === "undefined") return;
      this.active = true;
      window.addEventListener("message", this._boundOnMessage);
      window.addEventListener("game-box:runtime-event", this._boundOnCustom);
      flushPendingResultsApi().catch(() => {
      });
    }
    stop() {
      if (!this.active || typeof window === "undefined") return;
      this.active = false;
      window.removeEventListener("message", this._boundOnMessage);
      window.removeEventListener("game-box:runtime-event", this._boundOnCustom);
    }
    async _handleWindowMessage(event) {
      if (typeof window !== "undefined" && event.origin !== window.location.origin) {
        return;
      }
      const data = event.data;
      if (!data || typeof data !== "object" || data.source !== GAME_EVENT_MESSAGE_SOURCE) {
        return;
      }
      const payload = data.payload || data;
      await this.processEvent(payload);
    }
    async _handleCustomEvent(event) {
      if (!event?.detail) return;
      await this.processEvent(event.detail);
    }
    async processEvent(rawPayload) {
      const identity = this.getIdentity ? this.getIdentity() : loadGuestIdentity();
      const normalized = normalizeGameEvent(rawPayload, identity);
      if (!normalized) return null;
      if ((normalized.eventType === "game:complete" || normalized.eventType === "game:abort") && this.processedEventIds.has(normalized.clientEventId)) {
        return { duplicated: true, event: normalized };
      }
      if (normalized.eventType === "game:complete" || normalized.eventType === "game:abort") {
        this.processedEventIds.add(normalized.clientEventId);
      }
      let apiOutcome = null;
      try {
        if (normalized.eventType === "game:start" || normalized.eventType === "game:progress") {
          apiOutcome = await recordSessionEventApi(normalized);
        } else if (normalized.eventType === "game:complete") {
          apiOutcome = await submitGameResultApi(normalized);
        } else if (normalized.eventType === "game:abort") {
          await recordSessionEventApi(normalized).catch(() => {
          });
          if (normalized.score !== null || normalized.typingSpeed !== null) {
            apiOutcome = await submitGameResultApi({
              ...normalized,
              recordClassification: "practice",
              outcome: "aborted"
            });
          }
        }
      } catch (err) {
        apiOutcome = {
          savedToServer: false,
          error: err instanceof Error ? err.message : String(err)
        };
      }
      if (typeof this.onEventProcessed === "function") {
        this.onEventProcessed({ event: normalized, apiOutcome });
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("game-box:ranking-updated", {
            detail: { event: normalized, apiOutcome }
          })
        );
      }
      return { duplicated: false, event: normalized, apiOutcome };
    }
  };

  // tool-box/src/features/game-box/registry/retroGames.js
  var RETRO_GAMES = Object.freeze([
    {
      id: "hancom-typing-97",
      win98AppId: "hancom-typing-97",
      name: "\uD55C\uCEF4\uD0C0\uC790\uC5F0\uC2B5",
      fullTitle: "\uD55C\uCEF4\uD0C0\uC790\uC5F0\uC2B5 97 (DOS \uC6D0\uBCF8)",
      year: 1997,
      developer: "\uD55C\uAE00\uACFC\uCEF4\uD4E8\uD130",
      runtimeType: "iframe-jsdos",
      launchUrl: "/?v=97&embed=win98",
      standaloneUrl: "/?v=97",
      sourcePath: "original-player-src/ (references/\uD55C\uCEF4\uD0C0\uC790\uC5F0\uC2B5 1997/_HTTD_.EXE)",
      aspectRatio: "4:3",
      recommendedSize: { width: 740, height: 580 },
      inputDevices: ["keyboard"],
      iconUrl: "/win98-web/icons/hancom-typing-97.svg",
      supportedModes: [
        { id: "position", label: "\uC790\uB9AC\uC5F0\uC2B5", metric: "typing_speed", unit: "\uD0C0/\uBD84", telemetryStatus: "auto-screen-pixel" },
        { id: "word", label: "\uB0B1\uB9D0\uC5F0\uC2B5", metric: "typing_speed", unit: "\uD0C0/\uBD84", telemetryStatus: "dos-session-and-snapshot" },
        { id: "short", label: "\uC9E7\uC740\uAE00 \uC5F0\uC2B5", metric: "typing_speed", unit: "\uD0C0/\uBD84", telemetryStatus: "dos-session-and-snapshot" },
        { id: "long", label: "\uAE34\uAE00 \uC5F0\uC2B5", metric: "typing_speed", unit: "\uD0C0/\uBD84", telemetryStatus: "dos-session-and-snapshot" },
        { id: "acid-rain", label: "\uC0B0\uC131\uBE44", metric: "score", unit: "\uC810", telemetryStatus: "dos-session-and-snapshot" },
        { id: "invader", label: "\uCE68\uB7B5\uC790", metric: "score", unit: "\uC810", telemetryStatus: "dos-session-and-snapshot" }
      ],
      controlsSummary: "\uBC29\uD5A5\uD0A4(\u2191\u2193\u2190\u2192) \uBC0F Enter/ESC\uB85C \uBA54\uB274 \uC774\uB3D9 \xB7 \uD55C/\uC601 \uC804\uD658\uC740 Shift + Space (\uB610\uB294 \uC6B0\uCE21 \uD55C/\uC601 \uD0A4)"
    },
    {
      id: "hanme-typing-30",
      win98AppId: "hanme-typing-30",
      name: "\uD55C\uBA54\uD0C0\uC790\uC5F0\uC2B5",
      fullTitle: "\uD55C\uBA54\uD0C0\uC790\uAD50\uC0AC 3.0 (DOS \uC6D0\uBCF8)",
      year: 1994,
      developer: "\uD55C\uBA54\uC18C\uD504\uD2B8",
      runtimeType: "iframe-jsdos",
      launchUrl: "/?v=hanme&embed=win98",
      standaloneUrl: "/?v=hanme",
      sourcePath: "original-player-src/ (hanme-typing-3.jsdos / HTT.EXE)",
      aspectRatio: "4:3",
      recommendedSize: { width: 740, height: 580 },
      inputDevices: ["keyboard"],
      iconUrl: "/win98-web/icons/hanme-typing-30.svg",
      supportedModes: [
        { id: "venezia", label: "\uBCA0\uB124\uCE58\uC544 \uAC8C\uC784", metric: "score", unit: "\uC810", telemetryStatus: "dos-session-telemetry" },
        { id: "short", label: "\uB2E8\uBB38\uC5F0\uC2B5", metric: "typing_speed", unit: "\uD0C0/\uBD84", telemetryStatus: "dos-session-telemetry" },
        { id: "long", label: "\uC7A5\uBB38\uC5F0\uC2B5", metric: "typing_speed", unit: "\uD0C0/\uBD84", telemetryStatus: "dos-session-telemetry" },
        { id: "position", label: "\uC790\uB9AC\uC5F0\uC2B5", metric: "typing_speed", unit: "\uD0C0/\uBD84", telemetryStatus: "dos-session-telemetry" },
        { id: "word", label: "\uB0B1\uB9D0\uC5F0\uC2B5", metric: "typing_speed", unit: "\uD0C0/\uBD84", telemetryStatus: "dos-session-telemetry" }
      ],
      controlsSummary: "\uBC29\uD5A5\uD0A4(\u2191\u2193\u2190\u2192) \uBC0F Enter/ESC\uB85C \uBA54\uB274 \uC774\uB3D9 \xB7 \uD55C/\uC601 \uC804\uD658\uC740 Shift + Space"
    },
    {
      id: "pikachu-volleyball",
      win98AppId: "pikachu-volleyball",
      name: "\uD53C\uCE74\uCE04 \uBC30\uAD6C",
      fullTitle: "\uD53C\uCE74\uCE04 \uBC30\uAD6C (Pikachu Volleyball)",
      year: 1997,
      developer: "SACHI SOFT / \uC774\uADDC\uD0DC \uC6F9 \uC774\uC2DD",
      runtimeType: "iframe-pixi",
      launchUrl: "/pikachu-volleyball/ko/index.html?embed=win98",
      standaloneUrl: "/pikachu-volleyball/ko/index.html",
      sourcePath: "pikachu-volleyball-src/src/resources/js/main_online.js",
      aspectRatio: "432:304 (\uC57D 4:3)",
      recommendedSize: { width: 840, height: 640 },
      inputDevices: ["keyboard"],
      iconUrl: "/pikachu-volleyball/resources/assets/images/IDI_PIKAICON-0.png",
      supportedModes: [
        { id: "vs-computer", label: "\uCEF4\uD4E8\uD130 AI \uB300\uC804 (15\uC810 \uB0B4\uAE30)", metric: "score", unit: "\uC810", telemetryStatus: "direct-engine-hook" },
        { id: "vs-local-2p", label: "2\uC778 \uB85C\uCEEC \uB300\uC804 (\uC5F0\uC2B5 \uAE30\uB85D)", metric: "score", unit: "\uC810", telemetryStatus: "direct-engine-hook" },
        { id: "p2p-online", label: "\uC628\uB77C\uC778 P2P \uB300\uC804 (\uC77C\uBC29 \uC2E0\uACE0 \uB7AD\uD0B9 \uC81C\uC678)", metric: "score", unit: "\uC810", telemetryStatus: "session-only" }
      ],
      controlsSummary: "1\uC778\uC6A9 AI \uB300\uC804: \uBC29\uD5A5\uD0A4 \uC774\uB3D9 + Enter/Z \uC2A4\uD30C\uC774\uD06C (\uB610\uB294 RDFG + Z) \xB7 2\uC778 \uB85C\uCEEC: 1P(RDFG+Z) / 2P(\uBC29\uD5A5\uD0A4+Enter)"
    }
  ]);

  // tool-box/src/features/game-box/registry/arcadeGames.js
  var ARCADE_GAMES = Object.freeze([
    {
      id: "bomberman",
      name: "Blast Arena (\uBD04\uBC84\uB9E8)",
      subtitle: "27\xD715 \uD074\uB798\uC2DD \uADF8\uB9AC\uB4DC \uC11C\uBC14\uC774\uBC8C",
      genre: "ARCADE ACTION",
      caseColor: "#dc2626",
      discLabel: "BLST-001",
      playersLabel: "1~4\uC778 (COM-BOT / \uBA40\uD2F0)",
      sourcePath: "vendor/blast-arena-original/ & server/original-blast-arena-adapter.mjs",
      launchUrl: "/original-blast-arena/index.html?autobot=1",
      multiplayerUrl: "/original-blast-arena/index.html",
      iframeCompatible: true,
      aspectRatio: "16:9",
      inputDevices: ["Keyboard (WASD / \uBC29\uD5A5\uD0A4 + Space)"],
      eventSupport: "WebSocket \uB8F8 \uC0C1\uD0DC \uBC0F \uC2B9\uD328 \uD310\uC815",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uB098\uBB34 \uC0C1\uC790\uB97C \uD3ED\uD30C\uD574 \uD3ED\uD0C4 \uAC1C\uC218\xB7\uD654\uB825\xB7\uC2A4\uD53C\uB4DC \uC544\uC774\uD15C\uC744 \uD68D\uB4DD\uD558\uACE0 \uCD5C\uD6C4\uC758 1\uC778\uC774 \uB418\uB294 \uC544\uCF00\uC774\uB4DC \uC11C\uBC14\uC774\uBC8C."
    },
    {
      id: "bombergirl",
      name: "HTML5 Bombergirl",
      subtitle: "17\xD713 \uC624\uB9AC\uC9C0\uB110 \uCE94\uBC84\uC2A4 \uC544\uCF00\uC774\uB4DC",
      genre: "CLASSIC ARCADE",
      caseColor: "#ea580c",
      discLabel: "BMbg-002",
      playersLabel: "1~2\uC778 (AI 3\uC778 / \uC628\uB77C\uC778 2\uC778)",
      sourcePath: "vendor/html5-bombergirl-original/ & server/original-bombergirl-adapter.mjs",
      launchUrl: "/original-bombergirl/index.html?mode=single",
      multiplayerUrl: "/platform/?game=bombergirl",
      iframeCompatible: true,
      aspectRatio: "4:3",
      inputDevices: ["Keyboard (\uBC29\uD5A5\uD0A4 + Space / WASD)"],
      eventSupport: "\uC2F1\uAE00/\uC628\uB77C\uC778 \uC785\uB825 \uC911\uACC4 \uC5B4\uB311\uD130 \uC9C0\uC6D0",
      coverPreviewImage: "/pikachu-volleyball/resources/assets/images/screenshot.png",
      description: "\uC6D0\uBCF8 17\xD713 \uCE94\uBC84\uC2A4\uC640 \uC2A4\uD504\uB77C\uC774\uD2B8, \uD3ED\uD0C4\xB7\uBCF4\uB108\uC2A4 \uC544\uC774\uD15C \uADDC\uCE59\uC744 \uADF8\uB300\uB85C \uC7AC\uD604\uD55C \uD074\uB798\uC2DD \uBD04\uBC84\uAC78."
    },
    {
      id: "snakeduel",
      name: "Snake Duel (\uC2A4\uB124\uC774\uD06C \uB4C0\uC5BC)",
      subtitle: "30\xD720 \uC544\uB808\uB098 150ms \uD2F1 \uC0DD\uC874 \uB300\uACB0",
      genre: "ARCADE DUEL",
      caseColor: "#16a34a",
      discLabel: "SNKD-003",
      playersLabel: "1~2\uC778 (AI BOT / \uC628\uB77C\uC778)",
      sourcePath: "vendor/snake-duel-original/ & server/original-engines/snake-duel-engine.mjs",
      launchUrl: "/platform/?game=snakeduel",
      iframeCompatible: true,
      aspectRatio: "3:2",
      inputDevices: ["Keyboard (\uBC29\uD5A5\uD0A4 / WASD)"],
      eventSupport: "\uC11C\uBC84 \uAD8C\uC704 \uC5D4\uC9C4 \uC810\uC218\xB7\uC2B9\uD328\xB7\uB7AD\uD0B9 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uBA39\uC774\uB97C \uBA39\uC73C\uBA70 \uBAB8\uC9D1\uC744 \uD0A4\uC6B0\uACE0 \uC0C1\uB300\uC758 \uC9C4\uB85C\uB97C \uCC28\uB2E8\uD558\uB294 \uC815\uD1B5 1:1 \uC2A4\uB124\uC774\uD06C \uC544\uB808\uB098."
    },
    {
      id: "roulette",
      name: "Marble Roulette (\uB9C8\uBE14 \uB8F0\uB81B)",
      subtitle: "Box2D-WASM \uAD6C\uC2AC \uB808\uC774\uC2A4 \uCD94\uCCA8\uAE30",
      genre: "PHYSICS PARTY",
      caseColor: "#db2777",
      discLabel: "MRBL-004",
      playersLabel: "1~100\uBA85 \uCD94\uCCA8",
      sourcePath: "roulette-src/ & roulette/index.html",
      launchUrl: "/roulette/index.html",
      iframeCompatible: true,
      aspectRatio: "16:9",
      inputDevices: ["Mouse", "Keyboard"],
      eventSupport: "\uCD94\uCCA8 \uACB0\uACFC \uBC0F \uD788\uC2A4\uD1A0\uB9AC API \uC5F0\uB3D9",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "Box2D \uBB3C\uB9AC \uC5D4\uC9C4 \uAE30\uBC18\uC758 \uC2E4\uC2DC\uAC04 \uAD6C\uC2AC \uB099\uD558 \uB808\uC774\uC2A4 \uBC0F \uD300/\uB2F9\uCCA8\uC790 \uCD94\uCCA8 \uB3C4\uAD6C."
    },
    {
      id: "drawing",
      name: "CatchMind (\uCE90\uCE58\uB9C8\uC778\uB4DC)",
      subtitle: "\uC2E4\uC2DC\uAC04 \uADF8\uB9BC \uD034\uC988 \uD30C\uD2F0 \uAC8C\uC784",
      genre: "PARTY QUIZ",
      caseColor: "#9333ea",
      discLabel: "CTCH-005",
      playersLabel: "2~8\uC778 (AI BOT / \uC628\uB77C\uC778)",
      sourcePath: "platform-src/components/GamePlayStage.jsx & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=drawing",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Mouse (Canvas \uB4DC\uB85C\uC789)", "Keyboard (\uC815\uB2F5 \uCC44\uD305)"],
      eventSupport: "SSE \uC2E4\uC2DC\uAC04 \uC2A4\uD2B8\uB85C\uD06C \uBC0F \uC810\uC218/\uC2B9\uD328 \uC800\uC7A5",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uCD9C\uC81C\uC790\uAC00 \uCE94\uBC84\uC2A4\uC5D0 \uADF8\uB9BC\uC744 \uADF8\uB9AC\uACE0 \uCC38\uAC00\uC790\uB4E4\uC774 \uC2E4\uC2DC\uAC04\uC73C\uB85C \uC81C\uC2DC\uC5B4\uB97C \uB9DE\uCD94\uB294 \uD30C\uD2F0 \uAC8C\uC784."
    },
    {
      id: "reaction",
      name: "Reaction Battle (\uC21C\uBC1C\uB825 \uB300\uACB0)",
      subtitle: "BattleBox #01 \xB7 \uC2E0\uD638 \uBC18\uC751 \uB300\uACB0",
      genre: "BATTLEBOX SPEED",
      caseColor: "#0284c7",
      discLabel: "BBOX-101",
      playersLabel: "1~8\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=reaction",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Mouse", "Keyboard"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uD654\uBA74 \uC2E0\uD638\uAC00 \uCF1C\uC9C0\uB294 \uC21C\uAC04 \uAC00\uC7A5 \uBE60\uB974\uAC8C \uBC18\uC751\uD558\uC5EC \uD074\uB9AD\uD558\uB294 \uC21C\uBC1C\uB825 \uB300\uACB0."
    },
    {
      id: "speedtyping",
      name: "Speed Typing (\uC2A4\uD53C\uB4DC \uD0C0\uC774\uD551)",
      subtitle: "BattleBox #02 \xB7 \uBB38\uC7A5 \uC785\uB825 \uB808\uC774\uC2A4",
      genre: "BATTLEBOX SPEED",
      caseColor: "#2563eb",
      discLabel: "BBOX-102",
      playersLabel: "1~8\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=speedtyping",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Keyboard"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uC81C\uC2DC\uB41C \uBB38\uC7A5\uC744 \uAC00\uC7A5 \uBE60\uB974\uACE0 \uC815\uD655\uD558\uAC8C \uD0C0\uC774\uD551\uD558\uC5EC \uB77C\uC6B4\uB4DC \uC810\uC218\uB97C \uD68D\uB4DD\uD558\uB294 \uAC8C\uC784."
    },
    {
      id: "colormatch",
      name: "Color Match (\uCEEC\uB7EC \uB9E4\uCE58)",
      subtitle: "BattleBox #03 \xB7 \uC2A4\uD2B8\uB8F9 \uD6A8\uACFC \uC21C\uBC1C\uB825",
      genre: "BATTLEBOX SPEED",
      caseColor: "#0d9488",
      discLabel: "BBOX-103",
      playersLabel: "1~8\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=colormatch",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Mouse", "Keyboard"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uAE00\uC790\uC758 \uC758\uBBF8\uAC00 \uC544\uB2CC \uC2E4\uC81C \uD45C\uC2DC\uB41C \uC0C9\uC0C1\uC744 \uC21C\uAC04\uC801\uC73C\uB85C \uD310\uBCC4\uD574 \uC120\uD0DD\uD558\uB294 \uB450\uB1CC \uD68C\uC804 \uAC8C\uC784."
    },
    {
      id: "connectfour",
      name: "Connect Four (\uC0AC\uBAA9)",
      subtitle: "BattleBox #04 \xB7 7\xD76 \uC911\uB825 \uBCF4\uB4DC \uC804\uB7B5",
      genre: "BATTLEBOX STRATEGY",
      caseColor: "#4f46e5",
      discLabel: "BBOX-104",
      playersLabel: "1~2\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=connectfour",
      iframeCompatible: true,
      aspectRatio: "4:3",
      inputDevices: ["Mouse"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "7\xD76 \uBCF4\uB4DC\uC5D0 \uB514\uC2A4\uD06C\uB97C \uB5A8\uC5B4\uB728\uB824 \uAC00\uB85C\xB7\uC138\uB85C\xB7\uB300\uAC01\uC120 4\uAC1C\uB97C \uBA3C\uC800 \uC787\uB294 \uACE0\uC804 \uC804\uB7B5 \uAC8C\uC784."
    },
    {
      id: "tictactoe",
      name: "Tic Tac Toe (\uD2F1\uD0DD\uD1A0)",
      subtitle: "BattleBox #05 \xB7 3\xD73 \uC218\uC2F8\uC6C0",
      genre: "BATTLEBOX STRATEGY",
      caseColor: "#6366f1",
      discLabel: "BBOX-105",
      playersLabel: "1~2\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=tictactoe",
      iframeCompatible: true,
      aspectRatio: "4:3",
      inputDevices: ["Mouse"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "3\xD73 \uBCF4\uB4DC\uC5D0\uC11C O\uC640 X\uB97C \uBC88\uAC08\uC544 \uB450\uC5B4 \uD55C \uC904\uC744 \uBA3C\uC800 \uC644\uC131\uD558\uB294 1:1 \uC804\uB7B5 \uB300\uACB0."
    },
    {
      id: "memorymatch",
      name: "Memory Match (\uAE30\uC5B5\uB825 \uCE74\uB4DC)",
      subtitle: "BattleBox #06 \xB7 \uCE74\uB4DC \uC9DD \uB9DE\uCD94\uAE30",
      genre: "BATTLEBOX MEMORY",
      caseColor: "#7c3aed",
      discLabel: "BBOX-106",
      playersLabel: "1~8\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=memorymatch",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Mouse"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uB4A4\uC9D1\uD78C \uCE74\uB4DC\uC758 \uC704\uCE58\uB97C \uAE30\uC5B5\uD574 \uAC00\uC7A5 \uB9CE\uC740 \uC9DD\uC744 \uB9DE\uCD94\uB294 \uAE30\uC5B5\uB825 \uBC30\uD2C0."
    },
    {
      id: "simonsays",
      name: "Simon Says (\uC0AC\uC774\uBA3C \uC138\uC774\uC988)",
      subtitle: "BattleBox #07 \xB7 \uBD88\uBE5B \uD328\uD134 \uC554\uAE30",
      genre: "BATTLEBOX MEMORY",
      caseColor: "#c026d3",
      discLabel: "BBOX-107",
      playersLabel: "1~8\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=simonsays",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Mouse"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uC810\uC810 \uAE38\uC5B4\uC9C0\uB294 \uC0C9\uC0C1 \uC810\uBA78 \uC21C\uC11C\uB97C \uAE30\uC5B5\uD574 \uC815\uD655\uD788 \uB530\uB77C \uB204\uB974\uB294 \uD328\uD134 \uAE30\uC5B5 \uAC8C\uC784."
    },
    {
      id: "wordchain",
      name: "Word Chain (\uC601\uB2E8\uC5B4 \uB05D\uB9D0\uC787\uAE30)",
      subtitle: "BattleBox #08 \xB7 \uC81C\uD55C\uC2DC\uAC04 \uB2E8\uC5B4 \uBC30\uD2C0",
      genre: "BATTLEBOX WORD",
      caseColor: "#059669",
      discLabel: "BBOX-108",
      playersLabel: "1~8\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=wordchain",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Keyboard"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uC774\uC804 \uB2E8\uC5B4\uC758 \uB05D \uC54C\uD30C\uBCB3\uC73C\uB85C \uC2DC\uC791\uD558\uB294 \uC601\uB2E8\uC5B4\uB97C \uC81C\uD55C \uC2DC\uAC04 \uB0B4\uC5D0 \uC774\uC5B4\uAC00\uB294 \uB05D\uB9D0\uC787\uAE30."
    },
    {
      id: "anagram",
      name: "Anagram Sprint (\uCCA0\uC790 \uC870\uD569)",
      subtitle: "BattleBox #09 \xB7 \uB4A4\uC11E\uC778 \uCCA0\uC790 \uD574\uB3C5",
      genre: "BATTLEBOX WORD",
      caseColor: "#10b981",
      discLabel: "BBOX-109",
      playersLabel: "1~8\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=anagram",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Keyboard"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uBB34\uC791\uC704\uB85C \uC11E\uC778 \uC54C\uD30C\uBCB3 \uCCA0\uC790\uB97C \uBCF4\uACE0 \uC6D0\uB798 \uB2E8\uC5B4\uB97C \uAC00\uC7A5 \uBA3C\uC800 \uB9DE\uCD94\uB294 \uC2A4\uD53C\uB4DC \uD37C\uC990."
    },
    {
      id: "mathduel",
      name: "Math Duel (\uC554\uC0B0 \uB300\uACB0)",
      subtitle: "BattleBox #10 \xB7 \uC0AC\uCE59\uC5F0\uC0B0 \uC2A4\uD53C\uB4DC\uC804",
      genre: "BATTLEBOX MATH",
      caseColor: "#d97706",
      discLabel: "BBOX-110",
      playersLabel: "1~8\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=mathduel",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Keyboard", "Mouse"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uC5F0\uC18D\uC73C\uB85C \uCD9C\uC81C\uB418\uB294 \uC0AC\uCE59\uC5F0\uC0B0 \uBB38\uC81C\uB97C \uAC00\uC7A5 \uBE60\uB974\uAC8C \uC554\uC0B0\uD558\uC5EC \uD478\uB294 \uB450\uB1CC \uB300\uACB0."
    },
    {
      id: "numberhunt",
      name: "Number Hunt (\uB118\uBC84 \uD5CC\uD2B8)",
      subtitle: "BattleBox #11 \xB7 1~25 \uC21C\uC11C \uCC3E\uAE30",
      genre: "BATTLEBOX MATH",
      caseColor: "#ca8a04",
      discLabel: "BBOX-111",
      playersLabel: "1~8\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=numberhunt",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Mouse"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uACA9\uC790\uC5D0 \uD769\uC5B4\uC9C4 \uC22B\uC790\uB97C 1\uBD80\uD130 \uC21C\uC11C\uB300\uB85C \uAC00\uC7A5 \uBE60\uB974\uAC8C \uCC3E\uC544 \uD130\uCE58\uD558\uB294 \uC9D1\uC911\uB825 \uAC8C\uC784."
    },
    {
      id: "rpsarena",
      name: "RPS Arena (\uAC00\uC704\uBC14\uC704\uBCF4)",
      subtitle: "BattleBox #12 \xB7 5\uD310 3\uC120\uC2B9 \uC2EC\uB9AC\uC804",
      genre: "BATTLEBOX CLASSIC",
      caseColor: "#e11d48",
      discLabel: "BBOX-112",
      playersLabel: "1~2\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=rpsarena",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Mouse"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uC0C1\uB300\uC758 \uD328\uD134\uC744 \uC77D\uACE0 \uAC00\uC704\xB7\uBC14\uC704\xB7\uBCF4 \uC218\uC2F8\uC6C0\uC744 \uBC8C\uC774\uB294 5\uB77C\uC6B4\uB4DC \uC544\uB808\uB098."
    },
    {
      id: "trivia",
      name: "Trivia Challenge (\uC0C1\uC2DD \uD034\uC988)",
      subtitle: "BattleBox #13 \xB7 IT\xB7\uC0C1\uC2DD 4\uC9C0\uC120\uB2E4",
      genre: "BATTLEBOX TRIVIA",
      caseColor: "#0891b2",
      discLabel: "BBOX-113",
      playersLabel: "1~8\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=trivia",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Mouse"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "IT\xB7\uACFC\uD559\xB7\uC77C\uBC18 \uC0C1\uC2DD 4\uC9C0\uC120\uB2E4 \uBB38\uC81C\uB97C \uBE60\uB974\uACE0 \uC815\uD655\uD558\uAC8C \uD480\uC5B4 \uC810\uC218\uB97C \uACA8\uB8E8\uB294 \uD034\uC988\uC1FC."
    },
    {
      id: "higherlower",
      name: "Higher or Lower (\uD558\uC774 \uB85C\uC6B0)",
      subtitle: "BattleBox #14 \xB7 \uC22B\uC790 \uB192\uB0AE\uC774 \uC608\uCE21",
      genre: "BATTLEBOX SPEED",
      caseColor: "#475569",
      discLabel: "BBOX-114",
      playersLabel: "1~2\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=higherlower",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Mouse"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uB2E4\uC74C \uB4F1\uC7A5\uD560 \uC22B\uC790\uAC00 \uD604\uC7AC \uC22B\uC790\uBCF4\uB2E4 \uB192\uC744\uC9C0 \uB0AE\uC744\uC9C0 \uC5F0\uC18D\uC73C\uB85C \uB9DE\uCD94\uB294 \uD655\uB960 \uAC8C\uC784."
    },
    {
      id: "oddoneout",
      name: "Odd One Out (\uB2E4\uB978 \uADF8\uB9BC \uCC3E\uAE30)",
      subtitle: "BattleBox #15 \xB7 \uC774\uC9C8\uC801\uC778 \uD0C0\uC77C \uD0D0\uC0C9",
      genre: "BATTLEBOX STRATEGY",
      caseColor: "#334155",
      discLabel: "BBOX-115",
      playersLabel: "1~2\uC778 (BOT / \uC628\uB77C\uC778)",
      sourcePath: "battlebox/games/ & server/platform-realtime.mjs",
      launchUrl: "/platform/?game=oddoneout",
      iframeCompatible: true,
      aspectRatio: "16:10",
      inputDevices: ["Mouse"],
      eventSupport: "\uD50C\uB7AB\uD3FC \uB9E4\uCE58 \uACB0\uACFC DB \uC800\uC7A5 \uC9C0\uC6D0",
      coverPreviewImage: "/assets/terminal-1997.png",
      description: "\uC218\uB9CE\uC740 \uD0C0\uC77C \uC911 \uBBF8\uC138\uD558\uAC8C \uB2E4\uB978 \uD558\uB098\uB97C \uAC00\uC7A5 \uBA3C\uC800 \uCC3E\uC544\uB0B4\uB294 \uB208\uC370\uBBF8 \uB300\uACB0."
    }
  ]);

  // tool-box/src/features/game-box/GameBoxHome.js
  function GameBoxHome({ onNavigate }) {
    const featuredDeckCases = ARCADE_GAMES.slice(0, 6);
    return /* @__PURE__ */ u3("div", { className: "gb-home-container", children: [
      /* @__PURE__ */ u3("div", { className: "gb-home-intro-bar", children: [
        /* @__PURE__ */ u3("div", { children: [
          /* @__PURE__ */ u3("span", { className: "gb-home-kicker", children: "UNIFIED WORKSPACE ARCADE & RETRO SYSTEM" }),
          /* @__PURE__ */ u3("h2", { className: "gb-home-heading", children: "\uC6D0\uD558\uB294 \uAC8C\uC784 \uACF5\uAC04\uC744 \uC120\uD0DD\uD558\uC138\uC694" })
        ] }),
        /* @__PURE__ */ u3("p", { className: "gb-home-subtext", children: "1990\uB144\uB300 \uD55C\uAE00 Windows 98 \uBC14\uD0D5\uD654\uBA74\uC5D0\uC11C \uC990\uAE30\uB294 \uD0C0\uC790\xB7\uD53C\uCE74\uCE04\uBC30\uAD6C \uB7AD\uD0B9\uC804\uBD80\uD130 \uD604\uB300\uC801\uC778 \uCF58\uC194 \uB371 \uAE30\uBC18\uC758 20\uC885 \uC544\uCF00\uC774\uB4DC \uCEEC\uB809\uC158\uAE4C\uC9C0 \uD558\uB098\uC758 \uC2DC\uC2A4\uD15C\uC73C\uB85C \uC5F0\uACB0\uB429\uB2C8\uB2E4." })
      ] }),
      /* @__PURE__ */ u3("div", { className: "gb-home-cards-grid", children: [
        /* @__PURE__ */ u3(
          "article",
          {
            className: "gb-entry-card gb-entry-card-retro",
            role: "button",
            tabIndex: 0,
            onClick: () => onNavigate("/game-box/retro"),
            onKeyDown: (e3) => {
              if (e3.key === "Enter" || e3.key === " ") {
                e3.preventDefault();
                onNavigate("/game-box/retro");
              }
            },
            children: [
              /* @__PURE__ */ u3("div", { className: "gb-card-top-meta", children: [
                /* @__PURE__ */ u3("div", { children: [
                  /* @__PURE__ */ u3("span", { className: "gb-card-subtitle", children: "CLASSIC GAMES" }),
                  /* @__PURE__ */ u3("h3", { className: "gb-card-title", children: "RETRO DESKTOP" })
                ] }),
                /* @__PURE__ */ u3("span", { className: "gb-card-era-badge gb-badge-win98", children: "\uD55C\uAE00 Windows 98 EDITION" })
              ] }),
              /* @__PURE__ */ u3("div", { className: "gb-retro-preview-window", children: [
                /* @__PURE__ */ u3("div", { className: "gb-win98-titlebar", children: [
                  /* @__PURE__ */ u3("span", { className: "gb-win98-titlebar-text", children: "\u{1FA9F} \uD55C\uAE00 Windows 98 \u2014 \uCD94\uC5B5\uC758 \uCEF4\uD4E8\uD130\uC2E4 \uC5D0\uB514\uC158" }),
                  /* @__PURE__ */ u3("div", { className: "gb-win98-controls", children: [
                    /* @__PURE__ */ u3("span", { children: "_" }),
                    /* @__PURE__ */ u3("span", { children: "\u25A1" }),
                    /* @__PURE__ */ u3("span", { children: "\xD7" })
                  ] })
                ] }),
                /* @__PURE__ */ u3("div", { className: "gb-win98-desktop-stage", children: [
                  /* @__PURE__ */ u3("div", { className: "gb-win98-canvas-icons", children: [
                    /* @__PURE__ */ u3("div", { className: "gb-win98-d-icon", children: [
                      /* @__PURE__ */ u3("span", { className: "gb-d-ico-glyph", children: "\u{1F5A9}" }),
                      /* @__PURE__ */ u3("span", { className: "gb-d-ico-label", children: "\uD55C\uCEF4\uD0C0\uC790\uC5F0\uC2B5 97" })
                    ] }),
                    /* @__PURE__ */ u3("div", { className: "gb-win98-d-icon", children: [
                      /* @__PURE__ */ u3("span", { className: "gb-d-ico-glyph", children: "\u2328\uFE0F" }),
                      /* @__PURE__ */ u3("span", { className: "gb-d-ico-label", children: "\uD55C\uBA54\uD0C0\uC790 3.0" })
                    ] }),
                    /* @__PURE__ */ u3("div", { className: "gb-win98-d-icon", children: [
                      /* @__PURE__ */ u3("span", { className: "gb-d-ico-glyph", children: "\u26A1" }),
                      /* @__PURE__ */ u3("span", { className: "gb-d-ico-label", children: "\uD53C\uCE74\uCE04 \uBC30\uAD6C" })
                    ] }),
                    /* @__PURE__ */ u3("div", { className: "gb-win98-d-icon", children: [
                      /* @__PURE__ */ u3("span", { className: "gb-d-ico-glyph", children: "\u{1F4D6}" }),
                      /* @__PURE__ */ u3("span", { className: "gb-d-ico-label", children: "\uAC8C\uC784 \uAC00\uC774\uB4DC" })
                    ] }),
                    /* @__PURE__ */ u3("div", { className: "gb-win98-d-icon", children: [
                      /* @__PURE__ */ u3("span", { className: "gb-d-ico-glyph", children: "\u{1F3C6}" }),
                      /* @__PURE__ */ u3("span", { className: "gb-d-ico-label", children: "GAME RANKING" })
                    ] })
                  ] }),
                  /* @__PURE__ */ u3("div", { className: "gb-win98-stage-windows", children: [
                    /* @__PURE__ */ u3("div", { className: "gb-win98-floating-win gb-win-typing", children: [
                      /* @__PURE__ */ u3("div", { className: "gb-win-bar", children: [
                        /* @__PURE__ */ u3("span", { children: "\u{1F5A9} \uD55C\uCEF4\uD0C0\uC790 97 \u2014 \uC0B0\uC131\uBE44" }),
                        /* @__PURE__ */ u3("div", { className: "gb-win-btn-mini", children: "\u2715" })
                      ] }),
                      /* @__PURE__ */ u3("div", { className: "gb-win-inner-typing", children: [
                        /* @__PURE__ */ u3("div", { className: "gb-drop-word w1", children: "\uBB34\uAD81\uD654" }),
                        /* @__PURE__ */ u3("div", { className: "gb-drop-word w2", children: "\uCEF4\uD4E8\uD130" }),
                        /* @__PURE__ */ u3("div", { className: "gb-drop-word w3", children: "\uC544\uB984\uB2E4\uC6B4" }),
                        /* @__PURE__ */ u3("div", { className: "gb-typing-ocean", children: "\u{1F30A} \uD0C0\uC790\uC18D\uB3C4: 482\uD0C0 / \uCD5C\uACE0\uAE30\uB85D" })
                      ] })
                    ] }),
                    /* @__PURE__ */ u3("div", { className: "gb-win98-floating-win gb-win-pika", children: [
                      /* @__PURE__ */ u3("div", { className: "gb-win-bar", children: [
                        /* @__PURE__ */ u3("span", { children: "\u26A1 \uD53C\uCE74\uCE04 \uBC30\uAD6C 1:1 \uB300\uC804" }),
                        /* @__PURE__ */ u3("div", { className: "gb-win-btn-mini", children: "\u2715" })
                      ] }),
                      /* @__PURE__ */ u3("div", { className: "gb-win-inner-pika", children: [
                        /* @__PURE__ */ u3("div", { className: "gb-pika-court", children: [
                          /* @__PURE__ */ u3("span", { className: "gb-pika-char p1", children: "\u26A1" }),
                          /* @__PURE__ */ u3("span", { className: "gb-pika-net", children: "\u2502" }),
                          /* @__PURE__ */ u3("span", { className: "gb-pika-ball", children: "\u{1F534}" }),
                          /* @__PURE__ */ u3("span", { className: "gb-pika-char p2", children: "\u26A1" })
                        ] }),
                        /* @__PURE__ */ u3("div", { className: "gb-pika-score", children: "1P: 14 vs 2P(COM): 12" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ u3("div", { className: "gb-win98-stage-taskbar", children: [
                    /* @__PURE__ */ u3("button", { type: "button", className: "gb-win98-start-btn", children: [
                      /* @__PURE__ */ u3("span", { className: "gb-win98-flag", children: "\u{1FA9F}" }),
                      /* @__PURE__ */ u3("strong", { children: "\uC2DC\uC791" })
                    ] }),
                    /* @__PURE__ */ u3("div", { className: "gb-win98-task-tabs", children: [
                      /* @__PURE__ */ u3("div", { className: "gb-win98-task-tab active", children: "\u{1F5A9} \uD55C\uCEF4\uD0C0\uC790 97" }),
                      /* @__PURE__ */ u3("div", { className: "gb-win98-task-tab", children: "\u26A1 \uD53C\uCE74\uCE04 \uBC30\uAD6C" })
                    ] }),
                    /* @__PURE__ */ u3("div", { className: "gb-win98-task-tray", children: [
                      /* @__PURE__ */ u3("span", { children: "\uD55C" }),
                      /* @__PURE__ */ u3("span", { children: "\u{1F50A}" }),
                      /* @__PURE__ */ u3("span", { children: "\uC624\uD6C4 03:40" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ u3("p", { className: "gb-card-desc", children: [
                "1990\uB144\uB300 \uCEF4\uD4E8\uD130\uC2E4\uACFC \uD55C\uAE00 Windows 98 \uBC14\uD0D5\uD654\uBA74 \uD658\uACBD\uC744 \uADF8\uB300\uB85C \uCCB4\uD5D8\uD558\uB294 \uACF5\uAC04\uC785\uB2C8\uB2E4.",
                /* @__PURE__ */ u3("strong", { children: " \uD55C\uCEF4\uD0C0\uC790\uC5F0\uC2B5 97" }),
                ", ",
                /* @__PURE__ */ u3("strong", { children: "\uD55C\uBA54\uD0C0\uC790\uAD50\uC0AC 3.0" }),
                ", ",
                /* @__PURE__ */ u3("strong", { children: "\uD53C\uCE74\uCE04 \uBC30\uAD6C" }),
                "\uC640 \uC6B0\uCE21 \uACE0\uC815 ",
                /* @__PURE__ */ u3("strong", { children: "GAME RANKING" }),
                " \uCC3D\uC744 \uD1B5\uD574 \uC2E4\uC2DC\uAC04 \uC885\uBAA9\uBCC4 TOP 10 \uC21C\uC704\uB97C \uACA8\uB8F9\uB2C8\uB2E4."
              ] }),
              /* @__PURE__ */ u3("div", { className: "gb-card-footer", children: [
                /* @__PURE__ */ u3("div", { className: "gb-card-specs", children: [
                  /* @__PURE__ */ u3("span", { children: "\uC218\uB85D: \uD0C0\uC790 2\uC885 \xB7 \uD53C\uCE74\uCE04 \uBC30\uAD6C \xB7 \uC9C0\uB8B0\uCC3E\uAE30 \xB7 \uD540\uBCFC" }),
                  /* @__PURE__ */ u3("span", { children: "\uC2E4\uC2DC\uAC04 \uB7AD\uD0B9 \uCC3D \uC5F0\uB3D9" })
                ] }),
                /* @__PURE__ */ u3("span", { className: "gb-card-cta gb-cta-retro", children: "RETRO DESKTOP \uC9C4\uC785 \u2192" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ u3(
          "article",
          {
            className: "gb-entry-card gb-entry-card-deck",
            role: "button",
            tabIndex: 0,
            onClick: () => onNavigate("/game-box/deck"),
            onKeyDown: (e3) => {
              if (e3.key === "Enter" || e3.key === " ") {
                e3.preventDefault();
                onNavigate("/game-box/deck");
              }
            },
            children: [
              /* @__PURE__ */ u3("div", { className: "gb-card-top-meta", children: [
                /* @__PURE__ */ u3("div", { children: [
                  /* @__PURE__ */ u3("span", { className: "gb-card-subtitle", children: "ARCADE COLLECTION" }),
                  /* @__PURE__ */ u3("h3", { className: "gb-card-title", children: "GAME DECK" })
                ] }),
                /* @__PURE__ */ u3("span", { className: "gb-card-era-badge gb-badge-deck", children: "20 ARCADE PACKS" })
              ] }),
              /* @__PURE__ */ u3("div", { className: "gb-deck-preview-stage", children: /* @__PURE__ */ u3("div", { className: "gb-deck-console-bezel", children: [
                /* @__PURE__ */ u3("div", { className: "gb-deck-console-header", children: [
                  /* @__PURE__ */ u3("span", { className: "gb-deck-console-led" }),
                  /* @__PURE__ */ u3("span", { className: "gb-deck-console-label", children: "CONSOLE DISPLAY // ACTIVE COLLECTION" }),
                  /* @__PURE__ */ u3("span", { className: "gb-deck-console-slot", children: "SLOT READY" })
                ] }),
                /* @__PURE__ */ u3("div", { className: "gb-deck-screen-collage", children: [
                  /* @__PURE__ */ u3("div", { className: "gb-deck-screen-main", children: [
                    /* @__PURE__ */ u3(
                      "img",
                      {
                        src: "/pikachu-volleyball/resources/assets/images/screenshot.png",
                        alt: "Game Deck Console Display Preview",
                        className: "gb-deck-screen-img"
                      }
                    ),
                    /* @__PURE__ */ u3("div", { className: "gb-deck-screen-overlay", children: /* @__PURE__ */ u3("span", { children: "BLAST ARENA \xB7 SNAKE DUEL \xB7 BOMBERGIRL \xB7 BATTLEBOX 15" }) })
                  ] }),
                  /* @__PURE__ */ u3("div", { className: "gb-deck-cases-rack", children: featuredDeckCases.map((c3) => /* @__PURE__ */ u3(
                    "div",
                    {
                      className: "gb-mini-game-case",
                      style: { "--case-color": c3.caseColor },
                      children: [
                        /* @__PURE__ */ u3("span", { className: "gb-mini-case-code", children: c3.discLabel }),
                        /* @__PURE__ */ u3("strong", { className: "gb-mini-case-name", children: c3.name })
                      ]
                    },
                    c3.id
                  )) })
                ] })
              ] }) }),
              /* @__PURE__ */ u3("p", { className: "gb-card-desc", children: [
                "\uB2E4\uD06C \uADF8\uB798\uD30C\uC774\uD2B8 \uCF58\uC194\uACFC \uC2E4\uBC84 \uB370\uD06C\uC5D0 \uAC8C\uC784\uD329 \uCF00\uC774\uC2A4\uB97C \uC0BD\uC785\uD574 \uC990\uAE30\uB294 \uD604\uB300\uC801\uC778 \uC544\uCF00\uC774\uB4DC \uCEEC\uB809\uC158\uC785\uB2C8\uB2E4.",
                /* @__PURE__ */ u3("strong", { children: " \uBD04\uBC84\uB9E8(Blast Arena)" }),
                ", ",
                /* @__PURE__ */ u3("strong", { children: "\uC2A4\uB124\uC774\uD06C \uB4C0\uC5BC" }),
                ", ",
                /* @__PURE__ */ u3("strong", { children: "\uBD04\uBC84\uAC78" }),
                ",",
                /* @__PURE__ */ u3("strong", { children: " \uB9C8\uBE14 \uB8F0\uB81B" }),
                ", ",
                /* @__PURE__ */ u3("strong", { children: "\uBC30\uD2C0\uBC15\uC2A4 15\uC885" }),
                "\uC744 \uC9C0\uC6D0\uD569\uB2C8\uB2E4."
              ] }),
              /* @__PURE__ */ u3("div", { className: "gb-card-footer", children: [
                /* @__PURE__ */ u3("div", { className: "gb-card-specs", children: [
                  /* @__PURE__ */ u3("span", { children: "\uC218\uB85D: \uC544\uCF00\uC774\uB4DC 3\uC885 \xB7 \uD30C\uD2F0 2\uC885 \xB7 \uBC30\uD2C0\uBC15\uC2A4 15\uC885" }),
                  /* @__PURE__ */ u3("span", { children: "\uCF58\uC194 \uB371 & \uBA40\uD2F0 \uB85C\uBE44 \uC9C0\uC6D0" })
                ] }),
                /* @__PURE__ */ u3("span", { className: "gb-card-cta gb-cta-deck", children: "GAME DECK \uC9C4\uC785 \u2192" })
              ] })
            ]
          }
        )
      ] })
    ] });
  }

  // tool-box/src/features/game-box/retro/RetroDesktop.js
  function RetroDesktop({ onNavigate }) {
    const { identity, openNicknameModal } = useGameIdentity();
    const iframeRef = A2(null);
    h2(() => {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;
      try {
        iframe.contentWindow.postMessage(
          {
            source: "game-box-host",
            type: "identity:sync",
            payload: identity
          },
          window.location.origin
        );
      } catch {
      }
    }, [identity]);
    const sendCommandToWin98 = (appId) => {
      const cw = iframeRef.current?.contentWindow;
      if (cw?.System?.launchApp) {
        cw.System.launchApp(appId);
        cw.focus();
      }
    };
    return /* @__PURE__ */ u3("div", { className: "gb-retro-shell", children: [
      /* @__PURE__ */ u3("div", { className: "gb-subbar", children: [
        /* @__PURE__ */ u3("div", { className: "gb-subbar-left", children: [
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: "gb-subbar-back",
              onClick: () => onNavigate("/game-box"),
              children: "\u2190 GAME-BOX \uD648\uC73C\uB85C"
            }
          ),
          /* @__PURE__ */ u3("span", { className: "gb-subbar-divider", children: "|" }),
          /* @__PURE__ */ u3("strong", { className: "gb-subbar-title", children: "RETRO DESKTOP (Windows 98)" }),
          /* @__PURE__ */ u3("span", { className: "gb-subbar-hint", children: "\uBC14\uD0D5\uD654\uBA74\uC758 [\uD55C\uCEF4\uD0C0\uC790\uC5F0\uC2B5], [\uD55C\uBA54\uD0C0\uC790\uC5F0\uC2B5], [\uD53C\uCE74\uCE04 \uBC30\uAD6C], [\uAC8C\uC784 \uAC00\uC774\uB4DC], \uC624\uB978\uCABD [GAME RANKING] \uCC3D\uC744 \uC774\uC6A9\uD558\uC138\uC694." })
        ] }),
        /* @__PURE__ */ u3("div", { className: "gb-subbar-actions", children: [
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: "gb-subbar-btn",
              onClick: () => sendCommandToWin98("retro-game-guide"),
              children: "\u{1F4D6} \uAC8C\uC784 \uAC00\uC774\uB4DC \uC5F4\uAE30"
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: "gb-subbar-btn",
              onClick: () => sendCommandToWin98("retro-ranking"),
              children: "\u{1F3C6} GAME RANKING \uCC3D \uC5F4\uAE30"
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: "gb-subbar-btn",
              onClick: openNicknameModal,
              children: [
                "\u{1F464} ",
                identity.nickname || "\uB2C9\uB124\uC784 \uC124\uC815"
              ]
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: "gb-subbar-btn",
              onClick: () => onNavigate("/game-box/deck"),
              children: "\u{1F579}\uFE0F GAME DECK \uC774\uB3D9 \u2192"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { className: "gb-retro-viewport", children: /* @__PURE__ */ u3(
        "iframe",
        {
          ref: iframeRef,
          src: "/win98-web/",
          title: "Windows 98 RETRO DESKTOP",
          className: "gb-retro-iframe",
          allow: "autoplay; fullscreen",
          onLoad: () => {
            try {
              iframeRef.current?.contentWindow?.postMessage(
                {
                  source: "game-box-host",
                  type: "identity:sync",
                  payload: identity
                },
                window.location.origin
              );
            } catch {
            }
          }
        }
      ) })
    ] });
  }

  // tool-box/src/features/game-box/deck/gameDeckConfig.js
  var GAME_DECK_CATEGORIES = Object.freeze([
    { id: "all", label: "ALL PACKS (20)" },
    { id: "ARCADE", label: "ARCADE ORIGINAL (3)" },
    { id: "PARTY", label: "ROULETTE & PARTY (2)" },
    { id: "BATTLEBOX", label: "BATTLEBOX COLLECTION (15)" }
  ]);
  var FUTURE_3D_REFERENCES = Object.freeze([
    {
      repo: "brayanspagnol/ps2-web",
      license: "MIT / Open Reference",
      referenceFiles: [
        "public/js/console-scene.js",
        "public/js/crt-tv.js",
        "public/demo-console.html"
      ],
      adoptionScope: "\uCF58\uC194 \uBCF8\uCCB4 \uD2B8\uB808\uC774 \uC5F0\uCD9C, \uB514\uC2A4\uD06C \uC0BD\uC785/\uBC30\uCD9C \uC560\uB2C8\uBA54\uC774\uC158 \uD0C0\uC774\uBC0D, \uD654\uBA74 \uC804\uD658 \uCE74\uBA54\uB77C \uC6CC\uD06C \uCC38\uACE0 (PS2 \uC0C1\uD45C/\uB85C\uACE0 \uBC0F \uC5D0\uBBAC\uB808\uC774\uD130\uB294 \uC81C\uC678)"
    },
    {
      repo: "otisabiburada/finally-3d-game-cases-plugin",
      license: "BSD-3-Clause / Open Reference",
      referenceFiles: [
        "src/engine.ts",
        "README.md",
        "LICENSE"
      ],
      adoptionScope: "\uAC8C\uC784 \uCF00\uC774\uC2A4 \uC785\uCCB4 \uD68C\uC804, \uC120\uD0DD \uC2DC \uCF00\uC774\uC2A4 \uAC1C\uD3D0 \uBC0F \uB514\uC2A4\uD06C \uCD94\uCD9C \uC5F0\uCD9C \uCC38\uACE0 (Steam Deck \uD50C\uB7EC\uADF8\uC778 \uB7F0\uD0C0\uC784\uC740 \uC81C\uC678)"
    }
  ]);
  function filterDeckGames(categoryFilter = "all", query = "") {
    return ARCADE_GAMES.filter((game) => {
      if (categoryFilter !== "all" && !game.genre.includes(categoryFilter)) {
        return false;
      }
      if (query.trim()) {
        const q4 = query.trim().toLowerCase();
        return game.name.toLowerCase().includes(q4) || game.subtitle.toLowerCase().includes(q4) || game.genre.toLowerCase().includes(q4) || game.discLabel.toLowerCase().includes(q4);
      }
      return true;
    });
  }

  // tool-box/src/features/game-box/runtime/GameLauncher.js
  var DEFAULT_GAME_GUIDES = {
    bomberman: {
      title: "Blast Arena (\uBD04\uBC84\uB9E8)",
      controls: [
        { key: "\uBC29\uD5A5\uD0A4 \uB610\uB294 W, A, S, D", desc: "\uC0C1\xB7\uD558\xB7\uC88C\xB7\uC6B0 \uCE90\uB9AD\uD130 \uC774\uB3D9" },
        { key: "Space", desc: "\uD3ED\uD0C4 \uC124\uCE58" }
      ],
      rules: [
        "\uB098\uBB34 \uC0C1\uC790\uB97C \uD3ED\uD30C\uD558\uBA74 \uD3ED\uD0C4 \uAC1C\uC218(+1), \uD654\uB825(+1), \uC774\uB3D9 \uC18D\uB3C4(+1) \uAC15\uD654 \uC544\uC774\uD15C\uC774 \uB098\uC635\uB2C8\uB2E4.",
        "\uC790\uC2E0 \uB610\uB294 \uC0C1\uB300\uC758 \uD3ED\uD0C4 \uD3ED\uBC1C \uBC18\uACBD(\uC2ED\uC790 \uBAA8\uC591 \uD654\uC5FC)\uC5D0 \uB2FF\uC73C\uBA74 \uC989\uC2DC \uD0C8\uB77D\uD569\uB2C8\uB2E4.",
        "\uCD5C\uD6C4\uAE4C\uC9C0 \uC0DD\uC874\uD558\uB294 1\uC778\uC774 \uD574\uB2F9 \uB77C\uC6B4\uB4DC\uC758 \uC6B0\uC2B9\uC790\uAC00 \uB429\uB2C8\uB2E4."
      ],
      tip: "\uBCBD \uB4A4\uC5D0 \uC228\uC5B4 \uC548\uC804\uAC70\uB9AC\uB97C \uD655\uBCF4\uD558\uACE0, \uC0C1\uB300\uAC00 \uC774\uB3D9\uD560 \uD1F4\uB85C\uB97C \uC608\uCE21\uD574 \uD3ED\uD0C4\uC744 \uBC30\uCE58\uD558\uC138\uC694."
    },
    bombergirl: {
      title: "HTML5 Bombergirl",
      controls: [
        { key: "\uBC29\uD5A5\uD0A4 (\u2191 \u2193 \u2190 \u2192)", desc: "1P \uC774\uB3D9" },
        { key: "Space \uB610\uB294 Alt", desc: "1P \uD3ED\uD0C4 \uC124\uCE58" },
        { key: "W, A, S, D", desc: "2P \uC774\uB3D9 (\uB85C\uCEEC 2\uC778 \uC2DC)" },
        { key: "Shift", desc: "2P \uD3ED\uD0C4 \uC124\uCE58 (\uB85C\uCEEC 2\uC778 \uC2DC)" },
        { key: "Enter", desc: "\uAC8C\uC784 \uC7AC\uC2DC\uC791" },
        { key: "ESC", desc: "\uBA54\uC778 \uBA54\uB274 \uC774\uB3D9" },
        { key: "M", desc: "\uC0AC\uC6B4\uB4DC \uCF1C\uAE30/\uB044\uAE30 (Mute)" }
      ],
      rules: [
        "17\xD713 \uD074\uB798\uC2DD \uADF8\uB9AC\uB4DC\uC5D0\uC11C 3\uBA85\uC758 AI \uD50C\uB808\uC774\uC5B4\uC640 \uC11C\uBC14\uC774\uBC8C \uB300\uC804\uC744 \uD3BC\uCE69\uB2C8\uB2E4.",
        "\uC0C1\uC790\uB97C \uD30C\uAD34\uD574 \uBD88\uAF43(\uD654\uB825 \uC99D\uAC00), \uB864\uB7EC\uC2A4\uCF00\uC774\uD2B8(\uC2A4\uD53C\uB4DC), \uD3ED\uD0C4(\uC124\uCE58 \uD55C\uB3C4 \uC99D\uAC00)\uC744 \uD68D\uB4DD\uD558\uC138\uC694.",
        "\uD654\uC5FC\uC5D0 \uB2FF\uC73C\uBA74 \uD0C8\uB77D\uD558\uBA70 \uB9C8\uC9C0\uB9C9 1\uC778\uC774 \uC2B9\uB9AC\uD569\uB2C8\uB2E4."
      ],
      tip: "\uD3ED\uD0C4\uC744 \uC5F0\uC18D \uC124\uCE58\uD560 \uB54C \uC790\uC2E0\uC774 \uAC07\uD788\uC9C0 \uC54A\uB3C4\uB85D \uD0C8\uCD9C\uB85C\uB97C \uBA3C\uC800 \uACC4\uC0B0\uD558\uC138\uC694."
    },
    snakeduel: {
      title: "Snake Duel (\uC2A4\uB124\uC774\uD06C \uB4C0\uC5BC)",
      controls: [
        { key: "\uBC29\uD5A5\uD0A4 \uB610\uB294 W, A, S, D", desc: "\uBC40 \uBA38\uB9AC \uC9C4\uD589 \uBC29\uD5A5 \uC804\uD658" }
      ],
      rules: [
        "\uD544\uB4DC\uC5D0 \uC0DD\uC131\uB418\uB294 \uBA39\uC774\uB97C \uBA39\uC73C\uBA74 \uBAB8\uAE38\uC774\uAC00 1\uCE78 \uB298\uC5B4\uB098\uACE0 \uC810\uC218\uB97C \uD68D\uB4DD\uD569\uB2C8\uB2E4.",
        "\uC678\uACFD \uBCBD\uC774\uB098 \uC790\uC2E0\uC758 \uBAB8\uD1B5, \uB610\uB294 \uC0C1\uB300 \uBC40\uC758 \uBAB8\uD1B5\uC5D0 \uCDA9\uB3CC\uD558\uBA74 \uC989\uC2DC \uD328\uBC30\uD569\uB2C8\uB2E4.",
        "\uC0C1\uB300 \uBC40\uC774 \uC6C0\uC9C1\uC77C \uACF5\uAC04\uC744 \uBAB8\uD1B5\uC73C\uB85C \uAC00\uB450\uAC70\uB098 \uCC28\uB2E8\uD558\uB294 \uAC83\uC774 \uD575\uC2EC \uC804\uB7B5\uC785\uB2C8\uB2E4."
      ],
      tip: "\uCD08\uBC18\uC5D0\uB294 \uBA39\uC774\uB97C \uBA39\uC5B4 \uBAB8\uC9D1\uC744 \uBD88\uB9AC\uACE0, \uD6C4\uBC18\uC5D0\uB294 \uD544\uB4DC \uC911\uC559\uC744 \uC7A5\uC545\uD558\uC5EC \uC0C1\uB300\uB97C \uAD6C\uC11D\uC73C\uB85C \uBAA8\uC138\uC694."
    },
    roulette: {
      title: "Marble Roulette (\uB9C8\uBE14 \uB8F0\uB81B)",
      controls: [
        { key: "\uB9C8\uC6B0\uC2A4 \uD074\uB9AD", desc: "\uCC38\uAC00\uC790 \uBA85\uB2E8 \uC785\uB825 / \uB2F9\uCCA8\uC790 \uC218 \uC124\uC815 / \uB9F5 \uC120\uD0DD" },
        { key: "PLAY / START \uBC84\uD2BC", desc: "\uBB3C\uB9AC \uAD6C\uC2AC \uB099\uD558 \uB808\uC774\uC2A4 \uC2DC\uC791" }
      ],
      rules: [
        "Box2D 2D \uBB3C\uB9AC \uC5D4\uC9C4\uC744 \uAE30\uBC18\uC73C\uB85C \uBAA8\uB4E0 \uAD6C\uC2AC\uC774 \uB3D9\uC77C\uD55C \uBB3C\uB9AC \uC870\uAC74\uC5D0\uC11C \uB808\uC774\uC2A4\uB97C \uC2DC\uC791\uD569\uB2C8\uB2E4.",
        "\uD68C\uC804 \uD1B1\uB2C8, \uD540, \uBC18\uC0AC\uD310 \uB4F1\uC758 \uC7A5\uC560\uBB3C\uC744 \uD1B5\uACFC\uD574 \uACB0\uC2B9\uC120\uC5D0 \uAC00\uC7A5 \uBA3C\uC800(\uB610\uB294 \uC124\uC815\uB41C \uC21C\uC704) \uB3C4\uB2EC\uD55C \uAD6C\uC2AC\uC774 \uB2F9\uCCA8\uB429\uB2C8\uB2E4."
      ],
      tip: "\uCC38\uAC00\uC790 \uC774\uB984 \uB4A4\uC5D0 *2, *3\uC744 \uBD99\uC5EC \uAC00\uC911\uCE58\uB97C \uC8FC\uAC70\uB098, \uB9F5 \uC120\uD0DD\uC744 \uBC14\uAFD4 \uC0C9\uB2E4\uB978 \uBB3C\uB9AC \uD2B8\uB799\uC744 \uC990\uAE38 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    },
    drawing: {
      title: "CatchMind (\uCE90\uCE58\uB9C8\uC778\uB4DC)",
      controls: [
        { key: "\uB9C8\uC6B0\uC2A4 \uB4DC\uB798\uADF8", desc: "\uCD9C\uC81C\uC790: \uCE94\uBC84\uC2A4 \uC790\uC720 \uACE1\uC120 \uB4DC\uB85C\uC789 / \uC0C9\uC0C1\xB7\uAD75\uAE30 \uC120\uD0DD" },
        { key: "\uD0A4\uBCF4\uB4DC \uD0C0\uC774\uD551 + Enter", desc: "\uCC38\uAC00\uC790: \uD558\uB2E8 \uCC44\uD305\uCC3D\uC5D0 \uC815\uB2F5 \uD0A4\uC6CC\uB4DC \uC2E4\uC2DC\uAC04 \uC785\uB825" }
      ],
      rules: [
        "\uCD9C\uC81C\uC790\uAC00 \uC81C\uC2DC\uC5B4\uB97C \uBCF4\uACE0 \uADF8\uB9BC\uC744 \uADF8\uB9AC\uBA74 \uCC38\uAC00\uC790\uB4E4\uC740 \uCC44\uD305\uCC3D\uC5D0 \uC815\uB2F5\uC744 \uCD94\uCE21\uD574 \uB9DE\uCDA5\uB2C8\uB2E4.",
        "\uAC00\uC7A5 \uBA3C\uC800 \uC815\uB2F5\uC744 \uB9DE\uD78C \uCC38\uAC00\uC790\uC640 \uADF8\uB9BC\uC744 \uADF8\uB9B0 \uCD9C\uC81C\uC790 \uBAA8\uB450 \uC810\uC218\uB97C \uD68D\uB4DD\uD569\uB2C8\uB2E4."
      ],
      tip: "\uC0AC\uBB3C\uC758 \uAC00\uC7A5 \uD2B9\uC9D5\uC801\uC778 \uD575\uC2EC \uC2E4\uB8E8\uC5E3\uBD80\uD130 \uBE60\uB974\uAC8C \uADF8\uB9AC\uB294 \uAC83\uC774 \uB4DD\uC810\uC5D0 \uC720\uB9AC\uD569\uB2C8\uB2E4."
    },
    reaction: {
      title: "Reaction Battle (\uC21C\uBC1C\uB825 \uB300\uACB0)",
      controls: [
        { key: "\uB9C8\uC6B0\uC2A4 \uC88C\uD074\uB9AD \uB610\uB294 Space", desc: "\uC2E0\uD638 \uBC18\uC751 \uC2DC \uC989\uC2DC \uC785\uB825" }
      ],
      rules: [
        "\uC2E0\uD638 \uB300\uAE30(\uBE68\uAC04\uC0C9) \uD654\uBA74\uC5D0\uC11C \uCD08\uB85D\uC0C9\uC73C\uB85C \uBC14\uB00C\uB294 \uCC30\uB098\uC5D0 \uAC00\uC7A5 \uBE60\uB974\uAC8C \uD074\uB9AD\uD558\uC138\uC694.",
        "\uC2E0\uD638\uAC00 \uBC14\uB00C\uAE30 \uC804\uC5D0 \uBBF8\uB9AC \uD074\uB9AD\uD558\uBA74 \uBD80\uC815\uCD9C\uBC1C(\uD398\uB110\uD2F0)\uB85C \uD0C8\uB77D\uD558\uAC70\uB098 \uC2DC\uAC04\uC774 \uAC00\uC0B0\uB429\uB2C8\uB2E4."
      ],
      tip: "\uD654\uBA74 \uC911\uC559\uC758 \uC0C9\uC0C1 \uBCC0\uD654\uC5D0 \uC2DC\uC120\uC744 \uC9D1\uC911\uD558\uACE0 \uC2EC\uD638\uD761\uC744 \uD558\uC138\uC694."
    },
    speedtyping: {
      title: "Speed Typing (\uC2A4\uD53C\uB4DC \uD0C0\uC774\uD551)",
      controls: [
        { key: "\uD0A4\uBCF4\uB4DC \uD55C/\uC601 \uD0C0\uC774\uD551 + Enter", desc: "\uC81C\uC2DC \uBB38\uC7A5 \uC785\uB825 \uBC0F \uC81C\uCD9C" }
      ],
      rules: [
        "\uD654\uBA74\uC5D0 \uD45C\uC2DC\uB41C \uBB38\uC7A5\uC744 \uC624\uD0C0 \uC5C6\uC774 \uAC00\uC7A5 \uBE60\uB974\uAC8C \uC785\uB825\uD558\uB294 \uD50C\uB808\uC774\uC5B4\uAC00 \uC2B9\uB9AC\uD569\uB2C8\uB2E4.",
        "\uC815\uD655\uB3C4 100%\uB97C \uC720\uC9C0\uD574\uC57C \uB77C\uC6B4\uB4DC \uC2B9\uC810\uC744 \uC628\uC804\uD788 \uD68D\uB4DD\uD569\uB2C8\uB2E4."
      ],
      tip: "\uD0C0\uC774\uD551 \uC18D\uB3C4\uBCF4\uB2E4 \uC624\uD0C0\uB97C \uB0B4\uC9C0 \uC54A\uB294 \uAC83\uC774 \uBC31\uC2A4\uD398\uC774\uC2A4 \uC2DC\uAC04\uC744 \uC808\uC57D\uD558\uB294 \uBE44\uACB0\uC785\uB2C8\uB2E4."
    },
    colormatch: {
      title: "Color Match (\uCEEC\uB7EC \uB9E4\uCE58)",
      controls: [
        { key: "\uB9C8\uC6B0\uC2A4 \uD074\uB9AD \uB610\uB294 \uD0A4\uD328\uB4DC 1~4", desc: "\uC815\uB2F5 \uC0C9\uC0C1 \uBC84\uD2BC \uC120\uD0DD" }
      ],
      rules: [
        '\uC2A4\uD2B8\uB8F9(Stroop) \uD6A8\uACFC \uD6C8\uB828 \uAC8C\uC784\uC785\uB2C8\uB2E4. \uAE00\uC790\uC758 \uC758\uBBF8(\uC608: "\uD30C\uB791")\uAC00 \uC544\uB2CC \uC2E4\uC81C \uAE00\uC790 \uC0C9\uC0C1(\uC608: \uBE68\uAC04\uC0C9)\uC744 \uACE8\uB77C\uC57C \uD569\uB2C8\uB2E4.',
        "\uC81C\uD55C\uC2DC\uAC04 \uB0B4\uC5D0 \uC5F0\uC18D\uC73C\uB85C \uC62C\uBC14\uB978 \uC0C9\uC0C1\uC744 \uD074\uB9AD\uD560\uC218\uB85D \uCF64\uBCF4 \uC810\uC218\uAC00 \uB204\uC801\uB429\uB2C8\uB2E4."
      ],
      tip: "\uAE00\uC790\uB97C \uC18C\uB9AC \uB0B4\uC5B4 \uC77D\uC9C0 \uB9D0\uACE0, \uC2DC\uAC01\uC801\uC778 \uC0C9\uC0C1 \uC790\uCCB4\uC5D0\uB9CC \uC9D1\uC911\uD558\uC138\uC694."
    },
    connectfour: {
      title: "Connect Four (\uC0AC\uBAA9)",
      controls: [
        { key: "\uB9C8\uC6B0\uC2A4 \uD074\uB9AD", desc: "\uB514\uC2A4\uD06C\uB97C \uB5A8\uC5B4\uB728\uB9B4 \uC5F4(1~7\uC5F4) \uC120\uD0DD" }
      ],
      rules: [
        "\uC911\uB825\uC5D0 \uC758\uD574 \uB514\uC2A4\uD06C\uAC00 \uC544\uB798\uB85C \uB5A8\uC5B4\uC9C0\uB294 7\xD76 \uC218\uC9C1 \uACA9\uC790\uD310\uC785\uB2C8\uB2E4.",
        "\uC790\uC2E0\uC758 \uC0C9\uC0C1 \uB514\uC2A4\uD06C 4\uAC1C\uB97C \uAC00\uB85C, \uC138\uB85C, \uB610\uB294 \uB300\uAC01\uC120\uC73C\uB85C \uBA3C\uC800 \uC77C\uB82C\uB85C \uB9CC\uB4DC\uB294 \uCABD\uC774 \uC2B9\uB9AC\uD569\uB2C8\uB2E4."
      ],
      tip: "\uAC00\uC6B4\uB370 \uC5F4(4\uC5F4)\uC744 \uC120\uC810\uD558\uBA74 \uB354 \uB9CE\uC740 \uB300\uAC01\uC120 \uBC0F \uAC00\uB85C \uC5F0\uACB0 \uAE30\uD68C\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4."
    }
  };
  function GameLauncher({
    title,
    src,
    aspectRatio = "4:3",
    game = null,
    onClose,
    allowFullscreen = true
  }) {
    const iframeRef = A2(null);
    const [showGuide, setShowGuide] = d2(false);
    const { identity } = useGameIdentity();
    const effectiveSrc = T2(() => {
      if (!src) return "";
      try {
        const url = new URL(src, window.location.origin);
        url.searchParams.set("embed", "deck");
        if (identity?.nickname) {
          url.searchParams.set("nickname", identity.nickname);
        }
        if (identity?.guestId) {
          url.searchParams.set("guestId", identity.guestId);
        }
        return url.pathname + url.search;
      } catch {
        const sep = src.includes("?") ? "&" : "?";
        let res = `${src}${sep}embed=deck`;
        if (identity?.nickname) {
          res += `&nickname=${encodeURIComponent(identity.nickname)}`;
        }
        if (identity?.guestId) {
          res += `&guestId=${encodeURIComponent(identity.guestId)}`;
        }
        return res;
      }
    }, [src, identity?.nickname, identity?.guestId]);
    h2(() => {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.focus();
      }
      return () => {
        if (iframe) {
          try {
            iframe.src = "about:blank";
          } catch {
          }
        }
      };
    }, [effectiveSrc]);
    h2(() => {
      const handleKeyDown = (e3) => {
        if (e3.key === "Escape" && showGuide) {
          setShowGuide(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showGuide]);
    const handleFullscreen = () => {
      if (iframeRef.current?.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    };
    const gameKey = game?.id || "";
    const guideInfo = DEFAULT_GAME_GUIDES[gameKey] || {
      title: game?.name || title,
      controls: (game?.inputDevices || ["Keyboard", "Mouse"]).map((dev) => ({
        key: dev,
        desc: "\uAC8C\uC784 \uB0B4 \uC548\uB0B4 \uBC0F \uD654\uBA74 \uCEE8\uD2B8\uB864\uC744 \uB530\uB974\uC138\uC694."
      })),
      rules: [
        game?.description || "\uC2E4\uC2DC\uAC04 \uC810\uC218 \uBC0F \uC2B9\uD328\uAC00 \uC9D1\uACC4\uB418\uB294 \uC544\uCF00\uC774\uB4DC \uAC8C\uC784\uC785\uB2C8\uB2E4.",
        "\uC0C1\uB300\uBC29 \uB610\uB294 AI BOT\uBCF4\uB2E4 \uB192\uC740 \uC810\uC218\uB97C \uD68D\uB4DD\uD558\uAC70\uB098 \uCD5C\uD6C4\uAE4C\uC9C0 \uC0DD\uC874\uD558\uC138\uC694."
      ],
      tip: "\uADDC\uCE59\uC744 \uC219\uC9C0\uD558\uACE0 \uC0C1\uB300\uC758 \uC6C0\uC9C1\uC784\uC744 \uAD00\uCC30\uD558\uC5EC \uD50C\uB808\uC774\uD558\uC138\uC694."
    };
    return /* @__PURE__ */ u3("div", { className: "gb-launcher-frame-wrap", "data-aspect": aspectRatio, children: [
      /* @__PURE__ */ u3("div", { className: "gb-launcher-toolbar", children: [
        /* @__PURE__ */ u3("div", { className: "gb-launcher-left", children: [
          /* @__PURE__ */ u3("span", { className: "gb-launcher-led-dot" }),
          /* @__PURE__ */ u3("span", { className: "gb-launcher-title", children: title }),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: "gb-launcher-btn gb-launcher-btn-guide",
              onClick: () => setShowGuide(true),
              title: "\uAC8C\uC784 \uC870\uC791 \uBC29\uBC95 \uBC0F \uC0C1\uC138 \uADDC\uCE59 \uC548\uB0B4 \uBAA8\uB2EC \uC5F4\uAE30",
              children: "\u{1F4D6} \uC870\uC791\uBC95 & \uAC00\uC774\uB4DC"
            }
          )
        ] }),
        /* @__PURE__ */ u3("div", { className: "gb-launcher-actions", children: [
          identity?.nickname && /* @__PURE__ */ u3("span", { className: "gb-launcher-player-badge", title: "\uD604\uC7AC \uC5F0\uB3D9\uB41C \uD50C\uB808\uC774\uC5B4 \uB2C9\uB124\uC784", children: [
            "\u{1F464} ",
            identity.nickname
          ] }),
          allowFullscreen && /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: "gb-launcher-btn",
              onClick: handleFullscreen,
              title: "\uAC8C\uC784 \uC804\uCCB4 \uD654\uBA74\uC73C\uB85C \uC804\uD658",
              children: "\uC804\uCCB4\uD654\uBA74"
            }
          ),
          onClose && /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: "gb-launcher-btn gb-launcher-btn-close",
              onClick: onClose,
              title: "\uAC8C\uC784 \uC804\uC6D0 \uB044\uAE30 / \uD329 \uBD84\uB9AC",
              children: "\u2715 \uC804\uC6D0 \uB044\uAE30"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { className: "gb-launcher-stage-container", children: /* @__PURE__ */ u3(
        "iframe",
        {
          ref: iframeRef,
          src: effectiveSrc,
          title,
          className: "gb-launcher-iframe",
          allow: "autoplay; fullscreen"
        }
      ) }),
      showGuide && /* @__PURE__ */ u3(
        "div",
        {
          className: "gb-guide-modal-overlay",
          role: "dialog",
          "aria-modal": "true",
          onClick: () => setShowGuide(false),
          children: /* @__PURE__ */ u3(
            "div",
            {
              className: "gb-guide-modal-content",
              onClick: (e3) => e3.stopPropagation(),
              children: [
                /* @__PURE__ */ u3("div", { className: "gb-guide-modal-header", children: [
                  /* @__PURE__ */ u3("div", { className: "gb-guide-header-title", children: [
                    /* @__PURE__ */ u3("span", { className: "gb-guide-badge", children: "GAME MANUAL" }),
                    /* @__PURE__ */ u3("h3", { children: [
                      "\u{1F3AE} ",
                      guideInfo.title,
                      " \uC870\uC791\uBC95 & \uAC00\uC774\uB4DC"
                    ] })
                  ] }),
                  /* @__PURE__ */ u3(
                    "button",
                    {
                      type: "button",
                      className: "gb-guide-close-btn",
                      onClick: () => setShowGuide(false),
                      title: "\uB2EB\uAE30 (ESC)",
                      children: "\u2715"
                    }
                  )
                ] }),
                /* @__PURE__ */ u3("div", { className: "gb-guide-modal-body", children: [
                  /* @__PURE__ */ u3("section", { className: "gb-guide-section", children: [
                    /* @__PURE__ */ u3("h4", { children: "\u2328\uFE0F \uC870\uC791 \uBC29\uBC95" }),
                    /* @__PURE__ */ u3("div", { className: "gb-guide-key-list", children: guideInfo.controls.map((item, idx) => /* @__PURE__ */ u3("div", { className: "gb-guide-key-row", children: [
                      /* @__PURE__ */ u3("span", { className: "gb-guide-keycap", children: item.key }),
                      /* @__PURE__ */ u3("span", { className: "gb-guide-keydesc", children: item.desc })
                    ] }, idx)) })
                  ] }),
                  /* @__PURE__ */ u3("section", { className: "gb-guide-section", children: [
                    /* @__PURE__ */ u3("h4", { children: "\u{1F3AF} \uAC8C\uC784 \uADDC\uCE59 & \uC2B9\uB9AC \uC870\uAC74" }),
                    /* @__PURE__ */ u3("ul", { className: "gb-guide-rule-list", children: guideInfo.rules.map((rule, idx) => /* @__PURE__ */ u3("li", { children: rule }, idx)) })
                  ] }),
                  guideInfo.tip && /* @__PURE__ */ u3("section", { className: "gb-guide-section gb-guide-tip-box", children: [
                    /* @__PURE__ */ u3("strong", { children: "\u{1F4A1} \uD50C\uB808\uC774 \uD301:" }),
                    /* @__PURE__ */ u3("p", { children: guideInfo.tip })
                  ] }),
                  /* @__PURE__ */ u3("section", { className: "gb-guide-section gb-guide-identity-note", children: [
                    /* @__PURE__ */ u3("span", { className: "gb-note-icon", children: "\u{1F464}" }),
                    /* @__PURE__ */ u3("div", { children: [
                      /* @__PURE__ */ u3("strong", { children: "\uD50C\uB808\uC774\uC5B4 \uB2C9\uB124\uC784 \uC790\uB3D9 \uC5F0\uB3D9 \uC548\uB0B4" }),
                      /* @__PURE__ */ u3("p", { children: [
                        "\uD604\uC7AC \uD50C\uB808\uC774\uC5B4 ",
                        /* @__PURE__ */ u3("strong", { children: [
                          "[",
                          identity?.nickname || "\uAC8C\uC2A4\uD2B8",
                          "]"
                        ] }),
                        " \uB2D8\uC758 \uB2C9\uB124\uC784\uC774 \uAC8C\uC784 \uC138\uC158\uACFC \uB7AD\uD0B9\uC5D0 \uC790\uB3D9\uC73C\uB85C \uC5F0\uACB0\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4. \uBCC4\uB3C4\uC758 \uC785\uB825 \uC5C6\uC774 \uB300\uC804\uC744 \uC644\uB8CC\uD558\uBA74 \uC790\uB3D9\uC73C\uB85C \uC804\uC801\uC774 \uC800\uC7A5\uB429\uB2C8\uB2E4."
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ u3("div", { className: "gb-guide-modal-footer", children: /* @__PURE__ */ u3(
                  "button",
                  {
                    type: "button",
                    className: "gb-btn-guide-confirm",
                    onClick: () => setShowGuide(false),
                    children: "\uD655\uC778 / \uAC8C\uC784\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30 (ESC)"
                  }
                ) })
              ]
            }
          )
        }
      )
    ] });
  }

  // tool-box/src/features/game-box/deck/GameDeck.js
  function GameDeck({ onNavigate }) {
    const [selectedCategory, setSelectedCategory] = d2("all");
    const [searchQuery, setSearchQuery] = d2("");
    const [selectedGameId, setSelectedGameId] = d2(ARCADE_GAMES[0].id);
    const [isPlaying, setIsPlaying] = d2(false);
    const [deckRankings, setDeckRankings] = d2([]);
    const [loadingRankings, setLoadingRankings] = d2(false);
    const visibleGames = T2(
      () => filterDeckGames(selectedCategory, searchQuery),
      [selectedCategory, searchQuery]
    );
    const selectedGame = T2(
      () => ARCADE_GAMES.find((g4) => g4.id === selectedGameId) || ARCADE_GAMES[0],
      [selectedGameId]
    );
    const handleSelectCase = (gameId) => {
      if (gameId !== selectedGameId) {
        setIsPlaying(false);
        setSelectedGameId(gameId);
      }
    };
    h2(() => {
      let cancelled = false;
      setLoadingRankings(true);
      fetch(`/api/platform/rankings?gameId=${encodeURIComponent(selectedGame.id)}&includePractice=true`, {
        cache: "no-store"
      }).then((res) => res.ok ? res.json() : { individual: [] }).then((data) => {
        if (cancelled) return;
        setDeckRankings(Array.isArray(data.individual) ? data.individual.slice(0, 10) : []);
        setLoadingRankings(false);
      }).catch(() => {
        if (cancelled) return;
        setDeckRankings([]);
        setLoadingRankings(false);
      });
      return () => {
        cancelled = true;
      };
    }, [selectedGame.id]);
    return /* @__PURE__ */ u3("div", { className: "gb-deck-shell", children: [
      /* @__PURE__ */ u3("div", { className: "gb-subbar gb-subbar-dark", children: [
        /* @__PURE__ */ u3("div", { className: "gb-subbar-left", children: [
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: "gb-subbar-back",
              onClick: () => onNavigate("/game-box"),
              children: "\u2190 GAME-BOX \uD648\uC73C\uB85C"
            }
          ),
          /* @__PURE__ */ u3("span", { className: "gb-subbar-divider", children: "|" }),
          /* @__PURE__ */ u3("strong", { className: "gb-subbar-title", children: "GAME DECK \u2014 ARCADE COLLECTION" }),
          /* @__PURE__ */ u3("span", { className: "gb-subbar-hint", children: "\uC67C\uCABD \uCEEC\uB809\uC158\uC5D0\uC11C \uAC8C\uC784 \uCF00\uC774\uC2A4\uB97C \uC120\uD0DD\uD558\uACE0 \uCF58\uC194\uC758 [PLAY / \uB514\uC2A4\uD06C \uC0BD\uC785] \uBC84\uD2BC\uC744 \uB204\uB974\uC138\uC694." })
        ] }),
        /* @__PURE__ */ u3("div", { className: "gb-subbar-actions", children: /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            className: "gb-subbar-btn",
            onClick: () => onNavigate("/game-box/retro"),
            children: "\u{1FA9F} RETRO DESKTOP \uC774\uB3D9"
          }
        ) })
      ] }),
      /* @__PURE__ */ u3("div", { className: "gb-deck-grid", children: [
        /* @__PURE__ */ u3("aside", { className: "gb-deck-collection", children: [
          /* @__PURE__ */ u3("div", { className: "gb-deck-panel-header", children: [
            /* @__PURE__ */ u3("h2", { children: "GAME COLLECTION" }),
            /* @__PURE__ */ u3("span", { className: "gb-deck-badge", children: [
              visibleGames.length,
              " CASES"
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gb-deck-filters", children: [
            /* @__PURE__ */ u3("div", { className: "gb-deck-cat-row", children: GAME_DECK_CATEGORIES.map((cat) => /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                className: `gb-deck-cat-btn ${selectedCategory === cat.id ? "active" : ""}`,
                onClick: () => setSelectedCategory(cat.id),
                children: cat.label
              },
              cat.id
            )) }),
            /* @__PURE__ */ u3(
              "input",
              {
                type: "search",
                className: "gb-deck-search",
                placeholder: "\uAC8C\uC784\uD329 \uC774\uB984, \uCF54\uB4DC, \uC7A5\uB974 \uAC80\uC0C9...",
                value: searchQuery,
                onChange: (e3) => setSearchQuery(e3.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ u3("div", { className: "gb-case-shelf", children: visibleGames.map((game) => {
            const isSelected = game.id === selectedGame.id;
            return /* @__PURE__ */ u3(
              "button",
              {
                type: "button",
                className: `gb-game-case ${isSelected ? "selected" : ""}`,
                style: { "--case-accent": game.caseColor },
                onClick: () => handleSelectCase(game.id),
                children: [
                  /* @__PURE__ */ u3("div", { className: "gb-case-spine", children: /* @__PURE__ */ u3("span", { className: "gb-case-code", children: game.discLabel }) }),
                  /* @__PURE__ */ u3("div", { className: "gb-case-body", children: [
                    /* @__PURE__ */ u3("div", { className: "gb-case-top", children: [
                      /* @__PURE__ */ u3("span", { className: "gb-case-genre", children: game.genre }),
                      /* @__PURE__ */ u3("span", { className: "gb-case-players", children: game.playersLabel })
                    ] }),
                    /* @__PURE__ */ u3("strong", { className: "gb-case-title", children: game.name }),
                    /* @__PURE__ */ u3("span", { className: "gb-case-sub", children: game.subtitle })
                  ] })
                ]
              },
              game.id
            );
          }) })
        ] }),
        /* @__PURE__ */ u3("section", { className: "gb-deck-console-zone", children: /* @__PURE__ */ u3("div", { className: "gb-console-unit", children: [
          /* @__PURE__ */ u3("div", { className: "gb-console-hardware-bar", children: [
            /* @__PURE__ */ u3("div", { className: "gb-console-led-group", children: [
              /* @__PURE__ */ u3("span", { className: `gb-console-led ${isPlaying ? "on" : "standby"}` }),
              /* @__PURE__ */ u3("span", { className: "gb-console-model", children: [
                "TOOL-BOX ARCADE DECK // ",
                selectedGame.discLabel
              ] })
            ] }),
            /* @__PURE__ */ u3("div", { className: "gb-console-slot-status", children: isPlaying ? "DISC INSERTED \xB7 RUNNING" : "READY TO INSERT PACK" })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gb-console-screen", children: isPlaying ? /* @__PURE__ */ u3(
            GameLauncher,
            {
              title: selectedGame.name,
              src: selectedGame.launchUrl,
              aspectRatio: selectedGame.aspectRatio,
              game: selectedGame,
              onClose: () => setIsPlaying(false)
            }
          ) : /* @__PURE__ */ u3("div", { className: "gb-console-preview", children: [
            /* @__PURE__ */ u3("div", { className: "gb-console-disc-preview", style: { "--case-accent": selectedGame.caseColor }, children: /* @__PURE__ */ u3("div", { className: "gb-disc-ring", children: [
              /* @__PURE__ */ u3("span", { className: "gb-disc-code", children: selectedGame.discLabel }),
              /* @__PURE__ */ u3("strong", { children: selectedGame.name }),
              /* @__PURE__ */ u3("span", { children: selectedGame.genre })
            ] }) }),
            /* @__PURE__ */ u3("div", { className: "gb-console-preview-info", children: [
              /* @__PURE__ */ u3("span", { className: "gb-preview-kicker", children: [
                selectedGame.genre,
                " \xB7 ",
                selectedGame.playersLabel
              ] }),
              /* @__PURE__ */ u3("h3", { children: selectedGame.name }),
              /* @__PURE__ */ u3("p", { children: selectedGame.description }),
              /* @__PURE__ */ u3("div", { className: "gb-console-action-row", children: [
                /* @__PURE__ */ u3(
                  "button",
                  {
                    type: "button",
                    className: "gb-btn-insert-play",
                    onClick: () => setIsPlaying(true),
                    children: "\u25B6 PLAY (\uAC8C\uC784\uD329 \uC0BD\uC785 \uBC0F \uC989\uC2DC \uC2E4\uD589)"
                  }
                ),
                /* @__PURE__ */ u3(
                  "a",
                  {
                    href: selectedGame.multiplayerUrl || selectedGame.launchUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "gb-btn-standalone",
                    children: "\u2197 \uB3C5\uB9BD \uCC3D\uC73C\uB85C \uC5F4\uAE30"
                  }
                )
              ] })
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ u3("aside", { className: "gb-deck-ranking-zone", children: [
          /* @__PURE__ */ u3("div", { className: "gb-deck-panel-header", children: [
            /* @__PURE__ */ u3("h2", { children: "GAME RANKING & SPEC" }),
            /* @__PURE__ */ u3("span", { className: "gb-deck-badge", children: "TOP 10" })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gb-deck-spec-card", children: [
            /* @__PURE__ */ u3("div", { className: "gb-spec-row", children: [
              /* @__PURE__ */ u3("span", { children: "\uAC8C\uC784\uBA85" }),
              /* @__PURE__ */ u3("strong", { children: selectedGame.name })
            ] }),
            /* @__PURE__ */ u3("div", { className: "gb-spec-row", children: [
              /* @__PURE__ */ u3("span", { children: "\uD50C\uB808\uC774 \uC778\uC6D0" }),
              /* @__PURE__ */ u3("strong", { children: selectedGame.playersLabel })
            ] }),
            /* @__PURE__ */ u3("div", { className: "gb-spec-row", children: [
              /* @__PURE__ */ u3("span", { children: "\uD654\uBA74 \uBE44\uC728 / \uC785\uB825" }),
              /* @__PURE__ */ u3("strong", { children: [
                selectedGame.aspectRatio,
                " \xB7 ",
                selectedGame.inputDevices.join(", ")
              ] })
            ] }),
            /* @__PURE__ */ u3("div", { className: "gb-spec-row", children: [
              /* @__PURE__ */ u3("span", { children: "\uC2E4\uD589 URL" }),
              /* @__PURE__ */ u3("code", { children: selectedGame.launchUrl })
            ] }),
            /* @__PURE__ */ u3("div", { className: "gb-spec-row", children: [
              /* @__PURE__ */ u3("span", { children: "\uAE30\uB85D \uC5F0\uB3D9" }),
              /* @__PURE__ */ u3("span", { children: selectedGame.eventSupport })
            ] })
          ] }),
          /* @__PURE__ */ u3("div", { className: "gb-deck-ranking-box", children: [
            /* @__PURE__ */ u3("h3", { children: [
              "\u{1F3C6} ",
              selectedGame.name,
              " TOP 10"
            ] }),
            loadingRankings ? /* @__PURE__ */ u3("div", { className: "gb-deck-empty", children: "\uB7AD\uD0B9 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911..." }) : deckRankings.length === 0 ? /* @__PURE__ */ u3("div", { className: "gb-deck-empty", children: [
              "\uC544\uC9C1 \uC774 \uAC8C\uC784\uC758 \uB300\uC804 \uC644\uB8CC \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
              /* @__PURE__ */ u3("br", {}),
              "\uAC8C\uC784\uC744 \uD50C\uB808\uC774\uD558\uBA74 \uC21C\uC704\uAC00 \uC9D1\uACC4\uB429\uB2C8\uB2E4."
            ] }) : /* @__PURE__ */ u3("table", { className: "gb-deck-table", children: [
              /* @__PURE__ */ u3("thead", { children: /* @__PURE__ */ u3("tr", { children: [
                /* @__PURE__ */ u3("th", { children: "\uC21C\uC704" }),
                /* @__PURE__ */ u3("th", { children: "\uD50C\uB808\uC774\uC5B4" }),
                /* @__PURE__ */ u3("th", { children: "\uC2B9/\uD328" }),
                /* @__PURE__ */ u3("th", { children: "\uCD5C\uACE0\uC810" })
              ] }) }),
              /* @__PURE__ */ u3("tbody", { children: deckRankings.map((row, idx) => /* @__PURE__ */ u3("tr", { children: [
                /* @__PURE__ */ u3("td", { children: [
                  "#",
                  idx + 1
                ] }),
                /* @__PURE__ */ u3("td", { children: row.name }),
                /* @__PURE__ */ u3("td", { children: [
                  row.wins,
                  "\uC2B9 ",
                  row.losses,
                  "\uD328"
                ] }),
                /* @__PURE__ */ u3("td", { children: Math.round(row.bestScore || 0).toLocaleString() })
              ] }, row.userId || idx)) })
            ] })
          ] })
        ] })
      ] })
    ] });
  }

  // tool-box/src/features/game-box/GameBox.js
  function normalizeRoutePath(pathname) {
    const clean = String(pathname || "/game-box").replace(/\/+$/, "") || "/game-box";
    if (clean === "/game-box/retro") return "/game-box/retro";
    if (clean === "/game-box/deck") return "/game-box/deck";
    return "/game-box";
  }
  function NicknameModal() {
    const {
      identity,
      isNicknameModalOpen,
      closeNicknameModal,
      registerOrChangeNickname,
      syncError
    } = useGameIdentity();
    const [inputValue, setInputValue] = d2(identity.nickname || "");
    const [localError, setLocalError] = d2(null);
    const [submitting, setSubmitting] = d2(false);
    h2(() => {
      if (isNicknameModalOpen) {
        setInputValue(identity.nickname || "");
        setLocalError(null);
      }
    }, [isNicknameModalOpen, identity.nickname]);
    if (!isNicknameModalOpen) return null;
    const handleSubmit = async (e3) => {
      e3.preventDefault();
      setLocalError(null);
      setSubmitting(true);
      const res = await registerOrChangeNickname(inputValue);
      setSubmitting(false);
      if (!res.ok) {
        setLocalError(res.error);
      }
    };
    return /* @__PURE__ */ u3("div", { className: "gb-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-labelledby": "gb-nick-modal-title", children: /* @__PURE__ */ u3("form", { className: "gb-modal-card", onSubmit: handleSubmit, children: [
      /* @__PURE__ */ u3("h3", { id: "gb-nick-modal-title", children: identity.isRegistered ? "\uD50C\uB808\uC774\uC5B4 \uB2C9\uB124\uC784 \uBCC0\uACBD" : "GAME-BOX \uD50C\uB808\uC774\uC5B4 \uB2C9\uB124\uC784 \uB4F1\uB85D" }),
      /* @__PURE__ */ u3("p", { children: identity.isRegistered ? "\uBCC0\uACBD\uD560 \uB2C9\uB124\uC784\uC744 \uC785\uB825\uD558\uC138\uC694. \uACE0\uC720 \uC2DD\uBCC4\uC790(guestId)\uAC00 \uC720\uC9C0\uB418\uBBC0\uB85C \uAE30\uC874 \uAC8C\uC784 \uAE30\uB85D\uACFC \uB7AD\uD0B9 \uC5F0\uACB0\uC774 \uADF8\uB300\uB85C \uBCF4\uC874\uB429\uB2C8\uB2E4." : "\uAC8C\uC784\uC744 \uC2DC\uC791\uD558\uAE30 \uC804\uC5D0 \uB7AD\uD0B9 \uBC0F \uAE30\uB85D \uC800\uC7A5\uC5D0 \uC0AC\uC6A9\uD560 \uB2C9\uB124\uC784(2~16\uC790)\uC744 \uB4F1\uB85D\uD574\uC8FC\uC138\uC694. \uD55C \uBC88 \uB4F1\uB85D\uD558\uBA74 \uB2E4\uC74C \uC811\uC18D\uBD80\uD130 \uC790\uB3D9 \uB85C\uADF8\uC778\uB429\uB2C8\uB2E4." }),
      /* @__PURE__ */ u3(
        "input",
        {
          type: "text",
          className: "gb-modal-input",
          value: inputValue,
          onChange: (e3) => setInputValue(e3.target.value),
          placeholder: "\uB2C9\uB124\uC784 \uC785\uB825 (\uD55C\uAE00, \uC601\uBB38, \uC22B\uC790 2~16\uC790)",
          maxLength: 16,
          autoFocus: true
        }
      ),
      (localError || syncError) && /* @__PURE__ */ u3("div", { className: "gb-modal-error", role: "alert", children: localError || syncError }),
      /* @__PURE__ */ u3("div", { className: "gb-modal-meta", children: [
        "\uACE0\uC720 \uC2DD\uBCC4\uC790 (guestId): ",
        identity.guestId
      ] }),
      /* @__PURE__ */ u3("div", { className: "gb-modal-actions", children: [
        identity.isRegistered && /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            className: "gb-modal-btn-secondary",
            onClick: closeNicknameModal,
            disabled: submitting,
            children: "\uCDE8\uC18C"
          }
        ),
        /* @__PURE__ */ u3(
          "button",
          {
            type: "submit",
            className: "gb-modal-btn-primary",
            disabled: submitting,
            children: submitting ? "\uC800\uC7A5 \uC911..." : identity.isRegistered ? "\uB2C9\uB124\uC784 \uBCC0\uACBD \uC800\uC7A5" : "\uB2C9\uB124\uC784 \uB4F1\uB85D \uBC0F \uC2DC\uC791"
          }
        )
      ] })
    ] }) });
  }
  function GameBoxInner({ initialRoute }) {
    const { identity, openNicknameModal } = useGameIdentity();
    const [route, setRoute] = d2(
      () => normalizeRoutePath(initialRoute || (typeof window !== "undefined" ? window.location.pathname : "/game-box"))
    );
    const navigate = q2((targetPath) => {
      const normalized = normalizeRoutePath(targetPath);
      if (typeof window !== "undefined" && window.location.pathname !== normalized) {
        window.history.pushState({}, "", normalized);
      }
      setRoute(normalized);
    }, []);
    h2(() => {
      if (typeof window === "undefined") return void 0;
      const onPopState = () => {
        setRoute(normalizeRoutePath(window.location.pathname));
      };
      window.addEventListener("popstate", onPopState);
      return () => window.removeEventListener("popstate", onPopState);
    }, []);
    h2(() => {
      const bridge = new GameEventBridge({
        getIdentity: () => identity
      });
      bridge.start();
      return () => bridge.stop();
    }, [identity]);
    return /* @__PURE__ */ u3("div", { className: "gb-shell", children: [
      /* @__PURE__ */ u3("header", { className: "gb-main-header", children: [
        /* @__PURE__ */ u3(
          "div",
          {
            className: "gb-header-brand",
            onClick: () => navigate("/game-box"),
            role: "button",
            tabIndex: 0,
            onKeyDown: (e3) => e3.key === "Enter" && navigate("/game-box"),
            children: [
              /* @__PURE__ */ u3("span", { className: "gb-header-badge", children: "TOOL BOX" }),
              /* @__PURE__ */ u3("h1", { className: "gb-header-title", children: "GAME-BOX" })
            ]
          }
        ),
        /* @__PURE__ */ u3("nav", { className: "gb-header-nav", "aria-label": "GAME-BOX \uACF5\uAC04 \uC774\uB3D9", children: [
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: `gb-header-tab ${route === "/game-box" ? "active" : ""}`,
              onClick: () => navigate("/game-box"),
              children: "HOME"
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: `gb-header-tab ${route === "/game-box/retro" ? "active" : ""}`,
              onClick: () => navigate("/game-box/retro"),
              children: "RETRO DESKTOP (Win98)"
            }
          ),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: `gb-header-tab ${route === "/game-box/deck" ? "active" : ""}`,
              onClick: () => navigate("/game-box/deck"),
              children: "GAME DECK (Arcade)"
            }
          )
        ] }),
        /* @__PURE__ */ u3("div", { className: "gb-header-identity", children: [
          /* @__PURE__ */ u3("div", { className: "gb-identity-pill", title: `\uACE0\uC720 ID: ${identity.guestId}`, children: [
            /* @__PURE__ */ u3("span", { children: "\u{1F464}" }),
            /* @__PURE__ */ u3("strong", { children: identity.nickname || "\uB2C9\uB124\uC784 \uBBF8\uB4F1\uB85D" }),
            /* @__PURE__ */ u3("span", { className: "gb-identity-guest-tag", children: identity.identityType === "authenticated" ? "SSO" : "GUEST" })
          ] }),
          /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              className: "gb-identity-edit-btn",
              onClick: openNicknameModal,
              children: "\uB2C9\uB124\uC784 \uBCC0\uACBD"
            }
          )
        ] })
      ] }),
      route === "/game-box/retro" ? /* @__PURE__ */ u3(RetroDesktop, { onNavigate: navigate }) : route === "/game-box/deck" ? /* @__PURE__ */ u3(GameDeck, { onNavigate: navigate }) : /* @__PURE__ */ u3(GameBoxHome, { onNavigate: navigate }),
      /* @__PURE__ */ u3(NicknameModal, {})
    ] });
  }
  function GameBox({ identityAdapter = null, initialRoute = null }) {
    return /* @__PURE__ */ u3(GameIdentityProvider, { adapter: identityAdapter, children: /* @__PURE__ */ u3(GameBoxInner, { initialRoute }) });
  }

  // tool-box/src/features/game-box/standalone-entry.jsx
  function mountGameBoxApp(containerEl, props = {}) {
    const root = createRoot(containerEl);
    root.render(/* @__PURE__ */ u3(GameBox, { ...props }));
    return () => root.unmount();
  }
  if (typeof document !== "undefined") {
    const autoRoot = document.getElementById("game-box-root");
    if (autoRoot) {
      mountGameBoxApp(autoRoot);
    }
  }
  return __toCommonJS(standalone_entry_exports);
})();
