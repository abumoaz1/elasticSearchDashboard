from flask import Blueprint, jsonify, request
from services.elasticsearch import ElasticsearchService

api_bp = Blueprint('api', __name__)
es_service = ElasticsearchService()

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    print("=== HEALTH CHECK ENDPOINT CALLED ===")
    try:
        print("Checking Elasticsearch connection...")
        es_status = es_service.check_connection()
        print(f"Elasticsearch connection status: {es_status}")
        
        response = {
            "status": "healthy" if es_status else "unhealthy",
            "elasticsearch": "connected" if es_status else "disconnected"
        }
        print(f"Health check response: {response}")
        return jsonify(response)
    except Exception as e:
        print(f"Health check failed with error: {str(e)}")
        return jsonify({"error": "Health check failed", "details": str(e)}), 500

@api_bp.route('/create-sample-data', methods=['POST'])
def create_sample_data():
    """Create sample data in Elasticsearch"""
    print("=== CREATE SAMPLE DATA ENDPOINT CALLED ===")
    try:
        print("Starting sample data creation process...")
        result = es_service.create_sample_data()
        print(f"Sample data creation result: {result}")
        return jsonify(result), 201
    except Exception as e:
        print(f"Sample data creation failed: {str(e)}")
        return jsonify({"error": "Failed to create sample data", "details": str(e)}), 500

@api_bp.route('/dashboard/summary', methods=['GET'])
def get_dashboard_summary():
    """Get dashboard summary data"""
    print("=== DASHBOARD SUMMARY ENDPOINT CALLED ===")
    try:
        print("Fetching dashboard summary data...")
        data = es_service.get_sales_summary()
        print(f"Dashboard summary data retrieved successfully")
        print(f"Summary data keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
        return jsonify(data), 200
    except Exception as e:
        print(f"Dashboard summary fetch failed: {str(e)}")
        return jsonify({"error": "Failed to fetch dashboard summary", "details": str(e)}), 500

@api_bp.route('/sales/recent', methods=['GET'])
def get_recent_sales():
    """Get recent sales data"""
    limit = request.args.get('limit', 10, type=int)
    print(f"=== RECENT SALES ENDPOINT CALLED (limit: {limit}) ===")
    try:
        print(f"Fetching {limit} recent sales records...")
        data = es_service.get_recent_sales(limit)
        print(f"Retrieved {len(data) if isinstance(data, list) else 'unknown'} recent sales records")
        return jsonify(data), 200
    except Exception as e:
        print(f"Recent sales fetch failed: {str(e)}")
        return jsonify({"error": "Failed to fetch recent sales", "details": str(e)}), 500

@api_bp.route('/search', methods=['POST'])
def search_data():
    """Search data in Elasticsearch"""
    print("=== SEARCH ENDPOINT CALLED ===")
    try:
        search_query = request.json.get('query', '') if request.json else ''
        print(f"Search query received: '{search_query}'")
        
        if not search_query:
            print("Empty search query provided")
            return jsonify({"error": "Query parameter required"}), 400
        
        query = {
            "query": {
                "multi_match": {
                    "query": search_query,
                    "fields": ["product", "region"]
                }
            }
        }
        print(f"Elasticsearch query constructed: {query}")
        
        print("Executing search query...")
        response = es_service.es.search(index="sales_data", body=query)
        results = [hit['_source'] for hit in response['hits']['hits']]
        
        result_data = {
            "total": response['hits']['total']['value'],
            "results": results
        }
        print(f"Search completed. Found {result_data['total']} results")
        
        return jsonify(result_data), 200
        
    except Exception as e:
        print(f"Search operation failed: {str(e)}")
        return jsonify({"error": "Search failed", "details": str(e)}), 500