import { useState, useCallback } from 'react';

interface UseFileUploadOptions {
  maxFiles?: number;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onError?: (message: string) => void;
}

interface UseFileUploadReturn {
  files: File[];
  uploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    maxFiles = 20,
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    onError,
  } = options;

  const [files, setFiles] = useState<File[]>([]);

  const uploadFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFiles = e.target.files;
      if (!uploadedFiles) return;

      const newFiles = Array.from(uploadedFiles);
      const validFiles = newFiles.filter(file => {
        const isValidSize = file.size <= maxSize;
        const isValidType = allowedTypes.includes(file.type);
        return isValidSize && isValidType;
      });

      if (validFiles.length !== newFiles.length) {
        const errorMessage = `${maxSize / 1024 / 1024}MB 이하의 ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} 파일만 업로드 가능합니다.`;
        onError?.(errorMessage);
      }

      setFiles(prev => [...prev, ...validFiles].slice(0, maxFiles));
    },
    [maxFiles, maxSize, allowedTypes, onError],
  );

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    files,
    uploadFile,
    removeFile,
    clearFiles,
  };
}
