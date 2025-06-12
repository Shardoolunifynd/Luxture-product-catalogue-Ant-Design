import React from 'react';
import { Modal, Typography, Row, Col, Image, Tag, Space } from 'antd';

const { Title, Text } = Typography;

export default function ProductModal({ visible, product, onClose }) {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      title={
        <Title level={3} style={{ margin: 0, color: '#1e3a8a' }}>
          {product?.['Product Name']}
        </Title>
      }
      width={600}
      style={{ borderRadius: '12px' }}
    >
      {product && (
        <div style={{ padding: '16px 0' }}>
          <Row gutter={24} align="middle">
            <Col xs={24} md={12}>
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={product['Image URL']}
                  alt={product['Product Name']}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">Serial Number:</Text>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    #{product['Serial No']}
                  </div>
                </div>
                <div>
                  <Text type="secondary">Price:</Text>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                    ₹{product['Price']?.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <Text type="secondary">Points:</Text>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#7c3aed' }}>
                    {product['Points']} points
                  </div>
                </div>
                {product['Extra'] && (
                  <div>
                    <Text type="secondary">Extra Features:</Text>
                    <div style={{ marginTop: '8px' }}>
                      {product['Extra'].split(',').map((e, i) => (
                        <Tag key={i} color="geekblue" style={{ 
                          margin: '4px 4px 4px 0',
                          padding: '4px 8px',
                          fontSize: '13px'
                        }}>
                          {e.trim()}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
              </Space>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  );
}
