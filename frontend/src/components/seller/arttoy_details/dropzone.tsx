import React, { useRef, useState } from "react";
import "./dropzone.css";

interface DropzoneProps {
    onDrop: (files: string[]) => void; // Accept Base64 strings instead of File objects
    maxFiles?: number;
}

const Dropzone: React.FC<DropzoneProps> = ({ onDrop, maxFiles = 4 }) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);

    // Convert File to Base64 string after compressing
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
            reader.onloadend = () => {
                img.src = reader.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);

            img.onload = () => {
                // Check the size of the original file
                const originalSize = file.size; // Size in bytes
                console.log("Original file size:", originalSize, "bytes");

                // Create a canvas to resize the image
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    const maxWidth = 800; // Max width for the image
                    const maxHeight = 800; // Max height for the image
                    let width = img.width;
                    let height = img.height;

                    // Scale the image while maintaining its aspect ratio
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    // Set the canvas size to the new dimensions
                    canvas.width = width;
                    canvas.height = height;

                    // Draw the image onto the canvas
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert canvas to base64 string with quality set
                    const base64Data = canvas.toDataURL("image/jpeg", 0.8); // Set quality to 0.7 (can be adjusted)
                    const compressedSize = (base64Data.length * 3) / 4; // Approximate size of Base64 string (in bytes)
                    console.log("Compressed base64 size:", compressedSize, "bytes");
                    console.log(base64Data);

                    resolve(base64Data);
                }
            };
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
