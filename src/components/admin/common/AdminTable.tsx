import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface AdminTableColumn<T = any> {
  key: string;
  title: string;
  dataIndex: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface AdminTableProps<T = any> {
  columns: AdminTableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;
  className?: string;
  emptyText?: string;
  rowKey?: keyof T | ((record: T) => string);
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
    onDoubleClick?: () => void;
    className?: string;
  };
}

export function AdminTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  searchable = true,
  searchPlaceholder = "Search...",
  onSearch,
  className = "",
  emptyText = "No data available",
  rowKey = 'id',
  onRow
}: AdminTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  
  const [searchTerm, setSearchTerm] = useState('');

  // Handle sorting
  const handleSort = (columnKey: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key: columnKey, direction });
  };

  // Sort and filter data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filter if no external search handler
    if (!onSearch && searchTerm) {
      const searchableColumns = columns.filter(col => col.searchable !== false);
      result = result.filter(record =>
        searchableColumns.some(col => {
          const value = record[col.dataIndex];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, sortConfig, searchTerm, onSearch, columns]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Get row key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey]?.toString() || index.toString();
  };

  // Pagination data
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return processedData.slice(start, end);
  }, [processedData, pagination]);

  const totalPages = pagination ? Math.ceil(processedData.length / pagination.pageSize) : 1;

  console.log('[AdminTable] Rendering with data:', processedData.length, 'items');

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.width ? `w-${column.width}` : ''}`}
                  style={{ textAlign: column.align || 'left' }}
                  onClick={() => column.sortable !== false && handleSort(column.dataIndex)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {column.sortable !== false && (
                      <span className="ml-2">
                        {sortConfig.key === column.dataIndex ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <div className="w-4 h-4 opacity-30">
                            <ChevronUp className="w-4 h-4" />
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                    <span className="ml-2 text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((record, index) => {
                const rowProps = onRow?.(record, index);
                return (
                  <tr
                    key={getRowKey(record, index)}
                    className={`hover:bg-gray-50 ${rowProps?.className || ''} ${
                      rowProps?.onClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={rowProps?.onClick}
                    onDoubleClick={rowProps?.onDoubleClick}
                  >
                    {columns.map((column) => {
                      const value = record[column.dataIndex];
                      const rendered = column.render ? column.render(value, record, index) : value;
                      
                      return (
                        <td
                          key={column.key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          style={{ textAlign: column.align || 'left' }}
                        >
                          {rendered}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.current - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.current * pagination.pageSize, processedData.length)} of{' '}
            {processedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current <= 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="px-3 py-1 text-sm">
              Page {pagination.current} of {totalPages}
            </span>
            
            <button
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current >= totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}