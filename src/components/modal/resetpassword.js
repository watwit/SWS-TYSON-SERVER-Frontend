import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import PasswordInput from "../passwordinput";
import axios from "axios";
import Loading from "@/components/loading";
import { useAlert } from "@/contexts/alertContext";
import Alerts from "@/components/modal/alertcompenent";
import { useSession } from "next-auth/react";


export default function ResetPassword({ open, handleClose, data }) {
  const { data: session } = useSession();
  const { addAlert } = useAlert();
  const [loadings, setLoadings] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    password_verification: "",
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
    if (formData.password_verification.trim().length < 8) {
      errors.password_verification =
        "Password must be at least 8 characters long";
    }
    if (formData.password.trim().length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    if (formData.role === "") {
      errors.role = "Role is required";
    }

    if (
      formData.password.trim().length >= 8 &&
      formData.password_verification.length >= 8 &&
      formData.password_verification.trim() !== formData.password.trim()
    ) {
      errors.password_verification = "Password do not match";
    }
    return errors;
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      updatePassword(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const updatePassword = async (formData) => {
    try {
      setLoadings(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/password`,
        {
          id: formData.id,
          password: formData.password,
          update_by: session?.user.username,
        }
      );
      const { data } = response;
      handleSuccess(data.message);
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
    handleClose();
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
      password: "",
      password_verification: "",
      id: data ? data.id : "",
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
              maxWidth: "650px",
            },
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          style={{ color: "#000", fontWeight: 600 }}
        >
          Reset Password
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
          <div className="flex flex-col gap-4">
            <p className="flex text-black">
              Set a new password for{" "}
              <span className="px-1 font-semibold"> {data?.username} </span>{" "}
              user
            </p>
            <PasswordInput
              label="Password"
              value={formData.password}
              handlePassword={handleChange}
              name="password"
              error={Boolean(errors.password)}
              helperText={
                errors.password || "Password must be at least 8 characters long"
              }
            />
            <PasswordInput
              label="Password Verification"
              handlePassword={handleChange}
              name={"password_verification"}
              value={formData.password_verification}
              error={Boolean(errors.password_verification)}
              helperText={
                errors.password_verification ||
                "Password must be at least 8 characters long"
              }
            />
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
            onClick={handleUpdatePassword}
          >
            Save
          </Button>

          <Loading open={loadings} />
          <Alerts />
        </DialogActions>
      </Dialog>
    </div>
  );
}

ResetPassword.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};
