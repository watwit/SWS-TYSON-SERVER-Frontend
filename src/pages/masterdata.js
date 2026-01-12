import React, { useState } from "react";
import ProtectedRoute from "@/components/protectedRoute";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import MasterdataTabpanel from "@/components/masterdataTabpanel";
import Standard from "@/components/masterdata/standard";

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: "#1976d2",
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(1),
    color: "rgba(0, 0, 0, 0.85)",
    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
    "&.Mui-selected": {
      color: "#1976d2",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  })
);

export default function Masterdata() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col flex-wrap justify-between p-4 gap-8 container mx-auto">
        <h1 className="text-2xl font-semibold">Master Data</h1>
        <div className="w-full bg-white rounded-xl p-4 content-user">
          <Box sx={{ width: "100%" }}>
            <Box>
              <AntTabs value={value} onChange={handleChange}>
                <AntTab label="Standard" />
              </AntTabs>

              <MasterdataTabpanel value={value} index={0}>
                <Standard />
              </MasterdataTabpanel>
              <Box />
            </Box>
          </Box>
        </div>
      </div>
    </ProtectedRoute>
  );
}
