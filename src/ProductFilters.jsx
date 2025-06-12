import React from 'react';
import { Row, Col, Input, Select, Button, Tooltip, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function ProductFilters({
  search,
  setSearch,
  priceFilter,
  setPriceFilter,
  pointsFilter,
  setPointsFilter,
  extraFilter,
  setExtraFilter,
  uniqueExtras,
  resetFilters,
  handleExportCSV
}) {
  return (
    <Row gutter={[16, 16]} align="middle" style={{ margin: 0 }}>
      <Col xs={24} sm={12} md={8}>
        <Input
          placeholder="🔍 Search products or extras..."
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ borderRadius: '8px', fontSize: '15px', height: '40px' }}
          allowClear
        />
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Select
          value={priceFilter}
          onChange={setPriceFilter}
          style={{ width: '100%', height: '40px' }}
          placeholder="Filter by Price"
        >
          <Option value="all">All Prices</Option>
          <Option value="low">Under ₹500</Option>
          <Option value="medium">₹500 - ₹1500</Option>
          <Option value="high">Above ₹1500</Option>
        </Select>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Select
          value={pointsFilter}
          onChange={setPointsFilter}
          style={{ width: '100%', height: '40px' }}
          placeholder="Filter by Points"
        >
          <Option value="all">All Points</Option>
          <Option value="low">Under 50 pts</Option>
          <Option value="medium">50 - 150 pts</Option>
          <Option value="high">Above 150 pts</Option>
        </Select>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Select
          value={extraFilter}
          onChange={setExtraFilter}
          style={{ width: '100%', height: '40px' }}
          placeholder="Filter by Extra"
        >
          <Option value="all">All Extras</Option>
          <Option value="none">No Extras</Option>
          {uniqueExtras.map(extra => (
            <Option key={extra} value={extra}>{extra}</Option>
          ))}
        </Select>
      </Col>
      <Col xs={12} sm={6} md={4}>
        <Space>
          <Tooltip title="Reset all filters">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={resetFilters}
              style={{ height: '40px' }}
            >
              Reset
            </Button>
          </Tooltip>
          <Tooltip title="Export filtered data">
            <Button 
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportCSV}
              style={{ 
                height: '40px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none'
              }}
            >
              Export
            </Button>
          </Tooltip>
        </Space>
      </Col>
    </Row>
  );
}
