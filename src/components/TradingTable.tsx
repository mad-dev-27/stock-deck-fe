import React, { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import { columnHeaders } from '../data/columnConfig';
import { mockData } from '../data/mockData';

interface TradingTableProps {
  visibleColumns: Record<string, boolean>;
  columnOrder: string[];
  columnWidths: Record<string, number>;
  onColumnWidthChange: (column: string, width: number) => void;
  onColumnReorder: (fromIndex: number, toIndex: number) => void;
}

export const TradingTable: React.FC<TradingTableProps> = ({
  visibleColumns,
  columnOrder,
  columnWidths,
  onColumnWidthChange,
  onColumnReorder,
}) => {
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [tableContainerRef, setTableContainerRef] = useState<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent, column: string) => {
    setDraggedColumn(column);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== targetColumn) {
      const fromIndex = columnOrder.indexOf(draggedColumn);
      const toIndex = columnOrder.indexOf(targetColumn);
      onColumnReorder(fromIndex, toIndex);
    }
    setDraggedColumn(null);
  };

  const handleResizeStart = (e: React.MouseEvent, column: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(column);
    setResizeStartX(e.clientX);
    setResizeStartWidth(columnWidths[column]);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (resizingColumn) {
      const diff = e.clientX - resizeStartX;
      const newWidth = Math.max(0, resizeStartWidth + diff); // Allow width to go to 0
      onColumnWidthChange(resizingColumn, newWidth);
    }
  };

  const handleResizeEnd = () => {
    setResizingColumn(null);
  };

  // Handle mouse wheel for horizontal scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (!tableContainerRef) return;
    
    // If scrolling vertically and we're not at the edges, allow normal vertical scroll
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      // Check if we can scroll vertically
      const canScrollUp = tableContainerRef.scrollTop > 0;
      const canScrollDown = tableContainerRef.scrollTop < (tableContainerRef.scrollHeight - tableContainerRef.clientHeight);
      
      if ((e.deltaY < 0 && canScrollUp) || (e.deltaY > 0 && canScrollDown)) {
        // Allow normal vertical scrolling
        return;
      }
    }
    
    // For horizontal scrolling or when vertical scroll is at limits
    if (e.deltaX !== 0 || (Math.abs(e.deltaY) > Math.abs(e.deltaX) && 
        (tableContainerRef.scrollTop === 0 || 
         tableContainerRef.scrollTop >= (tableContainerRef.scrollHeight - tableContainerRef.clientHeight)))) {
      e.preventDefault();
      tableContainerRef.scrollLeft += e.deltaX || e.deltaY;
    }
  };
  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingColumn, resizeStartX, resizeStartWidth]);

  return (
    <div className="flex-1 relative">
      {/* Vertical scrollable container with hidden horizontal scroll */}
      <div 
        ref={setTableContainerRef}
        className="overflow-x-hidden overflow-y-auto h-[calc(100vh-240px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 flex-1"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 #1F2937'
        }}
        onWheel={handleWheel}
      >
        {/* Inner container for horizontal scrolling */}
        <div className="overflow-x-auto overflow-y-visible">
          <table className="text-xs border-collapse" style={{ minWidth: 'max-content' }}>
            <thead className="bg-gray-700 sticky top-0 z-10">
              <tr>
                {columnOrder.map((key) => (
                  visibleColumns[key] && (
                    <th 
                      key={key} 
                      className="px-1 py-3 text-left font-semibold text-white border-r border-gray-600 bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-200 relative group"
                      style={{ 
                        width: columnWidths[key] === 0 ? '0px' : `${Math.max(columnWidths[key], 20)}px`,
                        minWidth: columnWidths[key] === 0 ? '0px' : '20px',
                        maxWidth: columnWidths[key] === 0 ? '0px' : 'none',
                        overflow: 'hidden'
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, key)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, key)}
                    >
                      <div className="flex items-center justify-between" style={{ opacity: columnWidths[key] === 0 ? 0 : 1 }}>
                        <div className="truncate text-xs leading-tight text-blue-200 font-bold tracking-wide uppercase flex-1" title={columnHeaders[key as keyof typeof columnHeaders]}>
                          {columnHeaders[key as keyof typeof columnHeaders]}
                        </div>
                        <GripVertical className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move ml-1" />
                      </div>
                      {/* Enhanced Resize Handle */}
                      <div
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 transition-colors z-20"
                        style={{ 
                          background: resizingColumn === key ? '#3B82F6' : 'transparent',
                          right: '-1px'
                        }}
                        onMouseDown={(e) => handleResizeStart(e, key)}
                        title="Drag to resize column (can resize to 0 width)"
                      />
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-800">
              {mockData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-700 border-b border-gray-700">
                  {columnOrder.map((key) => (
                    visibleColumns[key] && (
                      <td 
                        key={key} 
                        className="px-1 py-2 text-gray-100 border-r border-gray-700"
                        style={{ 
                          width: columnWidths[key] === 0 ? '0px' : `${Math.max(columnWidths[key], 20)}px`,
                          minWidth: columnWidths[key] === 0 ? '0px' : '20px',
                          maxWidth: columnWidths[key] === 0 ? '0px' : 'none',
                          overflow: 'hidden'
                        }}
                      >
                        <div 
                          className={`truncate ${
                            (key === 'changePercent' || key === 'netChange') ? 
                              (row[key as keyof typeof row].toString().startsWith('+') ? 'text-green-400' : 
                               row[key as keyof typeof row].toString().startsWith('-') ? 'text-red-400' : '') : ''
                          }`}
                          style={{ opacity: columnWidths[key] === 0 ? 0 : 1 }}
                        >
                          {row[key as keyof typeof row]}
                        </div>
                      </td>
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom horizontal scrollbar */}
      <div 
        className="overflow-x-auto overflow-y-hidden h-4 bg-gray-800 border-t border-gray-700"
        onScroll={(e) => {
          if (tableContainerRef) {
            const innerContainer = tableContainerRef.querySelector('div') as HTMLDivElement;
            if (innerContainer) {
              innerContainer.scrollLeft = e.currentTarget.scrollLeft;
            }
          }
        }}
      >
        <div style={{ 
          width: `${Object.keys(visibleColumns).reduce((total, key) => 
            visibleColumns[key] ? total + Math.max(columnWidths[key], 20) : total, 0)}px`,
          height: '1px'
        }} />
      </div>

      {/* Resize cursor overlay */}
      {resizingColumn && (
        <div className="fixed inset-0 cursor-col-resize z-50" style={{ pointerEvents: 'none' }} />
      )}

      {/* Enhanced scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1F2937;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
        .scrollbar-thin::-webkit-scrollbar-corner {
          background: #1F2937;
        }
      `}</style>
    </div>
  );
};