import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAlert } from "@/contexts/alertContext";
import PropTypes from "prop-types";

export default function Alerts({ top }) {
  const { alerts, removeAlert } = useAlert();
  return (
    <>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => removeAlert(alert.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          style={{ top: top || "70px" }}
        >
          <MuiAlert
            onClose={() => removeAlert(alert.id)}
            severity={alert.severity}
          >
            {alert.message}
          </MuiAlert>
        </Snackbar>
      ))}
    </>
  );
}

Alerts.propTypes = {
  top: PropTypes.string,
};
