import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/protectedRoute";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { IoSearchOutline } from "react-icons/io5";
import { Table } from "antd/lib";
import axios from "axios";
import Loading from "@/components/loading";
import { useAlert } from "@/contexts/alertContext";
import Alerts from "@/components/modal/alertcompenent";
import { sorterStringWithNull, sorterNumerWithNull } from "@/utils/sorter";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { TbFileExport } from "react-icons/tb";
import { RiFileExcel2Line } from "react-icons/ri";
import ImportProductionOrder from "@/components/modal/importporductionorder";

const { Column } = Table;

const getStatusClassName = (status) => {
    if (status === "Available") {
        return "status-available";
    } else if (status === "Preparing" || status === "Mixing" || status === "Packing" || status === "Incomplete") {
        return "status-inprocess";
    } else if (status === "Prepared" || status === "Mixed" || status === "Packed" || status === "Finished") {
        return "status-finished";
    } else if (status === "No standard") {
        return "status-no-standard";
    }
    return "";
};

export default function Order() {
    const { addAlert } = useAlert();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [data, setData] = useState([]);
    const [loadings, setLoadings] = useState(false);
    const [searchText, setSearchText] = useState("");

    const [machineCode, setMachineCode] = useState([]);
    const [selectedMachineCode, setSelectedMachineCode] = useState("All");

    const [openImportData, setOpenImportData] = useState(false);

    const handleClickOpenImportData = () => {
        setOpenImportData(true);
    };

    const handleCloseOpenImportData = (status) => {
        setOpenImportData(false);
        if (status == 'success') {
            fetchdata();
        }
    };


    const handleChangeSelectMachineCode = (event) => {
        setSelectedMachineCode(event.target.value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    const handleSearch = () => {
        fetchdata();
    };

    const fetchMachineCode = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/productionOrder/machineCode/productionDate`,
                {
                    "production_date": selectedDate.format("DD/MM/YYYY")
                }
            );
            const { data } = response;
            if (data.data != undefined) {
                setMachineCode(data.data);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const fetchdata = async () => {
        try {
            setLoadings(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/productionOrder/search`,
                {
                    "production_date": selectedDate.format("DD/MM/YYYY"),
                    "machine_code": selectedMachineCode
                }

            );
            const { data } = response;

            if (data.data != null) {
                const processedData = data.data.map((item, index) => ({
                    ...item,
                    index: index + 1,

                }));
                setData(processedData);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoadings(false);
        }
    };

    const handleDownloadtemplate = async () => {
        try {
            setLoadings(true);

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/productionOrder/template`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'production-order-template.xlsx');
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
        setSelectedMachineCode("All");
        fetchMachineCode();
    }, [selectedDate]);

    useEffect(() => {
        fetchdata();
    }, []);

    const rowClassName = (record, index) => {
        return index % 2 === 0
            ? "atn-table-row-bottom-border ant-table-row-odd"
            : "atn-table-row-bottom-border ant-table-row-even";
    };


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
                                    label="วันที่ผลิต"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    format="DD/MM/YYYY"
                                    slotProps={{ textField: { size: "small" } }}
                                />
                            </LocalizationProvider>

                            <TextField
                                label="รหัสเครื่อง"
                                size="small"
                                select
                                value={selectedMachineCode}
                                onChange={handleChangeSelectMachineCode}
                                className="w-[250px]"
                            >
                                <MenuItem value="All">ทั้งหมด</MenuItem>
                                {machineCode.map((option) => (
                                    <MenuItem
                                        key={option.machine_code}
                                        value={option.machine_code}
                                    >
                                        {option.machine_code}
                                    </MenuItem>
                                ))}
                            </TextField>

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
                        rowClassName={rowClassName}
                        rootClassName="maintain"
                        scroll={{ x: 'max-content' }}

                    >
                        <Column title="No." dataIndex="index" key="index" />

                        <Column
                            title="วันที่ผลิต"
                            dataIndex="production_date"
                            key="production_date"
                            sorter={(a, b) => sorterStringWithNull(a, b, "production_date")}
                            render={(production_date) =>
                                dayjs(production_date).format("DD/MM/YYYY")
                            }
                            filteredValue={[searchText]}
                            onFilter={(value, record) => {
                                return (
                                    String(record.production_date).toLocaleLowerCase().includes(value) ||
                                    String(record.order_number).toLocaleLowerCase().includes(value) ||
                                    String(record.machine_code).toLocaleLowerCase().includes(value) ||
                                    String(record.product_type).toLocaleLowerCase().includes(value) ||
                                    String(record.size).toLocaleLowerCase().includes(value) ||
                                    String(record.width).toLocaleLowerCase().includes(value) ||
                                    String(record.thickness).toLocaleLowerCase().includes(value) ||
                                    String(record.quantity_kg).toLocaleLowerCase().includes(value) ||
                                    String(record.remark).toLocaleLowerCase().includes(value) ||
                                    String(record.product_code).toLocaleLowerCase().includes(value) ||
                                    String(record.status).toLocaleLowerCase().includes(value)
                                );
                            }}
                        />
                        <Column
                            title="เลขที่ใบสั่ง"
                            dataIndex="order_number"
                            key="order_number"
                            sorter={(a, b) => sorterStringWithNull(a, b, "order_number")}
                        />
                        <Column
                            title="รหัสเครื่อง"
                            dataIndex="machine_code"
                            key="machine_code"
                            sorter={(a, b) => sorterStringWithNull(a, b, "machine_code")}
                        />
                        <Column
                            title="ประเภท"
                            dataIndex="product_type"
                            key="product_type"
                            sorter={(a, b) => sorterStringWithNull(a, b, "product_type")}
                        />
                        <Column
                            title="ขนาด"
                            dataIndex="size"
                            key="size"
                            sorter={(a, b) => sorterStringWithNull(a, b, "size")}
                        />
                        <Column
                            title="กว้าง"
                            dataIndex="width"
                            key="width"
                            sorter={(a, b) => sorterNumerWithNull(a, b, "width")}
                        />
                        <Column
                            title="หนา"
                            dataIndex="thickness"
                            key="thickness"
                            sorter={(a, b) => sorterNumerWithNull(a, b, "thickness")}
                        />
                        <Column
                            title="จำนวนสั่งผลิต (kg)"
                            dataIndex="quantity_kg"
                            key="quantity_kg"
                            sorter={(a, b) => sorterNumerWithNull(a, b, "quantity_kg")}
                        />
                        <Column
                            title="เพิ่มเติม"
                            dataIndex="remark"
                            key="remark"
                            sorter={(a, b) => sorterStringWithNull(a, b, "remark")}
                        />
                        <Column
                            title="รหัสสินค้า"
                            dataIndex="product_code"
                            key="product_code"
                            sorter={(a, b) => sorterStringWithNull(a, b, "product_code")}
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
                    </Table>


                    <ImportProductionOrder
                        open={openImportData}
                        handleClose={handleCloseOpenImportData}
                    />

                    <Loading open={loadings} />
                    <Alerts />
                </div>
            </div>
        </ProtectedRoute>
    );
}
