(function(){var q={encode:function(h){return window.unescape(window.encodeURIComponent(h))},decode:function(h){return window.decodeURIComponent(window.escape(h))}},x=function(){return function(h,p){var g=function(b,a){var d,c,f,e,g;f=b&2147483648;e=a&2147483648;d=b&1073741824;c=a&1073741824;g=(b&1073741823)+(a&1073741823);return d&c?g^2147483648^f^e:d|c?g&1073741824?g^3221225472^f^e:g^1073741824^f^e:g^f^e},k=function(b,a,d,c,f,e,h){b=g(b,g(g(a&d|~a&c,f),h));return g(b<<e|b>>>32-e,a)},m=function(b,
a,d,c,f,e,h){b=g(b,g(g(a&c|d&~c,f),h));return g(b<<e|b>>>32-e,a)},l=function(b,a,c,d,e,f,h){b=g(b,g(g(a^c^d,e),h));return g(b<<f|b>>>32-f,a)},n=function(b,a,c,d,f,e,h){b=g(b,g(g(c^(a|~d),f),h));return g(b<<e|b>>>32-e,a)},r=function(b){var a="",c="",d;for(d=0;3>=d;d++)c=b>>>8*d&255,c="0"+c.toString(16),a+=c.substr(c.length-2,2);return a},e=[],f,t,u,v,w,b,a,d,c;p&&"utf-8"==p.toLowerCase()&&(h=q.encode(h));e=function(b){var a,c=b.length;a=c+8;for(var d=16*((a-a%64)/64+1),e=Array(d-1),f=0,g=0;g<c;)a=
(g-g%4)/4,f=g%4*8,e[a]|=b.charCodeAt(g)<<f,g++;a=(g-g%4)/4;e[a]|=128<<g%4*8;e[d-2]=c<<3;e[d-1]=c>>>29;return e}(h);b=1732584193;a=4023233417;d=2562383102;c=271733878;for(f=0;f<e.length;f+=16)t=b,u=a,v=d,w=c,b=k(b,a,d,c,e[f+0],7,3614090360),c=k(c,b,a,d,e[f+1],12,3905402710),d=k(d,c,b,a,e[f+2],17,606105819),a=k(a,d,c,b,e[f+3],22,3250441966),b=k(b,a,d,c,e[f+4],7,4118548399),c=k(c,b,a,d,e[f+5],12,1200080426),d=k(d,c,b,a,e[f+6],17,2821735955),a=k(a,d,c,b,e[f+7],22,4249261313),b=k(b,a,d,c,e[f+8],7,1770035416),
c=k(c,b,a,d,e[f+9],12,2336552879),d=k(d,c,b,a,e[f+10],17,4294925233),a=k(a,d,c,b,e[f+11],22,2304563134),b=k(b,a,d,c,e[f+12],7,1804603682),c=k(c,b,a,d,e[f+13],12,4254626195),d=k(d,c,b,a,e[f+14],17,2792965006),a=k(a,d,c,b,e[f+15],22,1236535329),b=m(b,a,d,c,e[f+1],5,4129170786),c=m(c,b,a,d,e[f+6],9,3225465664),d=m(d,c,b,a,e[f+11],14,643717713),a=m(a,d,c,b,e[f+0],20,3921069994),b=m(b,a,d,c,e[f+5],5,3593408605),c=m(c,b,a,d,e[f+10],9,38016083),d=m(d,c,b,a,e[f+15],14,3634488961),a=m(a,d,c,b,e[f+4],20,3889429448),
b=m(b,a,d,c,e[f+9],5,568446438),c=m(c,b,a,d,e[f+14],9,3275163606),d=m(d,c,b,a,e[f+3],14,4107603335),a=m(a,d,c,b,e[f+8],20,1163531501),b=m(b,a,d,c,e[f+13],5,2850285829),c=m(c,b,a,d,e[f+2],9,4243563512),d=m(d,c,b,a,e[f+7],14,1735328473),a=m(a,d,c,b,e[f+12],20,2368359562),b=l(b,a,d,c,e[f+5],4,4294588738),c=l(c,b,a,d,e[f+8],11,2272392833),d=l(d,c,b,a,e[f+11],16,1839030562),a=l(a,d,c,b,e[f+14],23,4259657740),b=l(b,a,d,c,e[f+1],4,2763975236),c=l(c,b,a,d,e[f+4],11,1272893353),d=l(d,c,b,a,e[f+7],16,4139469664),
a=l(a,d,c,b,e[f+10],23,3200236656),b=l(b,a,d,c,e[f+13],4,681279174),c=l(c,b,a,d,e[f+0],11,3936430074),d=l(d,c,b,a,e[f+3],16,3572445317),a=l(a,d,c,b,e[f+6],23,76029189),b=l(b,a,d,c,e[f+9],4,3654602809),c=l(c,b,a,d,e[f+12],11,3873151461),d=l(d,c,b,a,e[f+15],16,530742520),a=l(a,d,c,b,e[f+2],23,3299628645),b=n(b,a,d,c,e[f+0],6,4096336452),c=n(c,b,a,d,e[f+7],10,1126891415),d=n(d,c,b,a,e[f+14],15,2878612391),a=n(a,d,c,b,e[f+5],21,4237533241),b=n(b,a,d,c,e[f+12],6,1700485571),c=n(c,b,a,d,e[f+3],10,2399980690),
d=n(d,c,b,a,e[f+10],15,4293915773),a=n(a,d,c,b,e[f+1],21,2240044497),b=n(b,a,d,c,e[f+8],6,1873313359),c=n(c,b,a,d,e[f+15],10,4264355552),d=n(d,c,b,a,e[f+6],15,2734768916),a=n(a,d,c,b,e[f+13],21,1309151649),b=n(b,a,d,c,e[f+4],6,4149444226),c=n(c,b,a,d,e[f+11],10,3174756917),d=n(d,c,b,a,e[f+2],15,718787259),a=n(a,d,c,b,e[f+9],21,3951481745),b=g(b,t),a=g(a,u),d=g(d,v),c=g(c,w);return(r(b)+r(a)+r(d)+r(c)).toLowerCase()}}();Registry.register("convert","5271",{UTF8:q,Base64:{encode:function(h){for(var p=
"",g=0;g<h.length;g++)p+=window.String.fromCharCode(h.charCodeAt(g)&255);return window.btoa(p)},decode:function(h){return window.atob(h)}},encode:function(h){return window.escape(h)},decode:function(h){return window.unescape(h)},encodeR:function(h){return h},decodeR:function(h){return h},encodeS:function(h){return window.btoa(q.encode(h))},decodeS:function(h){return q.decode(window.atob(h))},MD5:x,arrbuf2str:function(h,p){try{var g,k;"object"===typeof p?(g=p.encoding,k=p.array):g=p;if(window.TextDecoder&&
!k&&g)return(new window.TextDecoder(g)).decode(h);k="";for(var m=new window.Uint8Array(h),l=0;l<m.length;l+=32687)k+=window.String.fromCharCode.apply(null,m.subarray(l,l+32687));g&&"utf-8"==g.toLowerCase()&&(k=q.decode(k));return k}catch(n){window.console.warn(n)}return null},str2arrbuf:function(h,p){try{var g,k;"object"===typeof p?(g=p.encoding,k=p.array):g=p;if(window.TextEncoder&&!k&&g)return(new window.TextEncoder(g)).encode(h);g&&"utf-8"==g.toLowerCase()&&(h=q.encode(h));var m=new window.Uint8Array(h.length);
for(g=0;g<h.length;g++)m[g]=h.charCodeAt(g)&255;return m.buffer}catch(l){window.console.warn(l)}return null}})})();