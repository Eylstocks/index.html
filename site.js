(function(){
var each=function(list,fn){Array.prototype.forEach.call(list,fn)};

/* Phone menu */
var m=document.querySelector(".mnav");
if(m){
document.addEventListener("click",function(e){if(m.open&&!m.contains(e.target)){m.open=false}});
m.addEventListener("click",function(e){if(e.target.closest&&e.target.closest(".panel a")){m.open=false}});
document.addEventListener("keydown",function(e){if(e.key==="Escape"){m.open=false}});
}

/* Sections fade in on scroll */
var still=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if("IntersectionObserver" in window&&!still){
document.documentElement.classList.add("rv-on");
var io=new IntersectionObserver(function(list){each(list,function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{rootMargin:"0px 0px -8% 0px"});
each(document.querySelectorAll("main section .wrap>*"),function(el){io.observe(el)});
}

/* Top photo slider */
var sl=document.getElementById("slides");
if(sl){
var sims=sl.querySelectorAll("img"),dots=document.querySelectorAll(".dots button"),cur=0;
var loadAll=function(){each(sims,function(im){var s=im.getAttribute("data-src");if(s){im.src=s;im.removeAttribute("data-src")}})};
if(document.readyState==="complete"){loadAll()}else{window.addEventListener("load",loadAll)}
var go=function(k){loadAll();k=(k+sims.length)%sims.length;sl.scrollTo({left:k*sl.clientWidth,behavior:still?"auto":"smooth"})};
sl.addEventListener("scroll",function(){loadAll();var k=Math.round(sl.scrollLeft/sl.clientWidth);if(k!==cur){cur=k;each(dots,function(b,j){b.setAttribute("aria-current",j===k?"true":"false")})}},{passive:true});
var p=document.querySelector(".hs-p"),nx=document.querySelector(".hs-n");
if(p){p.addEventListener("click",function(){go(cur-1)})}
if(nx){nx.addEventListener("click",function(){go(cur+1)})}
each(dots,function(b,k){b.addEventListener("click",function(){go(k)})});
sl.addEventListener("keydown",function(e){if(e.key==="ArrowLeft"){e.preventDefault();go(cur-1)}else if(e.key==="ArrowRight"){e.preventDefault();go(cur+1)}});
window.addEventListener("resize",function(){sl.scrollLeft=cur*sl.clientWidth});
/* Auto-slide every 6 seconds; stops for good once the guest swipes, taps or clicks */
var hero=sl.parentNode,timer=null,stopped=still,hover=false;
var tick=function(){if(!stopped&&!hover&&!document.hidden){go(cur+1)}};
var start=function(){if(!stopped&&!timer){timer=setInterval(tick,6000)}};
var stop=function(){stopped=true;clearInterval(timer);timer=null};
each(["pointerdown","touchstart","wheel","keydown"],function(t){hero.addEventListener(t,stop,{passive:true})});
hero.addEventListener("mouseenter",function(){hover=true});
hero.addEventListener("mouseleave",function(){hover=false});
if(document.readyState==="complete"){start()}else{window.addEventListener("load",start)}
}

/* Gallery photo viewer */
var figs=document.querySelectorAll(".g figure");
var d=document.createElement("dialog");
if(!figs.length||!d.showModal){return}
d.id="lb";
d.setAttribute("aria-label","Photo viewer");
d.innerHTML='<button type="button" class="lb-btn lb-x" aria-label="Close">&times;</button><button type="button" class="lb-btn lb-p" aria-label="Previous photo">&lsaquo;</button><img alt=""><p></p><button type="button" class="lb-btn lb-n" aria-label="Next photo">&rsaquo;</button>';
document.body.appendChild(d);
var im=d.querySelector("img"),cap=d.querySelector("p"),i=0,n=figs.length;
function show(k){
i=(k+n)%n;
var f=figs[i],s=f.querySelector("img"),c=f.querySelector("figcaption");
im.src=s.currentSrc||s.src;im.alt=s.alt;
cap.textContent=(c?c.textContent+" · ":"")+(i+1)+" / "+n;
}
function open(k){show(k);d.showModal()}
each(figs,function(f,k){
var c=f.querySelector("figcaption");
f.tabIndex=0;
f.setAttribute("role","button");
f.setAttribute("aria-label","Open photo: "+(c?c.textContent:"photo "+(k+1)));
f.addEventListener("click",function(){open(k)});
f.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();open(k)}});
});
d.querySelector(".lb-x").addEventListener("click",function(){d.close()});
d.querySelector(".lb-p").addEventListener("click",function(){show(i-1)});
d.querySelector(".lb-n").addEventListener("click",function(){show(i+1)});
d.addEventListener("click",function(e){if(e.target===d){d.close()}});
d.addEventListener("keydown",function(e){if(e.key==="ArrowLeft"){show(i-1)}else if(e.key==="ArrowRight"){show(i+1)}});
var x0=null;
d.addEventListener("touchstart",function(e){x0=e.touches[0].clientX},{passive:true});
d.addEventListener("touchend",function(e){if(x0===null){return}var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>50){show(dx<0?i+1:i-1)}});
})();
