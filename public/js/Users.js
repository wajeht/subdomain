(function(e,s){typeof exports=="object"&&typeof module<"u"?module.exports=s(require("vue"),require("axios")):typeof define=="function"&&define.amd?define(["vue","axios"],s):(e=typeof globalThis<"u"?globalThis:e||self,e.Users=s(e.Vue,e.axios))})(this,function(e,s){"use strict";const a=(c,n)=>{const o=c.__vccOpts||c;for(const[r,i]of n)o[r]=i;return o},l={class:"flex flex-col gap-5"},d=["href"],p={class:"font-bold"},_={class:"font-bold"};return a({__name:"Users",setup(c){const n=e.reactive({users:[]}),o=e.computed(()=>window.location.origin);return e.onMounted(async()=>{const{data:r}=await s.get("/api/users");n.users=r.data}),(r,i)=>(e.openBlock(),e.createElementBlock("div",l,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(n.users,t=>(e.openBlock(),e.createElementBlock("a",{href:`${o.value}/user/${t.username}`,key:`user-key-${t.id}`,class:"bg-neutral-200 hover:bg-neutral-300 p-5 rounded-md"},[e.createElementVNode("h4",p,e.toDisplayString(t.emoji),1),e.createElementVNode("h4",_,e.toDisplayString(t.username),1),e.createElementVNode("p",null,e.toDisplayString(t.email),1),e.createElementVNode("p",null,e.toDisplayString(t.role),1)],8,d))),128))]))}},[["__file","/usr/src/app/src/web/components/Users/Users.vue"]])});
