"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, X, Upload } from "lucide-react";
import { formatFileSize } from "@/lib/constants";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

export default function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 20 * 1024 * 1024,
  });

  const handleClearFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect?.(null);
  };

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <div className="space-y-4 cursor-pointer">
          {selectedFile ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <FileText className="h-10 w-10 text-primary" />
              <div className="flex items-center space-x-3 flex-1 ml-3">
                <div>
                  <p className="text-sm font-medium truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="p-2 cursor-pointer hover:bg-accent rounded-full"
                onClick={handleClearFile}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className={`p-8 text-center bg-card rounded-2xl border-2 border-dashed transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}>
              <div className="mx-auto w-16 h-16 flex items-center mb-2 justify-center">
                <Upload className="w-12 h-12 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold text-foreground">Click to upload </span>
                or drag and drop
              </p>
              <p className="text-lg text-muted-foreground">PDF (max 20 MB)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
