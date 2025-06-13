import React, { useEffect, useState, useRef } from 'react';
import { 
  Spin, 
  Card, 
  Row, 
  Col, 
  Typography,
  Pagination
} from 'antd';
import 'antd/dist/reset.css';
import './index.css';
import ProductTable from './ProductTable';
import ProductFilters from './ProductFilters';
import ProductModal from './ProductModal';
import { csvEscape } from './utils';

const { Title, Text } = Typography;

const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbz-Y7Sp-YdEuDyd9EB_2x3G9zdXeV1ibcikT-sWomciRnYniY_L6-KSTdhmDK3lwC0/exec";

export default function App() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ visible: false, product: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [priceFilter, setPriceFilter] = useState('all');
  const [pointsFilter, setPointsFilter] = useState('all');
  const [extraFilter, setExtraFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const searchInput = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch(SHEET_API_URL)
      .then(res => res.json())
      .then(data => {
        // Normalize keys for each product
        const normalizeProduct = (p) => ({
          'Serial No': p['Serial No']?.toString().trim() || p['Serial No'] || p['serial no'] || '',
          'Product Name': p['Product Name']?.toString().trim() || p['Product Name'] || p['product name'] || '',
          'Image URL': p['Image URL']?.toString().trim() || p['Image URL'] || p['image url'] || '',
          'Price': p['Price'],
          'Points': p['Points'],
          'Extra': p['Extra'],
        });
        const normalized = data.map(normalizeProduct);
        setProducts(normalized);
        setFiltered(normalized);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    let result = products;
    if (search) {
      result = result.filter(p => 
        p['Product Name']?.toLowerCase().includes(search.toLowerCase()) ||
        p['Extra']?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (priceFilter !== 'all') {
      result = result.filter(p => {
        const price = p['Price'] || 0;
        switch (priceFilter) {
          case 'low': return price < 500;
          case 'medium': return price >= 500 && price < 1500;
          case 'high': return price >= 1500;
          default: return true;
        }
      });
    }
    if (pointsFilter !== 'all') {
      result = result.filter(p => {
        const points = p['Points'] || 0;
        switch (pointsFilter) {
          case 'low': return points < 50;
          case 'medium': return points >= 50 && points < 150;
          case 'high': return points >= 150;
          default: return true;
        }
      });
    }
    if (extraFilter !== 'all') {
      result = result.filter(p => {
        if (extraFilter === 'none') return !p['Extra'];
        return p['Extra']?.toLowerCase().includes(extraFilter.toLowerCase());
      });
    }
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const comparison = aVal.toString().localeCompare(bVal.toString());
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }
    setFiltered(result);
    setPage(1);
  }, [search, products, priceFilter, pointsFilter, extraFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExportCSV = () => {
    let csv = 'Serial No,Product Name,Image URL,Price,Points,Extra\n';
    filtered.forEach(p => {
      csv += [
        p['Serial No'], 
        csvEscape(p['Product Name']), 
        p['Image URL'], 
        p['Price'], 
        p['Points'], 
        csvEscape(p['Extra'] || '')
      ].join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch('');
    setPriceFilter('all');
    setPointsFilter('all');
    setExtraFilter('all');
    setSortConfig({ key: null, direction: null });
  };

  const uniqueExtras = [...new Set(products.flatMap(p => 
    p.Extra ? p.Extra.split(',').map(e => e.trim()) : []
  ))];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '24px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      width: '100vw',
      maxWidth: '100vw',
      boxSizing: 'border-box'
    }}>
      {/* Sticky top bar for title and filters */}
      <div className="sticky-top-bar">
        <Card style={{ margin: 0, borderRadius: '12px', boxShadow: 'none', background: 'transparent' }} bodyStyle={{ padding: 0 }}>
          <Title level={2} style={{ 
            textAlign: 'center', 
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
            fontWeight: 'bold'
          }}>
            🛍️ Product Catalog
          </Title>
          <ProductFilters
            search={search}
            setSearch={setSearch}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            pointsFilter={pointsFilter}
            setPointsFilter={setPointsFilter}
            extraFilter={extraFilter}
            setExtraFilter={setExtraFilter}
            uniqueExtras={uniqueExtras}
            resetFilters={resetFilters}
            handleExportCSV={handleExportCSV}
          />
        </Card>
      </div>

      <Card style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '100%' }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">Total Products</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a' }}>
                {products.length}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">Filtered Results</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                {filtered.length}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">Avg Price</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                ₹{filtered.length ? Math.round(filtered.reduce((sum, p) => sum + (p.Price || 0), 0) / filtered.length) : 0}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">Avg Points</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7c3aed' }}>
                {filtered.length ? Math.round(filtered.reduce((sum, p) => sum + (p.Points || 0), 0) / filtered.length) : 0}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '100%' }}>
        <Spin spinning={loading} tip="Loading products..." size="large">
          <div className="table-responsive">
            <ProductTable
              data={filtered.slice((page - 1) * pageSize, page * pageSize)}
              loading={loading}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              rowKey={r => `${r['Serial No']}-${r['Product Name']}`}
              onRow={record => ({
                onClick: () => setModal({ visible: true, product: record }),
                style: { cursor: 'pointer' }
              })}
              rowClassName={(record, index) =>
                index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
              }
              pagination={false}
            />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
            padding: '16px 0'
          }}>
            <Text type="secondary">
              Showing {Math.min((page - 1) * pageSize + 1, filtered.length)} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} products
            </Text>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={filtered.length}
              onChange={setPage}
              onShowSizeChange={(current, size) => {
                setPageSize(size);
                setPage(1);
              }}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={['5', '10', '20', '50']}
              style={{ marginBottom: 0 }}
            />
          </div>
        </Spin>
      </Card>

      <ProductModal
        visible={modal.visible}
        product={modal.product}
        onClose={() => setModal({ visible: false, product: null })}
      />

      <style jsx>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #ffffff;
        }
        .table-row-light:hover,
        .table-row-dark:hover {
          background-color: #e6f7ff !important;
        }
      `}</style>
    </div>
  );
}
