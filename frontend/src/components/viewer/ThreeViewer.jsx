import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stage, 
  Environment, 
  PresentationControls,
  useGLTF 
} from '@react-three/drei';

const Model = ({ url }) => {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} scale={1} />;
};

const ThreeViewer = ({ modelUrl }) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas>
        {/* 添加環境光源 */}
        <ambientLight intensity={0.5} />
        {/* 添加平行光源 */}
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
        />
        {/* 添加點光源 */}
        <pointLight 
          position={[-10, -10, -5]} 
          intensity={0.5} 
        />
        
        <PresentationControls
          global
          rotation={[0, -Math.PI / 4, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <Model url={modelUrl} />
        </PresentationControls>

        <Environment preset="studio" />
        <OrbitControls autoRotate />
      </Canvas>
    </div>
  );
};

export default ThreeViewer;