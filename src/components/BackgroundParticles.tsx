import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function StarField() {
  const group = useRef<THREE.Group>(null!);
  const { viewport, mouse } = useThree();

  useFrame((state) => {
    const { clock } = state;
    
    // Base rotation
    group.current.rotation.y = clock.getElapsedTime() * 0.05;
    group.current.rotation.x = clock.getElapsedTime() * 0.02;
    
    // Mouse movement effect (moveable stars)
    const targetX = mouse.x * (viewport.width / 2);
    const targetY = mouse.y * (viewport.height / 2);
    
    group.current.position.x += (targetX * 0.1 - group.current.position.x) * 0.05;
    group.current.position.y += (targetY * 0.1 - group.current.position.y) * 0.05;
  });

  return (
    <group ref={group}>
      <Stars 
        radius={100} 
        depth={50} 
        count={7000} 
        factor={6} 
        saturation={0} 
        fade 
        speed={1.5} 
      />
    </group>
  );
}

export default function BackgroundParticles() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }} 
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={['#050505']} />
        <StarField />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/5 to-dark-bg pointer-events-none" />
    </div>
  );
}
