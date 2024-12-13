import React, { useState, useEffect } from 'react';
import { collectionService } from '../../services/collectionService';
import CollectionItem from './CollectionItem';
import { Loading } from '../common/Loading';

const CollectionGrid = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      try {
        const response = await collectionService.listCollections();
        
        if (response.data.success) {
          setCollections(response.data.data.collections);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleRemoveCollection = async (collectionId) => {
    try {
      await collectionService.removeCollection(collectionId);
      setCollections(prev => 
        prev.filter(collection => collection.id !== collectionId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        載入收藏失敗：{error}
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4">
      {collections.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          您還沒有任何收藏
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map(collection => (
            <CollectionItem 
              key={collection.id}
              collection={collection}
              onRemove={() => handleRemoveCollection(collection.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionGrid;