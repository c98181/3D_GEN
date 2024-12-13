import React from 'react';
import CollectionGrid from '../components/collections/CollectionGrid';

const CollectionsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          我的模型收藏
        </h1>
        <CollectionGrid />
      </div>
    </div>
  );
};

export default CollectionsPage;