import React, { useRef, useState } from "react";
import "./dropzone.css";

interface DropzoneProps {
    onDrop: (files: File[]) => void;
    maxFiles?: number; // Optional maxFiles prop
}

const Dropzone: React.FC<DropzoneProps> = ({ onDrop, maxFiles = 10 }) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);

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

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            if (newFiles.length + (maxFiles - 1) <= maxFiles) {
                onDrop(newFiles);
            } else {
                alert(`You can upload a maximum of ${maxFiles} files.`);
            }
        }
    };

    const handleClick = () => {
        hiddenFileInput.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            if (newFiles.length + (maxFiles - 1) <= maxFiles) {
                onDrop(newFiles);
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
