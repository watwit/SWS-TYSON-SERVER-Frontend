import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Space, Table } from "antd/lib";
import { MdOutlineModeEdit, MdOutlineDelete } from "react-icons/md";
import TextField from "@mui/material/TextField";
import CRUDuser from "@/components/modal/cruduser";
import useAxiosAuth from "@/utils/useAxiosAuth";
import Loading from "@/components/loading";
import { useAlert } from "@/contexts/alertContext";
import Alerts from "@/components/modal/alertcompenent";
import ProtectedRoute from "@/components/protectedRoute";
import { IoIosAddCircleOutline } from "react-icons/io";
import { sorterStringWithNull } from "@/utils/sorter";
import {getRowClassName} from "@/utils/tableClassName";

const { Column } = Table;

export default function Usermanagement() {
  const { addAlert } = useAlert();
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const axiosAuth = useAxiosAuth();

  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [openDeleteUser, setOpenDeleteUser] = useState(false);
  const [loadings, setLoadings] = useState(false);

  const [selectUser, setSelectUser] = useState(null);

  const handleClickOpenCreateUser = () => {
    setSelectUser(null);
    setOpenCreateUser(true);
  };
  const handleCloseCreateUser = (newUser) => {
    if (newUser) {
      setData([...data, newUser]);
    }
    setOpenCreateUser(false);
    setSelectUser(null);
  };

  const handleClickOpenEditUser = (user) => {
    setSelectUser(user);
    setOpenEditUser(true);
  };
  const handleCloseEditUser = (updatedUser) => {
    if (updatedUser) {
      const updatedData = data.map((user) => {
        if (user.id === updatedUser.id) {
          return updatedUser;
        }
        return user;
      });
      setData(updatedData);
    }
    setOpenEditUser(false);
  };

  const handleClickOpenDeleteUser = (user) => {
    setSelectUser(user);
    setOpenDeleteUser(true);
  };
  const handleCloseDeleteUser = (updatedUser) => {
    if (updatedUser) {
      const updatedData = data.filter((user) => user.id !== updatedUser.id);
      setData(updatedData);
    }
    setOpenDeleteUser(false);
  };

  const handleError = (error) => {
    addAlert({
      id: new Date().getTime(),
      severity: "error",
      message: error.response?.data.message || error.message,
    });
  };

  const fetchdata = async () => {
    try {
      setLoadings(true);
      const response = await axiosAuth.get(
        "/api/user",
        {}
      );
      const { data } = response;
      if (data.data != null) {
        setData(data.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoadings(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex flex-col flex-wrap justify-between p-4 gap-8 container mx-auto">
        <h1 className="text-2xl font-semibold">User Management</h1>

        <div className="w-full bg-white rounded-xl p-4 content-user">
          <div className="flex justify-between mb-4">
            <Button
              variant="contained"
              color="success"
              className="bg-success"
              style={{ color: "#fff", fontSize: "16px" }}
              size="small"
              onClick={handleClickOpenCreateUser}
            >
              <IoIosAddCircleOutline size={25} className="mr-1" /> Add
            </Button>

            <TextField
              name="search"
              id="search"
              placeholder="Search"
              size="small"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Table
            dataSource={data}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            rowClassName={getRowClassName}
            rootClassName="maintain"
          >
            <Column
              title="Username"
              dataIndex="username"
              key="username"
              sorter={(a, b) => sorterStringWithNull(a,b,"username")}
              filteredValue={[searchText]}
              onFilter={(value, record) => {
                return (
                  String(record.username).toLocaleLowerCase().includes(value) ||
                  String(record.firstname)
                    .toLocaleLowerCase()
                    .includes(value) ||
                  String(record.lastname).toLocaleLowerCase().includes(value) ||
                  String(record.role).toLocaleLowerCase().includes(value)
                );
              }}
            />
            <Column
              title="Firstname"
              dataIndex="firstname"
              key="firstname"
              sorter={(a, b) => sorterStringWithNull(a,b,"firstname")}
            />
            <Column
              title="Lastname"
              dataIndex="lastname"
              key="lastname"
              sorter={(a, b) => sorterStringWithNull(a,b,"lastname")}
            />
            <Column
              title="Role"
              dataIndex="role"
              key="role"
              sorter={(a, b) => sorterStringWithNull(a,b,"role")}
            />
            <Column
              title="Action"
              key="action"
              render={(_, record) => (
                <Space size="middle">
                  <Button
                    variant="outlined"
                    color="success"
                    style={{
                      maxWidth: "40px",
                      minWidth: "40px",
                      padding: "6px 0px",
                    }}
                    onClick={() => handleClickOpenEditUser(record)}
                  >
                    <MdOutlineModeEdit size={20} className="text-success" />
                  </Button>
                  {record.username !== "admin" && (
                    <Button
                      variant="contained"
                      color="error"
                      className="bg-error"
                      style={{
                        maxWidth: "40px",
                        minWidth: "40px",
                        padding: "6px 0px",
                      }}
                      onClick={() => handleClickOpenDeleteUser(record)}
                    >
                      <MdOutlineDelete size={20} />
                    </Button>
                  )}
                </Space>
              )}
            />
          </Table>
          <CRUDuser
            open={openCreateUser}
            handleClose={handleCloseCreateUser}
            mode={"Create User"}
            selectUser={selectUser}
          />
          <CRUDuser
            open={openEditUser}
            handleClose={handleCloseEditUser}
            mode={"Edit User"}
            selectUser={selectUser}
          />
          <CRUDuser
            open={openDeleteUser}
            handleClose={handleCloseDeleteUser}
            mode={"Delete User"}
            selectUser={selectUser}
          />
          <Loading open={loadings} />
          <Alerts />
        </div>
      </div>
    </ProtectedRoute>
  );
}
