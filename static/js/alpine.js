;(() => {
    var Ze = !1,
        Qe = !1,
        V = [],
        et = -1
    function Kt(e) {
        bn(e)
    }
    function bn(e) {
        V.includes(e) || V.push(e), wn()
    }
    function we(e) {
        let t = V.indexOf(e)
        t !== -1 && t > et && V.splice(t, 1)
    }
    function wn() {
        !Qe && !Ze && ((Ze = !0), queueMicrotask(En))
    }
    function En() {
        ;(Ze = !1), (Qe = !0)
        for (let e = 0; e < V.length; e++) V[e](), (et = e)
        ;(V.length = 0), (et = -1), (Qe = !1)
    }
    var T,
        D,
        L,
        rt,
        tt = !0
    function zt(e) {
        ;(tt = !1), e(), (tt = !0)
    }
    function Ht(e) {
        ;(T = e.reactive),
            (L = e.release),
            (D = (t) =>
                e.effect(t, {
                    scheduler: (r) => {
                        tt ? Kt(r) : r()
                    },
                })),
            (rt = e.raw)
    }
    function nt(e) {
        D = e
    }
    function Vt(e) {
        let t = () => {}
        return [
            (n) => {
                let i = D(n)
                return (
                    e._x_effects ||
                        ((e._x_effects = new Set()),
                        (e._x_runEffects = () => {
                            e._x_effects.forEach((o) => o())
                        })),
                    e._x_effects.add(i),
                    (t = () => {
                        i !== void 0 && (e._x_effects.delete(i), L(i))
                    }),
                    i
                )
            },
            () => {
                t()
            },
        ]
    }
    function q(e, t, r = {}) {
        e.dispatchEvent(
            new CustomEvent(t, {
                detail: r,
                bubbles: !0,
                composed: !0,
                cancelable: !0,
            }),
        )
    }
    function O(e, t) {
        if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
            Array.from(e.children).forEach((i) => O(i, t))
            return
        }
        let r = !1
        if ((t(e, () => (r = !0)), r)) return
        let n = e.firstElementChild
        for (; n; ) O(n, t, !1), (n = n.nextElementSibling)
    }
    function S(e, ...t) {
        console.warn(`Alpine Warning: ${e}`, ...t)
    }
    var qt = !1
    function Ut() {
        qt &&
            S(
                "Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.",
            ),
            (qt = !0),
            document.body ||
                S(
                    "Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?",
                ),
            q(document, "alpine:init"),
            q(document, "alpine:initializing"),
            ce(),
            Qt((t) => v(t, O)),
            Q((t) => ae(t)),
            Se((t, r) => {
                le(t, r).forEach((n) => n())
            })
        let e = (t) => !U(t.parentElement, !0)
        Array.from(document.querySelectorAll(Jt()))
            .filter(e)
            .forEach((t) => {
                v(t)
            }),
            q(document, "alpine:initialized")
    }
    var it = [],
        Wt = []
    function Gt() {
        return it.map((e) => e())
    }
    function Jt() {
        return it.concat(Wt).map((e) => e())
    }
    function Ee(e) {
        it.push(e)
    }
    function ve(e) {
        Wt.push(e)
    }
    function U(e, t = !1) {
        return Z(e, (r) => {
            if ((t ? Jt() : Gt()).some((i) => r.matches(i))) return !0
        })
    }
    function Z(e, t) {
        if (e) {
            if (t(e)) return e
            if (
                (e._x_teleportBack && (e = e._x_teleportBack),
                !!e.parentElement)
            )
                return Z(e.parentElement, t)
        }
    }
    function Yt(e) {
        return Gt().some((t) => e.matches(t))
    }
    var Xt = []
    function Zt(e) {
        Xt.push(e)
    }
    function v(e, t = O, r = () => {}) {
        tr(() => {
            t(e, (n, i) => {
                r(n, i),
                    Xt.forEach((o) => o(n, i)),
                    le(n, n.attributes).forEach((o) => o()),
                    n._x_ignore && i()
            })
        })
    }
    function ae(e) {
        O(e, (t) => {
            ot(t), er(t)
        })
    }
    var rr = [],
        nr = [],
        ir = []
    function Qt(e) {
        ir.push(e)
    }
    function Q(e, t) {
        typeof t == "function"
            ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t))
            : ((t = e), nr.push(t))
    }
    function Se(e) {
        rr.push(e)
    }
    function Oe(e, t, r) {
        e._x_attributeCleanups || (e._x_attributeCleanups = {}),
            e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []),
            e._x_attributeCleanups[t].push(r)
    }
    function ot(e, t) {
        e._x_attributeCleanups &&
            Object.entries(e._x_attributeCleanups).forEach(([r, n]) => {
                ;(t === void 0 || t.includes(r)) &&
                    (n.forEach((i) => i()), delete e._x_attributeCleanups[r])
            })
    }
    function er(e) {
        if (e._x_cleanups) for (; e._x_cleanups.length; ) e._x_cleanups.pop()()
    }
    var at = new MutationObserver(ft),
        ct = !1
    function ce() {
        at.observe(document, {
            subtree: !0,
            childList: !0,
            attributes: !0,
            attributeOldValue: !0,
        }),
            (ct = !0)
    }
    function lt() {
        vn(), at.disconnect(), (ct = !1)
    }
    var ue = [],
        st = !1
    function vn() {
        ;(ue = ue.concat(at.takeRecords())),
            ue.length &&
                !st &&
                ((st = !0),
                queueMicrotask(() => {
                    Sn(), (st = !1)
                }))
    }
    function Sn() {
        ft(ue), (ue.length = 0)
    }
    function h(e) {
        if (!ct) return e()
        lt()
        let t = e()
        return ce(), t
    }
    var ut = !1,
        Ae = []
    function or() {
        ut = !0
    }
    function sr() {
        ;(ut = !1), ft(Ae), (Ae = [])
    }
    function ft(e) {
        if (ut) {
            Ae = Ae.concat(e)
            return
        }
        let t = [],
            r = [],
            n = new Map(),
            i = new Map()
        for (let o = 0; o < e.length; o++)
            if (
                !e[o].target._x_ignoreMutationObserver &&
                (e[o].type === "childList" &&
                    (e[o].addedNodes.forEach(
                        (s) => s.nodeType === 1 && t.push(s),
                    ),
                    e[o].removedNodes.forEach(
                        (s) => s.nodeType === 1 && r.push(s),
                    )),
                e[o].type === "attributes")
            ) {
                let s = e[o].target,
                    a = e[o].attributeName,
                    c = e[o].oldValue,
                    l = () => {
                        n.has(s) || n.set(s, []),
                            n.get(s).push({ name: a, value: s.getAttribute(a) })
                    },
                    u = () => {
                        i.has(s) || i.set(s, []), i.get(s).push(a)
                    }
                s.hasAttribute(a) && c === null
                    ? l()
                    : s.hasAttribute(a)
                    ? (u(), l())
                    : u()
            }
        i.forEach((o, s) => {
            ot(s, o)
        }),
            n.forEach((o, s) => {
                rr.forEach((a) => a(s, o))
            })
        for (let o of r) t.includes(o) || (nr.forEach((s) => s(o)), ae(o))
        t.forEach((o) => {
            ;(o._x_ignoreSelf = !0), (o._x_ignore = !0)
        })
        for (let o of t)
            r.includes(o) ||
                (o.isConnected &&
                    (delete o._x_ignoreSelf,
                    delete o._x_ignore,
                    ir.forEach((s) => s(o)),
                    (o._x_ignore = !0),
                    (o._x_ignoreSelf = !0)))
        t.forEach((o) => {
            delete o._x_ignoreSelf, delete o._x_ignore
        }),
            (t = null),
            (r = null),
            (n = null),
            (i = null)
    }
    function Ce(e) {
        return F($(e))
    }
    function N(e, t, r) {
        return (
            (e._x_dataStack = [t, ...$(r || e)]),
            () => {
                e._x_dataStack = e._x_dataStack.filter((n) => n !== t)
            }
        )
    }
    function $(e) {
        return e._x_dataStack
            ? e._x_dataStack
            : typeof ShadowRoot == "function" && e instanceof ShadowRoot
            ? $(e.host)
            : e.parentNode
            ? $(e.parentNode)
            : []
    }
    function F(e) {
        let t = new Proxy(
            {},
            {
                ownKeys: () =>
                    Array.from(new Set(e.flatMap((r) => Object.keys(r)))),
                has: (r, n) => e.some((i) => i.hasOwnProperty(n)),
                get: (r, n) =>
                    (e.find((i) => {
                        if (i.hasOwnProperty(n)) {
                            let o = Object.getOwnPropertyDescriptor(i, n)
                            if (
                                (o.get && o.get._x_alreadyBound) ||
                                (o.set && o.set._x_alreadyBound)
                            )
                                return !0
                            if ((o.get || o.set) && o.enumerable) {
                                let s = o.get,
                                    a = o.set,
                                    c = o
                                ;(s = s && s.bind(t)),
                                    (a = a && a.bind(t)),
                                    s && (s._x_alreadyBound = !0),
                                    a && (a._x_alreadyBound = !0),
                                    Object.defineProperty(i, n, {
                                        ...c,
                                        get: s,
                                        set: a,
                                    })
                            }
                            return !0
                        }
                        return !1
                    }) || {})[n],
                set: (r, n, i) => {
                    let o = e.find((s) => s.hasOwnProperty(n))
                    return o ? (o[n] = i) : (e[e.length - 1][n] = i), !0
                },
            },
        )
        return t
    }
    function Te(e) {
        let t = (n) => typeof n == "object" && !Array.isArray(n) && n !== null,
            r = (n, i = "") => {
                Object.entries(Object.getOwnPropertyDescriptors(n)).forEach(
                    ([o, { value: s, enumerable: a }]) => {
                        if (a === !1 || s === void 0) return
                        let c = i === "" ? o : `${i}.${o}`
                        typeof s == "object" && s !== null && s._x_interceptor
                            ? (n[o] = s.initialize(e, c, o))
                            : t(s) &&
                              s !== n &&
                              !(s instanceof Element) &&
                              r(s, c)
                    },
                )
            }
        return r(e)
    }
    function Re(e, t = () => {}) {
        let r = {
            initialValue: void 0,
            _x_interceptor: !0,
            initialize(n, i, o) {
                return e(
                    this.initialValue,
                    () => An(n, i),
                    (s) => dt(n, i, s),
                    i,
                    o,
                )
            },
        }
        return (
            t(r),
            (n) => {
                if (typeof n == "object" && n !== null && n._x_interceptor) {
                    let i = r.initialize.bind(r)
                    r.initialize = (o, s, a) => {
                        let c = n.initialize(o, s, a)
                        return (r.initialValue = c), i(o, s, a)
                    }
                } else r.initialValue = n
                return r
            }
        )
    }
    function An(e, t) {
        return t.split(".").reduce((r, n) => r[n], e)
    }
    function dt(e, t, r) {
        if ((typeof t == "string" && (t = t.split(".")), t.length === 1))
            e[t[0]] = r
        else {
            if (t.length === 0) throw error
            return e[t[0]] || (e[t[0]] = {}), dt(e[t[0]], t.slice(1), r)
        }
    }
    var ar = {}
    function y(e, t) {
        ar[e] = t
    }
    function fe(e, t) {
        return (
            Object.entries(ar).forEach(([r, n]) => {
                let i = null
                function o() {
                    if (i) return i
                    {
                        let [s, a] = pt(t)
                        return (i = { interceptor: Re, ...s }), Q(t, a), i
                    }
                }
                Object.defineProperty(e, `$${r}`, {
                    get() {
                        return n(t, o())
                    },
                    enumerable: !1,
                })
            }),
            e
        )
    }
    function cr(e, t, r, ...n) {
        try {
            return r(...n)
        } catch (i) {
            ee(i, e, t)
        }
    }
    function ee(e, t, r = void 0) {
        Object.assign(e, { el: t, expression: r }),
            console.warn(
                `Alpine Expression Error: ${e.message}

${
    r
        ? 'Expression: "' +
          r +
          `"

`
        : ""
}`,
                t,
            ),
            setTimeout(() => {
                throw e
            }, 0)
    }
    var Me = !0
    function Pe(e) {
        let t = Me
        Me = !1
        let r = e()
        return (Me = t), r
    }
    function R(e, t, r = {}) {
        let n
        return x(e, t)((i) => (n = i), r), n
    }
    function x(...e) {
        return lr(...e)
    }
    var lr = ht
    function ur(e) {
        lr = e
    }
    function ht(e, t) {
        let r = {}
        fe(r, e)
        let n = [r, ...$(e)],
            i = typeof t == "function" ? On(n, t) : Tn(n, t, e)
        return cr.bind(null, e, t, i)
    }
    function On(e, t) {
        return (r = () => {}, { scope: n = {}, params: i = [] } = {}) => {
            let o = t.apply(F([n, ...e]), i)
            Ne(r, o)
        }
    }
    var mt = {}
    function Cn(e, t) {
        if (mt[e]) return mt[e]
        let r = Object.getPrototypeOf(async function () {}).constructor,
            n =
                /^[\n\s]*if.*\(.*\)/.test(e.trim()) ||
                /^(let|const)\s/.test(e.trim())
                    ? `(async()=>{ ${e} })()`
                    : e,
            o = (() => {
                try {
                    return new r(
                        ["__self", "scope"],
                        `with (scope) { __self.result = ${n} }; __self.finished = true; return __self.result;`,
                    )
                } catch (s) {
                    return ee(s, t, e), Promise.resolve()
                }
            })()
        return (mt[e] = o), o
    }
    function Tn(e, t, r) {
        let n = Cn(t, r)
        return (i = () => {}, { scope: o = {}, params: s = [] } = {}) => {
            ;(n.result = void 0), (n.finished = !1)
            let a = F([o, ...e])
            if (typeof n == "function") {
                let c = n(n, a).catch((l) => ee(l, r, t))
                n.finished
                    ? (Ne(i, n.result, a, s, r), (n.result = void 0))
                    : c
                          .then((l) => {
                              Ne(i, l, a, s, r)
                          })
                          .catch((l) => ee(l, r, t))
                          .finally(() => (n.result = void 0))
            }
        }
    }
    function Ne(e, t, r, n, i) {
        if (Me && typeof t == "function") {
            let o = t.apply(r, n)
            o instanceof Promise
                ? o.then((s) => Ne(e, s, r, n)).catch((s) => ee(s, i, t))
                : e(o)
        } else
            typeof t == "object" && t instanceof Promise
                ? t.then((o) => e(o))
                : e(t)
    }
    var yt = "x-"
    function C(e = "") {
        return yt + e
    }
    function fr(e) {
        yt = e
    }
    var _t = {}
    function p(e, t) {
        return (
            (_t[e] = t),
            {
                before(r) {
                    if (!_t[r]) {
                        console.warn(
                            "Cannot find directive `${directive}`. `${name}` will use the default order of execution",
                        )
                        return
                    }
                    let n = W.indexOf(r)
                    W.splice(n >= 0 ? n : W.indexOf("DEFAULT"), 0, e)
                },
            }
        )
    }
    function le(e, t, r) {
        if (((t = Array.from(t)), e._x_virtualDirectives)) {
            let o = Object.entries(e._x_virtualDirectives).map(([a, c]) => ({
                    name: a,
                    value: c,
                })),
                s = bt(o)
            ;(o = o.map((a) =>
                s.find((c) => c.name === a.name)
                    ? { name: `x-bind:${a.name}`, value: `"${a.value}"` }
                    : a,
            )),
                (t = t.concat(o))
        }
        let n = {}
        return t
            .map(pr((o, s) => (n[o] = s)))
            .filter(hr)
            .map(Mn(n, r))
            .sort(Nn)
            .map((o) => Rn(e, o))
    }
    function bt(e) {
        return Array.from(e)
            .map(pr())
            .filter((t) => !hr(t))
    }
    var gt = !1,
        de = new Map(),
        dr = Symbol()
    function tr(e) {
        gt = !0
        let t = Symbol()
        ;(dr = t), de.set(t, [])
        let r = () => {
                for (; de.get(t).length; ) de.get(t).shift()()
                de.delete(t)
            },
            n = () => {
                ;(gt = !1), r()
            }
        e(r), n()
    }
    function pt(e) {
        let t = [],
            r = (a) => t.push(a),
            [n, i] = Vt(e)
        return (
            t.push(i),
            [
                {
                    Alpine: j,
                    effect: n,
                    cleanup: r,
                    evaluateLater: x.bind(x, e),
                    evaluate: R.bind(R, e),
                },
                () => t.forEach((a) => a()),
            ]
        )
    }
    function Rn(e, t) {
        let r = () => {},
            n = _t[t.type] || r,
            [i, o] = pt(e)
        Oe(e, t.original, o)
        let s = () => {
            e._x_ignore ||
                e._x_ignoreSelf ||
                (n.inline && n.inline(e, t, i),
                (n = n.bind(n, e, t, i)),
                gt ? de.get(dr).push(n) : n())
        }
        return (s.runCleanups = o), s
    }
    var De =
            (e, t) =>
            ({ name: r, value: n }) => (
                r.startsWith(e) && (r = r.replace(e, t)), { name: r, value: n }
            ),
        Ie = (e) => e
    function pr(e = () => {}) {
        return ({ name: t, value: r }) => {
            let { name: n, value: i } = mr.reduce((o, s) => s(o), {
                name: t,
                value: r,
            })
            return n !== t && e(n, t), { name: n, value: i }
        }
    }
    var mr = []
    function te(e) {
        mr.push(e)
    }
    function hr({ name: e }) {
        return _r().test(e)
    }
    var _r = () => new RegExp(`^${yt}([^:^.]+)\\b`)
    function Mn(e, t) {
        return ({ name: r, value: n }) => {
            let i = r.match(_r()),
                o = r.match(/:([a-zA-Z0-9\-:]+)/),
                s = r.match(/\.[^.\]]+(?=[^\]]*$)/g) || [],
                a = t || e[r] || r
            return {
                type: i ? i[1] : null,
                value: o ? o[1] : null,
                modifiers: s.map((c) => c.replace(".", "")),
                expression: n,
                original: a,
            }
        }
    }
    var xt = "DEFAULT",
        W = [
            "ignore",
            "ref",
            "data",
            "id",
            "bind",
            "init",
            "for",
            "model",
            "modelable",
            "transition",
            "show",
            "if",
            xt,
            "teleport",
        ]
    function Nn(e, t) {
        let r = W.indexOf(e.type) === -1 ? xt : e.type,
            n = W.indexOf(t.type) === -1 ? xt : t.type
        return W.indexOf(r) - W.indexOf(n)
    }
    var wt = [],
        Et = !1
    function re(e = () => {}) {
        return (
            queueMicrotask(() => {
                Et ||
                    setTimeout(() => {
                        ke()
                    })
            }),
            new Promise((t) => {
                wt.push(() => {
                    e(), t()
                })
            })
        )
    }
    function ke() {
        for (Et = !1; wt.length; ) wt.shift()()
    }
    function gr() {
        Et = !0
    }
    function pe(e, t) {
        return Array.isArray(t)
            ? xr(e, t.join(" "))
            : typeof t == "object" && t !== null
            ? Pn(e, t)
            : typeof t == "function"
            ? pe(e, t())
            : xr(e, t)
    }
    function xr(e, t) {
        let r = (o) => o.split(" ").filter(Boolean),
            n = (o) =>
                o
                    .split(" ")
                    .filter((s) => !e.classList.contains(s))
                    .filter(Boolean),
            i = (o) => (
                e.classList.add(...o),
                () => {
                    e.classList.remove(...o)
                }
            )
        return (t = t === !0 ? (t = "") : t || ""), i(n(t))
    }
    function Pn(e, t) {
        let r = (a) => a.split(" ").filter(Boolean),
            n = Object.entries(t)
                .flatMap(([a, c]) => (c ? r(a) : !1))
                .filter(Boolean),
            i = Object.entries(t)
                .flatMap(([a, c]) => (c ? !1 : r(a)))
                .filter(Boolean),
            o = [],
            s = []
        return (
            i.forEach((a) => {
                e.classList.contains(a) && (e.classList.remove(a), s.push(a))
            }),
            n.forEach((a) => {
                e.classList.contains(a) || (e.classList.add(a), o.push(a))
            }),
            () => {
                s.forEach((a) => e.classList.add(a)),
                    o.forEach((a) => e.classList.remove(a))
            }
        )
    }
    function G(e, t) {
        return typeof t == "object" && t !== null ? Dn(e, t) : In(e, t)
    }
    function Dn(e, t) {
        let r = {}
        return (
            Object.entries(t).forEach(([n, i]) => {
                ;(r[n] = e.style[n]),
                    n.startsWith("--") || (n = kn(n)),
                    e.style.setProperty(n, i)
            }),
            setTimeout(() => {
                e.style.length === 0 && e.removeAttribute("style")
            }),
            () => {
                G(e, r)
            }
        )
    }
    function In(e, t) {
        let r = e.getAttribute("style", t)
        return (
            e.setAttribute("style", t),
            () => {
                e.setAttribute("style", r || "")
            }
        )
    }
    function kn(e) {
        return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    }
    function me(e, t = () => {}) {
        let r = !1
        return function () {
            r ? t.apply(this, arguments) : ((r = !0), e.apply(this, arguments))
        }
    }
    p(
        "transition",
        (e, { value: t, modifiers: r, expression: n }, { evaluate: i }) => {
            typeof n == "function" && (n = i(n)),
                n !== !1 &&
                    (!n || typeof n == "boolean" ? $n(e, r, t) : Ln(e, n, t))
        },
    )
    function Ln(e, t, r) {
        yr(e, pe, ""),
            {
                enter: (i) => {
                    e._x_transition.enter.during = i
                },
                "enter-start": (i) => {
                    e._x_transition.enter.start = i
                },
                "enter-end": (i) => {
                    e._x_transition.enter.end = i
                },
                leave: (i) => {
                    e._x_transition.leave.during = i
                },
                "leave-start": (i) => {
                    e._x_transition.leave.start = i
                },
                "leave-end": (i) => {
                    e._x_transition.leave.end = i
                },
            }[r](t)
    }
    function $n(e, t, r) {
        yr(e, G)
        let n = !t.includes("in") && !t.includes("out") && !r,
            i = n || t.includes("in") || ["enter"].includes(r),
            o = n || t.includes("out") || ["leave"].includes(r)
        t.includes("in") &&
            !n &&
            (t = t.filter((g, b) => b < t.indexOf("out"))),
            t.includes("out") &&
                !n &&
                (t = t.filter((g, b) => b > t.indexOf("out")))
        let s = !t.includes("opacity") && !t.includes("scale"),
            a = s || t.includes("opacity"),
            c = s || t.includes("scale"),
            l = a ? 0 : 1,
            u = c ? he(t, "scale", 95) / 100 : 1,
            d = he(t, "delay", 0) / 1e3,
            m = he(t, "origin", "center"),
            w = "opacity, transform",
            k = he(t, "duration", 150) / 1e3,
            be = he(t, "duration", 75) / 1e3,
            f = "cubic-bezier(0.4, 0.0, 0.2, 1)"
        i &&
            ((e._x_transition.enter.during = {
                transformOrigin: m,
                transitionDelay: `${d}s`,
                transitionProperty: w,
                transitionDuration: `${k}s`,
                transitionTimingFunction: f,
            }),
            (e._x_transition.enter.start = {
                opacity: l,
                transform: `scale(${u})`,
            }),
            (e._x_transition.enter.end = {
                opacity: 1,
                transform: "scale(1)",
            })),
            o &&
                ((e._x_transition.leave.during = {
                    transformOrigin: m,
                    transitionDelay: `${d}s`,
                    transitionProperty: w,
                    transitionDuration: `${be}s`,
                    transitionTimingFunction: f,
                }),
                (e._x_transition.leave.start = {
                    opacity: 1,
                    transform: "scale(1)",
                }),
                (e._x_transition.leave.end = {
                    opacity: l,
                    transform: `scale(${u})`,
                }))
    }
    function yr(e, t, r = {}) {
        e._x_transition ||
            (e._x_transition = {
                enter: { during: r, start: r, end: r },
                leave: { during: r, start: r, end: r },
                in(n = () => {}, i = () => {}) {
                    Le(
                        e,
                        t,
                        {
                            during: this.enter.during,
                            start: this.enter.start,
                            end: this.enter.end,
                        },
                        n,
                        i,
                    )
                },
                out(n = () => {}, i = () => {}) {
                    Le(
                        e,
                        t,
                        {
                            during: this.leave.during,
                            start: this.leave.start,
                            end: this.leave.end,
                        },
                        n,
                        i,
                    )
                },
            })
    }
    window.Element.prototype._x_toggleAndCascadeWithTransitions = function (
        e,
        t,
        r,
        n,
    ) {
        let i =
                document.visibilityState === "visible"
                    ? requestAnimationFrame
                    : setTimeout,
            o = () => i(r)
        if (t) {
            e._x_transition && (e._x_transition.enter || e._x_transition.leave)
                ? e._x_transition.enter &&
                  (Object.entries(e._x_transition.enter.during).length ||
                      Object.entries(e._x_transition.enter.start).length ||
                      Object.entries(e._x_transition.enter.end).length)
                    ? e._x_transition.in(r)
                    : o()
                : e._x_transition
                ? e._x_transition.in(r)
                : o()
            return
        }
        ;(e._x_hidePromise = e._x_transition
            ? new Promise((s, a) => {
                  e._x_transition.out(
                      () => {},
                      () => s(n),
                  ),
                      e._x_transitioning.beforeCancel(() =>
                          a({ isFromCancelledTransition: !0 }),
                      )
              })
            : Promise.resolve(n)),
            queueMicrotask(() => {
                let s = br(e)
                s
                    ? (s._x_hideChildren || (s._x_hideChildren = []),
                      s._x_hideChildren.push(e))
                    : i(() => {
                          let a = (c) => {
                              let l = Promise.all([
                                  c._x_hidePromise,
                                  ...(c._x_hideChildren || []).map(a),
                              ]).then(([u]) => u())
                              return (
                                  delete c._x_hidePromise,
                                  delete c._x_hideChildren,
                                  l
                              )
                          }
                          a(e).catch((c) => {
                              if (!c.isFromCancelledTransition) throw c
                          })
                      })
            })
    }
    function br(e) {
        let t = e.parentNode
        if (t) return t._x_hidePromise ? t : br(t)
    }
    function Le(
        e,
        t,
        { during: r, start: n, end: i } = {},
        o = () => {},
        s = () => {},
    ) {
        if (
            (e._x_transitioning && e._x_transitioning.cancel(),
            Object.keys(r).length === 0 &&
                Object.keys(n).length === 0 &&
                Object.keys(i).length === 0)
        ) {
            o(), s()
            return
        }
        let a, c, l
        Fn(e, {
            start() {
                a = t(e, n)
            },
            during() {
                c = t(e, r)
            },
            before: o,
            end() {
                a(), (l = t(e, i))
            },
            after: s,
            cleanup() {
                c(), l()
            },
        })
    }
    function Fn(e, t) {
        let r,
            n,
            i,
            o = me(() => {
                h(() => {
                    ;(r = !0),
                        n || t.before(),
                        i || (t.end(), ke()),
                        t.after(),
                        e.isConnected && t.cleanup(),
                        delete e._x_transitioning
                })
            })
        ;(e._x_transitioning = {
            beforeCancels: [],
            beforeCancel(s) {
                this.beforeCancels.push(s)
            },
            cancel: me(function () {
                for (; this.beforeCancels.length; ) this.beforeCancels.shift()()
                o()
            }),
            finish: o,
        }),
            h(() => {
                t.start(), t.during()
            }),
            gr(),
            requestAnimationFrame(() => {
                if (r) return
                let s =
                        Number(
                            getComputedStyle(e)
                                .transitionDuration.replace(/,.*/, "")
                                .replace("s", ""),
                        ) * 1e3,
                    a =
                        Number(
                            getComputedStyle(e)
                                .transitionDelay.replace(/,.*/, "")
                                .replace("s", ""),
                        ) * 1e3
                s === 0 &&
                    (s =
                        Number(
                            getComputedStyle(e).animationDuration.replace(
                                "s",
                                "",
                            ),
                        ) * 1e3),
                    h(() => {
                        t.before()
                    }),
                    (n = !0),
                    requestAnimationFrame(() => {
                        r ||
                            (h(() => {
                                t.end()
                            }),
                            ke(),
                            setTimeout(e._x_transitioning.finish, s + a),
                            (i = !0))
                    })
            })
    }
    function he(e, t, r) {
        if (e.indexOf(t) === -1) return r
        let n = e[e.indexOf(t) + 1]
        if (!n || (t === "scale" && isNaN(n))) return r
        if (t === "duration" || t === "delay") {
            let i = n.match(/([0-9]+)ms/)
            if (i) return i[1]
        }
        return t === "origin" &&
            ["top", "right", "left", "center", "bottom"].includes(
                e[e.indexOf(t) + 2],
            )
            ? [n, e[e.indexOf(t) + 2]].join(" ")
            : n
    }
    var I = !1
    function B(e, t = () => {}) {
        return (...r) => (I ? t(...r) : e(...r))
    }
    function wr(e) {
        return (...t) => I && e(...t)
    }
    function Er(e, t) {
        e._x_dataStack &&
            ((t._x_dataStack = e._x_dataStack),
            t.setAttribute("data-has-alpine-state", !0)),
            (I = !0),
            Sr(() => {
                v(t, (r, n) => {
                    n(r, () => {})
                })
            }),
            (I = !1)
    }
    var vt = !1
    function vr(e, t) {
        t._x_dataStack || (t._x_dataStack = e._x_dataStack),
            (I = !0),
            (vt = !0),
            Sr(() => {
                jn(t)
            }),
            (I = !1),
            (vt = !1)
    }
    function jn(e) {
        let t = !1
        v(e, (n, i) => {
            O(n, (o, s) => {
                if (t && Yt(o)) return s()
                ;(t = !0), i(o, s)
            })
        })
    }
    function Sr(e) {
        let t = D
        nt((r, n) => {
            let i = t(r)
            return L(i), () => {}
        }),
            e(),
            nt(t)
    }
    function Ar(e) {
        return I ? (vt ? !0 : e.hasAttribute("data-has-alpine-state")) : !1
    }
    function _e(e, t, r, n = []) {
        switch (
            (e._x_bindings || (e._x_bindings = T({})),
            (e._x_bindings[t] = r),
            (t = n.includes("camel") ? Wn(t) : t),
            t)
        ) {
            case "value":
                Bn(e, r)
                break
            case "style":
                zn(e, r)
                break
            case "class":
                Kn(e, r)
                break
            case "selected":
            case "checked":
                Hn(e, t, r)
                break
            default:
                Cr(e, t, r)
                break
        }
    }
    function Bn(e, t) {
        if (e.type === "radio")
            e.attributes.value === void 0 && (e.value = t),
                window.fromModel && (e.checked = Or(e.value, t))
        else if (e.type === "checkbox")
            Number.isInteger(t)
                ? (e.value = t)
                : !Array.isArray(t) &&
                  typeof t != "boolean" &&
                  ![null, void 0].includes(t)
                ? (e.value = String(t))
                : Array.isArray(t)
                ? (e.checked = t.some((r) => Or(r, e.value)))
                : (e.checked = !!t)
        else if (e.tagName === "SELECT") Un(e, t)
        else {
            if (e.value === t) return
            e.value = t === void 0 ? "" : t
        }
    }
    function Kn(e, t) {
        e._x_undoAddedClasses && e._x_undoAddedClasses(),
            (e._x_undoAddedClasses = pe(e, t))
    }
    function zn(e, t) {
        e._x_undoAddedStyles && e._x_undoAddedStyles(),
            (e._x_undoAddedStyles = G(e, t))
    }
    function Hn(e, t, r) {
        Cr(e, t, r), qn(e, t, r)
    }
    function Cr(e, t, r) {
        ;[null, void 0, !1].includes(r) && Gn(t)
            ? e.removeAttribute(t)
            : (Tr(t) && (r = t), Vn(e, t, r))
    }
    function Vn(e, t, r) {
        e.getAttribute(t) != r && e.setAttribute(t, r)
    }
    function qn(e, t, r) {
        e[t] !== r && (e[t] = r)
    }
    function Un(e, t) {
        let r = [].concat(t).map((n) => n + "")
        Array.from(e.options).forEach((n) => {
            n.selected = r.includes(n.value)
        })
    }
    function Wn(e) {
        return e.toLowerCase().replace(/-(\w)/g, (t, r) => r.toUpperCase())
    }
    function Or(e, t) {
        return e == t
    }
    function Tr(e) {
        return [
            "disabled",
            "checked",
            "required",
            "readonly",
            "hidden",
            "open",
            "selected",
            "autofocus",
            "itemscope",
            "multiple",
            "novalidate",
            "allowfullscreen",
            "allowpaymentrequest",
            "formnovalidate",
            "autoplay",
            "controls",
            "loop",
            "muted",
            "playsinline",
            "default",
            "ismap",
            "reversed",
            "async",
            "defer",
            "nomodule",
        ].includes(e)
    }
    function Gn(e) {
        return ![
            "aria-pressed",
            "aria-checked",
            "aria-expanded",
            "aria-selected",
        ].includes(e)
    }
    function Rr(e, t, r) {
        return e._x_bindings && e._x_bindings[t] !== void 0
            ? e._x_bindings[t]
            : Nr(e, t, r)
    }
    function Mr(e, t, r, n = !0) {
        if (e._x_bindings && e._x_bindings[t] !== void 0)
            return e._x_bindings[t]
        if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
            let i = e._x_inlineBindings[t]
            return (i.extract = n), Pe(() => R(e, i.expression))
        }
        return Nr(e, t, r)
    }
    function Nr(e, t, r) {
        let n = e.getAttribute(t)
        return n === null
            ? typeof r == "function"
                ? r()
                : r
            : n === ""
            ? !0
            : Tr(t)
            ? !![t, "true"].includes(n)
            : n
    }
    function $e(e, t) {
        var r
        return function () {
            var n = this,
                i = arguments,
                o = function () {
                    ;(r = null), e.apply(n, i)
                }
            clearTimeout(r), (r = setTimeout(o, t))
        }
    }
    function Fe(e, t) {
        let r
        return function () {
            let n = this,
                i = arguments
            r || (e.apply(n, i), (r = !0), setTimeout(() => (r = !1), t))
        }
    }
    function je({ get: e, set: t }, { get: r, set: n }) {
        let i = !0,
            o,
            s,
            a,
            c,
            l = D(() => {
                let u, d
                i
                    ? ((u = e()),
                      n(JSON.parse(JSON.stringify(u))),
                      (d = r()),
                      (i = !1))
                    : ((u = e()),
                      (d = r()),
                      (a = JSON.stringify(u)),
                      (c = JSON.stringify(d)),
                      a !== o
                          ? ((d = r()), n(u), (d = u))
                          : (t(JSON.parse(c ?? null)), (u = d))),
                    (o = JSON.stringify(u)),
                    (s = JSON.stringify(d))
            })
        return () => {
            L(l)
        }
    }
    function Pr(e) {
        ;(Array.isArray(e) ? e : [e]).forEach((r) => r(j))
    }
    var J = {},
        Dr = !1
    function Ir(e, t) {
        if ((Dr || ((J = T(J)), (Dr = !0)), t === void 0)) return J[e]
        ;(J[e] = t),
            typeof t == "object" &&
                t !== null &&
                t.hasOwnProperty("init") &&
                typeof t.init == "function" &&
                J[e].init(),
            Te(J[e])
    }
    function kr() {
        return J
    }
    var Lr = {}
    function $r(e, t) {
        let r = typeof t != "function" ? () => t : t
        return e instanceof Element ? St(e, r()) : ((Lr[e] = r), () => {})
    }
    function Fr(e) {
        return (
            Object.entries(Lr).forEach(([t, r]) => {
                Object.defineProperty(e, t, {
                    get() {
                        return (...n) => r(...n)
                    },
                })
            }),
            e
        )
    }
    function St(e, t, r) {
        let n = []
        for (; n.length; ) n.pop()()
        let i = Object.entries(t).map(([s, a]) => ({ name: s, value: a })),
            o = bt(i)
        return (
            (i = i.map((s) =>
                o.find((a) => a.name === s.name)
                    ? { name: `x-bind:${s.name}`, value: `"${s.value}"` }
                    : s,
            )),
            le(e, i, r).map((s) => {
                n.push(s.runCleanups), s()
            }),
            () => {
                for (; n.length; ) n.pop()()
            }
        )
    }
    var jr = {}
    function Br(e, t) {
        jr[e] = t
    }
    function Kr(e, t) {
        return (
            Object.entries(jr).forEach(([r, n]) => {
                Object.defineProperty(e, r, {
                    get() {
                        return (...i) => n.bind(t)(...i)
                    },
                    enumerable: !1,
                })
            }),
            e
        )
    }
    var Jn = {
            get reactive() {
                return T
            },
            get release() {
                return L
            },
            get effect() {
                return D
            },
            get raw() {
                return rt
            },
            version: "3.13.0",
            flushAndStopDeferringMutations: sr,
            dontAutoEvaluateFunctions: Pe,
            disableEffectScheduling: zt,
            startObservingMutations: ce,
            stopObservingMutations: lt,
            setReactivityEngine: Ht,
            onAttributeRemoved: Oe,
            onAttributesAdded: Se,
            closestDataStack: $,
            skipDuringClone: B,
            onlyDuringClone: wr,
            addRootSelector: Ee,
            addInitSelector: ve,
            addScopeToNode: N,
            deferMutations: or,
            mapAttributes: te,
            evaluateLater: x,
            interceptInit: Zt,
            setEvaluator: ur,
            mergeProxies: F,
            extractProp: Mr,
            findClosest: Z,
            onElRemoved: Q,
            closestRoot: U,
            destroyTree: ae,
            interceptor: Re,
            transition: Le,
            setStyles: G,
            mutateDom: h,
            directive: p,
            entangle: je,
            throttle: Fe,
            debounce: $e,
            evaluate: R,
            initTree: v,
            nextTick: re,
            prefixed: C,
            prefix: fr,
            plugin: Pr,
            magic: y,
            store: Ir,
            start: Ut,
            clone: vr,
            cloneNode: Er,
            bound: Rr,
            $data: Ce,
            walk: O,
            data: Br,
            bind: $r,
        },
        j = Jn
    function At(e, t) {
        let r = Object.create(null),
            n = e.split(",")
        for (let i = 0; i < n.length; i++) r[n[i]] = !0
        return t ? (i) => !!r[i.toLowerCase()] : (i) => !!r[i]
    }
    var Yn =
        "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly"
    var As = At(
        Yn +
            ",async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected",
    )
    var zr = Object.freeze({}),
        Os = Object.freeze([])
    var Xn = Object.prototype.hasOwnProperty,
        ge = (e, t) => Xn.call(e, t),
        K = Array.isArray,
        ne = (e) => Hr(e) === "[object Map]"
    var Zn = (e) => typeof e == "string",
        Be = (e) => typeof e == "symbol",
        xe = (e) => e !== null && typeof e == "object"
    var Qn = Object.prototype.toString,
        Hr = (e) => Qn.call(e),
        Ot = (e) => Hr(e).slice(8, -1)
    var Ke = (e) =>
        Zn(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e
    var ze = (e) => {
            let t = Object.create(null)
            return (r) => t[r] || (t[r] = e(r))
        },
        ei = /-(\w)/g,
        Cs = ze((e) => e.replace(ei, (t, r) => (r ? r.toUpperCase() : ""))),
        ti = /\B([A-Z])/g,
        Ts = ze((e) => e.replace(ti, "-$1").toLowerCase()),
        Ct = ze((e) => e.charAt(0).toUpperCase() + e.slice(1)),
        Rs = ze((e) => (e ? `on${Ct(e)}` : "")),
        Tt = (e, t) => e !== t && (e === e || t === t)
    var Rt = new WeakMap(),
        ye = [],
        P,
        Y = Symbol("iterate"),
        Mt = Symbol("Map key iterate")
    function ri(e) {
        return e && e._isEffect === !0
    }
    function Jr(e, t = zr) {
        ri(e) && (e = e.raw)
        let r = ii(e, t)
        return t.lazy || r(), r
    }
    function Yr(e) {
        e.active &&
            (Xr(e), e.options.onStop && e.options.onStop(), (e.active = !1))
    }
    var ni = 0
    function ii(e, t) {
        let r = function () {
            if (!r.active) return e()
            if (!ye.includes(r)) {
                Xr(r)
                try {
                    return si(), ye.push(r), (P = r), e()
                } finally {
                    ye.pop(), Zr(), (P = ye[ye.length - 1])
                }
            }
        }
        return (
            (r.id = ni++),
            (r.allowRecurse = !!t.allowRecurse),
            (r._isEffect = !0),
            (r.active = !0),
            (r.raw = e),
            (r.deps = []),
            (r.options = t),
            r
        )
    }
    function Xr(e) {
        let { deps: t } = e
        if (t.length) {
            for (let r = 0; r < t.length; r++) t[r].delete(e)
            t.length = 0
        }
    }
    var ie = !0,
        Pt = []
    function oi() {
        Pt.push(ie), (ie = !1)
    }
    function si() {
        Pt.push(ie), (ie = !0)
    }
    function Zr() {
        let e = Pt.pop()
        ie = e === void 0 ? !0 : e
    }
    function M(e, t, r) {
        if (!ie || P === void 0) return
        let n = Rt.get(e)
        n || Rt.set(e, (n = new Map()))
        let i = n.get(r)
        i || n.set(r, (i = new Set())),
            i.has(P) ||
                (i.add(P),
                P.deps.push(i),
                P.options.onTrack &&
                    P.options.onTrack({
                        effect: P,
                        target: e,
                        type: t,
                        key: r,
                    }))
    }
    function H(e, t, r, n, i, o) {
        let s = Rt.get(e)
        if (!s) return
        let a = new Set(),
            c = (u) => {
                u &&
                    u.forEach((d) => {
                        ;(d !== P || d.allowRecurse) && a.add(d)
                    })
            }
        if (t === "clear") s.forEach(c)
        else if (r === "length" && K(e))
            s.forEach((u, d) => {
                ;(d === "length" || d >= n) && c(u)
            })
        else
            switch ((r !== void 0 && c(s.get(r)), t)) {
                case "add":
                    K(e)
                        ? Ke(r) && c(s.get("length"))
                        : (c(s.get(Y)), ne(e) && c(s.get(Mt)))
                    break
                case "delete":
                    K(e) || (c(s.get(Y)), ne(e) && c(s.get(Mt)))
                    break
                case "set":
                    ne(e) && c(s.get(Y))
                    break
            }
        let l = (u) => {
            u.options.onTrigger &&
                u.options.onTrigger({
                    effect: u,
                    target: e,
                    key: r,
                    type: t,
                    newValue: n,
                    oldValue: i,
                    oldTarget: o,
                }),
                u.options.scheduler ? u.options.scheduler(u) : u()
        }
        a.forEach(l)
    }
    var ai = At("__proto__,__v_isRef,__isVue"),
        Qr = new Set(
            Object.getOwnPropertyNames(Symbol)
                .map((e) => Symbol[e])
                .filter(Be),
        ),
        ci = en()
    var li = en(!0)
    var Vr = ui()
    function ui() {
        let e = {}
        return (
            ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
                e[t] = function (...r) {
                    let n = _(this)
                    for (let o = 0, s = this.length; o < s; o++)
                        M(n, "get", o + "")
                    let i = n[t](...r)
                    return i === -1 || i === !1 ? n[t](...r.map(_)) : i
                }
            }),
            ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
                e[t] = function (...r) {
                    oi()
                    let n = _(this)[t].apply(this, r)
                    return Zr(), n
                }
            }),
            e
        )
    }
    function en(e = !1, t = !1) {
        return function (n, i, o) {
            if (i === "__v_isReactive") return !e
            if (i === "__v_isReadonly") return e
            if (
                i === "__v_raw" &&
                o === (e ? (t ? Oi : on) : t ? Ai : nn).get(n)
            )
                return n
            let s = K(n)
            if (!e && s && ge(Vr, i)) return Reflect.get(Vr, i, o)
            let a = Reflect.get(n, i, o)
            return (Be(i) ? Qr.has(i) : ai(i)) || (e || M(n, "get", i), t)
                ? a
                : Nt(a)
                ? !s || !Ke(i)
                    ? a.value
                    : a
                : xe(a)
                ? e
                    ? sn(a)
                    : Je(a)
                : a
        }
    }
    var fi = di()
    function di(e = !1) {
        return function (r, n, i, o) {
            let s = r[n]
            if (!e && ((i = _(i)), (s = _(s)), !K(r) && Nt(s) && !Nt(i)))
                return (s.value = i), !0
            let a = K(r) && Ke(n) ? Number(n) < r.length : ge(r, n),
                c = Reflect.set(r, n, i, o)
            return (
                r === _(o) &&
                    (a ? Tt(i, s) && H(r, "set", n, i, s) : H(r, "add", n, i)),
                c
            )
        }
    }
    function pi(e, t) {
        let r = ge(e, t),
            n = e[t],
            i = Reflect.deleteProperty(e, t)
        return i && r && H(e, "delete", t, void 0, n), i
    }
    function mi(e, t) {
        let r = Reflect.has(e, t)
        return (!Be(t) || !Qr.has(t)) && M(e, "has", t), r
    }
    function hi(e) {
        return M(e, "iterate", K(e) ? "length" : Y), Reflect.ownKeys(e)
    }
    var _i = { get: ci, set: fi, deleteProperty: pi, has: mi, ownKeys: hi },
        gi = {
            get: li,
            set(e, t) {
                return (
                    console.warn(
                        `Set operation on key "${String(
                            t,
                        )}" failed: target is readonly.`,
                        e,
                    ),
                    !0
                )
            },
            deleteProperty(e, t) {
                return (
                    console.warn(
                        `Delete operation on key "${String(
                            t,
                        )}" failed: target is readonly.`,
                        e,
                    ),
                    !0
                )
            },
        }
    var Dt = (e) => (xe(e) ? Je(e) : e),
        It = (e) => (xe(e) ? sn(e) : e),
        kt = (e) => e,
        Ge = (e) => Reflect.getPrototypeOf(e)
    function He(e, t, r = !1, n = !1) {
        e = e.__v_raw
        let i = _(e),
            o = _(t)
        t !== o && !r && M(i, "get", t), !r && M(i, "get", o)
        let { has: s } = Ge(i),
            a = n ? kt : r ? It : Dt
        if (s.call(i, t)) return a(e.get(t))
        if (s.call(i, o)) return a(e.get(o))
        e !== i && e.get(t)
    }
    function Ve(e, t = !1) {
        let r = this.__v_raw,
            n = _(r),
            i = _(e)
        return (
            e !== i && !t && M(n, "has", e),
            !t && M(n, "has", i),
            e === i ? r.has(e) : r.has(e) || r.has(i)
        )
    }
    function qe(e, t = !1) {
        return (
            (e = e.__v_raw),
            !t && M(_(e), "iterate", Y),
            Reflect.get(e, "size", e)
        )
    }
    function qr(e) {
        e = _(e)
        let t = _(this)
        return Ge(t).has.call(t, e) || (t.add(e), H(t, "add", e, e)), this
    }
    function Ur(e, t) {
        t = _(t)
        let r = _(this),
            { has: n, get: i } = Ge(r),
            o = n.call(r, e)
        o ? rn(r, n, e) : ((e = _(e)), (o = n.call(r, e)))
        let s = i.call(r, e)
        return (
            r.set(e, t),
            o ? Tt(t, s) && H(r, "set", e, t, s) : H(r, "add", e, t),
            this
        )
    }
    function Wr(e) {
        let t = _(this),
            { has: r, get: n } = Ge(t),
            i = r.call(t, e)
        i ? rn(t, r, e) : ((e = _(e)), (i = r.call(t, e)))
        let o = n ? n.call(t, e) : void 0,
            s = t.delete(e)
        return i && H(t, "delete", e, void 0, o), s
    }
    function Gr() {
        let e = _(this),
            t = e.size !== 0,
            r = ne(e) ? new Map(e) : new Set(e),
            n = e.clear()
        return t && H(e, "clear", void 0, void 0, r), n
    }
    function Ue(e, t) {
        return function (n, i) {
            let o = this,
                s = o.__v_raw,
                a = _(s),
                c = t ? kt : e ? It : Dt
            return (
                !e && M(a, "iterate", Y),
                s.forEach((l, u) => n.call(i, c(l), c(u), o))
            )
        }
    }
    function We(e, t, r) {
        return function (...n) {
            let i = this.__v_raw,
                o = _(i),
                s = ne(o),
                a = e === "entries" || (e === Symbol.iterator && s),
                c = e === "keys" && s,
                l = i[e](...n),
                u = r ? kt : t ? It : Dt
            return (
                !t && M(o, "iterate", c ? Mt : Y),
                {
                    next() {
                        let { value: d, done: m } = l.next()
                        return m
                            ? { value: d, done: m }
                            : { value: a ? [u(d[0]), u(d[1])] : u(d), done: m }
                    },
                    [Symbol.iterator]() {
                        return this
                    },
                }
            )
        }
    }
    function z(e) {
        return function (...t) {
            {
                let r = t[0] ? `on key "${t[0]}" ` : ""
                console.warn(
                    `${Ct(e)} operation ${r}failed: target is readonly.`,
                    _(this),
                )
            }
            return e === "delete" ? !1 : this
        }
    }
    function xi() {
        let e = {
                get(o) {
                    return He(this, o)
                },
                get size() {
                    return qe(this)
                },
                has: Ve,
                add: qr,
                set: Ur,
                delete: Wr,
                clear: Gr,
                forEach: Ue(!1, !1),
            },
            t = {
                get(o) {
                    return He(this, o, !1, !0)
                },
                get size() {
                    return qe(this)
                },
                has: Ve,
                add: qr,
                set: Ur,
                delete: Wr,
                clear: Gr,
                forEach: Ue(!1, !0),
            },
            r = {
                get(o) {
                    return He(this, o, !0)
                },
                get size() {
                    return qe(this, !0)
                },
                has(o) {
                    return Ve.call(this, o, !0)
                },
                add: z("add"),
                set: z("set"),
                delete: z("delete"),
                clear: z("clear"),
                forEach: Ue(!0, !1),
            },
            n = {
                get(o) {
                    return He(this, o, !0, !0)
                },
                get size() {
                    return qe(this, !0)
                },
                has(o) {
                    return Ve.call(this, o, !0)
                },
                add: z("add"),
                set: z("set"),
                delete: z("delete"),
                clear: z("clear"),
                forEach: Ue(!0, !0),
            }
        return (
            ["keys", "values", "entries", Symbol.iterator].forEach((o) => {
                ;(e[o] = We(o, !1, !1)),
                    (r[o] = We(o, !0, !1)),
                    (t[o] = We(o, !1, !0)),
                    (n[o] = We(o, !0, !0))
            }),
            [e, r, t, n]
        )
    }
    var [yi, bi, wi, Ei] = xi()
    function tn(e, t) {
        let r = t ? (e ? Ei : wi) : e ? bi : yi
        return (n, i, o) =>
            i === "__v_isReactive"
                ? !e
                : i === "__v_isReadonly"
                ? e
                : i === "__v_raw"
                ? n
                : Reflect.get(ge(r, i) && i in n ? r : n, i, o)
    }
    var vi = { get: tn(!1, !1) }
    var Si = { get: tn(!0, !1) }
    function rn(e, t, r) {
        let n = _(r)
        if (n !== r && t.call(e, n)) {
            let i = Ot(e)
            console.warn(
                `Reactive ${i} contains both the raw and reactive versions of the same object${
                    i === "Map" ? " as keys" : ""
                }, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`,
            )
        }
    }
    var nn = new WeakMap(),
        Ai = new WeakMap(),
        on = new WeakMap(),
        Oi = new WeakMap()
    function Ci(e) {
        switch (e) {
            case "Object":
            case "Array":
                return 1
            case "Map":
            case "Set":
            case "WeakMap":
            case "WeakSet":
                return 2
            default:
                return 0
        }
    }
    function Ti(e) {
        return e.__v_skip || !Object.isExtensible(e) ? 0 : Ci(Ot(e))
    }
    function Je(e) {
        return e && e.__v_isReadonly ? e : an(e, !1, _i, vi, nn)
    }
    function sn(e) {
        return an(e, !0, gi, Si, on)
    }
    function an(e, t, r, n, i) {
        if (!xe(e))
            return (
                console.warn(`value cannot be made reactive: ${String(e)}`), e
            )
        if (e.__v_raw && !(t && e.__v_isReactive)) return e
        let o = i.get(e)
        if (o) return o
        let s = Ti(e)
        if (s === 0) return e
        let a = new Proxy(e, s === 2 ? n : r)
        return i.set(e, a), a
    }
    function _(e) {
        return (e && _(e.__v_raw)) || e
    }
    function Nt(e) {
        return Boolean(e && e.__v_isRef === !0)
    }
    y("nextTick", () => re)
    y("dispatch", (e) => q.bind(q, e))
    y("watch", (e, { evaluateLater: t, effect: r }) => (n, i) => {
        let o = t(n),
            s = !0,
            a,
            c = r(() =>
                o((l) => {
                    JSON.stringify(l),
                        s
                            ? (a = l)
                            : queueMicrotask(() => {
                                  i(l, a), (a = l)
                              }),
                        (s = !1)
                }),
            )
        e._x_effects.delete(c)
    })
    y("store", kr)
    y("data", (e) => Ce(e))
    y("root", (e) => U(e))
    y(
        "refs",
        (e) => (
            e._x_refs_proxy || (e._x_refs_proxy = F(Ri(e))), e._x_refs_proxy
        ),
    )
    function Ri(e) {
        let t = [],
            r = e
        for (; r; ) r._x_refs && t.push(r._x_refs), (r = r.parentNode)
        return t
    }
    var Lt = {}
    function $t(e) {
        return Lt[e] || (Lt[e] = 0), ++Lt[e]
    }
    function cn(e, t) {
        return Z(e, (r) => {
            if (r._x_ids && r._x_ids[t]) return !0
        })
    }
    function ln(e, t) {
        e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = $t(t))
    }
    y("id", (e) => (t, r = null) => {
        let n = cn(e, t),
            i = n ? n._x_ids[t] : $t(t)
        return r ? `${t}-${i}-${r}` : `${t}-${i}`
    })
    y("el", (e) => e)
    un("Focus", "focus", "focus")
    un("Persist", "persist", "persist")
    function un(e, t, r) {
        y(t, (n) =>
            S(
                `You can't use [$${directiveName}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${r}`,
                n,
            ),
        )
    }
    p(
        "modelable",
        (e, { expression: t }, { effect: r, evaluateLater: n, cleanup: i }) => {
            let o = n(t),
                s = () => {
                    let u
                    return o((d) => (u = d)), u
                },
                a = n(`${t} = __placeholder`),
                c = (u) => a(() => {}, { scope: { __placeholder: u } }),
                l = s()
            c(l),
                queueMicrotask(() => {
                    if (!e._x_model) return
                    e._x_removeModelListeners.default()
                    let u = e._x_model.get,
                        d = e._x_model.set,
                        m = je(
                            {
                                get() {
                                    return u()
                                },
                                set(w) {
                                    d(w)
                                },
                            },
                            {
                                get() {
                                    return s()
                                },
                                set(w) {
                                    c(w)
                                },
                            },
                        )
                    i(m)
                })
        },
    )
    var Mi = document.createElement("div")
    p("teleport", (e, { modifiers: t, expression: r }, { cleanup: n }) => {
        e.tagName.toLowerCase() !== "template" &&
            S("x-teleport can only be used on a <template> tag", e)
        let i = B(
            () => document.querySelector(r),
            () => Mi,
        )()
        i || S(`Cannot find x-teleport element for selector: "${r}"`)
        let o = e.content.cloneNode(!0).firstElementChild
        ;(e._x_teleport = o),
            (o._x_teleportBack = e),
            e._x_forwardEvents &&
                e._x_forwardEvents.forEach((s) => {
                    o.addEventListener(s, (a) => {
                        a.stopPropagation(),
                            e.dispatchEvent(new a.constructor(a.type, a))
                    })
                }),
            N(o, {}, e),
            h(() => {
                t.includes("prepend")
                    ? i.parentNode.insertBefore(o, i)
                    : t.includes("append")
                    ? i.parentNode.insertBefore(o, i.nextSibling)
                    : i.appendChild(o),
                    v(o),
                    (o._x_ignore = !0)
            }),
            n(() => o.remove())
    })
    var fn = () => {}
    fn.inline = (e, { modifiers: t }, { cleanup: r }) => {
        t.includes("self") ? (e._x_ignoreSelf = !0) : (e._x_ignore = !0),
            r(() => {
                t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore
            })
    }
    p("ignore", fn)
    p("effect", (e, { expression: t }, { effect: r }) => r(x(e, t)))
    function oe(e, t, r, n) {
        let i = e,
            o = (c) => n(c),
            s = {},
            a = (c, l) => (u) => l(c, u)
        if (
            (r.includes("dot") && (t = Ni(t)),
            r.includes("camel") && (t = Pi(t)),
            r.includes("passive") && (s.passive = !0),
            r.includes("capture") && (s.capture = !0),
            r.includes("window") && (i = window),
            r.includes("document") && (i = document),
            r.includes("debounce"))
        ) {
            let c = r[r.indexOf("debounce") + 1] || "invalid-wait",
                l = Ye(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250
            o = $e(o, l)
        }
        if (r.includes("throttle")) {
            let c = r[r.indexOf("throttle") + 1] || "invalid-wait",
                l = Ye(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250
            o = Fe(o, l)
        }
        return (
            r.includes("prevent") &&
                (o = a(o, (c, l) => {
                    l.preventDefault(), c(l)
                })),
            r.includes("stop") &&
                (o = a(o, (c, l) => {
                    l.stopPropagation(), c(l)
                })),
            r.includes("self") &&
                (o = a(o, (c, l) => {
                    l.target === e && c(l)
                })),
            (r.includes("away") || r.includes("outside")) &&
                ((i = document),
                (o = a(o, (c, l) => {
                    e.contains(l.target) ||
                        (l.target.isConnected !== !1 &&
                            ((e.offsetWidth < 1 && e.offsetHeight < 1) ||
                                (e._x_isShown !== !1 && c(l))))
                }))),
            r.includes("once") &&
                (o = a(o, (c, l) => {
                    c(l), i.removeEventListener(t, o, s)
                })),
            (o = a(o, (c, l) => {
                ;(Ii(t) && ki(l, r)) || c(l)
            })),
            i.addEventListener(t, o, s),
            () => {
                i.removeEventListener(t, o, s)
            }
        )
    }
    function Ni(e) {
        return e.replace(/-/g, ".")
    }
    function Pi(e) {
        return e.toLowerCase().replace(/-(\w)/g, (t, r) => r.toUpperCase())
    }
    function Ye(e) {
        return !Array.isArray(e) && !isNaN(e)
    }
    function Di(e) {
        return [" ", "_"].includes(e)
            ? e
            : e
                  .replace(/([a-z])([A-Z])/g, "$1-$2")
                  .replace(/[_\s]/, "-")
                  .toLowerCase()
    }
    function Ii(e) {
        return ["keydown", "keyup"].includes(e)
    }
    function ki(e, t) {
        let r = t.filter(
            (o) =>
                ![
                    "window",
                    "document",
                    "prevent",
                    "stop",
                    "once",
                    "capture",
                ].includes(o),
        )
        if (r.includes("debounce")) {
            let o = r.indexOf("debounce")
            r.splice(o, Ye((r[o + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1)
        }
        if (r.includes("throttle")) {
            let o = r.indexOf("throttle")
            r.splice(o, Ye((r[o + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1)
        }
        if (r.length === 0 || (r.length === 1 && dn(e.key).includes(r[0])))
            return !1
        let i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((o) =>
            r.includes(o),
        )
        return (
            (r = r.filter((o) => !i.includes(o))),
            !(
                i.length > 0 &&
                i.filter(
                    (s) => (
                        (s === "cmd" || s === "super") && (s = "meta"),
                        e[`${s}Key`]
                    ),
                ).length === i.length &&
                dn(e.key).includes(r[0])
            )
        )
    }
    function dn(e) {
        if (!e) return []
        e = Di(e)
        let t = {
            ctrl: "control",
            slash: "/",
            space: " ",
            spacebar: " ",
            cmd: "meta",
            esc: "escape",
            up: "arrow-up",
            down: "arrow-down",
            left: "arrow-left",
            right: "arrow-right",
            period: ".",
            equal: "=",
            minus: "-",
            underscore: "_",
        }
        return (
            (t[e] = e),
            Object.keys(t)
                .map((r) => {
                    if (t[r] === e) return r
                })
                .filter((r) => r)
        )
    }
    p(
        "model",
        (e, { modifiers: t, expression: r }, { effect: n, cleanup: i }) => {
            let o = e
            t.includes("parent") && (o = e.parentNode)
            let s = x(o, r),
                a
            typeof r == "string"
                ? (a = x(o, `${r} = __placeholder`))
                : typeof r == "function" && typeof r() == "string"
                ? (a = x(o, `${r()} = __placeholder`))
                : (a = () => {})
            let c = () => {
                    let m
                    return s((w) => (m = w)), pn(m) ? m.get() : m
                },
                l = (m) => {
                    let w
                    s((k) => (w = k)),
                        pn(w)
                            ? w.set(m)
                            : a(() => {}, { scope: { __placeholder: m } })
                }
            typeof r == "string" &&
                e.type === "radio" &&
                h(() => {
                    e.hasAttribute("name") || e.setAttribute("name", r)
                })
            var u =
                e.tagName.toLowerCase() === "select" ||
                ["checkbox", "radio"].includes(e.type) ||
                t.includes("lazy")
                    ? "change"
                    : "input"
            let d = I
                ? () => {}
                : oe(e, u, t, (m) => {
                      l(Li(e, t, m, c()))
                  })
            if (
                (t.includes("fill") &&
                    ([null, ""].includes(c()) ||
                        (e.type === "checkbox" && Array.isArray(c()))) &&
                    e.dispatchEvent(new Event(u, {})),
                e._x_removeModelListeners || (e._x_removeModelListeners = {}),
                (e._x_removeModelListeners.default = d),
                i(() => e._x_removeModelListeners.default()),
                e.form)
            ) {
                let m = oe(e.form, "reset", [], (w) => {
                    re(() => e._x_model && e._x_model.set(e.value))
                })
                i(() => m())
            }
            ;(e._x_model = {
                get() {
                    return c()
                },
                set(m) {
                    l(m)
                },
            }),
                (e._x_forceModelUpdate = (m) => {
                    m === void 0 &&
                        typeof r == "string" &&
                        r.match(/\./) &&
                        (m = ""),
                        (window.fromModel = !0),
                        h(() => _e(e, "value", m)),
                        delete window.fromModel
                }),
                n(() => {
                    let m = c()
                    ;(t.includes("unintrusive") &&
                        document.activeElement.isSameNode(e)) ||
                        e._x_forceModelUpdate(m)
                })
        },
    )
    function Li(e, t, r, n) {
        return h(() => {
            if (r instanceof CustomEvent && r.detail !== void 0)
                return r.detail ?? r.target.value
            if (e.type === "checkbox")
                if (Array.isArray(n)) {
                    let i = t.includes("number")
                        ? Ft(r.target.value)
                        : r.target.value
                    return r.target.checked
                        ? n.concat([i])
                        : n.filter((o) => !$i(o, i))
                } else return r.target.checked
            else {
                if (e.tagName.toLowerCase() === "select" && e.multiple)
                    return t.includes("number")
                        ? Array.from(r.target.selectedOptions).map((i) => {
                              let o = i.value || i.text
                              return Ft(o)
                          })
                        : Array.from(r.target.selectedOptions).map(
                              (i) => i.value || i.text,
                          )
                {
                    let i = r.target.value
                    return t.includes("number")
                        ? Ft(i)
                        : t.includes("trim")
                        ? i.trim()
                        : i
                }
            }
        })
    }
    function Ft(e) {
        let t = e ? parseFloat(e) : null
        return Fi(t) ? t : e
    }
    function $i(e, t) {
        return e == t
    }
    function Fi(e) {
        return !Array.isArray(e) && !isNaN(e)
    }
    function pn(e) {
        return (
            e !== null &&
            typeof e == "object" &&
            typeof e.get == "function" &&
            typeof e.set == "function"
        )
    }
    p("cloak", (e) =>
        queueMicrotask(() => h(() => e.removeAttribute(C("cloak")))),
    )
    ve(() => `[${C("init")}]`)
    p(
        "init",
        B((e, { expression: t }, { evaluate: r }) =>
            typeof t == "string" ? !!t.trim() && r(t, {}, !1) : r(t, {}, !1),
        ),
    )
    p("text", (e, { expression: t }, { effect: r, evaluateLater: n }) => {
        let i = n(t)
        r(() => {
            i((o) => {
                h(() => {
                    e.textContent = o
                })
            })
        })
    })
    p("html", (e, { expression: t }, { effect: r, evaluateLater: n }) => {
        let i = n(t)
        r(() => {
            i((o) => {
                h(() => {
                    ;(e.innerHTML = o),
                        (e._x_ignoreSelf = !0),
                        v(e),
                        delete e._x_ignoreSelf
                })
            })
        })
    })
    te(De(":", Ie(C("bind:"))))
    var mn = (
        e,
        { value: t, modifiers: r, expression: n, original: i },
        { effect: o },
    ) => {
        if (!t) {
            let a = {}
            Fr(a),
                x(e, n)(
                    (l) => {
                        St(e, l, i)
                    },
                    { scope: a },
                )
            return
        }
        if (t === "key") return ji(e, n)
        if (
            e._x_inlineBindings &&
            e._x_inlineBindings[t] &&
            e._x_inlineBindings[t].extract
        )
            return
        let s = x(e, n)
        o(() =>
            s((a) => {
                a === void 0 &&
                    typeof n == "string" &&
                    n.match(/\./) &&
                    (a = ""),
                    h(() => _e(e, t, a, r))
            }),
        )
    }
    mn.inline = (e, { value: t, modifiers: r, expression: n }) => {
        t &&
            (e._x_inlineBindings || (e._x_inlineBindings = {}),
            (e._x_inlineBindings[t] = { expression: n, extract: !1 }))
    }
    p("bind", mn)
    function ji(e, t) {
        e._x_keyExpression = t
    }
    Ee(() => `[${C("data")}]`)
    p("data", (e, { expression: t }, { cleanup: r }) => {
        if (Ar(e)) return
        t = t === "" ? "{}" : t
        let n = {}
        fe(n, e)
        let i = {}
        Kr(i, n)
        let o = R(e, t, { scope: i })
        ;(o === void 0 || o === !0) && (o = {}), fe(o, e)
        let s = T(o)
        Te(s)
        let a = N(e, s)
        s.init && R(e, s.init),
            r(() => {
                s.destroy && R(e, s.destroy), a()
            })
    })
    p("show", (e, { modifiers: t, expression: r }, { effect: n }) => {
        let i = x(e, r)
        e._x_doHide ||
            (e._x_doHide = () => {
                h(() => {
                    e.style.setProperty(
                        "display",
                        "none",
                        t.includes("important") ? "important" : void 0,
                    )
                })
            }),
            e._x_doShow ||
                (e._x_doShow = () => {
                    h(() => {
                        e.style.length === 1 && e.style.display === "none"
                            ? e.removeAttribute("style")
                            : e.style.removeProperty("display")
                    })
                })
        let o = () => {
                e._x_doHide(), (e._x_isShown = !1)
            },
            s = () => {
                e._x_doShow(), (e._x_isShown = !0)
            },
            a = () => setTimeout(s),
            c = me(
                (d) => (d ? s() : o()),
                (d) => {
                    typeof e._x_toggleAndCascadeWithTransitions == "function"
                        ? e._x_toggleAndCascadeWithTransitions(e, d, s, o)
                        : d
                        ? a()
                        : o()
                },
            ),
            l,
            u = !0
        n(() =>
            i((d) => {
                ;(!u && d === l) ||
                    (t.includes("immediate") && (d ? a() : o()),
                    c(d),
                    (l = d),
                    (u = !1))
            }),
        )
    })
    p("for", (e, { expression: t }, { effect: r, cleanup: n }) => {
        let i = Ki(t),
            o = x(e, i.items),
            s = x(e, e._x_keyExpression || "index")
        ;(e._x_prevKeys = []),
            (e._x_lookup = {}),
            r(() => Bi(e, i, o, s)),
            n(() => {
                Object.values(e._x_lookup).forEach((a) => a.remove()),
                    delete e._x_prevKeys,
                    delete e._x_lookup
            })
    })
    function Bi(e, t, r, n) {
        let i = (s) => typeof s == "object" && !Array.isArray(s),
            o = e
        r((s) => {
            zi(s) && s >= 0 && (s = Array.from(Array(s).keys(), (f) => f + 1)),
                s === void 0 && (s = [])
            let a = e._x_lookup,
                c = e._x_prevKeys,
                l = [],
                u = []
            if (i(s))
                s = Object.entries(s).map(([f, g]) => {
                    let b = hn(t, g, f, s)
                    n((E) => u.push(E), { scope: { index: f, ...b } }),
                        l.push(b)
                })
            else
                for (let f = 0; f < s.length; f++) {
                    let g = hn(t, s[f], f, s)
                    n((b) => u.push(b), { scope: { index: f, ...g } }),
                        l.push(g)
                }
            let d = [],
                m = [],
                w = [],
                k = []
            for (let f = 0; f < c.length; f++) {
                let g = c[f]
                u.indexOf(g) === -1 && w.push(g)
            }
            c = c.filter((f) => !w.includes(f))
            let be = "template"
            for (let f = 0; f < u.length; f++) {
                let g = u[f],
                    b = c.indexOf(g)
                if (b === -1) c.splice(f, 0, g), d.push([be, f])
                else if (b !== f) {
                    let E = c.splice(f, 1)[0],
                        A = c.splice(b - 1, 1)[0]
                    c.splice(f, 0, A), c.splice(b, 0, E), m.push([E, A])
                } else k.push(g)
                be = g
            }
            for (let f = 0; f < w.length; f++) {
                let g = w[f]
                a[g]._x_effects && a[g]._x_effects.forEach(we),
                    a[g].remove(),
                    (a[g] = null),
                    delete a[g]
            }
            for (let f = 0; f < m.length; f++) {
                let [g, b] = m[f],
                    E = a[g],
                    A = a[b],
                    X = document.createElement("div")
                h(() => {
                    A || S('x-for ":key" is undefined or invalid', o),
                        A.after(X),
                        E.after(A),
                        A._x_currentIfEl && A.after(A._x_currentIfEl),
                        X.before(E),
                        E._x_currentIfEl && E.after(E._x_currentIfEl),
                        X.remove()
                }),
                    A._x_refreshXForScope(l[u.indexOf(b)])
            }
            for (let f = 0; f < d.length; f++) {
                let [g, b] = d[f],
                    E = g === "template" ? o : a[g]
                E._x_currentIfEl && (E = E._x_currentIfEl)
                let A = l[b],
                    X = u[b],
                    se = document.importNode(o.content, !0).firstElementChild,
                    Bt = T(A)
                N(se, Bt, o),
                    (se._x_refreshXForScope = (gn) => {
                        Object.entries(gn).forEach(([xn, yn]) => {
                            Bt[xn] = yn
                        })
                    }),
                    h(() => {
                        E.after(se), v(se)
                    }),
                    typeof X == "object" &&
                        S(
                            "x-for key cannot be an object, it must be a string or an integer",
                            o,
                        ),
                    (a[X] = se)
            }
            for (let f = 0; f < k.length; f++)
                a[k[f]]._x_refreshXForScope(l[u.indexOf(k[f])])
            o._x_prevKeys = u
        })
    }
    function Ki(e) {
        let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
            r = /^\s*\(|\)\s*$/g,
            n = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,
            i = e.match(n)
        if (!i) return
        let o = {}
        o.items = i[2].trim()
        let s = i[1].replace(r, "").trim(),
            a = s.match(t)
        return (
            a
                ? ((o.item = s.replace(t, "").trim()),
                  (o.index = a[1].trim()),
                  a[2] && (o.collection = a[2].trim()))
                : (o.item = s),
            o
        )
    }
    function hn(e, t, r, n) {
        let i = {}
        return (
            /^\[.*\]$/.test(e.item) && Array.isArray(t)
                ? e.item
                      .replace("[", "")
                      .replace("]", "")
                      .split(",")
                      .map((s) => s.trim())
                      .forEach((s, a) => {
                          i[s] = t[a]
                      })
                : /^\{.*\}$/.test(e.item) &&
                  !Array.isArray(t) &&
                  typeof t == "object"
                ? e.item
                      .replace("{", "")
                      .replace("}", "")
                      .split(",")
                      .map((s) => s.trim())
                      .forEach((s) => {
                          i[s] = t[s]
                      })
                : (i[e.item] = t),
            e.index && (i[e.index] = r),
            e.collection && (i[e.collection] = n),
            i
        )
    }
    function zi(e) {
        return !Array.isArray(e) && !isNaN(e)
    }
    function _n() {}
    _n.inline = (e, { expression: t }, { cleanup: r }) => {
        let n = U(e)
        n._x_refs || (n._x_refs = {}),
            (n._x_refs[t] = e),
            r(() => delete n._x_refs[t])
    }
    p("ref", _n)
    p("if", (e, { expression: t }, { effect: r, cleanup: n }) => {
        let i = x(e, t),
            o = () => {
                if (e._x_currentIfEl) return e._x_currentIfEl
                let a = e.content.cloneNode(!0).firstElementChild
                return (
                    N(a, {}, e),
                    h(() => {
                        e.after(a), v(a)
                    }),
                    (e._x_currentIfEl = a),
                    (e._x_undoIf = () => {
                        O(a, (c) => {
                            c._x_effects && c._x_effects.forEach(we)
                        }),
                            a.remove(),
                            delete e._x_currentIfEl
                    }),
                    a
                )
            },
            s = () => {
                e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf)
            }
        r(() =>
            i((a) => {
                a ? o() : s()
            }),
        ),
            n(() => e._x_undoIf && e._x_undoIf())
    })
    p("id", (e, { expression: t }, { evaluate: r }) => {
        r(t).forEach((i) => ln(e, i))
    })
    te(De("@", Ie(C("on:"))))
    p(
        "on",
        B((e, { value: t, modifiers: r, expression: n }, { cleanup: i }) => {
            let o = n ? x(e, n) : () => {}
            e.tagName.toLowerCase() === "template" &&
                (e._x_forwardEvents || (e._x_forwardEvents = []),
                e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t))
            let s = oe(e, t, r, (a) => {
                o(() => {}, { scope: { $event: a }, params: [a] })
            })
            i(() => s())
        }),
    )
    Xe("Collapse", "collapse", "collapse")
    Xe("Intersect", "intersect", "intersect")
    Xe("Focus", "trap", "focus")
    Xe("Mask", "mask", "mask")
    function Xe(e, t, r) {
        p(t, (n) =>
            S(
                `You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${r}`,
                n,
            ),
        )
    }
    j.setEvaluator(ht)
    j.setReactivityEngine({ reactive: Je, effect: Jr, release: Yr, raw: _ })
    var jt = j
    window.Alpine = jt
    queueMicrotask(() => {
        jt.start()
    })
})()
