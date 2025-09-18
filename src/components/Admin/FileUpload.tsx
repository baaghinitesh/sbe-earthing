import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, File, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onUpload?: (files: UploadedFile[]) => void;
  onRemove?: (fileId: string) => void;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  dragDropText?: string;
  existingFiles?: Array<{ id: string; url: string; name: string }>;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/*',
  multiple = true,
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 10,
  onUpload,
  onRemove,
  className = '',
  disabled = false,
  showPreview = true,
  dragDropText = 'Drop files here or click to upload',
  existingFiles = []
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || disabled) return;

    const newFiles: UploadedFile[] = [];
    const totalFiles = uploadedFiles.length + existingFiles.length + files.length;

    if (totalFiles > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`);
        return;
      }

      // Check if file type is allowed
      if (accept !== '*' && !file.type.match(accept.replace(/\*/g, '.*'))) {
        toast.error(`${file.name} is not a supported file type`);
        return;
      }

      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        status: 'uploading',
        progress: 0
      };

      newFiles.push(uploadedFile);
    });

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      simulateUpload(newFiles);
    }
  };

  const simulateUpload = (files: UploadedFile[]) => {
    files.forEach((file, index) => {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => {
            if (f.id === file.id) {
              const newProgress = Math.min(f.progress + Math.random() * 30, 100);
              const isComplete = newProgress >= 100;
              
              if (isComplete) {
                clearInterval(interval);
                // Simulate success or error (90% success rate)
                const isSuccess = Math.random() > 0.1;
                
                return {
                  ...f,
                  progress: 100,
                  status: isSuccess ? 'success' : 'error',
                  url: isSuccess ? `https://example.com/uploads/${f.file.name}` : undefined
                };
              }
              
              return { ...f, progress: newProgress };
            }
            return f;
          })
        );
      }, 200);
    });

    // Call onUpload callback after a delay
    setTimeout(() => {
      if (onUpload) {
        onUpload(files.map(f => ({ ...f, status: 'success' as const })));
      }
    }, 2000);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
    
    if (onRemove) {
      onRemove(fileId);
    }
  };

  const handleRemoveExistingFile = (fileId: string) => {
    if (onRemove) {
      onRemove(fileId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center space-y-3">
          <div className={`p-3 rounded-full ${isDragOver ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-600' : 'text-gray-500'}`} />
          </div>
          
          <div>
            <p className={`text-lg font-medium ${isDragOver ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
              {dragDropText}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {accept === 'image/*' ? 'Images' : 'Files'} up to {formatFileSize(maxSize)}
              {multiple && `, maximum ${maxFiles} files`}
            </p>
          </div>
        </div>
      </div>

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Files</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {existingFiles.map((file) => (
              <div key={file.id} className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                {file.url && file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden mb-2">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center mb-2">
                    {getFileIcon(file.name)}
                  </div>
                )}
                
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {file.name}
                </p>
                
                <button
                  onClick={() => handleRemoveExistingFile(file.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploading Files ({uploadedFiles.length})
          </h4>
          
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {showPreview && file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      getFileIcon(file.file.name)
                    )}
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.file.size)}
                    </p>
                    
                    {/* Progress Bar */}
                    {file.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {Math.round(file.progress)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {file.status === 'success' && (
                      <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                    {file.status === 'error' && (
                      <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                    {file.status === 'uploading' && (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {file.status === 'error' && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Upload failed. Please try again.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;