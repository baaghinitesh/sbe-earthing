import React, { useState } from 'react';
import { Download, Calendar, Filter, FileText, Database, X, CheckCircle } from 'lucide-react';
import { DataExporter } from '../../utils/export';
import toast from 'react-hot-toast';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dataType: 'contacts' | 'products' | 'faqs' | 'all';
  data: any[];
  title: string;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  dataType,
  data,
  title
}) => {
  const [exportOptions, setExportOptions] = useState({
    format: 'csv' as 'csv' | 'xlsx' | 'json',
    dateRange: {
      enabled: false,
      start: '',
      end: ''
    },
    filters: {} as Record<string, any>,
    includeFiltered: false
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const formatOptions = [
    { value: 'csv', label: 'CSV (Excel)', icon: FileText, description: 'Compatible with Excel and Google Sheets' },
    { value: 'xlsx', label: 'TSV (Excel)', icon: Database, description: 'Tab-separated format for Excel' },
    { value: 'json', label: 'JSON', icon: Database, description: 'Raw data format for developers' }
  ];

  const getFilterOptions = () => {
    switch (dataType) {
      case 'contacts':
        return [
          { key: 'status', label: 'Status', options: ['all', 'new', 'in-progress', 'resolved', 'archived'] },
          { key: 'priority', label: 'Priority', options: ['all', 'high', 'medium', 'low'] },
          { key: 'category', label: 'Category', options: ['all', 'general', 'technical', 'billing', 'feature-request', 'complaint'] }
        ];
      case 'products':
        return [
          { key: 'status', label: 'Status', options: ['all', 'active', 'draft', 'archived'] },
          { key: 'category', label: 'Category', options: ['all', 'Earth Rods', 'Electrodes', 'Strips & Accessories', 'Clamps & Connectors', 'Testing Equipment'] },
          { key: 'isFeatured', label: 'Featured', options: ['all', 'true', 'false'] }
        ];
      case 'faqs':
        return [
          { key: 'status', label: 'Status', options: ['all', 'active', 'draft', 'archived'] },
          { key: 'category', label: 'Category', options: ['all', 'general', 'technical', 'billing', 'shipping', 'returns', 'account'] }
        ];
      default:
        return [];
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const options = {
        format: exportOptions.format,
        dateRange: exportOptions.dateRange.enabled ? {
          start: new Date(exportOptions.dateRange.start),
          end: new Date(exportOptions.dateRange.end)
        } : undefined,
        filters: exportOptions.filters
      };

      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));

      switch (dataType) {
        case 'contacts':
          DataExporter.exportContacts(data, options);
          break;
        case 'products':
          DataExporter.exportProducts(data, options);
          break;
        case 'faqs':
          DataExporter.exportFAQs(data, options);
          break;
        case 'all':
          DataExporter.exportAllData({
            contacts: data.contacts || [],
            products: data.products || [],
            faqs: data.faqs || [],
            analytics: data.analytics || {}
          });
          break;
      }

      setExportComplete(true);
      toast.success('Export completed successfully!');

      // Auto-close after success
      setTimeout(() => {
        setExportComplete(false);
        onClose();
      }, 2000);

    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value
      }
    }));
  };

  const getRecordCount = () => {
    let filteredData = data;

    // Apply date range filter
    if (exportOptions.dateRange.enabled && exportOptions.dateRange.start && exportOptions.dateRange.end) {
      const start = new Date(exportOptions.dateRange.start);
      const end = new Date(exportOptions.dateRange.end);
      
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= start && itemDate <= end;
      });
    }

    // Apply other filters
    Object.entries(exportOptions.filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filteredData = filteredData.filter(item => {
          if (key === 'isFeatured') {
            return item[key] === (value === 'true');
          }
          return item[key] === value;
        });
      }
    });

    return filteredData.length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {exportComplete ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Export Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your data has been successfully exported and downloaded.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Download className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Export {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Format Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Export Format
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {formatOptions.map((format) => {
                    const Icon = format.icon;
                    return (
                      <label
                        key={format.value}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          exportOptions.format === format.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={format.value}
                          checked={exportOptions.format === format.value}
                          onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                          className="sr-only"
                        />
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {format.label}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {format.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Date Range Filter
                  </h3>
                </div>
                
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={exportOptions.dateRange.enabled}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, enabled: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Filter by date range
                  </span>
                </label>

                {exportOptions.dateRange.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={exportOptions.dateRange.start}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={exportOptions.dateRange.end}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Data Filters */}
              {dataType !== 'all' && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Data Filters
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getFilterOptions().map((filter) => (
                      <div key={filter.key}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {filter.label}
                        </label>
                        <select
                          value={exportOptions.filters[filter.key] || 'all'}
                          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {filter.options.map((option) => (
                            <option key={option} value={option}>
                              {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Summary */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                  Export Summary
                </h4>
                <div className="text-sm text-blue-800 dark:text-blue-400">
                  <p>Format: {formatOptions.find(f => f.value === exportOptions.format)?.label}</p>
                  <p>Records: {dataType === 'all' ? 'All data' : `${getRecordCount()} of ${data.length}`}</p>
                  {exportOptions.dateRange.enabled && exportOptions.dateRange.start && exportOptions.dateRange.end && (
                    <p>Date Range: {exportOptions.dateRange.start} to {exportOptions.dateRange.end}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export Data
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExportDialog;