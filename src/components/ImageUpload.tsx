"use client";

import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ImageUpload() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile: File) => {
        if (!selectedFile.type.startsWith('image/')) return;
        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
    };

    const handleSubmit = async () => {
        if (!file) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            // In next step, we will create the API route that saves the file and calls ChatGPT/Gemini
            const res = await fetch('/api/extract', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            // Redirect to the review page with the extraction job ID or data
            router.push(`/review?jobId=${data.jobId}`);
        } catch (error) {
            console.error(error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ease-in-out ${isDragging
                        ? 'border-indigo-500 bg-indigo-50/50'
                        : file
                            ? 'border-stone-200 bg-white'
                            : 'border-stone-300 hover:border-indigo-400 bg-white hover:bg-stone-50'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    disabled={isUploading}
                />

                {preview ? (
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative w-full max-w-sm aspect-[3/4] rounded-xl overflow-hidden shadow-md ring-1 ring-stone-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={preview} alt="Bookshelf preview" className="object-cover w-full h-full" />
                        </div>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSubmit();
                            }}
                            disabled={isUploading}
                            className="z-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:hover:bg-indigo-600 text-white font-medium px-8 py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-w-[200px]"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Extracting Books...</span>
                                </>
                            ) : (
                                <span>Scan Bookshelf</span>
                            )}
                        </button>
                        <p className="text-sm text-stone-500 z-10">Click to change photo</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-stone-800">
                            Upload Bookshelf Photo
                        </h3>
                        <p className="text-stone-500 max-w-sm">
                            Drag and drop an image of your bookshelf, or click to browse. We will automatically extract all the titles!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
