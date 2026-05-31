'use client';
import { useState } from 'react';

interface Props {
  onUpload: (url: string) => void;
  onMultiUpload?: (urls: string[]) => void;
  label?: string;
  currentUrl?: string;
  multiple?: boolean;
}

export default function ImageUpload({
  onUpload,
  onMultiUpload,
  label = 'Upload Image',
  currentUrl,
  multiple = false,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
    formData.append('folder', 'dclm');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
      { method: 'POST', body: formData }
    );
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.secure_url;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate all files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Please select image files only.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is too large. Max 5MB per image.`);
        return;
      }
    }

    setUploading(true);
    setError('');

    try {
      if (multiple && files.length > 1) {
        // Bulk upload
        setProgress({ done: 0, total: files.length });
        const urls: string[] = [];

        for (let i = 0; i < files.length; i++) {
          const url = await uploadToCloudinary(files[i]);
          urls.push(url);
          setProgress({ done: i + 1, total: files.length });
        }

        onMultiUpload?.(urls);
        setProgress(null);
      } else {
        // Single upload
        const url = await uploadToCloudinary(files[0]);
        setPreview(url);
        onUpload(url);
      }
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Single image preview */}
      {preview && !multiple && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => { setPreview(null); onUpload(''); }}
            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-600">
            Remove
          </button>
        </div>
      )}

      {/* Upload box */}
      {(!preview || multiple) && (
        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition
          ${uploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}>
          <div className="flex flex-col items-center justify-center">
            {uploading ? (
              <>
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                {progress ? (
                  <p className="text-sm text-blue-500">
                    Uploading {progress.done} of {progress.total} photos...
                  </p>
                ) : (
                  <p className="text-sm text-blue-500">Uploading...</p>
                )}
              </>
            ) : (
              <>
                <span className="text-2xl mb-1">{multiple ? '🖼️' : '📷'}</span>
                <p className="text-sm text-gray-500">
                  {multiple ? 'Click to select multiple photos' : 'Click to upload image'}
                </p>
                <p className="text-xs text-gray-400">
                  {multiple
                    ? 'Hold Ctrl/Cmd to select many • PNG, JPG up to 5MB each'
                    : 'PNG, JPG, WEBP up to 5MB'}
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}