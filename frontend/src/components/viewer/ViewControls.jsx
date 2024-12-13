import React, { useState } from 'react';

const ViewControls = ({ onViewChange }) => {
  const [activeView, setActiveView] = useState('default');

  const viewPresets = [
    { 
      name: 'default', 
      label: '預設視角', 
      cameraPosition: [0, 2, 5],
      description: '標準視角，適合整體觀察'
    },
    { 
      name: 'top', 
      label: '俯視角', 
      cameraPosition: [0, 5, 0],
      description: '從上方觀察模型' 
    },
    { 
      name: 'side', 
      label: '側視角', 
      cameraPosition: [5, 2, 0],
      description: '從側面觀察模型' 
    },
    { 
      name: 'detail', 
      label: '細節視角', 
      cameraPosition: [1, 1, 3],
      description: '特寫，觀察模型細節' 
    }
  ];

  const handleViewChange = (view) => {
    setActiveView(view.name);
    onViewChange(view.cameraPosition);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">視角選擇</h3>
      <div className="grid grid-cols-2 gap-3">
        {viewPresets.map((view) => (
          <button
            key={view.name}
            onClick={() => handleViewChange(view)}
            className={`
              p-3 rounded-md transition-all duration-200 text-left
              ${activeView === view.name 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            <div className="font-medium">{view.label}</div>
            <div className="text-xs opacity-75">{view.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewControls;