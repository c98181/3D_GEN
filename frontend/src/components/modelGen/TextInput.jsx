import React, { useState } from 'react';
import { generationService } from '../../services/generationService';

const TextInput = ({ onGenerationComplete }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeneration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await generationService.createGeneration(inputText);
      console.log('Generation response:', response);
      if (response.status === 201) {
        onGenerationComplete(response.data);
      } else {
        setError(response.message || '生成失敗');
      }
    } catch (err) {
      setError('伺服器錯誤，請稍後再試');
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">AI 文字生成</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleGeneration} className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="輸入文字描述生成您想要的模型..."
          rows="4"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          minLength={10}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-md transition duration-300 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLoading ? '生成中...' : '生成模型'}
        </button>
      </form>
    </div>
  );
};

export default TextInput;