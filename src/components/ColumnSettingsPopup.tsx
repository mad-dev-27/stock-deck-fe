import React from 'react';
import { Settings, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { columnHeaders } from '../data/columnConfig';

interface ColumnSettingsPopupProps {
  visibleColumns: Record<string, boolean>;
  columnOrder: string[];
  popupPosition: { x: number; y: number };
  onToggleColumn: (column: string) => void;
  onMoveColumn: (fromIndex: number, toIndex: number) => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const ColumnSettingsPopup: React.FC<ColumnSettingsPopupProps> = ({
  visibleColumns,
  columnOrder,
  popupPosition,
  onToggleColumn,
  onMoveColumn,
  onClose,
  onMouseDown,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* Draggable Popup */}
      <div 
        className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 min-w-[800px] max-w-[90vw] max-h-[80vh]"
        style={{ 
          left: `${popupPosition.x}px`, 
          top: `${popupPosition.y}px`,
          transform: 'translate(0, 0)'
        }}
        onMouseDown={onMouseDown}
      >
        {/* Popup Header */}
        <div className="popup-header bg-gray-700 px-4 py-3 rounded-t-lg cursor-move flex items-center justify-between border-b border-gray-600">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Column Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          >
            ✕
          </button>
        </div>
        
        {/* Popup Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
          <div className="flex gap-6">
            {/* Column Visibility */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-3">Column Visibility</h3>
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {columnOrder.map((key) => (
                  <label key={key} className="flex items-center gap-2 text-xs cursor-pointer p-2 hover:bg-gray-700 rounded">
                    <input
                      type="checkbox"
                      checked={visibleColumns[key]}
                      onChange={() => onToggleColumn(key)}
                      className="w-3 h-3"
                    />
                    <span className="text-gray-300 text-xs leading-tight" title={columnHeaders[key as keyof typeof columnHeaders]}>
                      {columnHeaders[key as keyof typeof columnHeaders]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Column Order */}
            <div className="w-96">
              <h3 className="text-sm font-semibold text-white mb-3">Column Order</h3>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {columnOrder.map((key, index) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 p-2 bg-gray-700 rounded text-xs hover:bg-gray-600 transition-colors"
                  >
                    <GripVertical className="w-3 h-3 text-gray-400" />
                    <span className="flex-1 text-gray-200 text-xs">
                      {index + 1}. {columnHeaders[key as keyof typeof columnHeaders]}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => index > 0 && onMoveColumn(index, index - 1)}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-500 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => index < columnOrder.length - 1 && onMoveColumn(index, index + 1)}
                        disabled={index === columnOrder.length - 1}
                        className="p-1 hover:bg-gray-500 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};