import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Alert, Spinner, Badge } from 'react-bootstrap';
import { apiService } from '../services/api';
import DataVisualization from './DataVisualization';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);

  // Load initial data
  useEffect(() => {
    console.log('=== DASHBOARD COMPONENT MOUNTED ===');
    checkHealth();
    loadDashboardData();
    loadRecentSales();
  }, []);

  const checkHealth = async () => {
    console.log('Checking system health...');
    try {
      const health = await apiService.checkHealth();
      setHealthStatus(health);
      console.log('Health status updated:', health);
    } catch (error) {
      console.error('Health check failed:', error);
      setError('Failed to check system health');
    }
  };

  const loadDashboardData = async () => {
    console.log('Loading dashboard data...');
    setLoading(true);
    try {
      const data = await apiService.getDashboardSummary();
      setDashboardData(data);
      console.log('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data');
    }
    setLoading(false);
  };

  const loadRecentSales = async () => {
    console.log('Loading recent sales...');
    try {
      const sales = await apiService.getRecentSales(5);
      setRecentSales(sales);
      console.log('Recent sales loaded successfully');
    } catch (error) {
      console.error('Failed to load recent sales:', error);
    }
  };

  const handleCreateSampleData = async () => {
    console.log('Creating sample data...');
    setLoading(true);
    try {
      await apiService.createSampleData();
      console.log('Sample data created, reloading dashboard...');
      // Reload data after creating sample data
      await loadDashboardData();
      await loadRecentSales();
      setError(null);
    } catch (error) {
      console.error('Failed to create sample data:', error);
      setError('Failed to create sample data');
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    console.log(`Searching for: "${searchQuery}"`);
    setLoading(true);
    try {
      const results = await apiService.searchData(searchQuery);
      setSearchResults(results);
      console.log('Search completed successfully');
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed');
    }
    setLoading(false);
  };

  const clearSearch = () => {
    console.log('Clearing search results');
    setSearchQuery('');
    setSearchResults(null);
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <Row className="align-items-center">
            <Col>
              <h1 className="mb-0">📊 Elasticsearch Sales Dashboard</h1>
            </Col>
            <Col xs="auto">
              {healthStatus && (
                <Badge 
                  bg={healthStatus.elasticsearch === 'connected' ? 'success' : 'danger'}
                  className="px-3 py-2"
                >
                  🔗 {healthStatus.elasticsearch === 'connected' ? 'Connected' : 'Disconnected'}
                </Badge>
              )}
            </Col>
          </Row>
        </Card.Header>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
          ❌ {error}
        </Alert>
      )}

      {/* Controls */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col xs={12} md={6} lg={4}>
              <Button 
                variant="primary" 
                onClick={handleCreateSampleData} 
                disabled={loading}
                className="w-100"
                size="lg"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating...
                  </>
                ) : (
                  <>🔄 Create Sample Data</>
                )}
              </Button>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Button 
                variant="secondary" 
                onClick={loadDashboardData} 
                disabled={loading}
                className="w-100"
                size="lg"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading...
                  </>
                ) : (
                  <>🔄 Refresh Data</>
                )}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Search Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-end">
              <Col xs={12} md={8}>
                <Form.Label>Search Products or Regions</Form.Label>
                <Form.Control
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products or regions..."
                  size="lg"
                />
              </Col>
              <Col xs={12} md={4}>
                <div className="d-grid gap-2 d-md-flex">
                  <Button 
                    type="submit" 
                    variant="success" 
                    disabled={loading}
                    size="lg"
                    className="flex-fill"
                  >
                    🔍 Search
                  </Button>
                  {searchResults && (
                    <Button 
                      type="button" 
                      variant="outline-danger" 
                      onClick={clearSearch}
                      size="lg"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">🔍 Search Results ({searchResults.total} found)</h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              {searchResults.results.map((item, index) => (
                <Col xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body>
                      <Card.Title className="text-primary">{item.product}</Card.Title>
                      <Card.Text>
                        <Badge bg="secondary" className="me-2">{item.region}</Badge>
                        <br />
                        <strong className="text-success">${item.sales_amount}</strong>
                        <br />
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Data Visualization */}
      {dashboardData && !loading && (
        <DataVisualization data={dashboardData} />
      )}

      {/* Recent Sales */}
      {recentSales.length > 0 && (
        <Card className="mb-4 shadow-sm">
          <Card.Header className="bg-secondary text-white">
            <h5 className="mb-0">📈 Recent Sales</h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Product</th>
                    <th>Region</th>
                    <th>Amount</th>
                    <th>Quantity</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale, index) => (
                    <tr key={index}>
                      <td><Badge bg="primary">{sale.product}</Badge></td>
                      <td><Badge bg="info">{sale.region}</Badge></td>
                      <td><strong className="text-success">${sale.sales_amount}</strong></td>
                      <td>{sale.quantity}</td>
                      <td>{new Date(sale.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Loading...</p>
        </div>
      )}
    </Container>
  );
};

export default Dashboard;