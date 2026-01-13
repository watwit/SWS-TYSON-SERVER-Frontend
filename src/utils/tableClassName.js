export const getStatusClassName = (status) => {
  const STATUS_CLASS_MAP = {
    Available: "status-available",
    Incomplete: "status-inprocess",
    Finished: "status-finished",
  };

  return STATUS_CLASS_MAP[status] || "";
};

export const getRowClassName = (_, index) => {
  return index % 2 === 0
    ? "atn-table-row-bottom-border ant-table-row-odd"
    : "atn-table-row-bottom-border ant-table-row-even";
};