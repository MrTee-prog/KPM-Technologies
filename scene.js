// KPM MOTION | Lightweight real-time 3D brand core
// Uses Three.js only for this one scene. The CSS 3D fallback remains visible if the CDN
// is unavailable, WebGL is disabled, or the device cannot create a context.
const canvas=document.getElementById('heroCanvas');
const host=document.getElementById('heroVisual');
const fallback=host?.querySelector('.scene-fallback');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(canvas&&host&&window.WebGLRenderingContext){
  try{
    const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js');
    const renderer=new THREE.WebGLRenderer({canvas,antialias:!matchMedia('(max-width: 700px)').matches,alpha:true,powerPreference:'low-power'});
    const mobile=matchMedia('(max-width: 700px)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,mobile?1.15:1.6));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000,0);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,0,10.6);
    scene.add(new THREE.AmbientLight(0x9dc9ff,.85));
    const p1=new THREE.PointLight(0x5da5ff,80,18);p1.position.set(3,4,5);scene.add(p1);
    const p2=new THREE.PointLight(0xff2f62,45,17);p2.position.set(-4,-2,4);scene.add(p2);
    const core=new THREE.Group();scene.add(core);
    const chrome=new THREE.MeshPhysicalMaterial({color:0x8dc7fc,metalness:.93,roughness:.16,clearcoat:1,clearcoatRoughness:.08});
    const blue=new THREE.MeshPhysicalMaterial({color:0x1a80ff,metalness:.72,roughness:.16,emissive:0x1154b8,emissiveIntensity:.42,clearcoat:1});
    const red=new THREE.MeshPhysicalMaterial({color:0xfc315e,metalness:.5,roughness:.18,emissive:0x991536,emissiveIntensity:.35,clearcoat:1});
    const black=new THREE.MeshPhysicalMaterial({color:0x121f36,metalness:.8,roughness:.22,clearcoat:1});
    const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.25,.21,140,12,2,3),chrome);core.add(knot);
    const inner=new THREE.Mesh(new THREE.IcosahedronGeometry(.9,2),black);core.add(inner);
    const innerWire=new THREE.Mesh(new THREE.IcosahedronGeometry(.91,1),new THREE.MeshBasicMaterial({color:0x8bc8ff,wireframe:true,transparent:true,opacity:.55}));core.add(innerWire);
    const orbital=[];
    [[2.6,.055,blue,Math.PI/3,0],[2.58,.07,red,-Math.PI/3,Math.PI/4],[2.95,.027,chrome,Math.PI/2.4,Math.PI/3]].forEach(([radius,tube,material,rx,ry])=>{
      const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,9,120),material);
      ring.rotation.set(rx,ry,0);core.add(ring);orbital.push(ring);
    });
    const glint=new THREE.Mesh(new THREE.OctahedronGeometry(.23,0),red);glint.position.set(2.8,0,.05);core.add(glint);
    const dotsN=mobile?65:135;
    const pos=new Float32Array(dotsN*3);
    for(let i=0;i<dotsN;i++){
      let theta=Math.random()*Math.PI*2,r=3.5+Math.random()*3;
      pos[i*3]=Math.cos(theta)*r;pos[i*3+1]=(Math.random()-.5)*7.5;pos[i*3+2]=Math.sin(theta)*r;
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const particles=new THREE.Points(g,new THREE.PointsMaterial({color:0x6db6ff,size:.032,transparent:true,opacity:.72,sizeAttenuation:true}));scene.add(particles);
    let tx=.15,ty=.35,dragging=false,lastX=0,lastY=0,active=true;
    function start(e){dragging=true;lastX=e.clientX;lastY=e.clientY;try{canvas.setPointerCapture(e.pointerId);}catch{}}
    function move(e){if(dragging){ty+=(e.clientX-lastX)*.009;tx+=(e.clientY-lastY)*.009;lastX=e.clientX;lastY=e.clientY;}else if(e.pointerType==='mouse'){const rect=canvas.getBoundingClientRect();ty=(e.clientX-rect.left-rect.width/2)/rect.width*.5;tx=(e.clientY-rect.top-rect.height/2)/rect.height*.35;}}
    canvas.addEventListener('pointerdown',start);
    canvas.addEventListener('pointermove',move);
    canvas.addEventListener('pointerup',()=>dragging=false);
    canvas.addEventListener('pointercancel',()=>dragging=false);
    canvas.addEventListener('lostpointercapture',()=>dragging=false);
    function resize(){const w=host.clientWidth,h=host.clientHeight;if(w>0&&h>0){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}}
    resize();window.addEventListener('resize',resize,{passive:true});
    if('ResizeObserver' in window)new ResizeObserver(resize).observe(host);
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{active=entries[0].isIntersecting},{threshold:.02}).observe(host);
    let last=0,tm=0,firstFrame=true;
    function loop(ts){requestAnimationFrame(loop);if(!active||document.hidden)return;if(ts-last<(mobile?33:16))return;
      const dt=Math.min((ts-last)/1000||.016,.05);last=ts;tm+=dt;
      core.rotation.y+=(ty-core.rotation.y)*Math.min(1,dt*3.8);
      core.rotation.x+=(tx-core.rotation.x)*Math.min(1,dt*3.8);
      if(!reduced){knot.rotation.z=tm*.12;inner.rotation.y=-tm*.14;innerWire.rotation.x=tm*.25;
      orbital[0].rotation.z+=dt*.12;orbital[1].rotation.y+=dt*.13;orbital[2].rotation.x-=dt*.09;glint.rotation.y=tm;particles.rotation.y=tm*.008;core.position.y=Math.sin(tm*.62)*.12;}
      renderer.render(scene,camera);
      if(firstFrame){firstFrame=false;fallback?.classList.add('hide');}
    }
    requestAnimationFrame(loop);
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback?.classList.remove('hide');},{passive:false});
  }catch(err){console.info('3D visuals fell back to the lightweight CSS experience.',err);canvas.style.display='none';}
}
