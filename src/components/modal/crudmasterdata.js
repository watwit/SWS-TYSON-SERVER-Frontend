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

const ALLOWED_CHARACTERS_REGEX = /^-?\d*\.?\d*$/;;

const handleKeyDown = (event) => {
    if (
        event.key === 'Backspace' ||
        event.key === 'Delete' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight'
    ) {
        return;
    }
    const inputValue = event.target.value + event.key;
    if (!ALLOWED_CHARACTERS_REGEX.test(inputValue)) {
        event.preventDefault();
    }
};
export default function CRUDMasterData({ open, mode, handleClose, selectMasterData }) {
    const { addAlert } = useAlert();
    const axiosAuth = useAxiosAuth();

    const [loadings, setLoadings] = useState(false);
    const [formData, setFormData] = useState({
        material_code: "",
        material_description: "",
        std_pack_size_kg_bag: "",
        std_pack_size_bag_carton: "",
        std_pack_size_kg_carton: "",
        standard_weight: "",
        max_weight: "",
        min_weight: "",
        pack_bag: "",
        give_away: "",
        id: "",
    });
    const [errors, setErrors] = useState({});

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
        if (formData.material_code.trim() === "") {
            errors.material_code = "Material code is required";
        }
        if (formData.material_description.trim() === "") {
            errors.material_description = "Material description is required";
        }
        if (formData.std_pack_size_kg_bag == null || formData.std_pack_size_kg_bag === "") {
            errors.std_pack_size_kg_bag = "STD Pack Size (kg/Bag) is required";
        }
        if (formData.std_pack_size_bag_carton == null || formData.std_pack_size_bag_carton === "") {
            errors.std_pack_size_bag_carton = "STD Pack Size (bag/Carton) is required";
        }
        if (formData.std_pack_size_kg_carton == null || formData.std_pack_size_kg_carton === "") {
            errors.std_pack_size_kg_carton = "Pack Size:ctn (kg/carton) is required";
        }
        if (formData.standard_weight == null || formData.standard_weight === "") {
            errors.standard_weight = "น้ำหนักมาตรฐาน is required";
        }
        if (formData.max_weight == null || formData.max_weight === "") {
            errors.max_weight = "น้ำหนักสูงสุด is required";
        }
        if (formData.min_weight == null || formData.min_weight === "") {
            errors.min_weight = "น้ำหนักต่ำสุด is required";
        }
        if (formData.pack_bag == null || formData.pack_bag === "") {
            errors.pack_bag = "Pack / Bag is required";
        }
        if (formData.give_away == null || formData.give_away === "") {
            errors.give_away = "Grive away (%) is required";
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
            const response = await axiosAuth.put("/api/masterdata",
                {
                    id: formData.id,
                    material_code: formData.material_code,
                    material_description: formData.material_description,
                    std_pack_size_kg_bag: formData.std_pack_size_kg_bag,
                    std_pack_size_bag_carton: formData.std_pack_size_bag_carton,
                    std_pack_size_kg_carton: formData.std_pack_size_kg_carton,
                    standard_weight: formData.standard_weight,
                    max_weight: formData.max_weight,
                    min_weight: formData.min_weight,
                    pack_bag: formData.pack_bag,
                    give_away: formData.give_away,
                }
            );
            const { data } = response;
            handleSuccess(data.message);
            const {
                id,
                material_code,
                material_description,
                std_pack_size_kg_bag,
                std_pack_size_bag_carton,
                std_pack_size_kg_carton,
                standard_weight,
                max_weight,
                min_weight,
                pack_bag,
                give_away,
            } = formData;
            handleClose({
                id,
                material_code,
                material_description,
                std_pack_size_kg_bag,
                std_pack_size_bag_carton,
                std_pack_size_kg_carton,
                standard_weight,
                max_weight,
                min_weight,
                pack_bag,
                give_away,
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
            const response = await axiosAuth.delete(`/api/masterdata/${formData.id}`, {});

            const { data } = response;
            handleSuccess(data.message);
            handleClose(selectMasterData);
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
            material_code: selectMasterData ? selectMasterData.material_code : "",
            material_description: selectMasterData ? selectMasterData.material_description : "",
            std_pack_size_kg_bag: selectMasterData ? selectMasterData.std_pack_size_kg_bag : null,
            std_pack_size_bag_carton: selectMasterData ? selectMasterData.std_pack_size_bag_carton : null,
            std_pack_size_kg_carton: selectMasterData ? selectMasterData.std_pack_size_kg_carton : null,
            standard_weight: selectMasterData ? selectMasterData.standard_weight : null,
            max_weight: selectMasterData ? selectMasterData.max_weight : null,
            min_weight: selectMasterData ? selectMasterData.min_weight : null,
            pack_bag: selectMasterData ? selectMasterData.pack_bag : null,
            give_away: selectMasterData ? selectMasterData.give_away : null,
            id: selectMasterData ? selectMasterData.id : "",
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
                                        label="Matetial code"
                                        size="small"
                                        required
                                        fullWidth
                                        disabled={mode == "Delete Master data"}
                                        name="material_code"
                                        value={formData.material_code}
                                        onChange={handleChange}
                                        error={Boolean(errors.material_code)}
                                        helperText={errors.material_code}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Matetial description"
                                        size="small"
                                        required
                                        fullWidth
                                        disabled={mode == "Delete Master data"}
                                        name="material_description"
                                        value={formData.material_description}
                                        onChange={handleChange}
                                        error={Boolean(errors.material_description)}
                                        helperText={errors.material_description}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="STD Pack Size (kg/Bag)"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Master data"}
                                        name="std_pack_size_kg_bag"
                                        value={formData.std_pack_size_kg_bag}
                                        onChange={handleChange}
                                        error={Boolean(errors.std_pack_size_kg_bag)}
                                        helperText={errors.std_pack_size_kg_bag}
                                        inputProps={{ onKeyDown: handleKeyDown }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="STD Pack Size (bag/Carton)"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Master data"}
                                        name="std_pack_size_bag_carton"
                                        value={formData.std_pack_size_bag_carton}
                                        onChange={handleChange}
                                        error={Boolean(errors.std_pack_size_bag_carton)}
                                        helperText={errors.std_pack_size_bag_carton}
                                        inputProps={{ onKeyDown: handleKeyDown }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Pack Size:ctn (kg/carton)"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Master data"}
                                        name="std_pack_size_kg_carton"
                                        value={formData.std_pack_size_kg_carton}
                                        onChange={handleChange}
                                        error={Boolean(errors.std_pack_size_kg_carton)}
                                        helperText={errors.std_pack_size_kg_carton}
                                        inputProps={{ onKeyDown: handleKeyDown }}
                                    />
                                </Grid>
                            </Grid>
                        </div>

                        <div className="w-[50%] border-[1px] border-primary rounded-md p-4">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="น้ำหนักมาตรฐาน"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Master data"}
                                        name="standard_weight"
                                        value={formData.standard_weight}
                                        onChange={handleChange}
                                        error={Boolean(errors.standard_weight)}
                                        helperText={errors.standard_weight}
                                        inputProps={{ onKeyDown: handleKeyDown }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="น้ำหนักสูงสุด"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Master data"}
                                        name="max_weight"
                                        value={formData.max_weight}
                                        onChange={handleChange}
                                        error={Boolean(errors.max_weight)}
                                        helperText={errors.max_weight}
                                        inputProps={{ onKeyDown: handleKeyDown }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="น้ำหนักต่ำสุด"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Master data"}
                                        name="min_weight"
                                        value={formData.min_weight}
                                        onChange={handleChange}
                                        error={Boolean(errors.min_weight)}
                                        helperText={errors.min_weight}
                                        inputProps={{ onKeyDown: handleKeyDown }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Pack / Bag"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Master data"}
                                        name="pack_bag"
                                        value={formData.pack_bag}
                                        onChange={handleChange}
                                        error={Boolean(errors.pack_bag)}
                                        helperText={errors.pack_bag}
                                        inputProps={{ onKeyDown: handleKeyDown }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Grive away (%)"
                                        size="small"
                                        fullWidth
                                        required
                                        disabled={mode == "Delete Master data"}
                                        name="give_away"
                                        value={formData.give_away}
                                        onChange={handleChange}
                                        error={Boolean(errors.give_away)}
                                        helperText={errors.give_away}
                                        inputProps={{ onKeyDown: handleKeyDown }}
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
                        style={{ display: mode == "Delete Master data" ? "none" : "block" }}
                        onClick={handleUpdate}
                        type="submit"
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        className="bg-error"
                        style={{ display: mode != "Delete Master data" ? "none" : "block" }}
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

CRUDMasterData.propTypes = {
    mode: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    selectMasterData: PropTypes.object,
};
