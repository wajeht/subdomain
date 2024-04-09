import { ref as g, reactive as $, nextTick as k, onMounted as E, computed as C, watch as R, openBlock as c, createElementBlock as r, normalizeClass as l, createElementVNode as o, withDirectives as L, withKeys as S, vModelText as B, Fragment as D, renderList as M, toDisplayString as w, createCommentVNode as p, createTextVNode as x } from "vue";
import A from "axios";
import { _ as N } from "./_plugin-vue_export-helper.js";
const T = { class: "p-5 border-b border-1 border-solid" }, z = { class: "input input-bordered flex items-center gap-2" }, V = /* @__PURE__ */ o("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  class: "w-4 h-4 opacity-70"
}, [
  /* @__PURE__ */ o("path", {
    "fill-rule": "evenodd",
    d: "M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
    "clip-rule": "evenodd"
  })
], -1), G = [
  V
], K = { class: "px-5 py-4 max-h-[335px] overflow-y-scroll bg-[#E8E9EA]" }, O = {
  key: 0,
  class: "flex flex-col gap-2"
}, q = ["href"], U = { class: "flex-1 h-full" }, j = { class: "flex flex-col gap-1" }, H = { class: "rating rating-xs" }, Z = {
  key: 0,
  class: "flex-0"
}, F = {
  key: 1,
  class: "text-center text-neutral-400 text-sm py-10"
}, J = /* @__PURE__ */ o("span", { class: "text-sm" }, "No recent searches", -1), P = [
  J
], Q = {
  key: 2,
  class: "text-center text-neutral-400 text-sm py-10"
}, W = { class: "text-sm" }, X = { class: "font-bold" }, Y = /* @__PURE__ */ o("div", { class: "border-t border-1 border-solid text-center p-5" }, [
  /* @__PURE__ */ x(" press "),
  /* @__PURE__ */ o("kbd", { class: "kbd kbd-sm" }, "esc"),
  /* @__PURE__ */ x(" to close. ")
], -1), ee = {
  __name: "GlobalSearch",
  setup(te) {
    const u = g(null), h = g(null), e = $({
      search: "",
      data: [],
      open: !1,
      selectedIndex: null
    }), _ = g(null);
    document.addEventListener("click", (t) => {
      const a = document.getElementById("modal");
      a && !a.contains(t.target) && (u.value || h.value) && (u.value.classList.add("animate__fadeOut"), h.value.classList.add("animate__zoomOut"), setTimeout(() => {
        e.open = !1, e.search = "", e.selectedIndex = null;
      }, 250));
    }), window.addEventListener("keydown", function(t) {
      if (t.ctrlKey && t.key === "k" && (e.open = !0, k(() => _.value.focus())), t.metaKey && t.key === "k" && (e.open = !0, k(() => _.value.focus())), t.key === "Escape" && (u.value || h.value) && (u.value.classList.add("animate__fadeOut"), h.value.classList.add("animate__zoomOut"), setTimeout(() => {
        e.open = !1, e.search = "", e.selectedIndex = null;
      }, 250)), e.open && ["ArrowUp", "ArrowDown"].includes(t.key)) {
        t.preventDefault();
        const s = e.selectedIndex !== null ? e.selectedIndex : -1;
        t.key === "ArrowUp" ? (e.selectedIndex = Math.max(s - 1, 0), a()) : t.key === "ArrowDown" && (e.selectedIndex = Math.min(s + 1, m.value.length - 1), a());
      }
      function a() {
        const s = document.querySelector(".selected");
        if (s) {
          const n = s.parentElement.parentElement, i = s.getBoundingClientRect(), d = n.getBoundingClientRect(), f = s.offsetHeight + 216;
          i.bottom > d.bottom ? n.scrollBy(0, f) : i.top < d.top && n.scrollBy(0, -f);
        }
      }
      if (t.key === "Enter" && e.selectedIndex !== null) {
        t.preventDefault();
        const s = m.value[e.selectedIndex].slug;
        I(s);
      }
    });
    function y() {
      if (e.search === "")
        return;
      const { protocol: t, hostname: a } = window.location, s = "current_page=1&per_page=25&sort=asc";
      if (a.split(".").length === 2) {
        window.location.href = `${window.location.origin}/tenants?q=${e.search}&${s}`;
        return;
      }
      if (a.split(".").length === 3) {
        const [n, i, d] = a.split(".");
        window.location.href = `${t}//${i}.${d}/tenants?q=${e.search}&${s}`;
        return;
      }
    }
    async function b() {
      try {
        return (await A.get("/api/tenants")).data.data;
      } catch {
        return [];
      }
    }
    E(async () => {
      setTimeout(async () => {
        e.data = await b();
      }, 500);
    });
    const m = C(() => e.data.filter((t) => (t.name + " " + t.slug).toLowerCase().includes(e.search.toLowerCase())));
    R(
      () => e.search,
      (t, a) => {
        t !== a && (e.selectedIndex = null);
      }
    );
    function v(t) {
      const { protocol: a, hostname: s } = window.location;
      return `${a}//${t}.${s}`;
    }
    function I(t) {
      const { protocol: a, hostname: s } = window.location;
      if (s.split(".").length === 2) {
        const n = `${a}//${t}.${s}`;
        window.location.href = n;
      }
      if (s.split(".").length === 3) {
        const [n, i, d] = s.split("."), f = `${a}//${t}.${i}.${d}`;
        window.location.href = f;
      }
    }
    return (t, a) => e.open ? (c(), r("div", {
      key: 0,
      ref_key: "backdropRef",
      ref: u,
      id: "backdrop",
      class: l(["absolute h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10 animate__animated animate__veryfast", {
        animate__fadeIn: !e.open
      }])
    }, [
      o("div", {
        ref_key: "modalRef",
        ref: h,
        id: "modal",
        class: l(["flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md animate__animated animate__veryfast", {
          animate__zoomIn: e.open
        }])
      }, [
        o("div", T, [
          o("label", z, [
            L(o("input", {
              ref_key: "inputRef",
              ref: _,
              type: "text",
              class: "grow",
              "onUpdate:modelValue": a[0] || (a[0] = (s) => e.search = s),
              onKeydown: S(y, ["enter"]),
              id: "search",
              name: "search",
              placeholder: "Search for a coach or a systems..."
            }, null, 544), [
              [B, e.search]
            ]),
            o("button", {
              onClick: y,
              class: "hover:bg-neutral hover:text-white h-8 w-8 flex justify-center items-center rounded-md"
            }, [...G])
          ])
        ]),
        o("div", K, [
          m.value.length && e.search.length ? (c(), r("ul", O, [
            (c(!0), r(D, null, M(m.value, (s, n) => (c(), r("li", {
              class: l(["p-3 shadow-sm rounded-md hover:bg-neutral hover:text-white", [e.selectedIndex === n ? "bg-neutral text-white selected" : "bg-white"]]),
              key: s.id
            }, [
              o("a", {
                class: "flex gap-2",
                href: v(s.slug)
              }, [
                o("div", {
                  class: l(["p-3 flex-0", `bg-[${s.color}]`])
                }, w(s.emoji), 3),
                o("div", U, [
                  o("div", j, [
                    o("p", null, w(s.name), 1),
                    o("div", H, [
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: l(["mask mask-star", [e.selectedIndex === n ? "bg-white" : ""]])
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: l(["mask mask-star", [e.selectedIndex === n ? "bg-white" : ""]]),
                        checked: ""
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: l(["mask mask-star", [e.selectedIndex === n ? "bg-white" : ""]])
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: l(["mask mask-star", [e.selectedIndex === n ? "bg-white" : ""]])
                      }, null, 2),
                      o("input", {
                        type: "radio",
                        name: "rating-1",
                        class: l(["mask mask-star", [e.selectedIndex === n ? "bg-white" : ""]])
                      }, null, 2)
                    ])
                  ])
                ]),
                e.selectedIndex === n ? (c(), r("span", Z, "↩")) : p("", !0)
              ], 8, q)
            ], 2))), 128))
          ])) : p("", !0),
          e.search.length ? p("", !0) : (c(), r("div", F, [...P])),
          !m.value.length && e.search.length ? (c(), r("div", Q, [
            o("span", W, [
              x("No results for "),
              o("span", X, w(`"${e.search}"`), 1)
            ])
          ])) : p("", !0)
        ]),
        Y
      ], 2)
    ], 2)) : p("", !0);
  }
}, ne = /* @__PURE__ */ N(ee, [["__file", "/usr/src/app/src/web/components/GlobalSearch/GlobalSearch.vue"]]);
export {
  ne as default
};
