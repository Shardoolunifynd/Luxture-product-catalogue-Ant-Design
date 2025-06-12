import React from 'react';
import { Table, Tag, Button, Tooltip, Image, Typography } from 'antd';
import { EyeOutlined, SortAscendingOutlined, SortDescendingOutlined, SearchOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function ProductTable({
  columns,
  data,
  loading,
  page,
  pageSize,
  setPage,
  setPageSize,
  rowKey,
  onRow,
  rowClassName,
  pagination,
}) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={rowKey}
      pagination={pagination}
      onRow={onRow}
      style={{
        fontSize: '15px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        width: '100%'
      }}
      bordered
      size="middle"
      scroll={{ x: 'max-content' }}
      rowClassName={rowClassName}
    />
  );
}
