import { useRef } from "react";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Avatar } from "./Avatar";

/* ============================================================
   Blueprint-themed R3F scene. Replaces the default drei <Sky />
   + sunset <Environment> (which rendered a bright realistic sky
   dome — the source of the white canvas) with the same ink-blue
   / ember dressing the wireframe mannequin used to sit in:
     - dark ambient + a single directional key light, ember rim light
     - an ember accent ring under the avatar's feet (was the old
       "footprint" ring)
     - a faint blueprint grid on the ground instead of a white plane
     - a slowly-rotating wireframe icosahedron "shell" around the
       figure (was the orbiting polygon the old mannequin sat inside)
   Canvas background color + camera are still set in Portfolio.jsx.
   ============================================================ */

function RotatingShell() {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // if (ref.current) {
    //   ref.current.rotation.y = -t * 0.05;
    //   ref.current.rotation.x = t * 0.02;
    // }
  });
  return (
    <mesh ref={ref} position-y={0.2}>
      <icosahedronGeometry args={[3.2, 0]} />
      <meshBasicMaterial color="#9fb8cc" wireframe transparent opacity={0.14} />
    </mesh>
  );
}

export const Experience = () => {
  const animation = "Standing";

  return (
    <>
      {/* Orbit controls kept from the original file; damped + no zoom
         so it reads as a gentle look-around rather than a full 3D tool */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0}
      />

      {/* Theme-matched lighting — no HDRI / sky dome, but bright enough
         to read clearly against the dark background */}
      <ambientLight intensity={1.1} color="#c9dcea" />
      <hemisphereLight args={["#eaf4fb", "#0e3a5c", 0.8]} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.9} color="#ffffff" />
      <directionalLight position={[-2, 2, -3]} intensity={0.6} color="#9fb8cc" />
      <pointLight position={[-3, 1.6, -2]} intensity={1.2} color="#ff7a45" />

      <group position-y={-1} position-z={0}>
        <ContactShadows
          opacity={0.3}
          scale={10}
          blur={1.8}
          far={10}
          resolution={256}
          color="#03111d"
        />

        <Avatar animationState={animation} />

        {/* Ember accent ring — same footprint ring the wireframe figure had */}
        <mesh rotation-x={-Math.PI / 2} position-y={-0.10}>
          <ringGeometry args={[0.62, 0.66, 48]} />
          <meshBasicMaterial color="#ff7a45" transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>

        {/* Faint blueprint grid floor instead of the plain white plane */}
        <gridHelper args={[10, 20, "#ff7a45", "#1a4f78"]} position-y={-0.9} />
      </group>

      {/* Faint orbiting wireframe shell — the "polygon" the mannequin sat inside */}
      {/* <RotatingShell /> */}
    </>
  );
};