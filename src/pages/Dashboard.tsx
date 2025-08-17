import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { TickerTape } from '../components/TickerTape';
import { ColumnSettingsPopup } from '../components/ColumnSettingsPopup';
import { TradingTable } from '../components/TradingTable';
import { defaultColumns } from '../data/columnConfig';

export const Dashboard: React.FC = () => {
  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [columnOrder, setColumnOrder] = useState(Object.keys(defaultColumns));
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    Object.keys(defaultColumns).reduce((acc, key) => ({ ...acc, [key]: 120 }), {})
  );
  const [popupPosition, setPopupPosition] = useState({ x: 100, y: 100 });
  const [isDraggingPopup, setIsDraggingPopup] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    const newOrder = [...columnOrder];
    const [movedColumn] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedColumn);
    setColumnOrder(newOrder);
  };

  const handleColumnWidthChange = (column: string, width: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [column]: width
    }));
  };

  const handlePopupMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.popup-header')) {
      setIsDraggingPopup(true);
      setDragStart({
        x: e.clientX - popupPosition.x,
        y: e.clientY - popupPosition.y
      });
    }
  };

  const handlePopupMouseMove = (e: MouseEvent) => {
    if (isDraggingPopup) {
      setPopupPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handlePopupMouseUp = () => {
    setIsDraggingPopup(false);
  };

  useEffect(() => {
    if (isDraggingPopup) {
      document.addEventListener('mousemove', handlePopupMouseMove);
      document.addEventListener('mouseup', handlePopupMouseUp);
      return () => {
        document.removeEventListener('mousemove', handlePopupMouseMove);
        document.removeEventListener('mouseup', handlePopupMouseUp);
      };
    }
  }, [isDraggingPopup, dragStart]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header onSettingsClick={() => setShowColumnSettings(!showColumnSettings)} />
      <TickerTape />
      
      {/* Dashboard Title */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <h2 className="text-xl font-bold text-center text-white">DASHBOARD</h2>
      </div>

      {/* Column Settings Popup */}
      {showColumnSettings && (
        <ColumnSettingsPopup
          visibleColumns={visibleColumns}
          columnOrder={columnOrder}
          popupPosition={popupPosition}
          onToggleColumn={toggleColumn}
          onMoveColumn={moveColumn}
          onClose={() => setShowColumnSettings(false)}
          onMouseDown={handlePopupMouseDown}
        />
      )}

      {/* Main Table */}
      <TradingTable
        visibleColumns={visibleColumns}
        columnOrder={columnOrder}
        columnWidths={columnWidths}
        onColumnWidthChange={handleColumnWidthChange}
        onColumnReorder={moveColumn}
      />
    </div>
  );
};