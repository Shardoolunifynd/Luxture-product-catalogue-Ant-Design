import React from 'react';
import { Table, Tag, Button, Tooltip, Image, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function ProductTable({
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
  onView,
}) {
  // Define columns here to ensure they always match the data
  const columns = [
    {
      title: (
        <div className="flex items-center justify-center gap-2">
          <Text strong style={{ color: '#1e3a8a', fontSize: '16px' }}>Serial No</Text>
        </div>
      ),
      dataIndex: 'Serial No',
      key: 'serial',
      width: 120,
      align: 'center',
      render: (text) => (
        <Tag color="blue" style={{ fontWeight: 'bold', fontSize: '14px' }}>
          #{text}
        </Tag>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <Text strong style={{ color: '#1e3a8a', fontSize: '16px' }}>Product Name</Text>
        </div>
      ),
      dataIndex: 'Product Name',
      key: 'name',
      render: (text, record) => (
        <div className="flex flex-col gap-1">
          <Text strong style={{ fontSize: '15px', color: '#1f2937' }}>{text}</Text>
          {record.Extra && (
            <div>
              {record.Extra.split(',').map((e, i) => (
                <Tag key={i} color="geekblue" style={{ fontSize: '11px', margin: '2px' }}>
                  {e.trim()}
                </Tag>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      title: (
        <Text strong style={{ color: '#1e3a8a', fontSize: '16px' }}>Image</Text>
      ),
      dataIndex: 'Image URL',
      key: 'image',
      width: 100,
      align: 'center',
      render: (url, record) => (
        <div className="flex justify-center">
          <Image
            src={url}
            alt={record['Product Name']}
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '2px solid #e5e7eb',
              transition: 'all 0.3s ease',
            }}
            preview={false}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center gap-2">
          <Text strong style={{ color: '#1e3a8a', fontSize: '16px' }}>Price</Text>
        </div>
      ),
      dataIndex: 'Price',
      key: 'price',
      render: price => (
        <Tag color="green" style={{ fontSize: '14px', fontWeight: 'bold', padding: '4px 8px' }}>
          ₹{price?.toLocaleString('en-IN')}
        </Tag>
      ),
      align: 'center',
    },
    {
      title: (
        <div className="flex items-center justify-center gap-2">
          <Text strong style={{ color: '#1e3a8a', fontSize: '16px' }}>Points</Text>
        </div>
      ),
      dataIndex: 'Points',
      key: 'points',
      align: 'center',
      render: points => (
        <Tag color="purple" style={{ fontSize: '14px', fontWeight: 'bold', padding: '4px 8px' }}>
          {points} pts
        </Tag>
      ),
    },
    {
      title: (
        <Text strong style={{ color: '#1e3a8a', fontSize: '16px' }}>Actions</Text>
      ),
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button 
            type="primary"
            icon={<EyeOutlined />} 
            size="small" 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '6px'
            }}
            onClick={e => { 
              e.stopPropagation(); 
              if (onView) onView(record);
            }}
          >
            View
          </Button>
        </Tooltip>
      ),
    },
  ];

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
