!function(t){var e={};function n(i){if(e[i])return e[i].exports;var s=e[i]={i:i,l:!1,exports:{}};return t[i].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)n.d(i,s,function(e){return t[e]}.bind(null,s));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";function i(t,e=null){let n=t;return"string"==typeof t&&(n=document.getElementById(t)),null!=n&&(null==e||n instanceof e)?n:null}n.r(e);const s=[],r=[],a=[],o=[];class l{constructor(t,e){if(this.simulator=t,this.canvas=i(e,HTMLCanvasElement),null==this.canvas)throw new Error(`The screen must be an HTMLCanvasElement, ${typeof this.canvas} provided.`);this.tilemap=this.simulator.tilemap.getContext("2d"),this.screen=this.canvas.getContext("2d")}render(t){const{tilemap:e,screen:n}=this;e.clearRect(0,0,1024,1024),e.drawImage(this.simulator.source,0,0);const i=e.getImageData(0,0,1024,1024).data,l=n.createImageData(256,224),u=l.data;let c=t.begin();for(let t=0;t<256;t++)s[t]=s[t]||{},c.transform(t,0,s[t]).entry=c;const{isNaN:h}=Number,{fixed:d}=this.simulator.colors,m=d.red,f=d.green,p=d.blue,y=d.alpha;for(let t=0;t<224;t++){o[t]=o[t]||{},r[t]=r[t]||{},c.transform(0,t,o[t]).entry=c,c.transform(255,t,r[t]).entry=c;for(let e=0;e<256;e++){const n=4*(256*t+e),s=4*c.transformToPixelIndex(e,t);h(s)?(u[n]=m,u[n+1]=f,u[n+2]=p,u[n+3]=y):(u[n]=i[s],u[n+1]=i[s+1],u[n+2]=i[s+2],u[n+3]=i[s+3])}c=c.nextScanline()}for(let t=224;t<255;t++)o[t]=o[t]||{},r[t]=r[t]||{},c.transform(0,t,o[t]).entry=c,c.transform(255,t,r[t]).entry=c,c=c.nextScanline();for(let t=0;t<256;t++)a[t]=a[t]||{},c.transform(t,255,a[t]).entry=c;n.putImageData(l,0,0),this.drawScreenBorder(e,s),this.drawScreenBorder(e,r),this.drawScreenBorder(e,a),this.drawScreenBorder(e,o)}drawScreenBorder(t,e){const{colors:n}=this.simulator,i=n.real.toRGBA(),s=n.virtual.toRGBA();let r=null,a=Number.NaN,o=Number.NaN,l=null;t.beginPath(),t.lineWidth=5,e.forEach(e=>{const{x:n,y:u,entry:c}=e,h=Math.floor(e.x/1024),d=Math.floor(e.y/1024),m=0==(128&c.settings)||0===h&&0===d?i:s;c.wrapToTilemap(e,e),r!==m||a!==h||o!==d||l!==c?(t.stroke(),t.beginPath(),t.strokeStyle=m,t.moveTo(e.x,e.y),r=m,a=h,o=d,l=c):t.lineTo(e.x,e.y)}),t.stroke()}}function u(t,e,n){return Math.max(e,Math.min(n,t))}function c(t,e,n=" "){return t.length>=e?t:new Array(1+e-t.length).join(n)+t}const h=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;class d{constructor(t=0,e=0,n=0,i=255){this.setTo(t,e,n,i)}setTo(t,e,n,i=null){return this.red=u(Math.round(t),0,255),this.green=u(Math.round(e),0,255),this.blue=u(Math.round(n),0,255),null!=i&&(this.alpha=u(Math.round(i),0,255)),this}setFromHex(t){const e=t.match(h);return null==e?this:this.setTo(parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16))}toHex(){return`#${c((this.red<<16|this.green<<8|this.blue).toString(16).toUpperCase(),6,"0")}`}toRGBA(){return`rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha/255})`}}function m(t,[e]){return e}m.metadata={name:"Constant",values:["Value"]};const{hasOwnProperty:f}=Object.prototype;class p{constructor(...t){this.func=m,this.min=Number.NEGATIVE_INFINITY,this.max=Number.POSITIVE_INFINITY,t[0]instanceof Function&&(this.func=t.shift()),this.values=t.map(Number).filter(t=>!Number.isNaN(t)),0===this.values.length&&this.values.push(0)}getValue(t){return this.func(t,this.values)}setRange(t,e){null!=t&&(this.min=Number(t)),null!=e&&(this.max=Number(e));const{values:n}=this;for(let i=0;i<n.length;i++)n[i]=u(n[i],t,e);return this}}const y={x:0,y:0};class v{constructor(t,e={}){this.scanlines=t-1,this.scanline=0,this.parameters={},this.values={},this.settings=0,this.wrapPoint=this.wrapToTilemap,this.previousEntry=null,this.nextEntry=null,this.createParameter(e,"matrixA",-128,128,1),this.createParameter(e,"matrixB",-128,128),this.createParameter(e,"matrixC",-128,128),this.createParameter(e,"matrixD",-128,128,1),this.createParameter(e,"offsetX",-4096,4095),this.createParameter(e,"offsetY",-4096,4095),this.createParameter(e,"centerX",-4096,4095),this.createParameter(e,"centerY",-4096,4095)}begin(){this.scanline=0,this.updateValues();const{values:t,settings:e}=this;return t.flipX=0!=(1&e),t.flipY=0!=(2&e),this.wrapPoint=0==(128&e)?this.wrapToTilemap:0==(64&e)?this.wrapToFixed:this.wrapToFirstTile,this}nextScanline(){return this.scanline+=1,this.scanline>this.scanlines&&(this.scanline=this.scanlines,null!=this.nextEntry)?this.nextEntry.begin():(this.updateValues(),this)}transform(t,e,n={}){const{values:i}=this,{matrixA:s,matrixB:r,matrixC:a,matrixD:o,offsetX:l,offsetY:u,centerX:c,centerY:h}=i;return i.flipX&&(t=256-t),i.flipY&&(e=256-e),n.x=Math.round(s*(t+l-c)+r*(e+u-h)+c),n.y=Math.round(a*(t+l-c)+o*(e+u-h)+h),n}transformToPixelIndex(t,e,n=y){const{x:i,y:s}=this.wrapPoint(this.transform(t,e,y),y);return i+1024*s}wrapToTilemap({x:t,y:e},n={}){return n.x=t>=0?t%1024:(t%1024+1024)%1024,n.y=e>=0?e%1024:(e%1024+1024)%1024,n}wrapToFirstTile({x:t,y:e},n={}){return t<0||t>=1024||e<0||e>=1024?(n.x=t>=0?t%8:(t%8+8)%8,n.y=e>=0?e%8:(e%8+8)%8):(n.x=t,n.y=e),n}wrapToFixed({x:t,y:e},n={}){return t<0||t>=1024||e<0||e>=1024?(n.x=Number.NaN,n.y=Number.NaN):(n.x=t,n.y=e),n}createParameter(t,e,n,i,s=0){const r=t[e];this.parameters[e]=r instanceof p?r.setRange(n,i):"number"!=typeof r?new p(s).setRange(n,i):new p(r).setRange(n,i)}updateValues(){const{parameters:t,values:e}=this,n=this.scanline/this.scanlines;e.matrixA=t.matrixA.getValue(n),e.matrixB=t.matrixB.getValue(n),e.matrixC=t.matrixC.getValue(n),e.matrixD=t.matrixD.getValue(n),e.offsetX=t.offsetX.getValue(n),e.offsetY=t.offsetY.getValue(n),e.centerX=t.centerX.getValue(n),e.centerY=t.centerY.getValue(n)}}class g{constructor(t){this.simulator=t,this.position=0,this.previousEntry=null,this.nextEntry=new v(256),this.nextEntry.previousEntry=this}}class x extends v{constructor(){super(1),this.parameters=null,this.progress=0,this.nextFrame=null}nextScanline(){return null==this.nextEntry?this:(this.nextEntry.progress=this.progress,this.nextEntry.nextFrame=this.nextFrame.nextEntry,this.nextEntry.begin())}updateValues(){Object.keys(this.calculated).forEach(t=>{const e=this.calculated[t],n=this.nextFrame.calculated[t];this.values[t]=e+this.progress*(n-e)})}}class E{constructor(t){this.keyframes=t,this.animation=null}render(){return this.animation=[],this.keyframes.forEach(t=>{let e=t.nextEntry.begin(),n=new x;this.animation.push({keyframe:t,entry:n});for(let t=0;t<255;t++){n.calculated=Object.assign({},e.values),n.settings=e.settings;const t=new x;t.previousEntry=n,n.nextEntry=t,n=t,e=e.nextScanline()}n.previousEntry.nextEntry=null}),this.animation}}class b{constructor(t){this.simulator=t,this.animation=null,this.timestamp=null,this.lastTime=null,this.id=null,this.onComplete=null,this.callback=this.step.bind(this)}render(){const t=new E(this.simulator.keyframes);this.animation=t.render()}start(){null==this.timestamp&&(null==this.animation&&this.render(),this.lastTime=0,this.timestamp=window.performance.now(),this.time=0,this.id=window.requestAnimationFrame(this.callback))}step(){this.lastTime=this.timestamp,this.timestamp=window.performance.now(),this.time+=this.timestamp-this.lastTime;let t=0;for(let e=0;e<this.animation.length&&!(this.animation[e].keyframe.position>this.time);e++)t=e;if(t===this.animation.length-1)return void(null!=this.onComplete&&this.onComplete());const e=this.animation[t],n=this.animation[t+1],i=e.keyframe.position,s=n.keyframe.position;e.entry.progress=u((this.time-i)/(s-i),0,1),e.entry.nextFrame=n.entry,this.simulator.renderer.render(e.entry),this.id=window.requestAnimationFrame(this.callback)}}window.AnimationHandler=b;class w{constructor(t,e,n){if(window.simulator=this,this.source=i(t,Image),this.tilemap=i(e,HTMLCanvasElement),null==this.source)throw new Error(`The tilemap source must be an Image, ${typeof this.source} provided.`);if(null==this.tilemap)throw new Error(`The tilemap must be an HTMLCanvasElement, ${typeof this.tilemap} provided.`);this.renderer=new l(this,n),this.keyframes=[new g(this)],this.keyframe=0,this.colors={fixed:new d,real:new d(0,0,255),virtual:new d(255,0,0,102)},this.onSourceLoad=this.refresh.bind(this),this.source.addEventListener("load",this.onSourceLoad)}refresh(){const t=this.keyframes[this.keyframe]||this.keyframes[0];null!=t&&this.renderer.render(t.nextEntry)}}class k{constructor(t,e){this.ui=t,this.key=e,this.input=null}addToDOM(){if(null!=this.input)return;const t=this.ui.simulator.colors[this.key];if(null==t)return;const e=document.getElementById(`color-${this.key}`);null!=e&&(e.value=t.toHex(),e.addEventListener("input",this.onInput.bind(this)),e.addEventListener("blur",this.onBlur.bind(this)),this.input=e)}onInput(){const{simulator:t}=this.ui;t.colors[this.key].setFromHex(this.input.value),t.refresh()}onBlur(){const{simulator:t}=this.ui,e=t.colors[this.key];e.setFromHex(this.input.value),this.input.value=e.toHex(),t.refresh()}}function M(t,[e,n]){return e+t*(n-e)}function T(t){const e=t>=0?t:1+(65535^Math.abs(t));return c(Math.round(e).toString(16).toUpperCase(),4,"0")}M.metadata={name:"Linear",values:["Start","End"]};const C=/^(-?[a-z]+ +)?(-?[0-9a-f.]+)$/i,L=2*Math.PI,D=Math.PI/180,O=["abs","cbrt","ceil","clz32","cos","cosh","cot","csc","exp","expm1","floor","fround","log","log10","log1p","log2","random","round","sign","sec","sin","sinh","sqrt","tan","tanh","trunc"],S=["cos","cot","csc","sec","sin","tan"],I={cot:t=>1/Math.tan(t),csc:t=>1/Math.sin(t),sec:t=>1/Math.cos(t)};function N(t){if(!("DOMParser"in window)){const e=document.createElement("div");return e.innerHTML=t,e}return(new DOMParser).parseFromString(t,"text/html").body}function B(t,[e,n]){return e+Math.sin(t*Math.PI)*(n-e)}B.metadata={name:"Sinusoidal",values:["Minimum","Maximum"]};const P='<span class="list-group-item list-group-item-action pointer">\n    For <input type="number" min="1" max="256" class="scanlines form-control d-inline w-25"> <span class="scanline-label">scanlines</span>\n    <span class="float-right ml-3 pointer remove"><svg class="icon" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"/></svg></span>\n    <span class="float-right ml-3 pointer down"><svg class="icon" width="10" height="16" viewBox="0 0 10 16"><path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"/></svg></span>\n    <span class="float-right ml-3 pointer up"><svg class="icon" width="10" height="16" viewBox="0 0 10 16"><path fill-rule="evenodd" d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5 5 5z"/></svg></span>\n</span>',A='<div class="form-group row">\n    <label class="col-md-2 col-form-label name"></label>\n    <div class="col-md-10 form-row fields">\n        <div class="col static">\n            <select class="custom-select functions"></select>\n        </div>\n    </div>\n</div>',F='<div class="col input-float">\n    <label></label>\n    <div class="input-group">\n        <div class="input-group-prepend">\n            <span class="input-group-text">$</span>\n        </div>\n        <input type="text">\n    </div>\n</div>',q='<div class="form-group row">\n    <label class="col-md-2 col-form-label">Settings</label>\n    <div class="col-md-10 form-row align-items-center">\n        <div class="col input-float input-float-start">\n            <label>Playing field</label>\n            <div class="input-group">\n                <select class="custom-select playfield">\n                    <option value="128">Don\'t wrap</option>\n                    <option value="0">Wrap to tilemap</option>\n                    <option value="192">Wrap to first tile</option>\n                </select>\n            </div>\n        </div>\n        <div class="col">\n            <div class="custom-control custom-checkbox">\n                <input type="checkbox" id="field-flip-x" class="custom-control-input" value="1">\n                <label for="field-flip-x" class="custom-control-label">Flip X</label>\n            </div>\n        </div>\n        <div class="col">\n            <div class="custom-control custom-checkbox">\n                <input type="checkbox" id="field-flip-y" class="custom-control-input" value="2">\n                <label for="field-flip-y" class="custom-control-label">Flip Y</label>\n            </div>\n        </div>\n        <div class="col flex-basis-auto value"></div>\n    </div>\n</div>',Y={matrixA:{name:"Matrix A",decimal:256},matrixB:{name:"Matrix B",decimal:256},matrixC:{name:"Matrix C",decimal:256},matrixD:{name:"Matrix D",decimal:256},offsetX:{name:"Offset X"},offsetY:{name:"Offset Y"},centerX:{name:"Center X"},centerY:{name:"Center Y"}},V=[m,M,B];class X{constructor(t,e){this.ui=t,this.entry=e,this.dom=null}addToDOM(){if(null!=this.dom)return;const t=N(P).firstElementChild;t.addEventListener("click",this.onItemClick.bind(this));const e=t.querySelector(".scanlines");e.value=this.entry.scanlines+1,e.addEventListener("input",this.onScanlineInput.bind(this));const n=t.querySelector(".scanline-label");n.innerText=0===this.entry.scanlines?"scanline":"scanlines";const i=t.querySelector(".up");i.addEventListener("click",this.onUpClick.bind(this));const s=t.querySelector(".down");s.addEventListener("click",this.onDownClick.bind(this));const r=t.querySelector(".remove");r.addEventListener("click",this.onRemoveClick.bind(this));const a=document.getElementById("entries");a.appendChild(t),this.dom={entries:a,item:t,scanlines:e,scanlineLabel:n,up:i,down:s,remove:r}}removeFromDOM(){null!=this.dom&&(this.dom.entries.removeChild(this.dom.item),this.dom=null)}onItemClick(t,e=!1){const{entries:n,item:i}=this.dom;if(!0!==e&&(t.target!==i||i.classList.contains("active")))return;const s=n.querySelector(".active");null!=s&&s.classList.remove("active"),i.classList.add("active");const r=document.getElementById("parameters");for(;null!=r.firstChild;)r.removeChild(r.firstChild);const{entry:a}=this;Object.keys(Y).forEach(t=>{const e=Y[t],n=N(A).firstElementChild;n.querySelector(".name").innerText=e.name;const i=i=>{const s=a.parameters[t],r=n.querySelector(".fields");for(;null!=r.lastChild&&"col static"!==r.lastChild.className;)r.removeChild(r.lastChild);s.func=i,i.metadata.values.forEach((t,n)=>{null==s.values[n]&&(s.values[n]=0);const i=N(F).firstElementChild,a=null==e.decimal?null:document.createElement("span"),o=null==e.decimal?1:e.decimal;i.querySelector("label").innerText=t;const l=i.querySelector("input");l.className="form-control",l.placeholder=t,l.value=T(s.values[n]*o),null!=a&&(a.innerText=`= ${s.values[n]}`,i.appendChild(a)),l.addEventListener("input",()=>{const t=u(function(t,e=1){const n=C.exec(t.trim());if(null==n)return 0;let i=Number.NaN;if(null==n[1])i=-1===n[2].indexOf(".")?parseInt(n[2],16):Math.round(Number(n[2])*e);else{let t=Number(n[2]);if(Number.isNaN(t))return 0;const s=n[1].trim(),r="-"===s[0]?-1:1,a=-1===r?s.slice(1):s;if(-1===O.indexOf(a))return 0;-1!==S.indexOf(a)&&(t=t>=L?t*D:t);const o=I[a]||Math[a];i=Math.round(o(t)*r*e)}return Number.isNaN(i)?0:(i=Math.round(i*e)/e)>=32768?-(1+(65535^i)):i}(l.value,o)/o,s.min,s.max);null!=a&&(a.innerText=`= ${t}`),s.values[n]=t,this.ui.simulator.refresh()}),l.addEventListener("blur",()=>{l.value=T(s.values[n]*o),null!=a&&(a.innerText=`= ${s.values[n]}`)}),r.appendChild(i)})},s=n.querySelector(".functions");V.forEach(t=>{const e=document.createElement("option");e.innerText=t.metadata.name,e.value=t.metadata.name,s.appendChild(e)}),s.addEventListener("change",()=>{const t=V.find(t=>t.metadata.name===s.value);null!=t&&(i(t),this.ui.simulator.refresh())}),i(a.parameters[t].func),r.appendChild(n)});const o=N(q).firstElementChild,l=o.querySelectorAll("select, input"),h=o.querySelector(".value"),d=()=>{a.settings=Array.prototype.reduce.call(l,(t,e)=>{if(!1===e.checked)return t;const n=parseInt(e.value,10);return Number.isNaN(n)?t:t|n},0),h.innerText=`= $${c(a.settings.toString(16).toUpperCase(),2,"0")} = %${c(a.settings.toString(2),8,"0")}`,this.ui.simulator.refresh()},m=o.querySelector(".playfield");m.value=192&a.settings,m.addEventListener("change",d);let f=`field-${Math.floor(32768*Math.random())}`;const p=o.querySelector("#field-flip-x");p.labels[0].setAttribute("for",f),p.id=f,p.checked=0!=(1&a.settings),p.addEventListener("change",d),f=`field-${Math.floor(32768*Math.random())}`;const y=o.querySelector("#field-flip-y");y.labels[0].setAttribute("for",f),y.id=f,y.checked=0!=(2&a.settings),y.addEventListener("change",d),h.innerText=`= $${c(a.settings.toString(16).toUpperCase(),2,"0")} = %${c(a.settings.toString(2),8,"0")}`,r.appendChild(o)}onScanlineInput(){const t=u(this.dom.scanlines.value,1,256)||1;this.dom.scanlines.value=t,this.dom.scanlineLabel.innerText=1===t?"scanline":"scanlines",this.entry.scanlines=t-1,this.ui.simulator.refresh()}onUpClick(t){if(t.preventDefault(),1===this.ui.entries.length)return;const{entry:e}=this;if(null==e.previousEntry||!(e.previousEntry instanceof v))return;this.swap(e,e.previousEntry);const n=this.dom.item.previousElementSibling;if(null==n)return;this.dom.entries.insertBefore(this.dom.item,n);const i=this.ui.entries.indexOf(this);i>0&&(this.ui.entries[i]=this.ui.entries[i-1],this.ui.entries[i-1]=this),this.ui.simulator.refresh()}onDownClick(t){if(t.preventDefault(),1===this.ui.entries.length)return;const{entry:e}=this;if(null==e.nextEntry)return;this.swap(e,e.nextEntry);const n=this.dom.item.nextElementSibling;if(null==n)return;this.dom.entries.insertBefore(this.dom.item,n.nextSibling);const i=this.ui.entries.indexOf(this);-1!==i&&i+1<this.ui.entries.length&&(this.ui.entries[i]=this.ui.entries[i+1],this.ui.entries[i+1]=this),this.ui.simulator.refresh()}onRemoveClick(t){if(t.preventDefault(),1===this.ui.entries.length)return void window.alert("You can't remove the last entry.");if(!window.confirm("Are you sure?"))return;this.removeEntry(this.entry),this.dom.item.parentNode.removeChild(this.dom.item);const e=this.ui.entries.indexOf(this);-1!==e&&this.ui.entries.splice(e,1),this.dom.item.classList.contains("active")&&this.ui.entries[0].onItemClick(null,!0),this.ui.simulator.refresh()}swap(t,e){if(t===e)return;const n=t.previousEntry,i=e.previousEntry;n===e?(this.removeEntry(t),this.insertAfter(t,i)):i===t?(this.removeEntry(e),this.insertAfter(e,n)):(this.removeEntry(t),this.removeEntry(e),this.insertAfter(t,i),this.insertAfter(e,n))}insertAfter(t,e){e&&(t.nextEntry=e.nextEntry,e.nextEntry=t),t.previousEntry=e,t.nextEntry&&(t.nextEntry.previousEntry=t)}removeEntry(t){null!=t.previousEntry&&(t.previousEntry.nextEntry=t.nextEntry),null!=t.nextEntry&&(t.nextEntry.previousEntry=t.previousEntry),t.previousEntry=null,t.nextEntry=null}}class j{constructor(t){this.ui=t,this.dom=null,this.onButtonClick=this.addEntry.bind(this)}addToDOM(){if(null!=this.dom)return;const t=document.getElementById("add-entry");t.addEventListener("click",this.onButtonClick),this.dom=t}removeFromDOM(){null!=this.dom&&(this.dom.removeEventListener("click",this.onButtonClick),this.dom=null)}addEntry(t){const e=new v(1);let n=this.ui.keyframe.nextEntry;for(;null!=n.nextEntry;)n=n.nextEntry;n.nextEntry=e,e.previousEntry=n;const i=new X(this.ui,e);i.addToDOM(),this.ui.entries.push(i),this.ui.simulator.refresh(),t.preventDefault()}}const H='<span class="keyframe">\n    <span class="badge badge-pill badge-dark"></span>\n</span>';class R{constructor(t,e){this.ui=t,this.simulator=t.simulator,this.keyframe=e,this.entries=[];let n=e.nextEntry;for(;null!=n;)this.entries.push(new X(this,n)),n=n.nextEntry;this.addEntry=new j(this),this.dom=null,this.active=!1,this.lastPosition=null}addToDOM(){if(null!=this.dom)return;const t=N(H).firstElementChild;t.addEventListener("mousedown",this.onMouseDown.bind(this)),t.addEventListener("mouseup",this.onMouseUp.bind(this)),this.ui.timeline.appendChild(t),this.dom=t,this.setPosition(this.keyframe.position)}removeFromDOM(){null!=this.dom&&(this.dom.parentNode.removeChild(this.dom),this.deactivate(),this.dom=null)}onMouseDown(t){this.lastPosition=this.keyframe.position,this.ui.startDrag(this)}onMouseUp(t){this.ui.stopDrag(),this.keyframe.position==this.lastPosition&&this.activate(t)}setPosition(t){const{keyframe:e,dom:n}=this;e.position=t,this.simulator.keyframes.sort((t,e)=>t.position-e.position),n.style.left=`${.2*t+4}px`,n.querySelector(".badge").innerText=`${Math.round(t/10)/100} sec`}activate(t,e=!1){if(null==this.dom||!e&&this.active)return;this.ui.keyframes.forEach(t=>{t.active&&t.deactivate()}),this.entries.forEach(t=>{t.addToDOM()}),this.entries[0].onItemClick(null,!0),this.addEntry.addToDOM(),this.dom.classList.add("active"),this.active=!0;const n=this.simulator.keyframes.indexOf(this.keyframe);-1!==n&&(this.simulator.keyframe=n,this.simulator.refresh())}deactivate(){this.active&&null!=this.dom&&(this.entries.forEach(t=>{t.removeFromDOM()}),this.addEntry.removeFromDOM(),this.dom.classList.remove("active"),this.active=!1)}}class U{constructor(t){this.ui=t,this.button=null,this.onButtonClick=this.addKeyframe.bind(this)}addToDOM(){if(null!=this.button)return;const t=document.getElementById("add-keyframe");t.addEventListener("click",this.onButtonClick),this.button=t}addKeyframe(t){const{simulator:e}=this.ui,{keyframes:n}=e,i=n[n.length-1],s=new g(e);s.position=null==i?0:i.position+250,e.keyframes.push(s);const r=new R(this.ui,s);r.addToDOM(),this.ui.keyframes.push(r),this.ui.updatePadding(),t.preventDefault()}}class K{constructor(t){this.timeline=t,this.simulator=t.simulator,this.dom=null,this.animation=null,this.onButtonClick=this.prepareAnimation.bind(this)}addToDOM(){if(null!=this.dom)return;const t=document.getElementById("play-animation");t.addEventListener("click",this.onButtonClick),this.dom={ui:document.getElementById("user-interface"),button:t}}prepareAnimation(t){if(t.preventDefault(),null!=this.animation)return;const{ui:e}=this.dom;this.animation=new b(this.simulator),this.animation.onComplete=(()=>{this.animation=null,this.timeline.keyframes[this.timeline.keyframes.length-1].activate(null,!0),e.classList.remove("hiding","hidden")}),this.animation.render(),window.scroll({top:0,behavior:"smooth"}),e.classList.add("hiding"),window.setTimeout(()=>{const{ui:t}=this.dom;t.classList.add("hidden"),this.animation.start()},1e3)}}class _{constructor(t){this.ui=t,this.button=null,this.onButtonClick=this.removeKeyframe.bind(this)}addToDOM(){if(null!=this.button)return;const t=document.getElementById("remove-keyframe");t.addEventListener("click",this.onButtonClick),this.button=t}removeKeyframe(t){const{ui:e}=this,{simulator:n}=e;if(t.preventDefault(),1===e.keyframes.length)return void window.alert("You can't remove the last keyframe.");const i=e.keyframes.find(t=>t.active),s=n.keyframes.indexOf(i.keyframe);null!=i&&-1!==s&&window.confirm("Are you sure?")&&(n.keyframes.splice(s,1),e.keyframes.splice(e.keyframes.indexOf(i),1),e.keyframes[e.keyframes.length-1].activate(null,!0),e.updatePadding(),i.removeFromDOM())}}class z{constructor(t){this.ui=t,this.simulator=t.simulator,this.keyframes=[],this.addKeyframe=new U(this),this.removeKeyframe=new _(this),this.play=new K(this),this.simulator.keyframes.forEach(t=>{this.keyframes.push(new R(this,t))}),this.timeline=null,this.dragging=null}addToDOM(){null==this.timeline&&(this.timeline=document.getElementById("timeline"),this.timeline.addEventListener("mousemove",this.onMouseMove.bind(this)),this.timeline.addEventListener("mouseup",this.stopDrag.bind(this)),this.addKeyframe.addToDOM(),this.removeKeyframe.addToDOM(),this.play.addToDOM(),this.keyframes.forEach(t=>{t.addToDOM()}),this.keyframes[0].activate(null,!0))}startDrag(t){this.dragging=t,this.offset=function(t){let e=0,n=t;for(;null!=n;)e+=n.offsetLeft,n=n.offsetParent;return e>=0?e:0}(this.timeline)}stopDrag(){this.dragging=null}updatePadding(){const{keyframes:t}=this.simulator,e=t[t.length-1];this.timeline.style.paddingRight=`${e.position/1e3*200+200}px`}onMouseMove(t){if(null==this.dragging)return;const e=(t.clientX-this.offset+this.timeline.parentNode.scrollLeft)/200*1e3,n=250*Math.round(e/250);for(let t=0;t<this.keyframes.length;t++)if(this.keyframes[t].keyframe.position===n)return;this.dragging.setPosition(n),this.updatePadding()}}class G{constructor(t){this.simulator=t,this.timeline=new z(this),this.colors=[]}addToDOM(){this.timeline.addToDOM(),Object.keys(this.simulator.colors).forEach(t=>{const e=new k(this,t);e.addToDOM(),this.colors.push(e)})}}document.addEventListener("DOMContentLoaded",function(){const t=document.createElement("img"),e=document.getElementById("tilemap"),n=document.getElementById("screen"),i=new w(t,e,n);new G(i).addToDOM(),t.src="assets/tilemap/grid.png";const s=document.getElementById("tilemap-file"),r=document.getElementById("tilemap-file-alert"),a=function(t){let e=0,n=t;for(;null!=n;)e+=n.offsetTop,n=n.offsetParent;return e>=0?e:0}(n)+.625*n.height;document.addEventListener("scroll",()=>{window.pageYOffset>a?n.classList.add("fixed"):n.classList.remove("fixed")});const o=document.getElementById("tilemap-container");$("#view-modal").on("show.bs.modal",function(t){this.querySelector(".modal-body").appendChild(e)}).on("hidden.bs.modal",function(t){o.appendChild(e)}),$("#change-upload-tab").on("show.bs.tab",t=>{r.classList.add("d-none")}),Array.prototype.forEach.call(document.getElementById("tilemap-choices").children,e=>{const n=e.firstElementChild;n instanceof HTMLImageElement&&n.addEventListener("click",e=>{t.src=n.src})}),s.addEventListener("change",e=>{const{files:n}=s;if(0===n.length)return;const i=n[0];if(!i.type.startsWith("image/")){r.innerText="You must select an image file.";const{classList:t}=r;return t.add("alert-danger"),t.remove("alert-success"),void t.remove("d-none")}r.classList.add("d-none");const a=new FileReader;a.onload=(e=>{t.src=e.target.result,r.innerText="Image selected.";const{classList:n}=r;n.add("alert-success"),n.remove("alert-danger"),n.remove("d-none")}),a.readAsDataURL(i)}),i.refresh()})}]);