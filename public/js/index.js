var t={134:t=>{t.exports=class{constructor(t,e,n,i){this.conditionalExpression=t,this.dataExpression=e,this.handlingExpression=n||"defaultTemplate",this.tripartite=i}}},824:t=>{t.exports=function(t,e){if(!t)return e;if(!e)return e;if(0!=e.indexOf("../")&&0!=e.indexOf("./"))return e;for(var n=t.split("/"),i=e.split("/");n.length&&!n[0];)n.shift();for(;i.length&&!i[0];)i.shift();if(0==e.indexOf("../")){for(;i.length&&".."==i[0];)n.pop(),i.shift();for(n.pop();i.length;)n.push(i.shift());return n.join("/")}if(0==e.indexOf("./")){for(i.shift(),n.pop();i.length;)n.push(i.shift());return n.join("/")}return e}},668:(t,e,n)=>{const i=n(502);let s=new Function("additionalContexts","with ({\n\t\t'$globals': additionalContexts.globalData\n\t}) {\n\t\twith (additionalContexts.dataFunctions) {\n\t\t\twith (additionalContexts.context) {\n\t\t\t\ttry {\n\t\t\t\t\treturn eval(additionalContexts.expression);\n\t\t\t\t} catch (e) {\n\t\t\t\t\treturn null;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}");function r(t,e,n,i){return n=n||{},i=i||{},s.call(this,{globalData:i,dataFunctions:n,context:t,expression:e})}t.exports=function(t,e,n,s){if(!e)return null;if("string"==typeof e&&(e=e.trim()),"$this"===e||"this"===e)return t;if("object"==typeof t&&e in t)return t[e];if('""'===e||"''"===e)return"";let a=i(t,e);return null==a&&(a=i({$globals:s},e)),null==a&&(a=r.call(t,t,e,n,s)),a}},268:(t,e,n)=>{let i=n(134);var s=n(824);let r=n(668);t.exports=class{constructor(t,e,n={},i="",s={}){this.tripartite=t,this.template=e,this.destination=i,this.initialData=n,this.currentData=[],this.dataFunctions=s,this.continueOnTripartiteError=!0,this.callCount=0,this.callDepthLimit=1e3}run(t){let e;return t&&(e=()=>{t(null,this.destination)}),this._run(this.template,this.initialData,e),this.destination}_resolveHandlingExpression(t,e,n){return e||(e=defaultTemplateName),"$"==e.charAt(0)&&(e=r(n,e.substring(1),this.dataFunctions,this.initialData)),0!=e.indexOf("./")&&0!=e.indexOf("../")||(e=s(t.templateMeta.name,e)),e}_run(t,e,n){let s=[...t.parts].reverse();const a=()=>{if(this.callCount++,this.callCount++>this.callDepthLimit)setTimeout((()=>{this.callCount=0,a()}));else if(s.length>0){let o=s.pop();if("string"==typeof o)this.output(o),a();else if(o instanceof i){let i,s=o.conditionalExpression||o.dataExpression,l=!1;if(null==s||null==s||""===s?l=!0:o.conditionalExpression?r(e,o.conditionalExpression,this.dataFunctions,this.initialData)&&(l=!0):(i=r(e,o.dataExpression,this.dataFunctions,this.initialData),null==i?l=!1:("number"==typeof i||Array.isArray(i)&&i.length>0||i)&&(l=!0)),l){o.dataExpression&&void 0===i&&(i=r(e,o.dataExpression,this.dataFunctions,this.initialData)),null==i&&(i=e);let s,l=this._resolveHandlingExpression(t,o.handlingExpression,e),p=(Array.isArray(i)?[...i]:[i]).reverse();const c=()=>{if(p.length>0){let t=p.pop();this._run(s,t,(()=>{c()}))}else a()};l in this.tripartite.templates?(s=this.tripartite.getTemplate(l),s?c():this.continueOnTripartiteError&&a()):this.tripartite.loadTemplate(l,(t=>{if(t)s=t,c();else{let t="Could not load template: "+l;if(console.error(t),this.continueOnTripartiteError)a();else{let e=new Error(t);if(!n)throw e;n(e)}}}))}else a()}else"function"==typeof o&&(o.write?o.write(e,this.destination,(()=>{a()})):(this.output(o(e)),a()))}else n&&n()};a()}output(t){null!=t&&("string"==typeof this.destination?this.destination+=t:this.destination.write&&this.destination.write(t))}}},502:t=>{t.exports=function(t,e){if(null==t)return t;let n;for("string"==typeof e?n=e.trim().split("."):Array.isArray(e)&&(n=e);n.length>0;){let e,i=n.shift();if(i.indexOf(" ")>-1)return null;if("this"===i||"$this"===i?e=t:"object"==typeof t&&i in t&&(e=t[i]),0==n.length)return e;t=e}}},158:(t,e,n)=>{function i(t){return null!==t&&"object"==typeof t&&"function"==typeof t.pipe}"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});let s=n(268),r=n(134);class a{constructor(t={}){this.templates={defaultTemplate:this._makeTemplate((function(t){return""+t}))};let{constants:e={templateBoundary:"__",templateNameBoundary:"##"}}=t;this.constants=e,this.secondaryTemplateFunctionObject=t.secondaryTemplateFunctionObject,this.loaders=t.loaders||[],this.dataFunctions=t.dataFunction||{}}_makeTemplate(t){if((e=t)&&"function"==typeof e&&e.write&&e.parts&&e.templateMeta)return t;var e;let n=this,r=function(t){let e=null,n=null,s=null;for(let t=1;t<arguments.length;t++){let r=arguments[t];i(r)?e=r:"function"==typeof r?s=r:"object"==typeof r&&(n=r)}return r.write(t,e,s,n)};return r.write=function(e,i,a,o={}){if(t&&t.write)return t.write.apply(t,arguments);{let t=new s(n,r,e,i||"",n.dataFunctions);return o&&"continueOnTripartiteError"in o&&(t.continueOnTripartiteError=o.continueOnTripartiteError),t.run(a)}},r.parts=[],t&&"function"==typeof t&&r.parts.push(t),r.templateMeta={},r}addTemplate(t,e){return"string"==typeof e?e=this.parseTemplate(e):"function"==typeof e&&(e=this._makeTemplate(e)),this.templates[t]=e,e.templateMeta=e.templateMeta||{},e.templateMeta.name=t,e}createBlank(){return new a}getTemplate(t){return this.templates[t]}loadTemplate(t,e){if(t in this.templates)e(this.templates[t]);else{let n=this,i=this.loaders.length,s=!1;0==i?(n.templates[t]=null,e(n.getTemplate(t))):this.loaders.forEach((r=>{s||r(t,(r=>{s||(i--,r?(s=!0,n.addTemplate(t,r)):0==i&&(s=!0,n.templates[t]=null),s&&e(n.getTemplate(t)))}))}))}}parseTemplateScript(t){for(var e=this.tokenizeTemplateScript(t),n=null,i=0;i<e.length;i++){var s=e[i];if(s.active)n=s.content;else if(n){var r=this.addTemplate(n,this.stripTemplateWhitespace(s.content));this.secondaryTemplateFunctionObject&&(this.secondaryTemplateFunctionObject[n]=r),n=null}}}stripTemplateWhitespace(t){var e=t.indexOf("\n");return e>-1&&""==t.substring(0,e).trim()&&(t=t.substring(e+1)),(e=t.lastIndexOf("\n"))>-1&&""==t.substring(e).trim()&&(t=t.substring(0,e)),t}_createActiveElement(t,e,n,i,s){let a=new r(t,e,n,i);return a.templateMeta=s,a}pt(t){return this.parseTemplate(t)}parseTemplate(t){var e=this.tokenizeTemplate(t);let n=this._makeTemplate();var i=n.templateMeta;for(let t of e)t.active?n.parts.push(this.tokenizeActivePart(t.content,i)):t.content&&n.parts.push(t.content);return n}tokenizeActivePart(t,e){var n=null,i=null,s=null,r=t.indexOf("??");r>-1?(n=t.substring(0,r),r+=2):r=0;var a=t.indexOf("::");return a>-1?(i=t.substring(r,a),s=t.substring(a+2)):i=t.substring(r),this._createActiveElement(n,i,s,this,e)}tokenizeTemplate(t){return this.tokenizeActiveAndInactiveBlocks(t,this.constants.templateBoundary)}tokenizeTemplateScript(t){return this.tokenizeActiveAndInactiveBlocks(t,this.constants.templateNameBoundary)}tokenizeActiveAndInactiveBlocks(t,e){let n=t.length,i=0,s=!1,r=[];for(;i<n;){let o=t.indexOf(e,i);-1==o&&(o=n);var a={active:s,content:t.substring(i,o)};r.push(a),i=o+e.length,s=!s}return r}}var o=new a;"undefined"!=typeof window&&(o.secondaryTemplateFunctionObject=window),t.exports=o,void 0!==n.g&&(n.g.Tripartite||(n.g.Tripartite=a),n.g.tripartite||(n.g.tripartite=o))},443:(t,e,n)=>{var i=n(158);t.exports=i.addTemplate("extension-pill",'<span class="extension-pill">__this__</span>')},277:(t,e,n)=>{var i=n(158);t.exports=i.addTemplate("image-browser-frame",'<div class="image-browser-frame">\n\t<div class="treebox">\n\t\t\n\t</div>\n\t<div class="node-view">\n\t\t<div class="view-controls">\n\t\t\t<input name="filter" type="text" placeholder="filter"/>\n\t\t</div>\n\t\t<div class="node-content">\n\t\t\t<div class="box-holder">\n\t\t\t\t<div class="choice-boxes">\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t\n\t\t\t\n\t\t</div>\n\t\t<div class="directory-controls">\n\t\t\t<button type="button" class="btn create-directory">Create Directory</button>\n\t\t</div>\n\t</div>\n\t\n\t\n</div>')},165:(t,e,n)=>{var i=n(158);t.exports=i.addTemplate("test1","This is test1.tri\n")},426:(t,e,n)=>{var i=n(158);t.exports=i.addTemplate("test2","This is test2.tri\n__::./test1__\n")},998:(t,e,n)=>{var i=n(158);t.exports=i.addTemplate("variant-choice-box",'<div class="variant-choice-box">\n\t<div class="img">\n\t\t__!this.thumbnail??\'<span class="material-icons thumbnail-icon">\' + thumbnailIcon + \'</span>\'__\n\t\t__this.thumbnail??\'<img class="thumbnail-image" src="\' + thumbnail + \'" />\'__\n\t</div>\n\t<div class="size-line">\n\t\t__size__\n\t</div>\n\t<div class="bottom">\n\t\t<div class="content">\n\t\t\t<div class="basename">\n\t\t\t\t__baseName__\n\t\t\t</div>\n\t\t\t<div class="extensions">\n\t\t\t\t__extensions::./extension-pill__\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="actions">\n\t\t\t<button class="details">\n\t\t\t\t<span class="material-icons">more_vert</span>\n\t\t\t</button>\n\t\t</div>\n\t</div>\n\n</div>')}},e={};function n(i){var s=e[i];if(void 0!==s)return s.exports;var r=e[i]={exports:{}};return t[i](r,r.exports,n),r.exports}n.d=(t,e)=>{for(var i in e)n.o(e,i)&&!n.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);var i={};(()=>{function t(){}function e(){console.log("stop")}n.d(i,{Z:()=>t,s:()=>e}),n(158),n(165),n(426),n(277),n(998),n(443)})();var s=i.Z,r=i.s;export{s as default,r as stop};
//# sourceMappingURL=index.js.map