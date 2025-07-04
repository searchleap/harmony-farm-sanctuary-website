import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { AnalyticsExport, AnalyticsFilter } from '../../../types/analytics';
import { AdminButton } from '../common/AdminButton';
import { AdminModal } from '../common/AdminModal';

interface DataExportToolProps {
  data: any[];
  filters: AnalyticsFilter;
  filename?: string;
  title?: string;
}

const DataExportTool: React.FC<DataExportToolProps> = ({
  data,
  filters,
  filename = 'sanctuary-analytics',
  title = 'Export Analytics Data'
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf' | 'excel' | 'json'>('csv');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      value: 'csv',
      label: 'CSV',
      description: 'Comma-separated values for spreadsheet applications',
      icon: FileSpreadsheet,
      extension: '.csv'
    },
    {
      value: 'excel',
      label: 'Excel',
      description: 'Microsoft Excel workbook format',
      icon: FileSpreadsheet,
      extension: '.xlsx'
    },
    {
      value: 'pdf',
      label: 'PDF',
      description: 'Portable document format for sharing and printing',
      icon: FileText,
      extension: '.pdf'
    },
    {
      value: 'json',
      label: 'JSON',
      description: 'JavaScript Object Notation for developers',
      icon: File,
      extension: '.json'
    }
  ];

  // Extract available columns from data
  const availableColumns = data.length > 0 ? Object.keys(data[0]) : [];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exportData: AnalyticsExport = {
        format: selectedFormat,
        data: data,
        filename: `${filename}-${new Date().toISOString().split('T')[0]}`,
        columns: selectedColumns.length > 0 ? selectedColumns : availableColumns,
        filters: filters,
        generatedAt: new Date()
      };

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, this would trigger actual file generation
      console.log('Exporting data:', exportData);
      
      // Create a mock download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportData.filename}${exportFormats.find(f => f.value === selectedFormat)?.extension}`;
      a.click();
      URL.revokeObjectURL(url);

      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(availableColumns);
  };

  const clearColumnSelection = () => {
    setSelectedColumns([]);
  };

  return (
    <>
      <AdminButton
        variant="outline"
        onClick={() => setIsExportModalOpen(true)}
        icon={Download}
        disabled={data.length === 0}
      >
        Export Data
      </AdminButton>

      <AdminModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={title}
        size="lg"
      >
        <div className="space-y-6">
          {/* Export Format Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Export Format
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {exportFormats.map((format) => {
                const IconComponent = format.icon;
                return (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value as any)}
                    className={`p-4 text-left border rounded-lg transition-colors ${
                      selectedFormat === format.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-5 h-5 ${
                        selectedFormat === format.value ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {format.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {format.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Select Columns
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={selectAllColumns}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Select All
                </button>
                <button
                  onClick={clearColumnSelection}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
              {availableColumns.map((column) => (
                <label key={column} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column) || selectedColumns.length === 0}
                    onChange={() => handleColumnToggle(column)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
            
            {selectedColumns.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                All columns will be included when none are selected
              </p>
            )}
          </div>

          {/* Export Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Export Summary
            </h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div>Records: {data.length.toLocaleString()}</div>
              <div>
                Columns: {selectedColumns.length > 0 ? selectedColumns.length : availableColumns.length}
              </div>
              <div>Format: {exportFormats.find(f => f.value === selectedFormat)?.label}</div>
              <div>
                Filename: {filename}-{new Date().toISOString().split('T')[0]}
                {exportFormats.find(f => f.value === selectedFormat)?.extension}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <AdminButton
              variant="outline"
              onClick={() => setIsExportModalOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              onClick={handleExport}
              loading={isExporting}
              icon={Download}
            >
              {isExporting ? 'Exporting...' : 'Export Data'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </>
  );
};

export default DataExportTool;