import React from 'react';

const LeadTimeline = ({data}) => {
  
  // Color mapping for different stages
  const getColors = (color) => {
    return { dot: `bg-[${color}]`, line:  `bg-[${color}]`, text:  `text-[${color}]` }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 overflow-y-scroll h-[80vh]">
      {data.map((change, index) => (
        <div key={index} className="relative flex gap-4">
          {/* Timeline line */}
          {index !== data.length - 1 && (
            <div style={{backgroundColor:change.colour}} className={`absolute left-1 top-2 h-full w-px ${getColors(change.color).line}`} />
          )}
          
          {/* Timeline content */}
          <div className="flex flex-col items-center">
            {/* Smaller circle indicator */}
            <div style={{backgroundColor:change.colour}} className={`w-2 h-2 rounded-full ${getColors(change.color).dot} flex items-center justify-center`}>
              <div className="flex items-center justify-center">
                <div style={{backgroundColor:change.colour}} className={`w-2 h-2 rounded-full ${getColors(change.color).dot}`} />
              </div>
            </div>
          </div>
          
          {/* Content card - more compact */}
          <div className="flex-1 mb-10 ">
            <div className="px-2 border-gray-100  transition-shadow rounded-lg ">
              {/* Header - smaller text */}
              <div className="flex justify-between items-center mb-1">
                <h3 style={{color:change.colour}} className={`text-sm font-semibold ${getColors(change.color).text}`} >
                  {change.stage}
                </h3>
                <span className="text-xs text-gray-400">
                  {new Date(change.changedAt).toLocaleString()}
                </span>
              </div>
              
              {/* Details - smaller text and spacing */}
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-1">
                 
                  <span className="text-gray-900">{change.changedBy}</span>
                  <span className="text-gray-600">
               ,  {change.reason}
                </span>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadTimeline;