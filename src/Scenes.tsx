import { Canvas } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function hasWebGL(){try{const canvas=document.createElement('canvas');return Boolean(canvas.getContext('webgl2')||canvas.getContext('webgl'))}catch{return false}}

function Planet() {
  const [earth, clouds] = useTexture(['https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg','https://threejs.org/examples/textures/planets/earth_clouds_1024.png']);
  earth.colorSpace = THREE.SRGBColorSpace; clouds.colorSpace = THREE.SRGBColorSpace;
  const globe=useRef<THREE.Group>(null);
  useFrame((_,delta)=>{if(globe.current)globe.current.rotation.y+=delta*0.018});
  return <group ref={globe} rotation={[0.1,-0.45,0.15]}><mesh><sphereGeometry args={[1.65,64,64]}/><meshStandardMaterial map={earth} roughness={0.82}/></mesh><mesh scale={1.008}><sphereGeometry args={[1.65,48,48]}/><meshStandardMaterial map={clouds} transparent opacity={0.34} depthWrite={false}/></mesh><mesh scale={1.045}><sphereGeometry args={[1.65,48,48]}/><meshBasicMaterial color="#72b9ff" transparent opacity={0.09} side={THREE.BackSide} blending={THREE.AdditiveBlending}/></mesh></group>;
}
export function SpaceScene(){
 if(!hasWebGL())return <div className="webgl-earth-fallback" role="img" aria-label="Earth in a star field"/>;
 return <div className="scene-host"><Canvas dpr={[1,1.4]} camera={{position:[0,0,6.5],fov:40}} gl={{antialias:true,alpha:true,powerPreference:'low-power'}}><ambientLight intensity={0.32}/><directionalLight position={[-3,2,4]} intensity={3} color="#e6f1ff"/><pointLight position={[3,-1,-2]} intensity={1.5} color="#7161c7"/><Stars radius={90} depth={48} count={1800} factor={3} saturation={0.35} fade/><Suspense fallback={<mesh><sphereGeometry args={[1.65,24,24]}/><meshBasicMaterial color="#19375c"/></mesh>}><Planet/></Suspense></Canvas></div>;
}
function CardFace({back=false}:{back?:boolean}){
 const map=useMemo(()=>{const c=document.createElement('canvas');c.width=1200;c.height=700;const x=c.getContext('2d')!;x.fillStyle='#11131a';x.fillRect(0,0,1200,700);const g=x.createLinearGradient(0,0,1200,700);g.addColorStop(0,'rgba(255,255,255,.10)');g.addColorStop(1,'rgba(141,220,255,.07)');x.fillStyle=g;x.fillRect(0,0,1200,700);x.strokeStyle='rgba(221,227,237,.27)';x.lineWidth=3;x.strokeRect(38,38,1124,624);x.fillStyle='#dde3ed';if(!back){x.font='500 92px Arial';x.fillText('NP',90,245);x.fillStyle='#8ddcff';x.fillRect(90,290,56,3);x.fillStyle='#dde3ed';x.font='600 52px Arial';x.fillText('NEW PRAKASH',90,405);x.font='300 34px Arial';x.fillText('RADIO SERVICE',90,466);x.fillStyle='#9297a3';x.font='18px Arial';x.fillText('TECHNOLOGY THAT FEELS CLOSER',90,580)}else{x.font='600 38px Arial';x.fillText('A LITTLE MORE CONNECTED.',90,145);x.fillStyle='#c5c7ce';x.font='28px Arial';['Electronics · Smartphones · Televisions','Air conditioners · Air coolers','Accessories · Home appliances'].forEach((t,i)=>x.fillText(t,90,250+i*70));x.fillStyle='#8ddcff';x.font='24px Arial';x.fillText('TURANGA CIRCLE / IDAR, GUJARAT',90,590)}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t},[back]);return <meshBasicMaterial map={map}/>;
}
function CardRig(){
 const card=useRef<THREE.Group>(null);const invalidate=useThree(s=>s.invalidate);
 useEffect(()=>{gsap.registerPlugin(ScrollTrigger);if(!card.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const tween=gsap.to(card.current.rotation,{y:Math.PI*2,ease:'none',scrollTrigger:{trigger:'#card',start:'top bottom',end:'bottom top',scrub:1,onUpdate:()=>invalidate()}});return()=>{tween.scrollTrigger?.kill();tween.kill()}},[invalidate]);
 return <group ref={card} rotation={[0.06,0,0.02]}><mesh><boxGeometry args={[4.2,2.45,0.075]}/><meshStandardMaterial color="#101116" roughness={0.44} metalness={0.22}/></mesh><mesh position={[0,0,0.039]}><planeGeometry args={[4.12,2.37]}/><CardFace/></mesh><mesh position={[0,0,-0.039]} rotation={[0,Math.PI,0]}><planeGeometry args={[4.12,2.37]}/><CardFace back/></mesh></group>;
}
export function BusinessCard(){if(!hasWebGL())return <div className="webgl-card-fallback"><b>NP</b><strong>NEW PRAKASH</strong><span>RADIO SERVICE</span></div>;return <Canvas frameloop="demand" dpr={[1,1.2]} camera={{position:[0,0,6],fov:35}} gl={{antialias:true,alpha:true,powerPreference:'low-power'}}><ambientLight intensity={1}/><spotLight position={[-4,5,5]} intensity={70} angle={0.7} penumbra={0.7}/><pointLight position={[4,-2,2]} intensity={20} color="#86cfff"/><CardRig/></Canvas>}

const walkStops = [
  { title: 'A clear view in.', detail: 'Entrance · the aisle opens ahead' },
  { title: 'Phones, up close.', detail: 'Smartphones · tablets · accessories' },
  { title: 'The big picture.', detail: 'Television wall · home entertainment' },
  { title: 'Everyday comfort.', detail: 'Air conditioners · air coolers · appliances' },
  { title: 'A place to check out.', detail: 'Billing counter · end of the walk' },
];

function makeTileMap(){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
  const ctx=canvas.getContext('2d')!;ctx.fillStyle='#e9e7e1';ctx.fillRect(0,0,512,512);
  const tile=128;
  for(let y=0;y<4;y++)for(let x=0;x<4;x++){
    const tone=232+((x*7+y*5)%7);ctx.fillStyle=`rgb(${tone},${tone-1},${tone-5})`;ctx.fillRect(x*tile+2,y*tile+2,tile-4,tile-4);
    ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;ctx.strokeRect(x*tile+5,y*tile+5,tile-10,tile-10);
  }
  ctx.strokeStyle='#c9c8c2';ctx.lineWidth=4;
  for(let i=0;i<=4;i++){ctx.beginPath();ctx.moveTo(i*tile,0);ctx.lineTo(i*tile,512);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*tile);ctx.lineTo(512,i*tile);ctx.stroke();}
  for(let i=0;i<25;i++){const x=(i*83)%512,y=(i*137)%512;ctx.strokeStyle='rgba(149,145,135,.055)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+18,y+6,x-11,y+20,x+31,y+34);ctx.stroke();}
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(4,11);texture.anisotropy=4;return texture;
}

function makeScreenMap(){
  const canvas=document.createElement('canvas');canvas.width=640;canvas.height=360;const ctx=canvas.getContext('2d')!;
  const sky=ctx.createLinearGradient(0,0,0,360);sky.addColorStop(0,'#90afc2');sky.addColorStop(.52,'#d5bda1');sky.addColorStop(1,'#556b62');ctx.fillStyle=sky;ctx.fillRect(0,0,640,360);
  ctx.fillStyle='#f5dbc0';ctx.beginPath();ctx.arc(472,110,48,0,Math.PI*2);ctx.fill();
  const mountain=(points:string,color:string)=>{ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(0,360);ctx.lineTo(0,240);for(let x=0;x<points.length;x+=2)ctx.lineTo(Number(points.slice(x,x+2))*6,150+((x*17)%92));ctx.lineTo(640,290);ctx.lineTo(640,360);ctx.closePath();ctx.fill();};
  mountain('0010203040506070809010','#657d7c');mountain('0015293649586778899810','#485f59');
  ctx.fillStyle='rgba(31,51,45,.55)';for(let i=0;i<34;i++){const x=(i*79)%640,y=268+(i*31)%88;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-11,y+37);ctx.lineTo(x+12,y+37);ctx.fill();}
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}

function ShopShell({floorMap}:{floorMap:THREE.CanvasTexture}){
  const panels=[-7.6,-4.1,-.6,2.9,6.4];
  return <group>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.012,0]} receiveShadow><planeGeometry args={[8.2,21]}/><meshPhysicalMaterial map={floorMap} roughness={.22} metalness={.025} clearcoat={.32} clearcoatRoughness={.18}/></mesh>
    <mesh position={[0,3.62,0]}><boxGeometry args={[8.35,.18,21.25]}/><meshStandardMaterial color="#f3f2ee" roughness={.8}/></mesh>
    <mesh position={[-4.12,1.8,0]} castShadow receiveShadow><boxGeometry args={[.22,3.6,21.15]}/><meshStandardMaterial color="#efeee9" roughness={.83}/></mesh>
    <mesh position={[4.12,1.8,0]} castShadow receiveShadow><boxGeometry args={[.22,3.6,21.15]}/><meshStandardMaterial color="#efeee9" roughness={.83}/></mesh>
    <mesh position={[0,1.8,-10.55]} castShadow><boxGeometry args={[8.3,3.6,.2]}/><meshStandardMaterial color="#f1f0ec" roughness={.83}/></mesh>
    <mesh position={[-3.98,.12,0]}><boxGeometry args={[.08,.24,20.8]}/><meshStandardMaterial color="#b8ad9a" roughness={.55}/></mesh>
    <mesh position={[3.98,.12,0]}><boxGeometry args={[.08,.24,20.8]}/><meshStandardMaterial color="#b8ad9a" roughness={.55}/></mesh>
    {Array.from({length:7},(_,i)=><mesh key={`tile-x-${i}`} position={[-3.55+i*1.18,.02,0]}><boxGeometry args={[.008,.008,20.8]}/><meshStandardMaterial color="#c8c6c0" roughness={.55}/></mesh>)}
    {Array.from({length:17},(_,i)=><mesh key={`tile-z-${i}`} position={[0,.022,-9.9+i*1.23]}><boxGeometry args={[8,.006,.008]}/><meshStandardMaterial color="#c8c6c0" roughness={.55}/></mesh>)}
    {panels.map((z,i)=><group key={`ceiling-${i}`}>
      {[-1.75,1.75].map(x=><mesh key={x} position={[x,3.48,z]}><boxGeometry args={[1.12,.035,2.18]}/><meshStandardMaterial color="#fffefa" emissive="#fffaf0" emissiveIntensity={1.15} roughness={.25}/></mesh>)}
    </group>)}
    <pointLight position={[0,3.1,6]} intensity={4.2} distance={9} decay={2} color="#fffaf2"/>
    <pointLight position={[0,3.1,1]} intensity={4.5} distance={9} decay={2} color="#fffdf8"/>
    <pointLight position={[0,3.1,-4]} intensity={4.5} distance={9} decay={2} color="#fffdf8"/>
    <pointLight position={[0,3.1,-8]} intensity={3.5} distance={8} decay={2} color="#fffaf2"/>
    <mesh position={[-2.05,3.51,0]}><boxGeometry args={[.045,.07,20.8]}/><meshStandardMaterial color="#d8d5cd"/></mesh>
    <mesh position={[2.05,3.51,0]}><boxGeometry args={[.045,.07,20.8]}/><meshStandardMaterial color="#d8d5cd"/></mesh>
  </group>;
}

function WallShelves(){
  const shelfZ=[3.25,-3.45];
  return <group>
    {shelfZ.map((z,zone)=><group key={z}>
      <mesh position={[-3.83,1.66,z]}><boxGeometry args={[.16,2.8,5.15]}/><meshStandardMaterial color={zone===0?'#ded9ce':'#e5e1d8'} roughness={.7}/></mesh>
      {[.52,1.12,1.72,2.32,2.88].map((y,i)=><group key={y}>
        <mesh position={[-3.49,y,z]} castShadow><boxGeometry args={[.72,.055,5.12]}/><meshStandardMaterial color={i===0?'#b8aa92':'#f5f3ee'} roughness={.46}/></mesh>
        <mesh position={[-3.72,y+.08,z]}><boxGeometry args={[.045,.18,5.05]}/><meshStandardMaterial color="#d2cdc3" roughness={.75}/></mesh>
        {Array.from({length:7},(_,j)=>{
          const zz=z-1.98+j*.66;
          if(zone===0&&i>0&&i<4)return <group key={j} position={[-3.27,y+.17,zz]}>
            <mesh castShadow><boxGeometry args={[.05,.26,.16]}/><meshStandardMaterial color={['#20242a','#29343b','#8a9195','#363239'][j%4]} roughness={.3} metalness={.26}/></mesh>
            <mesh position={[.027,0,0]} rotation={[0,Math.PI/2,0]}><planeGeometry args={[.13,.21]}/><meshStandardMaterial color="#111820" emissive="#455c68" emissiveIntensity={.12} roughness={.18}/></mesh>
            <mesh position={[.029,.045,0]} rotation={[0,Math.PI/2,0]}><planeGeometry args={[.034,.028]}/><meshStandardMaterial color="#85a8a9" emissive="#4a8386" emissiveIntensity={.16}/></mesh>
          </group>;
          return <mesh key={j} position={[-3.27,y+.16,zz]} castShadow><boxGeometry args={[.36,.28,.38]}/><meshStandardMaterial color={['#ddd8ce','#c9b99e','#e6e4de','#c9c6c0'][j%4]} roughness={.72}/></mesh>;
        })}
      </group>)}
    </group>)}
    {[.82,1.52,2.22].map((y,row)=><group key={`edge-${row}`} position={[-3.47,y,-.15]}>
      {Array.from({length:9},(_,i)=><mesh key={i} position={[0,0,-2.28+i*.57]} castShadow><boxGeometry args={[.44,.32,.38]}/><meshStandardMaterial color={['#eceae3','#c9c5bb','#ded8cc'][i%3]} roughness={.7}/></mesh>)}
    </group>)}
  </group>;
}

function TvSet({z,y=2.08,screenMap}:{z:number;y?:number;screenMap:THREE.CanvasTexture}){
  return <group position={[3.82,y,z]}>
    <mesh position={[-.105,0,0]} castShadow><boxGeometry args={[.16,.94,1.62]}/><meshStandardMaterial color="#171a1c" roughness={.24} metalness={.42}/></mesh>
    <mesh position={[-.19,0,0]} rotation={[0,-Math.PI/2,0]}><planeGeometry args={[1.53,.84]}/><meshBasicMaterial map={screenMap} toneMapped={false}/></mesh>
    <mesh position={[-.205,-.51,0]}><boxGeometry args={[.025,.035,.82]}/><meshStandardMaterial color="#25292b" metalness={.55} roughness={.3}/></mesh>
  </group>;
}

function TelevisionWall({screenMap}:{screenMap:THREE.CanvasTexture}){
  const z=[5.45,3.72,1.99,.26,-1.47,-3.2,-4.93,-6.66];
  return <group>
    <mesh position={[3.92,2.15,-.48]}><boxGeometry args={[.12,2.48,15.5]}/><meshStandardMaterial color="#d8d5ce" roughness={.72}/></mesh>
    {z.map((item,i)=><TvSet key={i} z={item} y={i%2===0?2.12:1.96} screenMap={screenMap}/>)}
    {[-6.6,-5.5,-4.4,-3.3,-2.2,-1.1,0,.9].map((z,i)=><mesh key={`soundbar-${i}`} position={[3.58,.76,z]} castShadow><boxGeometry args={[.28,.075,1.05]}/><meshStandardMaterial color="#343638" roughness={.38} metalness={.2}/></mesh>)}
    <mesh position={[3.63,.1,-.45]}><boxGeometry args={[.62,.2,15.5]}/><meshStandardMaterial color="#c5b79f" roughness={.56}/></mesh>
  </group>;
}

function PhoneOnStand({x,z,y=1.01}:{x:number;z:number;y?:number}){
  return <group position={[x,y,z]} rotation={[-.06,0,0]}>
    <mesh position={[0,.12,0]} castShadow><boxGeometry args={[.12,.24,.035]}/><meshStandardMaterial color="#32373b" metalness={.52} roughness={.26}/></mesh>
    <mesh position={[0,.12,.019]}><planeGeometry args={[.103,.213]}/><meshStandardMaterial color="#171d21" emissive="#51646c" emissiveIntensity={.13} roughness={.18}/></mesh>
    <mesh position={[0,-.02,-.035]} rotation={[-.18,0,0]}><boxGeometry args={[.16,.025,.11]}/><meshStandardMaterial color="#a9a8a2" metalness={.48} roughness={.4}/></mesh>
  </group>;
}

function RetailIsland({x,z,index}:{x:number;z:number;index:number}){
  const colors=['#ded8ca','#d5d0c5','#e1ddd3'];
  return <group position={[x,0,z]}>
    <mesh position={[0,.52,0]} castShadow receiveShadow><boxGeometry args={[1.14,.55,1.7]}/><meshStandardMaterial color="#f2f1ed" roughness={.52}/></mesh>
    <mesh position={[0,.83,0]} castShadow><boxGeometry args={[1.23,.09,1.8]}/><meshStandardMaterial color={colors[index%3]} roughness={.4} metalness={.08}/></mesh>
    {[-.47,.47].flatMap((sx)=>([-.72,.72].map((sz,j)=><mesh key={`${sx}-${sz}`} position={[sx,.32,sz]} rotation={[0,0,sx*.16]} castShadow><boxGeometry args={[.045,.62,.045]}/><meshStandardMaterial color="#788188" metalness={.7} roughness={.3}/></mesh>)))}
    {[-.36,0,.36].map((dx,i)=><PhoneOnStand key={i} x={dx} z={-.31} y={.91}/>)}
    <mesh position={[0,.94,.33]} rotation={[-Math.PI/2,0,0]} castShadow><boxGeometry args={[.36,.48,.028]}/><meshStandardMaterial color="#20272c" metalness={.35} roughness={.25}/></mesh>
    <mesh position={[0,.956,.33]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.33,.445]}/><meshStandardMaterial color={index%2?'#778c91':'#b8aaa0'} emissive={index%2?'#50666c':'#6f6259'} emissiveIntensity={.16}/></mesh>
    <mesh position={[0,.3,-.77]}><boxGeometry args={[.92,.035,.035]}/><meshStandardMaterial color="#a9a39a" metalness={.5}/></mesh>
  </group>;
}

function CoolingDisplay(){
  const coolerPositions=[[-3.05,-5.85],[2.95,-5.45]] as const;
  return <group>
    {[-3.55,3.55].map((x,i)=><group key={`ac-${i}`} position={[x,2.98,-6.55]}>
      <mesh castShadow><boxGeometry args={[.42,.3,1.55]}/><meshStandardMaterial color="#faf9f5" roughness={.38}/></mesh>
      <mesh position={[i===0?.218:-.218,-.105,0]} rotation={[0,i===0?Math.PI/2:-Math.PI/2,0]}><planeGeometry args={[1.3,.045]}/><meshStandardMaterial color="#a8afb0" roughness={.5}/></mesh>
      {Array.from({length:9},(_,j)=><mesh key={j} position={[i===0?.221:-.221,-.128,-.56+j*.14]}><boxGeometry args={[.025,.012,.075]}/><meshStandardMaterial color="#858d8e" roughness={.4}/></mesh>)}
    </group>)}
    {coolerPositions.map(([x,z],i)=><group key={`cooler-${i}`} position={[x,0,z]}>
      <mesh position={[0,.7,0]} castShadow><boxGeometry args={[.7,1.35,.5]}/><meshStandardMaterial color="#f0f0ec" roughness={.42}/></mesh>
      <mesh position={[0,.77,.258]}><boxGeometry args={[.52,.76,.02]}/><meshStandardMaterial color="#d9dedc" roughness={.48}/></mesh>
      {[-.25,-.17,-.09,-.01,.07,.15,.23].map((y,j)=><mesh key={j} position={[0,.74+y,.273]}><boxGeometry args={[.42,.012,.009]}/><meshStandardMaterial color="#626f70" roughness={.35}/></mesh>)}
      <mesh position={[0,.55,.286]}><torusGeometry args={[.16,.012,8,32]}/><meshStandardMaterial color="#87918e" metalness={.48} roughness={.32}/></mesh>
      <mesh position={[0,.04,0]}><boxGeometry args={[.62,.09,.46]}/><meshStandardMaterial color="#cbc9c1" roughness={.58}/></mesh>
    </group>)}
  </group>;
}

function BillingCounter(){
  return <group>
    <mesh position={[0,.52,-8.78]} castShadow receiveShadow><boxGeometry args={[3.35,.92,.8]}/><meshStandardMaterial color="#f3f1ec" roughness={.42}/></mesh>
    <mesh position={[0,1.02,-8.77]} castShadow><boxGeometry args={[3.5,.1,.92]}/><meshStandardMaterial color="#bca989" roughness={.38} metalness={.06}/></mesh>
    <mesh position={[0,.5,-8.365]}><boxGeometry args={[3.12,.56,.025]}/><meshStandardMaterial color="#e2dfd7" roughness={.5}/></mesh>
    {[-1.3,-.95,-.6,-.25,.1,.45,.8,1.15].map((x,i)=><mesh key={i} position={[x,.52,-8.345]}><boxGeometry args={[.012,.48,.01]}/><meshStandardMaterial color="#c6c2b8"/></mesh>)}
    <mesh position={[.8,1.34,-8.78]} rotation={[-.12,0,0]} castShadow><boxGeometry args={[.62,.43,.07]}/><meshStandardMaterial color="#252a2c" metalness={.35} roughness={.3}/></mesh>
    <mesh position={[.8,1.35,-8.736]} rotation={[-.12,0,0]}><planeGeometry args={[.54,.34]}/><meshStandardMaterial color="#64787c" emissive="#394f54" emissiveIntensity={.18}/></mesh>
    <mesh position={[-.15,1.11,-8.63]}><boxGeometry args={[.3,.04,.22]}/><meshStandardMaterial color="#25292a" metalness={.35}/></mesh>
    <mesh position={[-1.15,1.18,-8.78]}><boxGeometry args={[.42,.22,.36]}/><meshStandardMaterial color="#e1d8c6" roughness={.7}/></mesh>
    <mesh position={[2.75,.44,-8.85]} castShadow><boxGeometry args={[.72,.8,.58]}/><meshStandardMaterial color="#e5e1d9" roughness={.7}/></mesh>
    <mesh position={[2.75,.86,-8.85]}><boxGeometry args={[.78,.055,.62]}/><meshStandardMaterial color="#bfae91" roughness={.43}/></mesh>
  </group>;
}

function ShopContents(){
  const floorMap=useMemo(makeTileMap,[]);const screenMap=useMemo(makeScreenMap,[]);
  useEffect(()=>()=>{floorMap.dispose();screenMap.dispose()},[floorMap,screenMap]);
  return <>
    <ShopShell floorMap={floorMap}/><WallShelves/><TelevisionWall screenMap={screenMap}/>
    <RetailIsland x={-1.45} z={4.25} index={0}/><RetailIsland x={1.45} z={1} index={1}/>
    <RetailIsland x={-1.45} z={-2.25} index={2}/><RetailIsland x={1.45} z={-5.15} index={0}/>
    <CoolingDisplay/><BillingCounter/>
  </>;
}

function WalkCamera({progress,trigger,onStep}:{progress:React.MutableRefObject<number>;trigger:React.RefObject<HTMLElement>;onStep:(step:number)=>void}){
  const invalidate=useThree(s=>s.invalidate);const camera=useThree(s=>s.camera);
  const cameraPath=useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,1.62,8.45),new THREE.Vector3(-.12,1.62,5.1),new THREE.Vector3(.18,1.62,1.8),new THREE.Vector3(-.18,1.62,-1.65),new THREE.Vector3(.12,1.62,-4.9),new THREE.Vector3(0,1.62,-7.35),
  ],false,'catmullrom',.18),[]);
  useEffect(()=>{
    if(!trigger.current)return;gsap.registerPlugin(ScrollTrigger);const state={value:0};let last=-1;
    const tween=gsap.to(state,{value:1,ease:'none',scrollTrigger:{trigger:trigger.current,start:'top top',end:'bottom bottom',scrub:matchMedia('(prefers-reduced-motion: reduce)').matches?true:.45,onUpdate:()=>{
      progress.current=state.value;invalidate();const next=Math.min(walkStops.length-1,Math.floor(Math.min(.999,state.value)*walkStops.length));if(next!==last){last=next;onStep(next);}
    }}});
    ScrollTrigger.refresh();return()=>{tween.scrollTrigger?.kill();tween.kill()};
  },[trigger,progress,invalidate,onStep]);
  useFrame(()=>{
    const p=THREE.MathUtils.clamp(progress.current,0,1);camera.position.copy(cameraPath.getPointAt(p));
    const direction=cameraPath.getTangentAt(p).normalize();const target=camera.position.clone().addScaledVector(direction,3.4);target.y=1.43;camera.lookAt(target);
  });
  return null;
}

export function ShowroomWalkthrough(){
  const root=useRef<HTMLDivElement>(null);const progress=useRef(0);const [step,setStep]=useState(0);const updateStep=useMemo(()=>((value:number)=>setStep(value)),[]);
  if(!hasWebGL())return <div className="walkthrough-fallback"><div><span>VIRTUAL SHOWROOM · ILLUSTRATIVE LAYOUT</span><h3>Scroll the aisle, from entrance to counter.</h3><p>This lightweight preview needs WebGL for the interactive walkthrough. The store arrangement is conceptual until actual shop photos and measurements are supplied.</p></div><div className="fallback-shelves" aria-hidden="true"><i/><i/><i/><i/></div></div>;
  return <div ref={root} className="walkthrough-scroll" aria-label="Scroll-controlled illustrative virtual showroom">
    <div className="walkthrough-sticky">
      <div className="walkthrough-canvas"><Canvas frameloop="demand" dpr={typeof window!=='undefined'&&window.matchMedia('(max-width:720px)').matches?1:[1,1.35]} camera={{position:[0,1.62,8.45],fov:67,near:.1,far:60}} gl={{antialias:false,alpha:false,powerPreference:'low-power'}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.12}}>
        <color attach="background" args={['#e6e4df']}/><fog attach="fog" args={['#e6e4df',18,35]}/>
        <ambientLight intensity={.82}/><hemisphereLight args={['#fffdf8','#aaa399',.9]}/>
        <directionalLight position={[-3,7,5]} intensity={2.2} color="#fff9ed" castShadow shadow-mapSize-width={768} shadow-mapSize-height={768}/>
        <ShopContents/><WalkCamera progress={progress} trigger={root} onStep={updateStep}/>
      </Canvas></div>
      <div className="walkthrough-hud" aria-live="polite">
        <div className="walkthrough-hud-top"><span>VIRTUAL SHOWROOM <i/> CONCEPT WALKTHROUGH</span><span>SCROLL TO MOVE THROUGH THE STORE</span></div>
        <div className="walkthrough-zone"><span>0{step+1} / 05</span><h3>{walkStops[step].title}</h3><p>{walkStops[step].detail}</p></div>
        <div className="walkthrough-chapters" aria-label="Walkthrough zones">{walkStops.map((stop,i)=><div className={i===step?'active':''} key={stop.title}><span>0{i+1}</span><i/>{i<walkStops.length-1&&<b/>}</div>)}</div>
        <span className="walkthrough-disclaimer">ILLUSTRATIVE STORE LAYOUT · NOT A MEASURED DIGITAL TWIN</span>
      </div>
    </div>
  </div>;
}
