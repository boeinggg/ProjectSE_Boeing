import React, { useState } from "react";
import "./arttoy_detail.css";
import Button from "./button";
import Dropzone from "./dropzone";
import { CreateArtToy, GetArtToyID } from "../../../services/https/seller/arttoy";
import { CreateAuction } from "../../../services/https/seller/auction";
import { ArtToysInterface } from "../../../interfaces/ArtToy";
import { AuctionInterface } from "../../../interfaces/Auction";
import { Toaster, toast } from "react-hot-toast";

const ArtToyDetail: React.FC = () => {
    const [formValues, setFormValues] = useState({
        name: "",
        brand: "",
        category: "",
        size: "",
        material: "",
        description: "",
        startPrice: "",
        bidIncrement: "",
        startDate: new Date(),
        endDate: new Date(),
        status: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); // Store Base64 strings here
    const [isDropzoneVisible, setIsDropzoneVisible] = useState(true);
    const MAX_FILES = 10;

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    //     const { id, value } = e.target;
    //     setFormValues((prev) => ({ ...prev, [id]: value }));
    //     setErrors((prev) => ({ ...prev, [id]: "" }));
    // };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [id]: id === "startDate" || id === "endDate" ? new Date(value) : value,
        }));
        setErrors((prev) => ({ ...prev, [id]: "" }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formValues.name.trim()) newErrors.name = "Name is required.";
        if (!formValues.brand.trim()) newErrors.brand = "Brand is required.";
        if (!formValues.category) newErrors.category = "Category is required.";
        if (!formValues.size.trim()) newErrors.size = "Size is required.";
        if (!formValues.material.trim()) newErrors.material = "Material is required.";
        if (!formValues.description.trim()) newErrors.description = "Description is required.";
        if (!formValues.startPrice.trim()) newErrors.startPrice = "Start Price is required.";
        if (!formValues.bidIncrement.trim()) newErrors.bidIncrement = "Bid Increment is required.";
        if (!formValues.startDate) newErrors.startDate = "Start Date is required.";
        if (!formValues.endDate) newErrors.endDate = "End Date is required.";
        if (!formValues.status) newErrors.status = "Status is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = async () => {
        const values: ArtToysInterface = {
            name: formValues.name,
            brand: formValues.brand,
            description: formValues.description,
            material: formValues.material,
            size: formValues.size,
            categoryID: Number(formValues.category),
            sellerID: 1,
        };

        if (validateForm()) {
            try {
                const res = await CreateArtToy(values);
                const arttoyID = await GetArtToyID();
                console.log(arttoyID);
                const auctionDetails: AuctionInterface = {
                    startPrice: Number(formValues.startPrice),
                    bidIncrement: Number(formValues.bidIncrement),
                    CurrentPrice: Number(formValues.startPrice),
                    EndPrice: Number(formValues.startPrice),
                    startDate: formValues.startDate,
                    endDate: formValues.endDate,
                    status: formValues.status,
                    ArtToyID: arttoyID,
                };
                const res2 = await CreateAuction(auctionDetails);
                console.log(res);
                console.log(res2);

                // Show success toast
                toast.success("Data saved successfully!");

                // Reset form values and uploaded files
                setFormValues({
                    name: "",
                    brand: "",
                    category: "",
                    size: "",
                    material: "",
                    description: "",
                    startPrice: "",
                    bidIncrement: "",
                    startDate: new Date(),
                    endDate: new Date(),
                    status: "",
                });
                setUploadedFiles([]);
                setIsDropzoneVisible(true); // Reset Dropzone visibility
            } catch (error) {
                console.error("Error saving data:", error);
                toast.error("An error occurred while saving the data.");
            }
        } else {
            toast.error("Please fill in all required fields.");
        }
    };

    const handleDrop = (base64Files: string[]) => {
        const newFiles = [...uploadedFiles, ...base64Files];
        if (newFiles.length > MAX_FILES) {
            alert(`You can upload a maximum of ${MAX_FILES} images.`);
            return;
        }
        setUploadedFiles(newFiles);
        if (newFiles.length === MAX_FILES) setIsDropzoneVisible(false);
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles((prev) => {
            const updatedFiles = prev.filter((_, i) => i !== index);
            if (updatedFiles.length < MAX_FILES) setIsDropzoneVisible(true);
            return updatedFiles;
        });
    };

    return (
        <div className="detail">
            <Toaster />
            <div className="detail-header">
                <h1>Add Your Art Toy</h1>
                <div>
                    <Button label="Cancel" variant="cancel" onClick={() => alert("Cancel button clicked")} />
                    <Button label="Confirm" variant="confirm" onClick={handleConfirm} />
                </div>
            </div>
            <div className="detail-arttoy-form">
                <div className="detail-left-form">
                    <div className="arttoy">
                        <SectionHeader step="1" title="Art Toy Detail" />
                        <div className="des">
                            <div className="row">
                                <Field
                                    label="Name"
                                    id="name"
                                    placeholder="Enter name.."
                                    value={formValues.name}
                                    onChange={handleInputChange}
                                    error={errors.name}
                                />
                                <Field
                                    label="Brand"
                                    id="brand"
                                    placeholder="Enter brand.."
                                    value={formValues.brand}
                                    onChange={handleInputChange}
                                    error={errors.brand}
                                />
                            </div>
                            <div className="row">
                                <SelectField
                                    label="Category"
                                    id="category"
                                    options={[
                                        { value: "", label: "Choose category" },
                                        { value: "1", label: "Blind Box" },
                                        { value: "2", label: "Figurine" },
                                        { value: "3", label: "MEGA 100%" },
                                    ]}
                                    value={formValues.category}
                                    onChange={handleInputChange}
                                    error={errors.category}
                                />
                                <Field
                                    label="Size"
                                    id="size"
                                    placeholder="Enter size.."
                                    value={formValues.size}
                                    onChange={handleInputChange}
                                    error={errors.size}
                                />
                            </div>
                            <Field
                                label="Material"
                                id="material"
                                placeholder="Enter material.."
                                value={formValues.material}
                                onChange={handleInputChange}
                                error={errors.material}
                            />
                            <Field
                                label="Description"
                                id="description"
                                placeholder="Enter a description for your art toy.."
                                type="textarea"
                                value={formValues.description}
                                onChange={handleInputChange}
                                error={errors.description}
                            />
                        </div>
                    </div>
                    <div className="arttoy">
                        <SectionHeader title="Images" />
                        <h4>Images will appear on the website. A maximum of 10 images can be uploaded.</h4>
                        <div className="des">
                            {isDropzoneVisible && <Dropzone onDrop={handleDrop} maxFiles={MAX_FILES - uploadedFiles.length} />}
                            {uploadedFiles.length > 0 && (
                                <div className="uploaded-files">
                                    {uploadedFiles.map((base64Image, index) => (
                                        <div key={index} className="uploaded-file">
                                            <img src={base64Image} alt={`Uploaded ${index}`} className="uploaded-file-preview" />
                                            <button className="remove-file-icon" onClick={() => handleRemoveFile(index)}>
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="arttoy">
                    <SectionHeader step="2" title="Auction Detail" />
                    <div className="des">
                        <div className="row">
                            <Field
                                label="Start Price"
                                id="startPrice"
                                placeholder="Enter start price.."
                                value={formValues.startPrice}
                                onChange={handleInputChange}
                                error={errors.startPrice}
                            />
                            <Field
                                label="Bid Increment"
                                id="bidIncrement"
                                placeholder="Enter bid increment.."
                                value={formValues.bidIncrement}
                                onChange={handleInputChange}
                                error={errors.bidIncrement}
                            />
                        </div>
                        <div className="row">
                            <Field
                                label="Start Date"
                                id="startDate"
                                type="datetime-local"
                                value={formValues.startDate.toISOString().slice(0, 16)} // Correctly formatted value

                                onChange={handleInputChange}
                                error={errors.startDate}
                            />

                            <Field
                                label="End Date"
                                id="endDate"
                                type="datetime-local"
                                value={formValues.endDate.toISOString().slice(0, 16)} // Format to "YYYY-MM-DDTHH:mm"
                                onChange={handleInputChange}
                                error={errors.endDate}
                            />
                        </div>
                        <SelectField
                            label="Status"
                            id="status"
                            options={[
                                { value: "", label: "Choose status" },
                                { value: "upcoming", label: "Upcoming" },
                                { value: "active", label: "Active" },
                                { value: "close", label: "Close" },
                            ]}
                            value={formValues.status}
                            onChange={handleInputChange}
                            error={errors.status}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Field: React.FC<{
    label: string;
    id: string;
    placeholder?: string;
    type?: "text" | "textarea" | "datetime-local";
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: string;
}> = ({ label, id, placeholder, type = "text", value, onChange, error }) => (
    <div className={`field ${error ? "has-error" : ""}`}>
        <label htmlFor={id}>{label}</label>
        {type === "textarea" ? (
            <textarea id={id} name={id} placeholder={placeholder} rows={3} value={value} onChange={onChange} />
        ) : (
            <input type={type} id={id} name={id} placeholder={placeholder} value={value} onChange={onChange} />
        )}
        {error && <span className="error-message">{error}</span>}
    </div>
);

const SelectField: React.FC<{
    label: string;
    id: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
}> = ({ label, id, options, value, onChange, error }) => (
    <div className={`field ${error ? "has-error" : ""}`}>
        <label htmlFor={id}>{label}</label>
        <select id={id} name={id} value={value} onChange={onChange}>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {error && <span className="error-message">{error}</span>}
    </div>
);

const SectionHeader: React.FC<{ step?: string; title: string }> = ({ step, title }) => (
    <div className="arttoy-header">
        {step && <h2>{step}</h2>}
        <h3>{title}</h3>
    </div>
);

export default ArtToyDetail;
