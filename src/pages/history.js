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
import { BsFiletypeCsv } from "react-icons/bs";
import { ExportToCsv } from "@/components/exporttocsv";

const { Column } = Table;

const buildExportData = (data) => {
    return data.map((item) => {
        const weighingDate = dayjs(item.weighing_date);
        const dateFormatted = weighingDate.isValid() ? weighingDate.format("DD/MM/YYYY") : "";
        const timeFormatted = weighingDate.isValid() ? weighingDate.format("HH:mm:ss") : "";

        return {
            "เลขที่ใบสั่ง": item.order_number || "",
            "รหัสเครื่อง": item.machine_code || "",
            "รหัสสินค้า": item.product_code || "",
            "ประเภท": item.product_type || "",
            "ขนาด": item.size || "",
            "กว้าง": item.width ?? "",
            "หนา": item.thickness ?? "",
            "นน.แกน": item.core_weight ?? "",
            "ม้วนที่": item.weight_no ?? "",
            "วันที่": dateFormatted,
            "เวลา": timeFormatted,
            "กะ": item.shift || "",
            "นน.จริง": item.weight !== undefined && item.weight !== null && !isNaN(Number(item.weight))
                ? Number(item.weight).toFixed(3)
                : "",
            "นน.สุทธิ": item.net_weight !== undefined && item.net_weight !== null && !isNaN(Number(item.net_weight))
                ? Number(item.net_weight).toFixed(3)
                : "",
            "ผู้ตรวจ": item.weighing_by || "",
        };
    });
};

export default function History() {
    const { addAlert } = useAlert();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [data, setData] = useState([]);
    const [loadings, setLoadings] = useState(false);
    const [searchText, setSearchText] = useState("");

    const [machineCode, setMachineCode] = useState([]);
    const [selectedMachineCode, setSelectedMachineCode] = useState("All");


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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/productionOrder/history/machineCode/productionDate`,
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/productionOrder/history/search`,
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

    const handleClickExportToCSV = () => {
        try {
            setLoadings(true);
            const exportData = buildExportData(data);
            ExportToCsv(exportData, "history data");
            handleSuccess("Export data success.");
        } catch (error) {
            handleError(error);
        } finally {
            setLoadings(false);
        }
    }

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
                <h1 className="text-2xl font-semibold">History</h1>
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
                                color="success"
                                className="bg-success"
                                style={{ color: "#fff", fontSize: "16px" }}
                                size="medium"
                                onClick={handleClickExportToCSV}
                                disabled={!data.length > 0}
                            >
                                <BsFiletypeCsv size={25} className="mr-1" />
                                Export
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
                        rowKey="index"
                        pagination={{ pageSize: 10 }}
                        rowClassName={rowClassName}
                        rootClassName="maintain"
                        scroll={{ x: 'max-content' }}

                    >
                        <Column title="No." dataIndex="index" key="index" />

                        <Column
                            title="เลขที่ใบสั่ง"
                            dataIndex="order_number"
                            key="order_number"
                            sorter={(a, b) => sorterStringWithNull(a, b, "order_number")}
                            filteredValue={[searchText]}
                            onFilter={(value, record) => {
                                return (
                                    String(record.order_number).toLocaleLowerCase().includes(value) ||
                                    String(record.machine_code).toLocaleLowerCase().includes(value) ||
                                    String(record.product_code).toLocaleLowerCase().includes(value) ||
                                    String(record.product_type).toLocaleLowerCase().includes(value) ||
                                    String(record.size).toLocaleLowerCase().includes(value) ||
                                    String(record.width).toLocaleLowerCase().includes(value) ||
                                    String(record.thickness).toLocaleLowerCase().includes(value) ||
                                    String(record.core_weight).toLocaleLowerCase().includes(value) ||
                                    String(record.weight_no).toLocaleLowerCase().includes(value) ||
                                    String(record.shift).toLocaleLowerCase().includes(value) ||
                                    String(record.weight).toLocaleLowerCase().includes(value) ||
                                    String(record.net_weight).toLocaleLowerCase().includes(value) ||
                                    String(record.weighing_by).toLocaleLowerCase().includes(value) ||
                                    String(dayjs(record.weighing_date).format("DD/MM/YYYY")).toLocaleLowerCase().includes(value) ||
                                    String(dayjs(record.weighing_date).format("HH:mm:ss")).toLocaleLowerCase().includes(value)
                                );
                            }}
                        />
                        <Column
                            title="รหัสเครื่อง"
                            dataIndex="machine_code"
                            key="machine_code"
                            sorter={(a, b) => sorterStringWithNull(a, b, "machine_code")}
                        />
                        <Column
                            title="รหัสสินค้า"
                            dataIndex="product_code"
                            key="product_code"
                            sorter={(a, b) => sorterStringWithNull(a, b, "product_code")}
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
                            title="นน.แกน"
                            dataIndex="core_weight"
                            key="core_weight"
                            sorter={(a, b) => sorterNumerWithNull(a, b, "core_weight")}
                        />
                        <Column
                            title="ม้วนที่"
                            dataIndex="weight_no"
                            key="weight_no"
                            sorter={(a, b) => sorterNumerWithNull(a, b, "weight_no")}
                        />
                        <Column
                            title="วันที่"
                            dataIndex="weighing_date"
                            key="weighing_date"
                            sorter={(a, b) => sorterStringWithNull(a, b, "weighing_date")}
                            render={(production_date) =>
                                dayjs(production_date).format("DD/MM/YYYY")
                            }
                        />
                        <Column
                            title="เวลา"
                            dataIndex="weighing_date"
                            key="weighing_date"
                            sorter={(a, b) => sorterStringWithNull(a, b, "weighing_date")}
                            render={(production_date) =>
                                dayjs(production_date).format("HH:mm:ss")
                            }
                        />
                        <Column
                            title="กะ"
                            dataIndex="shift"
                            key="shift"
                            sorter={(a, b) => sorterStringWithNull(a, b, "shift")}
                        />
                        <Column
                            title="นน.จริง"
                            dataIndex="weight"
                            key="weight"
                            sorter={(a, b) => sorterNumerWithNull(a, b, "weight")}
                        />
                        <Column
                            title="นน. สุทธิ"
                            dataIndex="net_weight"
                            key="net_weight"
                            sorter={(a, b) => sorterNumerWithNull(a, b, "net_weight")}
                        />
                        <Column
                            title="ผู้ตรวจ"
                            dataIndex="weighing_by"
                            key="weighing_by"
                            sorter={(a, b) => sorterStringWithNull(a, b, "weighing_by")}
                        />
                    </Table>

                    <Loading open={loadings} />
                    <Alerts />
                </div>
            </div>
        </ProtectedRoute>
    );
}
