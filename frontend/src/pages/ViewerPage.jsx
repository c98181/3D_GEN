import React, { useState } from 'react';
import ViewerThreeViewer from '../components/viewer/ViewerThreeViewer';
import ModelControls from '../components/viewer/ModelControls';
import ViewControls from '../components/viewer/ViewControls';

const ViewerPage = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [cameraPosition, setCameraPosition] = useState([0, 2, 5]);
  const [scale, setScale] = useState(1);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
    }
  };

  const handleViewChange = (newPosition) => {
    setCameraPosition(newPosition);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 2.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev * 0.8, 0.5));
  };

  const handleReset = () => {
    setCameraPosition([0, 1.5, 3]);
    setScale(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          3D 模型瀏覽器
        </h1>

        <div className="mb-6 flex justify-center">
          <input 
            type="file" 
            accept=".glb,.gltf" 
            onChange={handleFileUpload}
            className="
              block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
            "
          />
        </div>

        {modelUrl ? (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-gray-50 rounded-lg shadow-inner">
              <ViewerThreeViewer 
                modelUrl={modelUrl}
                cameraPosition={cameraPosition}
                scale={scale}
              />
            </div>
            <div className="space-y-4">
              <ViewControls onViewChange={handleViewChange} />
              <ModelControls 
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleReset}
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            請上傳 GLB/GLTF 模型
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewerPage;