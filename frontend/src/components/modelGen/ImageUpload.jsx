import React, { useState, useRef } from 'react';
import { generationService } from '../../services/generationService';

const ImageUpload = ({ onGenerationComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Validate file type and size
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        setError('僅支持 JPEG, PNG 和 WebP 格式');
        return;
      }

      if (file.size > maxSize) {
        setError('檔案大小不得超過 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('請選擇要上傳的圖片');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await generationService.uploadImage(selectedFile);
      console.log('Upload jsx response:', response);
      if (response.status === 201) {
        console.log('Upload jsx response.data:', response.data);
        onGenerationComplete(response.data);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setSelectedFile(null);
      } else {
        setError(response.message || '上傳失敗');
      }
    } catch (err) {
      setError('伺服器錯誤，請稍後再試');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">圖片上傳生成</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {selectedFile ? (
                <p className="mb-2 text-sm text-gray-500">{selectedFile.name}</p>
              ) : (
                <>
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">點擊上傳圖片</p>
                  <p className="text-xs text-gray-500">支持 PNG, JPEG, WebP (最大 10MB)</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={!selectedFile || isLoading}
          className={`w-full py-2 rounded-md transition duration-300 ${
            (!selectedFile || isLoading)
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLoading ? '上傳中...' : '開始生成'}
        </button>
      </form>
    </div>
  );
};

export default ImageUpload;