import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vert = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform float uStrength;
varying vec3 vPos;
varying float vRipple;
varying vec3 vN;
float h(vec2 q){
  float w = sin(q.x*0.35 + uTime*0.4)*0.35 + cos(q.y*0.3 + uTime*0.3)*0.35
          + sin((q.x+q.y)*0.6 + uTime*0.6)*0.12;
  float d = distance(q, uMouse);
  return w + sin(d*2.2 - uTime*3.0) * exp(-d*0.35) * uStrength;
}
void main(){
  vec3 p = position;
  float e = 0.05;
  float z = h(p.xy);
  vec3 n = normalize(vec3(-(h(p.xy+vec2(e,0.))-z)/e, -(h(p.xy+vec2(0.,e))-z)/e, 1.0));
  vN = normalize(normalMatrix * n);
  p.z += z;
  vRipple = exp(-distance(p.xy,uMouse)*0.3) * uStrength;
  vPos = p;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
}`;

const frag = /* glsl */ `
uniform vec3 uGold;
uniform vec3 uBase;
varying vec3 vPos;
varying float vRipple;
varying vec3 vN;
void main(){
  vec3 n = normalize(vN);
  vec3 L = normalize(vec3(-0.4, 0.6, 0.8));
  vec3 V = vec3(0.0,0.0,1.0);
  float diff = max(dot(n,L),0.0);
  float spec = pow(max(dot(reflect(-L,n),V),0.0), 18.0);
  float fres = pow(1.0 - max(dot(n,V),0.0), 3.0);
  vec3 col = uBase * (0.4 + diff*0.6);
  col += uGold * spec * (0.6 + vRipple*1.6);
  col += uGold * fres * (0.3 + vRipple*0.6);
  gl_FragColor = vec4(col, 1.0);
}`;

function Surface() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const target = useRef(new THREE.Vector2(0, 0));
  const strength = useRef(0);
  const last = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uStrength: { value: 0 },
      uGold: { value: new THREE.Color("#D4AF37") },
      uBase: { value: new THREE.Color("#2b2b2b") },
    }),
    [],
  );
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(
        (e.clientX / window.innerWidth - 0.5) * viewport.width * 1.2,
        -(e.clientY / window.innerHeight - 0.5) * viewport.height * 1.6,
      );
      last.current = performance.now();
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [viewport]);
  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    if (!mat.current) return;
    const u = mat.current.uniforms as unknown as typeof uniforms;
    u.uTime.value += dt;
    u.uMouse.value.lerp(target.current, 1 - Math.exp(-4 * dt));
    const active = performance.now() - last.current < 1200 ? 1 : 0.35;
    strength.current += (active - strength.current) * (1 - Math.exp(-2 * dt));
    u.uStrength.value = strength.current * 0.6;
  });
  return (
    <mesh rotation-x={-0.55}>
      <planeGeometry args={[40, 30, 220, 160]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  );
}

export function GoldWaves() {
  return (
    <div className="fixed left-0 top-0 h-screen w-screen" style={{ zIndex: -1 }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 9], fov: 55 }}>
        <color attach="background" args={["#0A0A0A"]} />
        <fog attach="fog" args={["#0A0A0A", 8, 22]} />
        <Surface />
      </Canvas>
    </div>
  );
}
