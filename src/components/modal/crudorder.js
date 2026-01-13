import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Loading from "@/components/loading";
import { useAlert } from "@/contexts/alertContext";
import Alerts from "@/components/modal/alertcompenent";
import useAxiosAuth from "@/utils/useAxiosAuth";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function CRUDOrder({ open, mode, handleClose, selectOrder }) {
    const { addAlert } = useAlert();
    const axiosAuth = useAxiosAuth();

    const [loadings, setLoadings] = useState(false);
    const [formData, setFormData] = useState({
        plant: "",
        produce_date: "",
        line: "",
        order_type: "",
        production_order: "",
        material: "",
        material_type: "",
        description: "",
        location: "",
        id: "",
    });
    const [errors, setErrors] = useState({});

    const handleChangeProduceDate = (newValue) => {
        setFormData((prevData) => ({
            ...prevData,
            produce_date: newValue,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            produce_date: "",
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (formData.plant.trim() === "") {
            errors.plant = "Plant is required";
        }
        if (formData.produce_date == null || formData.produce_date === "") {
            errors.produce_date = "Produce date is required";
        }
        if (formData.line === "") {
            errors.line = "Line is required";
        }
        if (formData.order_type === "") {
            errors.order_type = "Order type is required";
        }
        if (formData.production_order === "") {
            errors.production_order = "Production order is required";
        }
        if (formData.material === "") {
            errors.material = "Material is required";
        }
        if (formData.material_type === "") {
            errors.material_type = "Material type is required";
        }
        if (formData.description === "") {
            errors.description = "Description is required";
        }
        if (formData.location === "") {
            errors.location = "Location is required";
        }
        return errors;
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            updateData(formData);
        } else {
            setErrors(validationErrors);
        }
    };

    const updateData = async (formData) => {
        try {
            setLoadings(true);
            const response = await axiosAuth.put("/api/order",
                {
                    id: formData.id,
                    plant: formData.plant,
                    produce_date: formData.produce_date.format('DD/MM/YYYY'),
                    line: formData.line,
                    order_type: formData.order_type,
                    production_order: formData.production_order,
                    material: formData.material,
                    material_type: formData.material_type,
                    description: formData.description,
                    location: formData.location,
                }
            );
            const { data } = response;
            handleSuccess(data.message);
            const {
                id,
                plant,
                produce_date,
                line,
                order_type,
                production_order,
                material,
                material_type,
                description,
                location,
                status,
            } = data.data;
            handleClose({
                id,
                plant,
                produce_date,
                line,
                order_type,
                production_order,
                material,
                material_type,
                description,
                location,
                status,
            });
        } catch (error) {
            handleError(error);
        } finally {
            setLoadings(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoadings(true);
            const response = await axiosAuth.delete(`/api/order/${formData.id}`, {});

            const { data } = response;
            handleSuccess(data.message);
            handleClose(selectOrder);
        } catch (error) {
            handleError(error);
        } finally {
            setLoadings(false);
        }
    };

    const handleSuccess = (message) => {
        addAlert({
            id: new Date().getTime(),
            severity: "success",
            message: message,
        });
    };

    const handleError = (error) => {
        addAlert({
            id: new Date().getTime(),
            severity: "error",
            message: error.response?.data.message || error.message,
        });
    };

    useEffect(() => {
        setLoadings(false);
        setErrors({});
        setFormData({
            plant: selectOrder ? selectOrder.plant : "",
            produce_date: selectOrder ? dayjs(selectOrder?.produce_date) : null,
            line: selectOrder ? selectOrder.line : "",
            order_type: selectOrder ? selectOrder.order_type : "",
            production_order: selectOrder ? selectOrder.production_order : "",
            material: selectOrder ? selectOrder.material : "",
            material_type: selectOrder ? selectOrder.material_type : "",
            description: selectOrder ? selectOrder.description : "",
            location: selectOrder ? selectOrder.location : "",
            id: selectOrder ? selectOrder.id : "",
        });
    }, [open]);

    return (
        <div>
            <Dialog
                onClose={() => handleClose(null)}
                aria-labelledby="customized-dialog-title"
                open={open}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "850px",
                        },
                    },
                }}
            >
                <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    style={{ color: "#000", fontWeight: 600 }}
                >
                    {mode}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => handleClose(null)}
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
                    <div className="flex w-full gap-4">
                        <div className="w-[50%] border-[1px] border-primary rounded-md p-4">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Plant"
                                        size="small"
                                        required
                                        fullWidth
                                        disabled={mode == "Delete Production order"}
                                        name="plant"
                                        value={formData.plant}
                                        onChange={handleChange}
                                        error={Boolean(errors.plant)}
                                        helperText={errors.plant}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            ampm={false}
                                            label="Product date *"
                                            format="DD/MM/YYYY"
                                            required
                                            disabled={mode == "Delete Production order"}
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    disabled: mode == "Delete Production order",
                                                    fullWidth: true,
                                                    error: Boolean(errors.produce_date),
                                                    helperText: errors.produce_date,
                                                },
                                            }}
                                            name="produce_date"
                                            value={formData.produce_date}
                                            onChange={handleChangeProduceDate}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Line"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Production order"}
                                        name="line"
                                        value={formData.line}
                                        onChange={handleChange}
                                        error={Boolean(errors.line)}
                                        helperText={errors.line}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Order type"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Production order"}
                                        name="order_type"
                                        value={formData.order_type}
                                        onChange={handleChange}
                                        error={Boolean(errors.order_type)}
                                        helperText={errors.order_type}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Production order"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Production order"}
                                        name="production_order"
                                        value={formData.production_order}
                                        onChange={handleChange}
                                        error={Boolean(errors.production_order)}
                                        helperText={errors.production_order}
                                    />
                                </Grid>
                            </Grid>
                        </div>

                        <div className="w-[50%] border-[1px] border-primary rounded-md p-4">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Material"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Production order"}
                                        name="material"
                                        value={formData.material}
                                        onChange={handleChange}
                                        error={Boolean(errors.material)}
                                        helperText={errors.material}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Material type"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Production order"}
                                        name="material_type"
                                        value={formData.material_type}
                                        onChange={handleChange}
                                        error={Boolean(errors.material_type)}
                                        helperText={errors.material_type}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Production order"}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        error={Boolean(errors.description)}
                                        helperText={errors.description}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Location"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Production order"}
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        error={Boolean(errors.location)}
                                        helperText={errors.location}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </DialogContent>

                <DialogActions style={{ padding: "16px 24px" }}>
                    <Button variant="outlined" onClick={() => handleClose(null)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className="bg-primary"
                        style={{ display: mode == "Delete Production order" ? "none" : "block" }}
                        onClick={handleUpdate}
                        type="submit"
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        className="bg-error"
                        style={{ display: mode != "Delete Production order" ? "none" : "block" }}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>

                    <Loading open={loadings} />
                    <Alerts />
                </DialogActions>
            </Dialog>
        </div>
    );
}

CRUDOrder.propTypes = {
    mode: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    selectOrder: PropTypes.object,
};
