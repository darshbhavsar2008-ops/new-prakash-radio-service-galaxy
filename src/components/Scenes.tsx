import { Canvas } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef } from 'react';
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
