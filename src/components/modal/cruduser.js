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
import PasswordInput from "../passwordinput";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import ResetPassword from "./resetpassword";
import Loading from "@/components/loading";
import { useAlert } from "@/contexts/alertContext";
import Alerts from "@/components/modal/alertcompenent";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/utils/useAxiosAuth";

export default function CRUDuser({ open, mode, handleClose, selectUser }) {
  const { data: session } = useSession();
  const { addAlert } = useAlert();
  const axiosAuth = useAxiosAuth();
  
  const [loadings, setLoadings] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    employee_id: "",
    department: "",
    password: "",
    password_verification: "",
    role: "",
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
    if (formData.username.trim() === "") {
      errors.username = "Username is required";
    }
    if (formData.firstname.trim() === "") {
      errors.firstname = "Firstname is required";
    }
    if (formData.lastname.trim() === "") {
      errors.lastname = "Lastname is required";
    }
    if (formData.department.trim() === "") {
      errors.department = "Department is required";
    }
    if (formData.employee_id.trim() === "") {
      errors.employee_id = "Department is required";
    }
    if (
      formData.password_verification.trim().length < 8 &&
      mode == "Create User"
    ) {
      errors.password_verification =
        "Password must be at least 8 characters long";
    }
    if (formData.password.trim().length < 8 && mode == "Create User") {
      errors.password = "Password must be at least 8 characters long";
    }
    if (formData.role === "") {
      errors.role = "Role is required";
    }

    if (
      formData.password.trim().length >= 8 &&
      formData.password_verification.length >= 8 &&
      formData.password_verification.trim() !== formData.password.trim() &&
      mode == "Create User"
    ) {
      errors.password_verification = "Password do not match";
    }
    return errors;
  };

  const handleClickOpenResetPassword = () => {
    setOpenResetPassword(true);
    handleClose(null);
  };
  const handleCloseResetPassword = () => {
    setOpenResetPassword(false);
  };

  const handleCrete = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      createUser(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const createUser = async (formData) => {
    try {
      setLoadings(true);
      if (formData.id == "") {
        const response = await axiosAuth.post("/api/user",
          {
            username: formData.username,
            firstname: formData.firstname,
            lastname: formData.lastname,
            employee_id: formData.employee_id,
            department: formData.department,
            password: formData.password,
            role: formData.role,
            create_by: session?.user.username,
          }
        );
        const { data } = response;
        handleSuccess(data.message);
        const {
          id,
          firstname,
          lastname,
          employee_id,
          department,
          role,
          username,
        } = data.data;
        handleClose({
          id,
          firstname,
          lastname,
          employee_id,
          department,
          role,
          username,
        });
      } else {
         const response = await axiosAuth.put("/api/user",
          {
            id: formData.id,
            firstname: formData.firstname,
            lastname: formData.lastname,
            employee_id: formData.employee_id,
            department: formData.department,
            role: formData.role,
            update_by: session?.user.username,
          }
        );
        const { data } = response;
        handleSuccess(data.message);
        const {
          id,
          firstname,
          lastname,
          employee_id,
          department,
          role,
          username,
        } = formData;
        handleClose({
          id,
          firstname,
          lastname,
          employee_id,
          department,
          role,
          username,
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoadings(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoadings(true);
      const response = await axiosAuth.delete(`/api/user/${formData.id}`,{});

      const { data } = response;
      handleSuccess(data.message);
      handleClose(selectUser);
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
      username: selectUser ? selectUser.username : "",
      firstname: selectUser ? selectUser.firstname : "",
      lastname: selectUser ? selectUser.lastname : "",
      employee_id: selectUser ? selectUser.employee_id : "",
      department: selectUser ? selectUser.department : "",
      password: "",
      password_verification: "",
      role: selectUser ? selectUser.role : "",
      id: selectUser ? selectUser.id : "",
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
            <div className="w-[60%]">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Username"
                    size="small"
                    required
                    fullWidth
                    disabled={mode == "Edit User" || mode == "Delete User"}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={Boolean(errors.username)}
                    helperText={errors.username}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Firstname"
                    size="small"
                    required
                    fullWidth
                    disabled={mode == "Delete User"}
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    error={Boolean(errors.firstname)}
                    helperText={errors.firstname}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Lastname"
                    size="small"
                    required
                    fullWidth
                    disabled={mode == "Delete User"}
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    error={Boolean(errors.lastname)}
                    helperText={errors.lastname}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Employee ID"
                    size="small"
                    required
                    fullWidth
                    disabled={mode == "Delete User"}
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    error={Boolean(errors.employee_id)}
                    helperText={errors.employee_id}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Department"
                    size="small"
                    required
                    fullWidth
                    disabled={mode == "Delete User"}
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    error={Boolean(errors.department)}
                    helperText={errors.department}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  style={{
                    display:
                      mode == "Edit User" || mode == "Delete User"
                        ? "none"
                        : "block",
                  }}
                >
                  <PasswordInput
                    label="Password"
                    value={formData.password}
                    handlePassword={handleChange}
                    name="password"
                    error={Boolean(errors.password)}
                    helperText={
                      errors.password ||
                      "Password must be at least 8 characters long"
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{
                    display:
                      mode == "Edit User" || mode == "Delete User"
                        ? "none"
                        : "block",
                  }}
                >
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
                </Grid>

                <Grid
                  item
                  xs={12}
                  style={{
                    display:
                      mode == "Create User" || mode == "Delete User"
                        ? "none"
                        : "block",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={handleClickOpenResetPassword}
                  >
                    Reset Password
                  </Button>
                </Grid>
              </Grid>
            </div>

            <div className="w-[40%] border-[1px] border-[#bdbdbd] rounded-md p-4">
              <FormControl>
                <FormLabel style={{ color: "#000", fontWeight: 600 }} required>
                  Role
                </FormLabel>
                <RadioGroup
                  name="role"
                  required
                  onChange={handleChange}
                  value={formData.role}
                >
                  <FormControlLabel
                    value="Administrator"
                    control={<Radio />}
                    label="Administrator"
                    disabled={mode == "Delete User" || selectUser?.username === "admin"}
                  />
                  <FormControlLabel
                    value="Supervisor"
                    control={<Radio />}
                    label="Supervisor"
                    disabled={mode == "Delete User" || selectUser?.username === "admin"}
                  />
                  <FormControlLabel
                    value="Operator"
                    control={<Radio />}
                    label="Operator"
                    disabled={mode == "Delete User" || selectUser?.username === "admin"}
                  />
                </RadioGroup>
              </FormControl>
              {Boolean(errors.role) && (
                <FormHelperText error>{errors.role}</FormHelperText>
              )}
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
            style={{ display: mode == "Delete User" ? "none" : "block" }}
            onClick={handleCrete}
            type="submit"
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            className="bg-error"
            style={{ display: mode != "Delete User" ? "none" : "block" }}
            onClick={handleDelete}
          >
            Delete
          </Button>

          <Loading open={loadings} />
          <Alerts />
        </DialogActions>
      </Dialog>

      <ResetPassword
        open={openResetPassword}
        handleClose={handleCloseResetPassword}
        data={selectUser}
      />
    </div>
  );
}

CRUDuser.propTypes = {
  mode: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectUser: PropTypes.object,
};
