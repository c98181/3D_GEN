import React, { useState } from 'react';
import TextInput from '../components/modelGen/TextInput';
import ImageUpload from '../components/modelGen/ImageUpload';
import ModelDisplay from '../components/modelGen/ModelDisplay';
import GenerationStatus from '../components/modelGen/GenerationStatus';

const GenerationPage = () => {
  const [generations, setGenerations] = useState([]);
  const [activeTab, setActiveTab] = useState('text');

  const handleGenerationComplete = (generationData) => {
    // 確保使用完整的響應數據
    console.log('Generation complete data:', generationData);
    
    // 檢查數據結構並添加到generations數組
    if (generationData.data && generationData.data.generation_id) {
      setGenerations(prev => [generationData.data, ...prev]);
    } else if (generationData.generation_id) {
      setGenerations(prev => [generationData, ...prev]);
    } else {
      console.error('Invalid generation data:', generationData);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          AI 3D 模型生成
        </h1>
        
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button 
              onClick={() => setActiveTab('text')}
              className={`
                px-4 py-2 text-sm font-medium 
                ${activeTab === 'text' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-900 border'}
                first:rounded-l-lg last:rounded-r-lg
              `}
            >
              文字生成
            </button>
            <button 
              onClick={() => setActiveTab('image')}
              className={`
                px-4 py-2 text-sm font-medium 
                ${activeTab === 'image' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-900 border'}
                first:rounded-l-lg last:rounded-r-lg
              `}
            >
              圖像上傳
            </button>
          </div>
        </div>

        {activeTab === 'text' ? (
          <TextInput onGenerationComplete={handleGenerationComplete} />
        ) : (
          <ImageUpload onGenerationComplete={handleGenerationComplete} />
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            最近生成
          </h2>
          {generations.length === 0 ? (
            <div className="text-center text-gray-500">
              尚未生成任何模型
            </div>
          ) : (
            <div className="space-y-4">
              {generations.map((generation, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4">
                  <GenerationStatus generation={generation} />
                  <ModelDisplay generation={generation} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerationPage;