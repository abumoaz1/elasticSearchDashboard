import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DataVisualization = ({ data }) => {
  console.log('=== RENDERING DATA VISUALIZATION ===');
  console.log('Visualization data:', data);

  if (!data) {
    console.log('No data provided for visualization');
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body className="text-center">
          <p className="text-muted">No data available</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      {/* Summary Cards */}
      <Row className="mb-4 g-4">
        <Col xs={12} md={4}>
          <Card 
            className="text-white shadow-lg" 
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            <Card.Body className="text-center p-4">
              <Card.Title 
                className="mb-3"
                style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600',
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                💰 Total Sales
              </Card.Title>
              <h2 
                className="mb-0"
                style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                ${data.total_sales?.toLocaleString() || '0'}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4}>
          <Card 
            className="text-white shadow-lg" 
            style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none'
            }}
          >
            <Card.Body className="text-center p-4">
              <Card.Title 
                className="mb-3"
                style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600',
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                📦 Total Quantity
              </Card.Title>
              <h2 
                className="mb-0"
                style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {data.total_quantity?.toLocaleString() || '0'}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4}>
          <Card 
            className="text-white shadow-lg" 
            style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none'
            }}
          >
            <Card.Body className="text-center p-4">
              <Card.Title 
                className="mb-3"
                style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600',
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                📊 Average Sale
              </Card.Title>
              <h2 
                className="mb-0"
                style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                ${data.avg_sale?.toFixed(2) || '0.00'}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Debug Card - Temporary to see raw data
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="shadow-sm border-info">
            <Card.Header className="bg-info text-white">
              <h6 className="mb-0">🔍 DEBUG - Raw Data</h6>
            </Card.Header>
            <Card.Body>
              <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>
                <p><strong>Total Sales:</strong> {data.total_sales} (Type: {typeof data.total_sales})</p>
                <p><strong>Total Quantity:</strong> {data.total_quantity} (Type: {typeof data.total_quantity})</p>
                <p><strong>Average Sale:</strong> {data.avg_sale} (Type: {typeof data.avg_sale})</p>
                <p><strong>Product Breakdown Length:</strong> {data.product_breakdown?.length || 0}</p>
                <p><strong>Region Breakdown Length:</strong> {data.region_breakdown?.length || 0}</p>
                <details>
                  <summary>View Full Data Object</summary>
                  <pre style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </details>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}

      {/* Charts */}
      <Row className="mb-4 g-4">
        <Col xs={12} lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">📊 Sales by Product</h5>
            </Card.Header>
            <Card.Body>
              {data.product_breakdown && data.product_breakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.product_breakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-5">
                  <p>No product data available</p>
                  <small>Product breakdown: {JSON.stringify(data.product_breakdown)}</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">🌍 Sales by Region</h5>
            </Card.Header>
            <Card.Body>
              {data.region_breakdown && data.region_breakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.region_breakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ region, sales }) => `${region}: $${sales.toLocaleString()}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="sales"
                    >
                      {data.region_breakdown?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-5">
                  <p>No region data available</p>
                  <small>Region breakdown: {JSON.stringify(data.region_breakdown)}</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DataVisualization;