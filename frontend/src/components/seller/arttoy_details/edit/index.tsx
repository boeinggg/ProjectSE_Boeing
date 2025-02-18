import React, { useEffect, useState } from "react";
import "../arttoy_detail.css";
import Button from "../button";
import Dropzone from "../dropzone";
import { GetArtToyById, GetCategory, UpdateArtToysById } from "../../../../services/https/seller/arttoy";
import { GetAutionById, UpdateAuctionById, UpdateAuctionStatus } from "../../../../services/https/seller/auction";
import { ArtToysInterface } from "../../../../interfaces/ArtToy";
import { AuctionInterface } from "../../../../interfaces/Auction";
import { Toaster, toast } from "react-hot-toast";
import { CategoryInterface } from "../../../../interfaces/Category";
import moment from "moment-timezone";

const EditArtToyDetail: React.FC<{ id: string }> = ({ id }) => {
    const [formValues, setFormValues] = useState({
        Name: "",
        Brand: "",
        Category: "",
        Size: "",
        Material: "",
        Description: "",
        StartPrice: "",
        BidIncrement: "",
        StartDateTime: new Date(),
        EndDateTime: new Date(),
        Status: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [isDropzoneVisible, setIsDropzoneVisible] = useState(true);
    const MAX_FILES = 4;
    const [categories, setCategories] = useState<CategoryInterface[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await GetCategory();
                const data: CategoryInterface[] = await response.data; // Type the response data
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                // Handle error gracefully (e.g., display an error message to the user)
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const artToyResponse = await GetArtToyById(id);
                const auctionResponse = await GetAutionById(id);

                if (artToyResponse?.data && auctionResponse?.data) {
                    const artToyData = artToyResponse.data;
                    const auctionData = auctionResponse.data;

                    setFormValues({
                        Name: artToyData.Name,
                        Brand: artToyData.Brand,
                        Category: artToyData.CategoryID.toString(),
                        Size: artToyData.Size,
                        Material: artToyData.Material,
                        Description: artToyData.Description,
                        StartPrice: auctionData.StartPrice.toString(),
                        BidIncrement: auctionData.BidIncrement.toString(),
                        StartDateTime: new Date(auctionData.StartDateTime),
                        EndDateTime: new Date(auctionData.EndDateTime),
                        Status: auctionData.Status,
                    });

                    setUploadedFiles(
                        artToyData.Picture
                            ? artToyData.Picture.split(",") // แยกค่าจากเครื่องหมายจุลภาค
                                  .filter((part: string) => !part.startsWith("data:image/jpeg;base64")) // กรองค่าที่เริ่มต้นด้วย 'data:image/jpeg;base64,' เพื่อหลีกเลี่ยงการซ้ำ
                            : []
                    );
                }
            } catch (error) {
                console.error("Error fetching art toy or auction details:", error);
                toast.error("Failed to load data.");
            }
        };

        fetchDetails();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;

        if (id === "StartDateTime" || id === "EndDateTime") {
            const localDateTime = moment.tz(value, "YYYY-MM-DDTHH:mm", "Asia/Bangkok");
            setFormValues((prev) => ({
                ...prev,
                [id]: localDateTime.toDate(),
            }));
        } else {
            setFormValues((prev) => ({
                ...prev,
                [id]: value,
            }));
        }

        setErrors((prev) => ({ ...prev, [id]: "" }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formValues.Name.trim()) newErrors.Name = "Name is required.";
        if (!formValues.Brand.trim()) newErrors.Brand = "Brand is required.";
        if (!formValues.Category) newErrors.Category = "Category is required.";
        if (!formValues.Size.trim()) newErrors.Size = "Size is required.";
        if (!formValues.Material.trim()) newErrors.Material = "Material is required.";
        if (!formValues.Description.trim()) newErrors.Description = "Description is required.";
        if (!formValues.StartPrice.trim()) newErrors.StartPrice = "Start Price is required.";
        if (!formValues.BidIncrement.trim()) newErrors.BidIncrement = "Bid Increment is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = async () => {
        const artToyValues: ArtToysInterface = {
            Name: formValues.Name,
            Brand: formValues.Brand,
            Description: formValues.Description,
            Material: formValues.Material,
            Size: formValues.Size,
            CategoryID: Number(formValues.Category),
            SellerID: 1,
            Picture: uploadedFiles.join(","),
        };

        const auctionValues: AuctionInterface = {
            StartPrice: Number(formValues.StartPrice),
            BidIncrement: Number(formValues.BidIncrement),
            CurrentPrice: Number(formValues.StartPrice),
            EndPrice: Number(formValues.StartPrice),
            StartDateTime: moment(formValues.StartDateTime).tz("Asia/Bangkok").utc().toDate(),
            EndDateTime: moment(formValues.EndDateTime).tz("Asia/Bangkok").utc().toDate(),
            Status: formValues.Status,
            ArtToyID: Number(id),
        };

        if (validateForm()) {
            try {
                await UpdateArtToysById(id, artToyValues);
                await UpdateAuctionById(id, auctionValues);

                // ตรวจสอบสถานะใหม่ตามวันที่
                const now = new Date();
                let newStatus = "";
                if (formValues.StartDateTime > now) {
                    newStatus = "Upcoming";
                } else if (formValues.StartDateTime <= now && formValues.EndDateTime >= now) {
                    newStatus = "Active";
                } else {
                    newStatus = "Closed";
                }

                // เรียก service อัปเดตสถานะ
                if (newStatus !== formValues.Status) {
                    await UpdateAuctionStatus(id, newStatus);
                    toast.success(`Status updated to ${newStatus}!`);
                }

                toast.success("Data updated successfully!");
            } catch (error) {
                console.error("Error updating data:", error);
                toast.error("An error occurred while updating the data.");
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

            // If there are less than MAX_FILES remaining, show the Dropzone
            if (updatedFiles.length < MAX_FILES) setIsDropzoneVisible(true);

            // Remove 'data:image/jpeg;base64,' from the image data if it's included
            const cleanedFiles = updatedFiles.map((file) =>
                file.startsWith("data:image/jpeg;base64,") ? file.split("data:image/jpeg;base64,")[1] : file
            );

            return cleanedFiles;
        });
    };

    return (
        <div className="detail">
            <Toaster />
            <div className="detail-header">
                <h1>Edit Art Toy</h1>
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
                                    id="Name"
                                    placeholder="Enter name.."
                                    value={formValues.Name}
                                    onChange={handleInputChange}
                                    error={errors.Name}
                                />
                                <Field
                                    label="Brand"
                                    id="Brand"
                                    placeholder="Enter brand.."
                                    value={formValues.Brand}
                                    onChange={handleInputChange}
                                    error={errors.Brand}
                                />
                            </div>
                            <div className="row">
                                <SelectField
                                    label="Category"
                                    id="Category"
                                    options={[
                                        { value: "", label: "Select Category" }, // ตัวเลือกเริ่มต้น
                                        ...categories.map((category) => ({
                                            value: category.ID?.toString() || "", // Handle potential missing ID
                                            label: category.Name || "", // Handle potential missing Name
                                        })),
                                    ]}
                                    value={formValues.Category}
                                    onChange={handleInputChange}
                                    error={errors.Category}
                                />

                                <Field
                                    label="Size"
                                    id="Size"
                                    placeholder="Enter size.."
                                    value={formValues.Size}
                                    onChange={handleInputChange}
                                    error={errors.Size}
                                />
                            </div>
                            <Field
                                label="Material"
                                id="Material"
                                placeholder="Enter material.."
                                value={formValues.Material}
                                onChange={handleInputChange}
                                error={errors.Material}
                            />
                            <Field
                                label="Description"
                                id="Description"
                                placeholder="Enter a description for your art toy.."
                                type="textarea"
                                value={formValues.Description}
                                onChange={handleInputChange}
                                error={errors.Description}
                            />
                        </div>
                    </div>
                    <div className="arttoy">
                        <SectionHeader title="Images" />
                        <h4>Images will appear on the website. A maximum of 4 images can be uploaded.</h4>
                        <div className="des">
                            {isDropzoneVisible && <Dropzone onDrop={handleDrop} maxFiles={MAX_FILES - uploadedFiles.length} />}
                            {uploadedFiles.length > 0 && (
                                <div className="uploaded-files">
                                    {uploadedFiles.map((base64Image, index) => (
                                        <div key={index} className="uploaded-file">
                                            <img
                                                src={
                                                    base64Image.startsWith("data:image/jpeg;base64,")
                                                        ? base64Image
                                                        : `data:image/jpeg;base64,${base64Image}`
                                                }
                                                alt={`Uploaded ${index}`} // Adjust for slice, since slice starts at index 1
                                                className="uploaded-file-preview"
                                            />

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
                                id="StartPrice"
                                placeholder="Enter start price.."
                                value={formValues.StartPrice}
                                onChange={handleInputChange}
                                error={errors.StartPrice}
                            />
                            <Field
                                label="Bid Increment"
                                id="BidIncrement"
                                placeholder="Enter bid increment.."
                                value={formValues.BidIncrement}
                                onChange={handleInputChange}
                                error={errors.BidIncrement}
                            />
                        </div>
                        <div className="row">
                            <Field
                                label="Start Date Time"
                                id="StartDateTime"
                                type="datetime-local"
                                value={moment(formValues.StartDateTime)
                                    .tz("Asia/Bangkok") // ใช้เวลาในเขตเวลาไทย
                                    .format("YYYY-MM-DDTHH:mm")} // Format ให้อยู่ในรูปแบบ "YYYY-MM-DDTHH:mm"
                                onChange={handleInputChange}
                                error={errors.StartDate}
                            />
                            <Field
                                label="End Date Time"
                                id="EndDateTime"
                                type="datetime-local"
                                value={moment(formValues.EndDateTime)
                                    .tz("Asia/Bangkok") // ใช้เวลาในเขตเวลาไทย
                                    .format("YYYY-MM-DDTHH:mm")} // Format ให้อยู่ในรูปแบบ "YYYY-MM-DDTHH:mm"
                                onChange={handleInputChange}
                                error={errors.EndDate}
                            />
                        </div>
                        {/* <SelectField
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
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditArtToyDetail;

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
