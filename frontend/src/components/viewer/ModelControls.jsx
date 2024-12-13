import React, { useState } from 'react';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RefreshIcon from '@mui/icons-material/Refresh';

const ModelControls = ({
  onRotate,
  onZoomIn,
  onZoomOut,
  onReset
}) => {
  const [activeControl, setActiveControl] = useState(null);

  const handleControlClick = (controlName) => {
    setActiveControl(controlName);
    switch(controlName) {
      case 'rotate':
        onRotate();
        break;
      case 'zoomIn':
        onZoomIn();
        break;
      case 'zoomOut':
        onZoomOut();
        break;
      case 'reset':
        onReset();
        break;
      default:
        break;
    }
  };

  const controlButtons = [
    { 
      name: 'zoomIn',
      icon: <ZoomInIcon />,
      label: '放大' 
    },
    { 
      name: 'zoomOut',
      icon: <ZoomOutIcon />,
      label: '縮小' 
    },
    { 
      name: 'reset',
      icon: <RefreshIcon />,
      label: '重置' 
    }
  ];

  return (
    <div className="flex justify-center space-x-4 p-4 bg-white rounded-lg shadow-md">
      {controlButtons.map((button) => (
        <button
          key={button.name}
          onClick={() => handleControlClick(button.name)}
          className={`
            flex flex-col items-center justify-center 
            p-2 rounded-md transition-all duration-200
            ${activeControl === button.name
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          {button.icon}
          <span className="text-xs mt-1">{button.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ModelControls;