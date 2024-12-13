import React, { useState } from 'react';
import ThreeViewer from '../viewer/ThreeViewer';
import { collectionService } from '../../services/collectionService';

const ModelDisplay = ({ generation }) => {
  const [isAddingToCollection, setIsAddingToCollection] = useState(false);
  const [error, setError] = useState('');
  
  const model = generation.glb_path || 
    (generation.data && generation.data.glb_path);
  
  // 使用 PHP 的檔案伺服器路由
  const modelUrl = model ? 
    `/trelli_platform/php_backend/file_server.php?path=${model}` : 
    null;
  console.log('ModelDisplay modelUrl:', modelUrl);

  const handleAddToCollection = async () => {
    if (!model) return;
    
    setIsAddingToCollection(true);
    setError('');
    
    try {
      const response = await collectionService.addToCollection(
        generation.id || generation.generation_id
      );
      console.log('Add to collection response:', response);
      
      if (response.data.success) {
        alert('已成功加入收藏！');
      } else {
        throw new Error(response.message || '新增至收藏失敗');
      }
    } catch (err) {
      setError('新增至收藏失敗: ' + err.message);
    } finally {
      setIsAddingToCollection(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          模型預覽
        </h2>
        {modelUrl && (
          <button
            onClick={handleAddToCollection}
            disabled={isAddingToCollection}
            className={`px-4 py-2 rounded-lg text-white text-sm transition-colors ${
              isAddingToCollection
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isAddingToCollection ? '新增中...' : '加入收藏'}
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {modelUrl ? (
        <ThreeViewer 
          modelUrl={modelUrl}
          alt="3D"
        />
      ) : (
        <div className="text-center text-gray-500">
          無法預覽模型
        </div>
      )}
    </div>
  );
};
export default ModelDisplay;