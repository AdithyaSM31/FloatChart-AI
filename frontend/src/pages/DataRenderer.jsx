import React, { useState } from 'react';

const DataRenderer = ({ data }) => {
  // State to track if the view is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine which records to show based on the state
  const recordsToShow = isExpanded ? data : data.slice(0, 3);

  return (
    <div className="data-preview">
      {recordsToShow.map((row, index) => (
        <div key={index} className="data-row">
          {Object.entries(row).slice(0, 4).map(([key, value]) => (
            <div key={key} className="data-cell">
              <span className="data-key">{key}:</span>
              <span className="data-value">{String(value)}</span>
            </div>
          ))}
        </div>
      ))}

      {/* Conditionally render the "Show More/Less" button */}
      {data.length > 3 && (
        <div className="data-more">
          <button className="btn btn-link" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '... show less' : `... and ${data.length - 3} more records`}
          </button>
        </div>
      )}
    </div>
  );
};

export default DataRenderer;
