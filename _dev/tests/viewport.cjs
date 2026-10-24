const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync('dist/js/app.js','utf8');
const snippet=code.slice(code.indexOf('  let restingViewportHeight'),code.indexOf('  function paintClock'));
function run(hasVisualViewport){
 const props={},classes=new Set(),events={},docEvents={},viewportEvents={};
 const messages={scrollTop:0,scrollHeight:900};
 const input={matches:()=>true,closest:()=>({querySelector:()=>messages})};
 const document={activeElement:null,documentElement:{style:{setProperty:(k,v)=>props[k]=v}},body:{classList:{toggle:(k,v)=>v?classes.add(k):classes.delete(k),remove:k=>classes.delete(k)}},getElementById:()=>({style:{setProperty:()=>{}}}),addEventListener:(k,f)=>docEvents[k]=f};
 const window={innerWidth:390,innerHeight:844,addEventListener:(k,f)=>events[k]=f};
 if(hasVisualViewport)window.visualViewport={height:844,offsetTop:0,addEventListener:(k,f)=>viewportEvents[k]=f};
 vm.runInNewContext(snippet,{window,document,requestAnimationFrame:fn=>{fn();return 1},cancelAnimationFrame:()=>{},setTimeout:fn=>fn()});
 assert.equal(props['--phone-visible-height'],'844px');
 document.activeElement=input;
 if(hasVisualViewport){window.visualViewport.height=420;window.visualViewport.offsetTop=36;viewportEvents.resize();}
 else {window.innerHeight=420;events.resize();}
 assert.equal(props['--phone-visible-height'],'420px');assert.ok(classes.has('keyboard-open'));assert.equal(messages.scrollTop,900);
 if(hasVisualViewport)assert.equal(props['--phone-visible-top'],'36px');
 document.activeElement=null;window.innerHeight=844;
 if(hasVisualViewport){window.visualViewport.height=844;window.visualViewport.offsetTop=0;viewportEvents.resize();}else events.resize();
 assert.ok(!classes.has('keyboard-open'));assert.equal(props['--phone-visible-height'],'844px');
 window.innerWidth=1200;events.resize();assert.ok(!classes.has('fullscreen'));
}
run(true);run(false);
console.log('键盘缩小可见区、页面偏移、关闭恢复与无visualViewport回退检查通过');
