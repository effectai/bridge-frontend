(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{1175:function(t,e,n){t.exports=n.p+"img/logo.38420dc.svg"},1176:function(t,e,n){t.exports=n.p+"img/BSC-logo.187534e.svg"},1177:function(t,e,n){var content=n(1179);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(103).default)("2733a5c8",content,!0,{sourceMap:!1})},1178:function(t,e,n){"use strict";n(1177)},1179:function(t,e,n){var o=n(102)(!1);o.push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap);"]),o.push([t.i,".container[data-v-134175e9]{z-index:1}.tabs.is-boxed li.is-active a[data-v-134175e9]{border:none;color:#1148eb!important}",""]),t.exports=o},1180:function(t,e,n){t.exports=n.p+"img/EOS-logo.244ceb6.svg"},1181:function(t,e,n){"use strict";var o={props:["active"],data:function(){return{}},computed:{},methods:{}},c=(n(1178),n(39)),component=Object(c.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("div",{staticClass:"tabs is-centered is-large is-boxed"},[n("ul",{staticStyle:{"border-bottom":"0px"}},[n("li",{staticClass:"tab",class:{"is-active":"swap"==t.active}},[n("nuxt-link",{attrs:{to:"/"}},[n("span",{staticClass:"icon is-small"},[n("i",{staticClass:"fas fa-sync-alt",attrs:{"aria-hidden":"true"}})]),t._v(" "),n("span",[t._v("Bridge")])])],1),t._v(" "),t._m(0),t._v(" "),n("li",{staticClass:"tab",class:{"is-active":"farm"==t.active}},[n("nuxt-link",{attrs:{to:"/farm"}},[n("span",[t._v("Farm")]),t._v(" "),n("span",{staticClass:"icon is-small"},[n("i",{staticClass:"fas fa-tractor",attrs:{"aria-hidden":"true"}})])])],1)])])])}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"tab"},[n("span",[t._v("   ")])])}],!1,null,"134175e9",null);e.a=component.exports},1185:function(t,e,n){var content=n(1194);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(103).default)("cf86d584",content,!0,{sourceMap:!1})},1186:function(t,e,n){var content=n(1196);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(103).default)("10c3af6c",content,!0,{sourceMap:!1})},1193:function(t,e,n){"use strict";n(1185)},1194:function(t,e,n){var o=n(102)(!1);o.push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap);"]),o.push([t.i,".blockchain-address[data-v-a871434e]{font-family:monospace;text-overflow:ellipsis;max-width:100%;white-space:nowrap;overflow:hidden;display:block}@media screen and (max-width:769px){.switch[data-v-a871434e]{padding-bottom:0}}",""]),t.exports=o},1195:function(t,e,n){"use strict";n(1186)},1196:function(t,e,n){var o=n(102)(!1);o.push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap);"]),o.push([t.i,".site-title[data-v-0e533d2a]{font-size:64px}@media screen and (max-width:769px){.learn[data-v-0e533d2a]{color:#000!important}}",""]),t.exports=o},1198:function(t,e,n){"use strict";n.r(e);var o=n(3),c=(n(38),{data:function(){return{swapFromEOS:!0,efxAmount:null}},computed:{eosWallet:function(){return this.$eos?this.$eos.wallet:null},bscWallet:function(){return this.$bsc?this.$bsc.wallet:null}},methods:{switchChains:function(){this.swapFromEOS=!this.swapFromEOS,this.efxAmount=null},onSwap:function(){var t=this;return Object(o.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.$ptokens.init(t.$bsc.currentProvider),t.$router.push("/swap-progress"),!t.swapFromEOS){e.next=13;break}return e.prev=3,e.next=6,t.$ptokens.swapToBsc(t.efxAmount);case 6:e.next=11;break;case 8:e.prev=8,e.t0=e.catch(3),t.swapError=e.t0.message;case 11:e.next=21;break;case 13:return e.prev=13,e.next=16,t.$ptokens.swapToEos(t.efxAmount);case 16:e.next=21;break;case 18:e.prev=18,e.t1=e.catch(13),t.swapError=e.t1.message;case 21:case"end":return e.stop()}}),e,null,[[3,8],[13,18]])})))()}},mounted:function(){this.$ptokens.resetSwap()}}),l=(n(1193),n(39)),r={components:{SwapForm:Object(l.a)(c,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticClass:"box is-horizontal-centered px-6 content",staticStyle:{"max-width":"550px"}},[o("div",{staticClass:"columns is-vcentered",class:{"is-flex-direction-row-reverse":!t.swapFromEOS}},[o("div",{staticClass:"column is-align-self-stretch is-5 "},[o("small",{staticClass:"is-size-7"},[t.swapFromEOS?o("span",[t._v("From")]):o("span",[t._v("To")])]),t._v(" "),o("div",{staticClass:"box is-shadowless has-border has-text-centered is-fullheight"},[o("div",{staticClass:"subtitle has-text-weight-semibold mb-2"},[t._v("EOS")]),t._v(" "),o("img",{attrs:{src:n(1180),height:"100"}}),t._v(" "),t.eosWallet?o("div",[o("a",{staticClass:"blockchain-address",attrs:{href:t.$eos.explorer+"/account/"+t.eosWallet.auth.accountName,target:"_blank"}},[t._v(t._s(t.eosWallet.auth.accountName))]),t._v(" "),o("a",{staticClass:"has-text-danger",on:{click:function(e){return t.$eos.logout()}}},[o("small",{staticClass:"is-size-7"},[t._v("Disconnect")])])]):o("div",[o("a",{staticClass:"button is-small is-accent",on:{click:function(e){t.$eos.loginModal=!0}}},[o("strong",[t._v("Connect EOS")])])])])]),t._v(" "),o("div",{staticClass:"column switch is-2 has-text-centered"},[o("a",{staticClass:"has-text-centered",on:{click:t.switchChains}},[o("i",{staticClass:"fas fa-exchange-alt"}),o("br"),t._v(" "),o("small",{staticClass:"is-size-7"},[o("a",{on:{click:function(t){}}},[t._v("switch")])])])]),t._v(" "),o("div",{staticClass:"column is-align-self-stretch is-5"},[o("small",{staticClass:"is-size-7"},[t.swapFromEOS?o("span",[t._v("To")]):o("span",[t._v("From")])]),t._v(" "),o("div",{staticClass:"box is-shadowless has-border has-text-centered"},[o("div",{staticClass:"subtitle has-text-weight-semibold mb-2"},[t._v("BSC")]),t._v(" "),o("img",{attrs:{src:n(1176),height:"100"}}),t._v(" "),t.bscWallet?o("div",[o("a",{staticClass:"blockchain-address",attrs:{href:t.$bsc.explorer+"/address/"+t.bscWallet[0],target:"_blank"}},[t._v(t._s(t.bscWallet[0]))]),t._v(" "),o("a",{staticClass:"has-text-danger",on:{click:function(e){return t.$bsc.logout()}}},[o("small",{staticClass:"is-size-7"},[t._v("Disconnect")])])]):o("div",[o("a",{staticClass:"button is-small is-accent",on:{click:function(e){t.$bsc.loginModal=!0}}},[o("strong",[t._v("Connect BSC")])])])])])]),t._v(" "),o("div",{staticClass:"is-size-7 columns mb-0 is-mobile"},[o("div",{staticClass:"column py-0"},[t._v("\n                Amount\n            ")]),t._v(" "),o("div",{staticClass:"column has-text-right py-0"},[t._v("\n                Balance:\n                "),t.swapFromEOS?o("span",[null!==t.$eos.efxAvailable?o("span",[o("a",{on:{click:function(e){t.efxAmount=t.$eos.efxAvailable}}},[t._v(t._s(t.$eos.efxAvailable))])]):o("span",[t._v("-")])]):o("span",[null!==t.$bsc.efxAvailable?o("span",[o("a",{on:{click:function(e){t.efxAmount=t.$bsc.efxAvailable}}},[t._v(t._s(t.$bsc.efxAvailable))])]):o("span",[t._v("-")])])])]),t._v(" "),o("div",{staticClass:"field has-addons"},[o("div",{staticClass:"control is-flex-grow-1"},[o("input",{directives:[{name:"model",rawName:"v-model",value:t.efxAmount,expression:"efxAmount"}],staticClass:"input is-medium",attrs:{type:"number",placeholder:"Minumum 10 EFX",min:"0"},domProps:{value:t.efxAmount},on:{input:function(e){e.target.composing||(t.efxAmount=e.target.value)}}})]),t._v(" "),t._m(0)]),t._v(" "),o("div",{staticClass:"is-size-7"},[t._v("\n            To your "),t.swapFromEOS?o("span",[t._v("BSC Address")]):o("span",[t._v("EOS Account")])]),t._v(" "),o("div",{staticClass:"field"},[o("input",{staticClass:"input",attrs:{disabled:"",type:"text"},domProps:{value:t.swapFromEOS?t.bscWallet?t.bscWallet[0]:"- login with your BSC wallet -":t.eosWallet?t.eosWallet.auth.accountName:"- login with your EOS wallet -"}})]),t._v(" "),o("button",{staticClass:"button is-medium is-accent is-fullwidth mt-5",attrs:{disabled:!t.efxAmount||!t.eosWallet||!t.bscWallet||t.efxAmount<10},on:{click:t.onSwap}},[o("strong",[t._v("Swap")])]),t._v(" "),t.swapFromEOS?t._e():o("p",{staticClass:"is-size-7 is-center has-text-centered\tmt-3"},[t._v("\n        Transaction fee: 0.25%\n        ")])])])}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",{staticClass:"control"},[n("a",{staticClass:"button is-static is-medium"},[t._v("EFX")])])}],!1,null,"a871434e",null).exports,Tabs:n(1181).a},data:function(){return{bridge:!0}},methods:{},created:function(){}},d=(n(1195),Object(l.a)(r,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("section",{staticClass:"section"},[o("div",{staticClass:"container"},[o("div",{staticClass:"has-text-centered block"},[o("img",{staticClass:"mb-5",attrs:{src:n(1175),width:"130"}}),t._v(" "),o("h2",{staticClass:"site-title is-spaced title"},[t._v("Bridge")]),t._v(" "),o("h4",{staticClass:"subtitle"},[t._v("Transfer EFX between EOS and your BSC Wallet.")])])])]),t._v(" "),o("div",{staticClass:"container"},[o("tabs",{attrs:{active:"swap"}}),t._v(" "),o("swap-form")],1),t._v(" "),t._m(0)])}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"has-text-centered my-5"},[n("a",{staticClass:"has-text-white learn",attrs:{href:"https://effect-dao-docs.gitbook.io/dao-guides/",target:"_blank"}},[n("strong",[t._v("Learn how to connect")])])])}],!1,null,"0e533d2a",null));e.default=d.exports}}]);