import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Loading from "@/components/loading";
import { useAlert } from "@/contexts/alertContext";
import Alerts from "@/components/modal/alertcompenent";
import { Upload, message } from "antd";
import { MdUploadFile } from "react-icons/md";
import useAxiosAuth from "@/utils/useAxiosAuth";
import { Switch } from 'antd';

export default function ImportMasterData({ open, handleClose }) {
    const axiosAuth = useAxiosAuth();
    const { addAlert } = useAlert();
    const [loadings, setLoadings] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [replace, setReplace] = useState(false);
    const [invalidData, setInvalidData] = useState([]);
    const [status, setStatus] = useState(null);

    const onReplaceChange = (checked) => {
        setReplace(checked);
    };

    const handleUpload = async () => {
        if (fileList.length === 0) {
            handleWarning("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileList[0]);
        formData.append("replace", replace)

        try {
            setLoadings(true);
            const response = await axiosAuth.post('/api/masterdata/import', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { data } = response.data;
            const success = data.success;
            const error = data.error;
            const invalid = data.invalid;

            if (error === 0) {
                setInvalidData([]);
                setStatus("success");
                handleSuccess("Import data successful.");
            } else {
                setStatus("success");
                handleWarning(`Import data success ${success}, error ${error}`);
                setInvalidData(invalid);
            }
        } catch (err) {
            handleError(err);
        } finally {
            setLoadings(false);
        }
    };

    const beforeUpload = (file) => {
        const isExcel = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const isLt1M = file.size / 1024 / 1024 < 1;

        if (!isExcel) {
            handleWarning("Only .xlsx files are allowed!");
        }
        if (!isLt1M) {
            handleWarning("File must be smaller than 1MB!");
        }

        if (isExcel && isLt1M) {
            setFileList([file]); // overwrite previous file
        }
        return false; // prevent auto upload
    };

    const handleRemove = () => {
        setFileList([]);
    };

    const handleSuccess = (messageText) => {
        addAlert({
            id: new Date().getTime(),
            severity: "success",
            message: messageText,
        });
        handleClose("success");
    };

    const handleWarning = (messageText) => {
        addAlert({
            id: new Date().getTime(),
            severity: "warning",
            message: messageText,
        });
    };

    const handleError = (error) => {
        addAlert({
            id: new Date().getTime(),
            severity: "error",
            message: error.response?.data?.message || error.message,
        });
    };

    useEffect(() => {
        setLoadings(false);
        setFileList([]);
        setReplace(false);
        setInvalidData([]);
        setStatus(null);
    }, [open]);

    return (
        <div>
            <Dialog
                onClose={() => handleClose(status)}
                aria-labelledby="customized-dialog-title"
                open={open}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "950px",
                        },
                    },
                }}
            >
                <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    style={{ color: "#000", fontWeight: 600 }}
                >
                    Import Data
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => handleClose(status)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div className="flex flex-col gap-4">
                        <Upload
                            accept=".xlsx"
                            beforeUpload={beforeUpload}
                            onRemove={handleRemove}
                            fileList={fileList}
                            maxCount={1}
                        >
                            <Button variant="outlined" startIcon={<MdUploadFile />}>
                                Select .xlsx File
                            </Button>
                        </Upload>
                        <div className="flex gap-2">
                            <p>Replace data if duplicate material code:</p>
                            <Switch className="bg-grey" onChange={onReplaceChange} />
                        </div>

                        {invalidData.length > 0 && (
                            <div
                                style={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    border: "1px solid #fd4400",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    background: "#f9f9f9",
                                }}
                            >
                                <strong style={{ color: "#fd4400" }}>Invalid data:</strong>
                                <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                                    {invalidData.map((msg, idx) => (
                                        <li key={idx} style={{ color: "#fd4400", fontSize: "14px" }}>
                                            {msg}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </DialogContent>

                <DialogActions style={{ padding: "16px 24px" }}>
                    <Button variant="outlined" onClick={() => handleClose(status)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className="bg-primary"
                        onClick={handleUpload}
                        disabled={fileList.length === 0}
                    >
                        Upload
                    </Button>

                    <Loading open={loadings} />
                    <Alerts />
                </DialogActions>
            </Dialog>
        </div>
    );
}

ImportMasterData.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};
