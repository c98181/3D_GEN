import React from 'react';

const GenerationStatus = ({ generation }) => {
  // 處理不同的數據結構
  const generationData = generation.data || generation;
  console.log('GenerationStatus generationData:', generationData);
  
  const videoUrl = generationData.video_path ? 
    `/trelli_platform/php_backend/file_server.php?path=${generationData.video_path}` : 
    null;
  console.log('GenerationStatus videoUrl:', videoUrl);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              生成 ID: {generationData.generation_id || generationData.id}
            </h3>
            <p className="text-sm text-gray-500">
              輸入描述: {generationData.explain || 'N/A'}
            </p>
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
      </div>
    </div>
  );
};
export default GenerationStatus;