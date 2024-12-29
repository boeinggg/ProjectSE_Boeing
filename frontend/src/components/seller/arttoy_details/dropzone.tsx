import React, { useRef, useState } from "react";
import "./dropzone.css";

interface DropzoneProps {
    onDrop: (files: string[]) => void; // Accept Base64 strings instead of File objects
    maxFiles?: number;
}

const Dropzone: React.FC<DropzoneProps> = ({ onDrop, maxFiles = 10 }) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);

    // Convert File to Base64 string
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string); // Resolve with the Base64 string
            };
            reader.onerror = reject; // Reject on error
            reader.readAsDataURL(file);
        });
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            const base64Files = await Promise.all(newFiles.map(convertFileToBase64));

            if (base64Files.length + (maxFiles - 1) <= maxFiles) {
                onDrop(base64Files); // Pass Base64 strings to the parent
            } else {
                alert(`You can upload a maximum of ${maxFiles} files.`);
            }
        }
    };

    const handleClick = () => {
        hiddenFileInput.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const base64Files = await Promise.all(newFiles.map(convertFileToBase64));

            if (base64Files.length + (maxFiles - 1) <= maxFiles) {
                onDrop(base64Files); // Pass Base64 strings to the parent
            } else {
                alert(`You can upload a maximum of ${maxFiles} files.`);
            }
        }
    };

    return (
        <div
            className={`dropzone ${isDragActive ? "dropzone--active" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <div className="dropzone__content">
                <span>Upload art toy images</span>
                <p>Drag & drop to upload or browse files</p>
            </div>
            <input type="file" ref={hiddenFileInput} style={{ display: "none" }} multiple accept="image/*" onChange={handleFileSelect} />
        </div>
    );
};

export default Dropzone;
