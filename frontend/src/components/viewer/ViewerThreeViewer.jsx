import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  useGLTF 
} from '@react-three/drei';

const Model = ({ url, scale = 1 }) => {
    const gltf = useGLTF(url);
    return <primitive object={gltf.scene} scale={scale} />;
  };

const ViewerThreeViewer = ({ modelUrl, cameraPosition = [0, 2, 5], scale = 0.5 }) => {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      const [x, y, z] = cameraPosition;
      controlsRef.current.object.position.set(x, y, z);
      controlsRef.current.update();
    }
  }, [cameraPosition]);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Canvas shadows camera={{ position: cameraPosition, fov: 75 }}>
        {/* 環境光源 */}
        <ambientLight intensity={0.5} />
        
        {/* 平行光源 */}
        <directionalLight 
          castShadow
          position={[10, 10, 5]} 
          intensity={1} 
        />
        
        {/* 點光源 */}
        <pointLight 
          position={[-10, -10, -5]} 
          intensity={0.5} 
        />

        {/* 模型 */}
        <Model url={modelUrl} scale={scale} />

        {/* 控制項 */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={10}
          enablePan={false}
        />

        {/* 環境 */}
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
};

export default ViewerThreeViewer;