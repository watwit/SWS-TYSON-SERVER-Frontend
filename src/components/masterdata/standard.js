import React, { useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import { Space, Table } from "antd/lib";
import Loading from "@/components/loading";
import { useAlert } from "@/contexts/alertContext";
import Alerts from "@/components/modal/alertcompenent";
import Button from "@mui/material/Button";
import { TbFileExport } from "react-icons/tb";
import { RiFileExcel2Line } from "react-icons/ri";
import { sorterStringWithNull, sorterNumerWithNull } from "@/utils/sorter";
import useAxiosAuth from "@/utils/useAxiosAuth";
import ImportMasterData from "../modal/importmasterdata";
import { MdOutlineModeEdit, MdOutlineDelete } from "react-icons/md";
import CRUDMasterData from "../modal/crudmasterdata";

const { Column } = Table;

export default function Standard() {
  const { addAlert } = useAlert();
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [loadings, setLoadings] = useState(true);
  const axiosAuth = useAxiosAuth();

  const [openEditMasterData, setOpenEditMasterData] = useState(false);
  const [openDeleteMasterData, setOpenDeleteMasterData] = useState(false);
  const [selectMasterData, setSelectMasterData] = useState(null);
  const [openImportData, setOpenImportData] = useState(false);

  const handleClickOpenEditMasterData = (masterData) => {
    setSelectMasterData(masterData);
    setOpenEditMasterData(true);
  };

  const handleCloseEditMasterData = (updateMasterData) => {
    if (updateMasterData) {
      const updatedData = data.map((masterData) => {
        if (masterData.id === updateMasterData.id) {
          return updateMasterData;
        }
        return masterData;
      });
      setData(updatedData);
    }
    setOpenEditMasterData(false);
  };

  const handleClickOpenDeleteMasterData = (masterData) => {
    setSelectMasterData(masterData);
    setOpenDeleteMasterData(true);
  };

  const handleCloseDeleteMasterData = (updateMasterData) => {
    if (updateMasterData) {
      const updatedData = data.filter((masterData) => masterData.id !== updateMasterData.id);
      setData(updatedData);
    }
    setOpenDeleteMasterData(false);
  };

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

      const response = await axiosAuth.get('/api/masterdata/template', {
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

  const handleSuccess = (message) => {
    addAlert({
      id: new Date().getTime(),
      severity: "success",
      message: message,
    });
  };

  const handleError = useCallback((error) => {
    addAlert({
      id: new Date().getTime(),
      severity: "error",
      message: error.response?.data.message || error.message,
    });
  }, [addAlert]);

  const fetchdata = useCallback(async () => {
    try {
      setLoadings(true);
      const response = await axiosAuth.get("/api/masterdata");
      const { data } = response;
      if (data.data != null) {
        const dataSource = data.data.map((item, index) => ({
          ...item,
          no: index + 1,
        }));
        setData(dataSource);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoadings(false);
    }
  }, [axiosAuth, handleError]);

  useEffect(() => {
    fetchdata();
  }, [fetchdata]);

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
        pagination={{ pageSize: 8 }}
        scroll={{ x: 'max-content' }}
      >
        <Column
          title="No."
          dataIndex="no"
          key="no"
          sorter={(a, b) => sorterNumerWithNull(a, b, "no")}
        />
        <Column
          title="Material code"
          dataIndex="material_code"
          key="material_code"
          sorter={(a, b) => sorterStringWithNull(a, b, "material_code")}
          filteredValue={[searchText]}
          onFilter={(value, record) => {
            return (
              String(record.material_code).toLocaleLowerCase().includes(value) ||
              String(record.material_description).toLocaleLowerCase().includes(value) ||
              String(record.std_pack_size_kg_bag).toLocaleLowerCase().includes(value) ||
              String(record.std_pack_size_bag_carton).toLocaleLowerCase().includes(value) ||
              String(record.std_pack_size_kg_carton).toLocaleLowerCase().includes(value) ||
              String(record.standard_weight).toLocaleLowerCase().includes(value) ||
              String(record.max_weight).toLocaleLowerCase().includes(value) ||
              String(record.min_weight).toLocaleLowerCase().includes(value) ||
              String(record.pack_bag).toLocaleLowerCase().includes(value) ||
              String(record.give_away).toLocaleLowerCase().includes(value)
            );
          }}
        />
        <Column
          title="Material description"
          dataIndex="material_description"
          key="material_description"
          sorter={(a, b) => sorterStringWithNull(a, b, "material_description")}
        />
        <Column
          title="STD Pack Size (kg/Bag)"
          dataIndex="std_pack_size_kg_bag"
          key="std_pack_size_kg_bag"
          sorter={(a, b) => sorterNumerWithNull(a, b, "std_pack_size_kg_bag")}
        />
        <Column
          title="STD Pack Size (bag/Carton)"
          dataIndex="std_pack_size_bag_carton"
          key="std_pack_size_bag_carton"
          sorter={(a, b) => sorterNumerWithNull(a, b, "std_pack_size_bag_carton")}
        />
        <Column
          title="Pack Size:ctn (kg/carton)"
          dataIndex="std_pack_size_kg_carton"
          key="std_pack_size_kg_carton"
          sorter={(a, b) => sorterNumerWithNull(a, b, "std_pack_size_kg_carton")}
        />
        <Column
          title="น้ำหนักมาตรฐาน"
          dataIndex="standard_weight"
          key="standard_weight"
          sorter={(a, b) => sorterNumerWithNull(a, b, "standard_weight")}
        />
        <Column
          title="น้ำหนักสูงสุด"
          dataIndex="max_weight"
          key="max_weight"
          sorter={(a, b) => sorterNumerWithNull(a, b, "max_weight")}
        />
        <Column
          title="น้ำหนักต่ำสุด"
          dataIndex="min_weight"
          key="min_weight"
          sorter={(a, b) => sorterNumerWithNull(a, b, "min_weight")}
        />
        <Column
          title="Pack / Bag"
          dataIndex="pack_bag"
          key="pack_bag"
          sorter={(a, b) => sorterNumerWithNull(a, b, "pack_bag")}
        />
        <Column
          title="Grive away (%)"
          dataIndex="give_away"
          key="give_away"
          sorter={(a, b) => sorterNumerWithNull(a, b, "give_away")}
        />
        <Column
          title="Action"
          key="action"
          fixed="right"
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
                onClick={() => handleClickOpenEditMasterData(record)}
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
                onClick={() => handleClickOpenDeleteMasterData(record)}
              >
                <MdOutlineDelete size={20} />
              </Button>
            </Space>
          )}
        />
      </Table>

      <ImportMasterData
        open={openImportData}
        handleClose={handleCloseOpenImportData}
      />

      <CRUDMasterData
        open={openEditMasterData}
        handleClose={handleCloseEditMasterData}
        mode={"Edit Master data"}
        selectMasterData={selectMasterData}
      />
      <CRUDMasterData
        open={openDeleteMasterData}
        handleClose={handleCloseDeleteMasterData}
        mode={"Delete Master data"}
        selectMasterData={selectMasterData}
      />

      <Loading open={loadings} />
      <Alerts />
    </div>
  );
}
