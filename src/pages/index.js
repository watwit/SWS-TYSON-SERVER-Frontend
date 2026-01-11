import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import PasswordInput from "@/components/passwordinput";
import Image from "next/image";
import Loading from "@/components/loading";
import { useAlert } from "@/contexts/alertContext";
import Alerts from "@/components/modal/alertcompenent";
import { signIn } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { addAlert } = useAlert();
  const [loadings, setLoadings] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    if (formData.password.trim() === "") {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleClickLogin = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      login();
    } else {
      setErrors(validationErrors);
    }
  };

  const login = async () => {
    try {
      setLoadings(true);
      const signInData = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (signInData?.error) {
        addAlert({
          id: new Date().getTime(),
          severity: "error",
          message: signInData?.error || "Server error",
        });
      } else {
        router.push(`/order`);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoadings(false);
    }
  };

  const handleError = (error) => {
    addAlert({
      id: new Date().getTime(),
      severity: "error",
      message: error.response?.data.message || error.message,
    });
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-r from-primary to-secondary">
      <div className="w-[600px] lg:w-[850px] h-[450px] lg:h-[500px] flex rounded-xl">
        <div className="w-[50%] lg:w-[60%] h-full bg-white bg-opacity-20 backdrop-blur-lg relative rounded-l-xl">
          <h1 className="text-[70px] leading-[70px] font-semibold text-white px-4 pt-4">
            SWS
          </h1>
          <p className="text-lg text-white px-4">Smart Weighing System </p>
          <div className="absolute bottom-4 left-2 lg:left-8 w-[270px] h-[270px] lg:w-[430px] lg:h-[430px]">
            <Image
              src={"/scale-logo.png"}
              alt="weight logo"
              priority
              fill={true}
              sizes="100%"
            />
          </div>
        </div>
        <div className="w-[50%] lg:w-[40%] h-full bg-white p-4 flex flex-col gap-4 rounded-r-xl">
          <p className="text-[32px] text-back font-semibold my-8">Sign in</p>

          <div className="mb-8 flex flex-col gap-2">
            <TextField
              label="Username"
              required
              fullWidth
              size="small"
              className="my-4"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              error={Boolean(errors.username)}
              helperText={errors.username || ""}
              InputLabelProps={{ shrink: true }}
            />
            <PasswordInput
              label="Password"
              id="password"
              value={formData.password}
              handlePassword={handleChange}
              name="password"
              error={Boolean(errors.password)}
              helperText={errors.password || ""}
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            className="bg-primary"
            onClick={handleClickLogin}
            fullWidth
          >
            Login
          </Button>

          <Loading open={loadings} />
          <Alerts top={"20px"} />
        </div>
      </div>
    </div>
  );
}
