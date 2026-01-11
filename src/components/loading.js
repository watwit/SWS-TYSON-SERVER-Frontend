import React from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from "prop-types";

export default function Loading({open}) {
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex:1000 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

Loading.propTypes = {
    open : PropTypes.bool.isRequired,
}
