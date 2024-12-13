import React, { useState } from 'react';
import ThreeViewer from '../viewer/ThreeViewer';
import Modal from '../common/Modal';

const CollectionItem = ({ collection, onRemove }) => {
  const [showViewer, setShowViewer] = useState(false);
  const modelUrl = collection.glb_path ? 
    `/trelli_platform/php_backend/file_server.php?path=${collection.glb_path}` : 
    null;

  const videoUrl = collection.video_path ? 
    `/trelli_platform/php_backend/file_server.php?path=${collection.video_path}` : 
    null;

  const handleDownload = async () => {
    try {
      const response = await fetch(modelUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `model-${collection.id}.glb`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('下載失敗:', error);
      alert('下載失敗，請稍後再試');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="h-64 bg-gray-100 flex items-center justify-center">
        <button
          onClick={() => setShowViewer(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          預覽 3D 模型
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              收藏 ID: {collection.id}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              輸入描述: {collection.input_text || 'N/A'}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleDownload}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              下載模型
            </button>
            <button 
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 transition-colors ml-4"
            >
              移除
            </button>
          </div>
        </div>

        {videoUrl && (
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">預覽影片</h4>
            <video 
              className="w-full rounded-lg shadow-sm"
              src={videoUrl} 
              controls
              preload="metadata"
            >
              您的瀏覽器不支持影片播放
            </video>
          </div>
        )}

        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>生成 ID: {collection.generation_id}</span>
          <span>狀態: {collection.status || '完成'}</span>
        </div>
      </div>

      {/* 3D 模型預覽 Modal */}
      <Modal isOpen={showViewer} onClose={() => setShowViewer(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">3D 模型預覽</h2>
          <div className="h-[600px]">
            <ThreeViewer 
              modelUrl={modelUrl}
              alt="3D Model"
            />
          </div>
          <p className="mt-4 text-gray-600">
            模型描述：{collection.input_text || 'N/A'}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default CollectionItem;