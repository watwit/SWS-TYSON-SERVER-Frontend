import React, { useState } from "react";
import Button from "@mui/material/Button";
import { MdOutlineLogout } from "react-icons/md";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useSession, signOut } from "next-auth/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";

export default function Navbar({handleNav}) {
  const { data: session } = useSession();

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <nav className="h-[60px] w-full bg-[#29334A] shadow-xl nav-header">
      <div className="flex items-center justify-between px-4 md:px-8 w-full h-full">
        <div className="flex items-center">
          <h1 className="text-[42px] leading-[42px] font-semibold text-[#36AC0C] mr-2">
            SWS
          </h1>
          <h1 className="text-[42px] leading-[42px] font-semibold text-white mr-4">
            Center
          </h1>
          <button
            onClick={handleNav}
            className="mr-4 hover:cursor-pointer hover:opacity-90"
            aria-label="Open Menu"
          >
            <GiHamburgerMenu size={25} color={"#fff"} />
          </button>
        </div>

        <Box sx={{ flexGrow: 0 }} className="self-center">
          <Tooltip title="Open user details">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} className="flex gap-4 hover:opacity-90">
              <Avatar
                sx={{
                  height: "45px",
                  width: "45px",
                  backgroundColor: "#DEEDFE",
                }}
              >
                <FaRegUser className="text-primary" size={25} />
              </Avatar>
              <Typography className="text-white">
                {session?.user.username}
              </Typography>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem
              onClick={handleCloseUserMenu}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <div className="flex gap-1">
                <Typography style={{ fontWeight: 600 }}>Role : </Typography>
                <Typography>{session?.user.role}</Typography>
              </div>

              <Button
                variant="contained"
                color="success"
                className="bg-success"
                style={{ color: "#fff", fontSize: "16px" }}
                size="medium"
                onClick={handleLogout}
              >
                logout <MdOutlineLogout className="ml-2" size={20} />
              </Button>
            </MenuItem>
          </Menu>
        </Box>
      </div>
    </nav>
  );
}
