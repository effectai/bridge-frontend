(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{1037:function(t,e,n){var content=n(1041);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(128).default)("5a64827a",content,!0,{sourceMap:!1})},1038:function(t,e,n){t.exports=n.p+"img/logo.38420dc.svg"},1039:function(t,e,n){t.exports=n.p+"img/BSC-logo.187534e.svg"},1040:function(t,e,n){"use strict";n(1037)},1041:function(t,e,n){var r=n(127)(!1);r.push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap);"]),r.push([t.i,".container[data-v-8776368a]{z-index:1}.tabs.is-boxed li.is-active a[data-v-8776368a]{border:none;color:#1148eb!important}",""]),t.exports=r},1043:function(t,e,n){"use strict";var r={props:["active"],data:function(){return{}},computed:{},methods:{}},c=(n(1040),n(61)),component=Object(c.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("div",{staticClass:"tabs is-centered is-large is-boxed"},[n("ul",{staticStyle:{"border-bottom":"0px"}},[n("li",{staticClass:"tab",class:{"is-active":"swap"==t.active}},[n("nuxt-link",{attrs:{to:"/"}},[n("span",{staticClass:"icon is-small"},[n("i",{staticClass:"fas fa-sync-alt",attrs:{"aria-hidden":"true"}})]),t._v(" "),n("span",[t._v("Bridge")])])],1),t._v(" "),t._m(0),t._v(" "),n("li",{staticClass:"tab",class:{"is-active":"farm"==t.active}},[n("nuxt-link",{attrs:{to:"/farms"}},[n("span",[t._v("Farms")]),t._v(" "),n("span",{staticClass:"icon is-small"},[n("i",{staticClass:"fas fa-tractor",attrs:{"aria-hidden":"true"}})])])],1)])])])}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{staticClass:"tab"},[n("span",[t._v("   ")])])}],!1,null,"8776368a",null);e.a=component.exports},1052:function(t,e,n){var content=n(1062);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(128).default)("1c5f577c",content,!0,{sourceMap:!1})},1061:function(t,e,n){"use strict";n(1052)},1062:function(t,e,n){var r=n(127)(!1);r.push([t.i,"@import url(https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap);"]),r.push([t.i,'.blockchain-address[data-v-4cbdc41c]{font-family:monospace;text-overflow:ellipsis;max-width:100%;white-space:nowrap;overflow:hidden;display:block}.max-amount[data-v-4cbdc41c]{height:100%!important;right:.4rem!important;font-size:.9rem!important;pointer-events:auto!important;z-index:4!important}@media screen and (max-width:769px){.switch[data-v-4cbdc41c]{padding-bottom:0}}.title[data-v-4cbdc41c]{font-family:"Inter",sans-serif}.align-userLPValue[data-v-4cbdc41c]{margin-left:9.7em}',""]),t.exports=r},1070:function(t,e,n){"use strict";n.r(e);var r=n(5),c=n(79),l=(n(47),n(567),n(568),n(566),n(69),n(1043)),o=n(29),d={components:{Tabs:l.a},data:function(){var t;return t={id:parseInt(this.$route.params.id),farm:null,activeForm:null,lpAmount:null,stakedLpAmount:null},Object(c.a)(t,"farm",{address:"0xE2F0627DCA576CCdbce0CED3E60E0E305b7D4E33",urladdress:"https://bscscan.com/address/".concat("0xE2F0627DCA576CCdbce0CED3E60E0E305b7D4E33")}),Object(c.a)(t,"pendingEFX",null),Object(c.a)(t,"allowanceApproval",null),Object(c.a)(t,"success",null),Object(c.a)(t,"error",null),Object(c.a)(t,"loading",!1),Object(c.a)(t,"totalLPSupply",null),Object(c.a)(t,"totalEFXSupply",null),Object(c.a)(t,"totalBNBSupply",null),Object(c.a)(t,"efxPrice",null),Object(c.a)(t,"bnbPrice",null),Object(c.a)(t,"poolStakedLPValue",null),Object(c.a)(t,"userStakedLPValue",null),t},computed:{bscWallet:function(){return this.$bsc?this.$bsc.wallet:null},approved:function(){return this.$bsc?this.$bsc.approved:null},liveFarm:function(){return this.$masterchef.startBlock<this.$masterchef.latestBlockNumber&&this.$masterchef.endBlock>this.$masterchef.latestBlockNumber},endedFarm:function(){return this.$masterchef.latestBlockNumber&&this.$masterchef.endBlock<this.$masterchef.latestBlockNumber},notStartedFarm:function(){return this.$masterchef.latestBlockNumber&&this.$masterchef.startBlock>this.$masterchef.latestBlockNumber}},watch:{"$bsc.wallet":function(){this.$bsc.wallet&&(this.farm=this.$masterchef.farms[this.id],this.$masterchef.init(this.$bsc.currentProvider,this.farm),this.$masterchef.isApproved(),this.$masterchef.getPendingEFX())}},created:function(){this.farm=this.$masterchef.farms[this.id],this.$masterchef.init(this.$bsc.currentProvider,this.farm),this.$masterchef.calculateAPR(),this.getStakedLPValues(),this.getEFXPrice(),this.getBNBPrice()},updated:function(){this.$masterchef.stakedLpBalance&&this.getStakedLPValues()},methods:{depositLpIntoMasterChef:function(t){var e=this;return Object(r.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return e.success,e.error=null,e.loading=!0,n.prev=2,n.next=5,e.$masterchef.depositLpIntoMasterChef(t);case 5:e.success="Successfuly deposited LP tokens",n.next=11;break;case 8:n.prev=8,n.t0=n.catch(2),e.error=n.t0.message;case 11:e.loading=!1;case 12:case"end":return n.stop()}}),n,null,[[2,8]])})))()},withdrawLpFromMasterChef:function(t){var e=this;return Object(r.a)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return e.success,e.error=null,e.loading=!0,n.prev=2,n.next=5,e.$masterchef.withdrawLpFromMasterChef(t);case 5:e.success="Successfuly withdrawn LP tokens",n.next=11;break;case 8:n.prev=8,n.t0=n.catch(2),e.error=n.t0.message;case 11:e.loading=!1;case 12:case"end":return n.stop()}}),n,null,[[2,8]])})))()},approveAllowance:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.success,t.error=null,t.loading=!0,e.prev=2,e.next=5,t.$masterchef.approveAllowance();case 5:e.next=10;break;case 7:e.prev=7,e.t0=e.catch(2),t.error=e.t0.message;case 10:t.loading=!1;case 11:case"end":return e.stop()}}),e,null,[[2,7]])})))()},claimPendingEFX:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.success,t.error=null,t.loading=!0,e.prev=2,e.next=5,t.$masterchef.claimPendingEFX();case 5:t.success="Successfuly claimed rewards!",e.next=11;break;case 8:e.prev=8,e.t0=e.catch(2),t.error=e.t0.message;case 11:t.loading=!1;case 12:case"end":return e.stop()}}),e,null,[[2,8]])})))()},getEFXPrice:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.coingecko.com/api/v3/coins/effect-network/tickers").then((function(data){return data.json()})).then((function(data){t.efxPrice=data.tickers[0].converted_last.usd}));case 2:case"end":return e.stop()}}),e)})))()},getBNBPrice:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.coingecko.com/api/v3/coins/binancecoin/tickers").then((function(data){return data.json()})).then((function(data){t.bnbPrice=data.tickers[0].converted_last.usd}));case 2:case"end":return e.stop()}}),e)})))()},getStakedLPValues:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,c,l,d,m,v,h,f;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$masterchef.pancakeContract.methods.totalSupply().call();case 2:return n=e.sent,t.totalLPSupply=Number.parseFloat(Object(o.fromWei)(n)).toFixed(2),e.next=6,t.$masterchef.efxContract.methods.balanceOf("0xAf1DB0c88a2Bd295F8EdCC8C73f9eB8BcEe6fA8a").call();case 6:return r=e.sent,t.totalEFXSupply=Number.parseFloat(Object(o.fromWei)(r)).toFixed(2),e.next=10,t.$masterchef.bnbContract.methods.balanceOf("0xAf1DB0c88a2Bd295F8EdCC8C73f9eB8BcEe6fA8a").call();case 10:return c=e.sent,t.totalBNBSupply=Number.parseFloat(Object(o.fromWei)(c)).toFixed(2),e.next=14,t.$masterchef.getLockedLpTokens(t.farm);case 14:return e.t0=e.sent,e.t1=t.totalLPSupply,l=e.t0/e.t1,d=l*t.totalEFXSupply*t.efxPrice,m=l*t.totalBNBSupply*t.bnbPrice,t.poolStakedLPValue=Number.parseFloat(d+m).toFixed(2),e.next=22,t.$masterchef.stakedLpBalance;case 22:e.t2=e.sent,e.t3=t.totalLPSupply,v=e.t2/e.t3,h=v*t.totalEFXSupply*t.efxPrice,f=v*t.totalBNBSupply*t.bnbPrice,t.userStakedLPValue=Number.parseFloat(h+f).toFixed(2);case 28:case"end":return e.stop()}}),e)})))()}}},m=(n(1061),n(61)),component=Object(m.a)(d,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("section",{staticClass:"section"},[r("div",{staticClass:"container"},[r("div",{staticClass:"has-text-centered block"},[r("img",{staticClass:"mb-5",attrs:{src:n(1038),width:"130"}}),t._v(" "),r("h2",{staticClass:"site-title is-spaced title"},[t._v("Bridge")]),t._v(" "),r("h4",{staticClass:"subtitle"},[t._v("Transfer EFX between EOS and your BSC Wallet.")])])])]),t._v(" "),r("tabs",{attrs:{active:"farm"}}),t._v(" "),r("div",{staticClass:"box is-horizontal-centered is-centered px-6 content",staticStyle:{"max-width":"550px"}},[r("nuxt-link",{attrs:{to:"/farms"}},[t._v("< Back")]),t._v(" "),r("h3",{staticClass:"title has-text-centered is-4 mt-5 mb-3"},[t._v("Stake your EFX-BNB LP")]),t._v(" "),r("h4",{staticClass:"subtitle is-6 has-text-centered has-text-weight-light mb-5 mt-2"},[t._v("And earn EFX rewards!")]),t._v(" "),r("div",{staticClass:"columns is-vcentered is-centered mt-3"},[r("div",{staticClass:"column is-align-self-stretch is-5"},[r("div",{staticClass:"box is-shadowless has-border has-text-centered"},[r("div",{staticClass:"subtitle has-text-weight-semibold mb-2"},[t._v("BSC")]),t._v(" "),t.bscWallet?t._e():r("img",{attrs:{src:n(1039),height:"100"}}),t._v(" "),t.bscWallet?r("div",[r("a",{staticClass:"blockchain-address",attrs:{href:t.$bsc.explorer+"/address/"+t.bscWallet[0],target:"_blank"}},[t._v(t._s(t.bscWallet[0]))]),t._v(" "),r("a",{staticClass:"has-text-danger",on:{click:function(e){return t.$bsc.logout()}}},[r("small",{staticClass:"is-size-7"},[t._v("Disconnect")])])]):r("div",[r("a",{staticClass:"button is-small is-accent",on:{click:function(e){t.$bsc.loginModal=!0}}},[r("strong",[t._v("Connect BSC")])])])])])]),t._v(" "),t.bscWallet?r("div",[t.endedFarm?r("div",{staticClass:"has-text-centered my-5 notification is-warning"},[r("h4",{staticClass:"mb-2"},[t._v("Farm ended")]),t._v(" "),r("p",[t._v("This farm ended at "+t._s(new Date(1e3*t.$masterchef.endDate).toISOString().slice(0,10))+" "),r("br"),t._v("\n              If you still have LP tokens staked, you should unstake them below.")])]):t.notStartedFarm?r("div",{staticClass:"has-text-centered my-5 notification is-warning"},[r("h5",[t._v("Farm not started yet")]),t._v(" "),r("p",[t._v("Starts at: "),r("a",{attrs:{href:t.$bsc.explorer+"/block/"+t.$masterchef.startBlock,target:"_blank"}},[t._v(t._s(t.$masterchef.startBlock))]),t._v(" "),r("br"),t._v("Current block: "+t._s(t.$masterchef.latestBlockNumber))])]):t._e()]):t._e(),t._v(" "),r("div",{staticClass:"column"},[t._m(0),t._v(" "),r("div",{staticClass:" has-text-centered"},[r("a",{staticClass:"blockchain-address",attrs:{href:t.$bsc.explorer+"/address/"+t.farm.contract,target:"_blank"}},[t._v(t._s(t.farm.contract))])]),t._v(" "),r("table",{staticClass:"table is-narrow"},[r("tbody",[r("tr",[r("th",[t._v("End Date:")]),t._v(" "),t.$masterchef.endDate?r("td",[t._v(t._s(new Date(1e3*t.$masterchef.endDate).toISOString().slice(0,10)))]):r("td",[t._v("...")]),t._v(" "),r("td")]),t._v(" "),r("tr",[r("th",[t._v("EFX Reward / Day")]),t._v(" "),r("td",[t._v(t._s(Math.round(t.$masterchef.efxPerBlock/1e18*28800)))]),t._v(" "),r("td")]),t._v(" "),r("tr",[r("th",[t._v("EFX-BNB LP Locked")]),t._v(" "),r("td",[t._v(t._s(t.$masterchef.lockedTokens))]),t._v(" "),r("td",{staticClass:"is-6 has-text-weight-light "},[t._v("$"+t._s(this.poolStakedLPValue)+" USD")])]),t._v(" "),t.farm.active?r("tr",[r("th",[t._v("APR")]),t._v(" "),t.$masterchef.apr?r("td",[t._v(t._s(t.$masterchef.apr)+"%")]):r("td",[t._v("...")]),t._v(" "),r("td")]):t._e()])])]),t._v(" "),t.bscWallet?r("div",[null===t.$masterchef.approved?r("div",[t._v("\n              Loading approval state..\n          ")]):t.$masterchef.approved?r("div",[t.notStartedFarm?t._e():r("div",[r("h4",[t._v("Harvest EFX")]),t._v(" "),t._m(1),t._v(" "),r("div",{staticClass:"field has-addons"},[r("div",{staticClass:"control is-flex-grow-1"},[r("input",{staticClass:"input is-medium",attrs:{disabled:"",type:"text"},domProps:{value:t.bscWallet?parseFloat(t.$masterchef.pendingEfx).toFixed(2):"- login with your BSC wallet -"}})]),t._v(" "),t._m(2)]),t._v(" "),r("button",{staticClass:"button is-medium is-accent is-fullwidth mt-5",attrs:{disabled:!t.bscWallet||t.$masterchef.pendingEfx<1},on:{click:function(e){return t.claimPendingEFX()}}},[r("strong",[t._v("Harvest")])])]),t._v(" "),r("hr"),t._v(" "),r("h4",{staticClass:"mb-2"},[t._v("Staked EFX-BNB LP")]),t._v(" "),r("h4",{staticClass:"subtitle is-6 has-text-weight-light mb-0 mt-0"},[t._v("EFX-BNB LP staked:\n                  "),null!==t.$masterchef.stakedLpBalance?r("span",[t._v(t._s(parseFloat(t.$masterchef.stakedLpBalance).toFixed(2))+" ("+t._s((t.$masterchef.stakedLpBalance/t.$masterchef.lockedTokens*100).toFixed(2))+"% of total pool)"),r("p",{staticClass:"align-userLPValue"},[t._v("$"+t._s(this.userStakedLPValue)+" USD")])]):r("span",[t._v("-")])]),t._v(" "),r("p",{staticClass:"mb-5"},[r("a",{attrs:{href:t.$masterchef.lpPool,target:"_blank"}},[t._v("Get EFX-BNB LP")])]),t._v(" "),r("div",{staticClass:"is-size-7 columns mb-0 mt-4 is-mobile"},[t.endedFarm?t._e():r("div",{staticClass:"column py-0"},[r("button",{staticClass:"button is-medium is-primary is-fullwidth",class:{"is-outlined":"stake"!=t.activeForm},on:{click:function(e){t.activeForm="stake"}}},[r("strong",[t._v("Stake")])])]),t._v(" "),r("div",{staticClass:"column py-0"},[r("button",{staticClass:"button is-medium is-primary is-fullwidth",class:{"is-outlined":"unstake"!=t.activeForm},on:{click:function(e){t.activeForm="unstake"}}},[r("strong",[t._v("Unstake")])])])]),t._v(" "),"stake"!=t.activeForm||t.endedFarm?"unstake"==t.activeForm?r("div",[r("div",{staticClass:"is-size-7 columns mb-0 mt-5 is-mobile"},[r("div",{staticClass:"column py-0"},[t._v("\n                              Amount\n                          ")]),t._v(" "),r("div",{staticClass:"column has-text-right py-0"},[t._v("\n                              EFX-BNB LP staked:\n                              "),null!==t.$masterchef.stakedLpBalance?r("span",[r("a",{on:{click:function(e){t.stakedLpAmount=t.$masterchef.stakedLpBalance}}},[t._v(t._s(parseFloat(t.$masterchef.stakedLpBalance).toFixed(2)))])]):r("span",[t._v("-")])])]),t._v(" "),r("div",{staticClass:"field has-addons"},[r("div",{staticClass:"control is-flex-grow-1 has-icons-right"},[r("input",{directives:[{name:"model",rawName:"v-model",value:t.stakedLpAmount,expression:"stakedLpAmount"}],staticClass:"input is-medium",attrs:{type:"number",placeholder:"Minimum 1",min:"0"},domProps:{value:t.stakedLpAmount},on:{input:function(e){e.target.composing||(t.stakedLpAmount=e.target.value)}}}),t._v(" "),null!==t.$masterchef.stakedLpBalance?r("span",{staticClass:"control icon is-right max-amount"},[r("a",{on:{click:function(e){t.stakedLpAmount=t.$masterchef.stakedLpBalance}}},[t._v("Max")])]):t._e()]),t._v(" "),t._m(4)]),t._v(" "),r("button",{staticClass:"button is-medium is-accent is-fullwidth mt-5",attrs:{disabled:!t.stakedLpAmount||t.stakedLpAmount<1},on:{click:function(e){return t.withdrawLpFromMasterChef(t.stakedLpAmount)}}},[r("strong",[t._v("Confirm Unstake")])]),t._v(" "),r("hr")]):t._e():r("div",[r("div",{staticClass:"is-size-7 columns mb-0 mt-5 is-mobile"},[r("div",{staticClass:"column py-0"},[t._v("\n                          Amount\n                      ")]),t._v(" "),r("div",{staticClass:"column has-text-right py-0"},[t._v("\n                          Balance:\n                          "),null!==t.$masterchef.lpBalance?r("span",[r("a",{on:{click:function(e){t.lpAmount=t.$masterchef.lpBalance}}},[t._v(t._s(parseFloat(t.$masterchef.lpBalance)))])]):r("span",[t._v("-")])])]),t._v(" "),r("div",{staticClass:"field has-addons"},[r("div",{staticClass:"control is-flex-grow-1 has-icons-right"},[r("input",{directives:[{name:"model",rawName:"v-model",value:t.lpAmount,expression:"lpAmount"}],staticClass:"input is-medium",attrs:{type:"number",placeholder:"Minimum 1",min:"0"},domProps:{value:t.lpAmount},on:{input:function(e){e.target.composing||(t.lpAmount=e.target.value)}}}),t._v(" "),null!==t.$masterchef.lpBalance?r("span",{staticClass:"control icon is-right max-amount"},[r("a",{on:{click:function(e){t.lpAmount=t.$masterchef.lpBalance}}},[t._v("Max")])]):t._e()]),t._v(" "),t._m(3)]),t._v(" "),r("button",{staticClass:"button is-medium is-accent is-fullwidth mt-5",attrs:{disabled:!t.lpAmount||t.lpAmount<1},on:{click:function(e){return t.depositLpIntoMasterChef(t.lpAmount)}}},[r("strong",[t._v("Confirm Stake")])]),t._v(" "),r("hr")])]):t.$masterchef.approved?t._e():r("div",[r("div",{staticClass:"is-size-7 columns mb-0 is-mobile"},[r("button",{staticClass:"button is-medium is-accent is-fullwidth mt-5",on:{click:function(e){return t.approveAllowance()}}},[r("strong",[t._v("Approve")])])]),t._v(" "),r("hr")]),t._v(" "),t.success?r("div",{staticClass:"notification mt-5 is-success"},[r("button",{staticClass:"delete",on:{click:function(e){t.success=null}}}),t._v("\n              "+t._s(t.success)+"\n          ")]):t._e(),t._v(" "),t.error?r("div",{staticClass:"notification mt-5 is-danger"},[r("button",{staticClass:"delete",on:{click:function(e){t.error=null}}}),t._v("\n              "+t._s(t.error)+"\n          ")]):t._e(),t._v(" "),t.loading?r("div",{staticClass:"loader-wrapper is-active"},[r("div",{staticClass:"loader is-loading"}),t._v(" "),r("br"),t._v(" "),r("p",[t._v("Waiting for the transaction to complete...")])]):t._e()]):t._e(),t._v(" "),r("br")],1),t._v(" "),r("br")],1)}),[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"has-text-centered"},[n("h4",[t._v("Farm info:")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"is-size-7 columns mb-0 is-mobile"},[n("div",{staticClass:"column py-0"},[t._v("\n                          Rewards\n                      ")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",{staticClass:"control"},[n("a",{staticClass:"button is-static is-medium"},[t._v("EFX")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",{staticClass:"control"},[n("a",{staticClass:"button is-static is-medium"},[t._v("EFX-BNB LP")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",{staticClass:"control"},[n("a",{staticClass:"button is-static is-medium"},[t._v("EFX-BNB LP")])])}],!1,null,"4cbdc41c",null);e.default=component.exports}}]);