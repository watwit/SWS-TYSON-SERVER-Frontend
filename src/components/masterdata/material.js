import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Loading from "@/components/loading";
import { useAlert } from "@/contexts/alertContext";
import Alerts from "@/components/modal/alertcompenent";
import Button from "@mui/material/Button";
import { Table } from "antd/lib";
import { sorterStringWithNull, sorterNumerWithNull } from "@/utils/sorter";
import { TbFileExport } from "react-icons/tb";
import { RiFileExcel2Line } from "react-icons/ri";
import ImportMasterData from "../modal/importmasterdata";

const { Column } = Table;

export default function Material() {
  const { addAlert } = useAlert();
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [loadings, setLoadings] = useState(true);
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

  const handleDownloadtemplate = async () => {
    try {
      setLoadings(true);

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/masterdata/template`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'masterdata-template.xlsx');
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


  const fetchdata = async () => {
    try {
      setLoadings(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/masterdata`,
        {}
      );
      const { data } = response;
      if (data.data != null) {
        const dataSource = data.data.map((item, index) => ({
          ...item,
          index: index + 1,
        }));
        setData(dataSource);
        console.log(dataSource);
      }
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

  const rowClassName = (record, index) => {
    return index % 2 === 0
      ? "atn-table-row-bottom-border ant-table-row-odd"
      : "atn-table-row-bottom-border ant-table-row-even";
  };

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
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
        rowClassName={rowClassName}
        rootClassName="maintain"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 950 }}
      >
        <Column title="No." dataIndex="index" key="index" />

        <Column
          title="รหัสสินค้า"
          dataIndex="product_code"
          key="product_code"
          sorter={(a, b) => sorterStringWithNull(a, b, "product_code")}
          filteredValue={[searchText]}
          onFilter={(value, record) => {
            return (
              String(record.product_code).toLocaleLowerCase().includes(value) ||
              String(record.product_name).toLocaleLowerCase().includes(value) ||
              String(record.min).toLocaleLowerCase().includes(value) ||
              String(record.max).toLocaleLowerCase().includes(value) ||
              String(record.ulx_label).toLocaleLowerCase().includes(value) ||
              String(record.upper_threshold).toLocaleLowerCase().includes(value) ||
              String(record.unit).toLocaleLowerCase().includes(value)
            );
          }}
        />
        <Column
          title="ชื่อสินค้า"
          dataIndex="product_name"
          key="product_name"
          sorter={(a, b) => sorterStringWithNull(a, b, "product_name")}
        />
        <Column
          title="ประเภท"
          dataIndex="category"
          key="category"
          sorter={(a, b) => sorterStringWithNull(a, b, "category")}
        />
        <Column
          title='กว้าง (")'
          dataIndex="width_inch"
          key="width_inch"
          sorter={(a, b) => sorterNumerWithNull(a, b, "width_inch")}
        />
        <Column
          title="หนา (mm)"
          dataIndex="thickness_mm"
          key="thickness_mm"
          sorter={(a, b) => sorterNumerWithNull(a, b, "thickness_mm")}
        />
        <Column
          title="ประเภทม้วน"
          dataIndex="roll_type"
          key="roll_type"
          sorter={(a, b) => sorterStringWithNull(a, b, "roll_type")}
        />
        <Column
          title="น้ำหนักแกน"
          dataIndex="core_weight"
          key="core_weight"
          sorter={(a, b) => sorterNumerWithNull(a, b, "core_weight")}
        />
        <Column
          title="ประเภทม้วน"
          dataIndex="unit"
          key="unit"
          sorter={(a, b) => sorterStringWithNull(a, b, "unit")}
        />
        <Column
          title="ลักษณะสินค้า"
          dataIndex="product_feature"
          key="product_feature"
          sorter={(a, b) => sorterStringWithNull(a, b, "product_feature")}
        />
        <Column
          title="การคิดต้นทุน"
          dataIndex="costing_method"
          key="costing_method"
          sorter={(a, b) => sorterStringWithNull(a, b, "costing_method")}
        />
      </Table>

      <ImportMasterData
        open={openImportData}
        handleClose={handleCloseOpenImportData}
      />

      <Loading open={loadings} />
      <Alerts />

    </div>
  );
}
