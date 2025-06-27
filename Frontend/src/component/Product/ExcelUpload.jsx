// components/ExcelUpload.jsx
import React, { useState } from 'react';
import { uploadExcelFile } from '../../services/uploadService';
import './ExcelUpload.css';

const ExcelUpload = ({ isOpen, onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file && !file.name.endsWith('.xlsx')) {
            setErrorMessage('Only .xlsx Excel files are allowed.');
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setErrorMessage('');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setErrorMessage('Please select a valid Excel file.');
            return;
        }

        setIsLoading(true);
        setStatusMessage('');
        setErrorMessage('');

        try {
            const response = await uploadExcelFile(selectedFile);
            setStatusMessage(response.data.message || 'File uploaded successfully!');
            setSelectedFile(null);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to upload file.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>×</button>

                <h2>Upload Excel File</h2>
                <p>Only Excel files with `.xlsx` format are accepted.</p>

                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="file-input"
                />

                <button className="upload-btn" onClick={handleUpload} disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload'}
                </button>

                {statusMessage && <p className="success-msg">{statusMessage}</p>}
                {errorMessage && <p className="error-msg">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default ExcelUpload;
