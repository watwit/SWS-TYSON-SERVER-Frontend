import React, { useState, useEffect } from "react";
import { Table, Space } from "antd/lib";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import ProtectedRoute from "@/components/protectedRoute";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "@/components/loading";
import { useAlert } from "@/contexts/alertContext";
import Alerts from "@/components/modal/alertcompenent";
import { MdOutlineDelete, MdOutlineModeEdit } from "react-icons/md";
import { sorterStringWithNull, sorterNumerWithNull } from "@/utils/sorter";
import useAxiosAuth from "@/utils/useAxiosAuth";
import { TbFileExport } from "react-icons/tb";
import { RiFileExcel2Line } from "react-icons/ri";
import ImportOrder from "@/components/modal/importorder";
import CRUDOrder from "@/components/modal/crudorder";
import {getStatusClassName, getRowClassName} from "@/utils/tableClassName";

const { Column } = Table;


export default function Order() {
  const { addAlert } = useAlert();
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [loadings, setLoadings] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const axiosAuth = useAxiosAuth();

  const [openEditOrder, setOpenEditOrder] = useState(false);
  const [openDeleteOrder, setOpenDeleteOrder] = useState(false);
  const [selectOrder, setSelectOrder] = useState(null);
  const [openImportData, setOpenImportData] = useState(false);

  const handleClickOpenEditOrder = (order) => {
    setSelectOrder(order);
    setOpenEditOrder(true);
  };
  const handleCloseEditOrder = (updateOrder) => {
    if (updateOrder) {
      setData(
        data
          .flatMap((order) => {
            if (order.id !== updateOrder.id) return [order];

            const formatDate = (date) =>
              new Date(date).toISOString().split("T")[0];
            return formatDate(order.produce_date) ===
              formatDate(updateOrder.produce_date)
              ? [updateOrder]
              : [];
          })
          .map((item, index) => ({ ...item, no: index + 1 }))
      );
    }
    setOpenEditOrder(false);
  };

  const handleClickOpenDeleteOrder = (order) => {
    setSelectOrder(order);
    setOpenDeleteOrder(true);
  };
  const handleCloseDeleteOrder = (updateOrder) => {
    if (updateOrder) {
      setData(
        data
          .filter((order) => order.id !== updateOrder.id)
          .map((item, index) => ({ ...item, no: index + 1 }))
      );
    }
    setOpenDeleteOrder(false);
  };

  const handleClickOpenImportData = () => {
    setOpenImportData(true);
  };

  const handleCloseOpenImportData = (status) => {
    setOpenImportData(false);
    if (status == "success") {
      fetchdata();
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSearch = () => {
    fetchdata();
  };

  const fetchdata = async () => {
    try {
      setLoadings(true);
      const response = await axiosAuth.post("/api/order/produceDate", {
        produce_date: selectedDate.format("DD/MM/YYYY"),
      });
      const { data } = response;

      const dataSource = data.data.map((item, index) => ({
        ...item,
        no: index + 1,
      }));
      setData(dataSource);
    } catch (error) {
      handleError(error);
    } finally {
      setLoadings(false);
    }
  };

  const handleDownloadtemplate = async () => {
    try {
      setLoadings(true);

      const response = await axiosAuth.get("/api/order/template", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "production-order-template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      handleSuccess("Download template success.");
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
    fetchdata();
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex flex-col flex-wrap justify-between p-4 gap-8 container mx-auto">
        <h1 className="text-2xl font-semibold">Production Order</h1>
        <div className="w-full bg-white rounded-xl p-4 content-user">
          <div className="flex justify-between mb-4">
            <div className="flex gap-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  className=" w-[200px] xl:w-auto"
                  label="Produce date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>
              <Button
                variant="contained"
                color="primary"
                className="bg-primary"
                size="medium"
                onClick={handleSearch}
              >
                <IoSearchOutline size={25} className="mr-1" />
                Search
              </Button>
              <Button
                variant="contained"
                color="primary"
                className="bg-primary"
                size="medium"
                onClick={handleDownloadtemplate}
              >
                <TbFileExport size={25} className="mr-1" />
                Template
              </Button>

              <Button
                variant="contained"
                color="success"
                className="bg-success"
                style={{ color: "#fff", fontSize: "16px" }}
                size="medium"
                onClick={handleClickOpenImportData}
              >
                <RiFileExcel2Line size={25} className="mr-1" />
                Import
              </Button>
            </div>
            <TextField
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
            scroll={{ x: "max-content" }}
          >
            <Column
              title="No."
              dataIndex="no"
              key="no"
              sorter={(a, b) => sorterNumerWithNull(a, b, "no")}
            />
            <Column
              title="Plant"
              dataIndex="plant"
              key="plant"
              sorter={(a, b) => sorterStringWithNull(a, b, "plant")}
              filteredValue={[searchText]}
              onFilter={(value, record) => {
                return (
                  String(record.plant).toLocaleLowerCase().includes(value) ||
                  String(record.produce_date)
                    .toLocaleLowerCase()
                    .includes(value) ||
                  String(record.line).toLocaleLowerCase().includes(value) ||
                  String(record.order_type)
                    .toLocaleLowerCase()
                    .includes(value) ||
                  String(record.production_order)
                    .toLocaleLowerCase()
                    .includes(value) ||
                  String(record.material).toLocaleLowerCase().includes(value) ||
                  String(record.material_type)
                    .toLocaleLowerCase()
                    .includes(value) ||
                  String(record.description)
                    .toLocaleLowerCase()
                    .includes(value) ||
                  String(record.location).toLocaleLowerCase().includes(value) ||
                  String(record.status).toLocaleLowerCase().includes(value)
                );
              }}
            />
            <Column
              title="Produce date"
              dataIndex="produce_date"
              key="produce_date"
              sorter={(a, b) => sorterStringWithNull(a, b, "produce_date")}
              render={(produce_date) =>
                dayjs(produce_date).format("DD/MM/YYYY")
              }
            />
            <Column
              title="Line"
              dataIndex="line"
              key="line"
              sorter={(a, b) => sorterStringWithNull(a, b, "line")}
            />
            <Column
              title="Order type"
              dataIndex="order_type"
              key="order_type"
              sorter={(a, b) => sorterStringWithNull(a, b, "order_type")}
            />
            <Column
              title="Production order"
              dataIndex="production_order"
              key="production_order"
              sorter={(a, b) => sorterStringWithNull(a, b, "production_order")}
            />
            <Column
              title="Material"
              dataIndex="material"
              key="material"
              sorter={(a, b) => sorterStringWithNull(a, b, "material")}
            />
            <Column
              title="Type"
              dataIndex="material_type"
              key="material_type"
              sorter={(a, b) => sorterStringWithNull(a, b, "material_type")}
            />
            <Column
              title="Description"
              dataIndex="description"
              key="description"
              sorter={(a, b) => sorterStringWithNull(a, b, "description")}
            />
            <Column
              title="Location"
              dataIndex="location"
              key="location"
              sorter={(a, b) => sorterStringWithNull(a, b, "location")}
            />
            <Column
              title="Status"
              dataIndex="status"
              key="status"
              sorter={(a, b) => sorterStringWithNull(a, b, "status")}
              render={(_, record) => (
                <div className={getStatusClassName(record.status)}>
                  {record.status}
                </div>
              )}
            />
            <Column
              title="Action"
              key="action"
              fixed="right"
              render={(_, record) =>
                record.status === "Available" ? (
                  <Space size="middle">
                    <Button
                      variant="outlined"
                      color="success"
                      style={{
                        maxWidth: "40px",
                        minWidth: "40px",
                        padding: "6px 0px",
                      }}
                      onClick={() => handleClickOpenEditOrder(record)}
                    >
                      <MdOutlineModeEdit size={20} className="text-success" />
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      className="bg-error"
                      style={{
                        maxWidth: "40px",
                        minWidth: "40px",
                        padding: "6px 0px",
                      }}
                      onClick={() => handleClickOpenDeleteOrder(record)}
                    >
                      <MdOutlineDelete size={20} />
                    </Button>
                  </Space>
                ) : null
              }
            />
          </Table>

          <ImportOrder
            open={openImportData}
            handleClose={handleCloseOpenImportData}
          />

          <CRUDOrder
            open={openEditOrder}
            handleClose={handleCloseEditOrder}
            mode={"Edit Production order"}
            selectOrder={selectOrder}
          />
          <CRUDOrder
            open={openDeleteOrder}
            handleClose={handleCloseDeleteOrder}
            mode={"Delete Production order"}
            selectOrder={selectOrder}
          />

          <Loading open={loadings} />
          <Alerts />
        </div>
      </div>
    </ProtectedRoute>
  );
}
