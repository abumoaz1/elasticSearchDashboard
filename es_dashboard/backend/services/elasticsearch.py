from elasticsearch import Elasticsearch
from config import Config
import json
from datetime import datetime, timedelta
import random

class ElasticsearchService:
    def __init__(self):
        print("=== INITIALIZING ELASTICSEARCH SERVICE ===")
        try:
            self.es = Elasticsearch([Config.ELASTICSEARCH_URL])
            print(f"Elasticsearch client initialized with URL: {Config.ELASTICSEARCH_URL}")
        except Exception as e:
            print(f"Failed to initialize Elasticsearch client: {str(e)}")
            raise
        
    def check_connection(self):
        print("Checking Elasticsearch connection...")
        try:
            ping_result = self.es.ping()
            print(f"Elasticsearch ping result: {ping_result}")
            return ping_result
        except Exception as e:
            print(f"Elasticsearch connection error: {e}")
            return False
    
    def create_sample_data(self):
        """Create sample data for dashboard"""
        print("=== CREATING SAMPLE DATA ===")
        index_name = "sales_data"
        
        try:
            # Delete index if exists
            if self.es.indices.exists(index=index_name):
                print(f"Index '{index_name}' exists, deleting...")
                self.es.indices.delete(index=index_name)
                print(f"Index '{index_name}' deleted successfully")
            
            # Create index
            print(f"Creating new index '{index_name}'...")
            self.es.indices.create(index=index_name)
            print(f"Index '{index_name}' created successfully")
            
            # Sample data
            products = ["Laptop", "Phone", "Tablet", "Headphones", "Camera"]
            regions = ["North", "South", "East", "West"]
            print(f"Sample products: {products}")
            print(f"Sample regions: {regions}")
            
            print("Generating and inserting 100 sample documents...")
            for i in range(100):
                doc = {
                    "product": random.choice(products),
                    "region": random.choice(regions),
                    "sales_amount": random.randint(100, 5000),
                    "quantity": random.randint(1, 50),
                    "timestamp": (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat()
                }
                
                self.es.index(index=index_name, body=doc)
                
                # Print progress every 20 documents
                if (i + 1) % 20 == 0:
                    print(f"Inserted {i + 1}/100 documents")
            
            # Refresh index
            print("Refreshing index to make documents searchable...")
            self.es.indices.refresh(index=index_name)
            print("Sample data creation completed successfully")
            
            return {"message": "Sample data created successfully"}
        
        except Exception as e:
            print(f"Sample data creation failed: {str(e)}")
            raise
    
    def get_sales_summary(self):
        """Get sales summary for dashboard"""
        print("=== FETCHING SALES SUMMARY ===")
        query = {
            "size": 0,
            "aggs": {
                "total_sales": {"sum": {"field": "sales_amount"}},
                "total_quantity": {"sum": {"field": "quantity"}},
                "avg_sale": {"avg": {"field": "sales_amount"}},
                "product_sales": {
                    "terms": {"field": "product.keyword"},
                    "aggs": {"total": {"sum": {"field": "sales_amount"}}}
                },
                "region_sales": {
                    "terms": {"field": "region.keyword"},
                    "aggs": {"total": {"sum": {"field": "sales_amount"}}}
                }
            }
        }
        
        try:
            print("Executing aggregation query...")
            print(f"Aggregation query: {query}")
            
            response = self.es.search(index="sales_data", body=query)
            print("Aggregation query executed successfully")
            
            result = {
                "total_sales": response['aggregations']['total_sales']['value'],
                "total_quantity": response['aggregations']['total_quantity']['value'],
                "avg_sale": response['aggregations']['avg_sale']['value'],
                "product_breakdown": [
                    {"product": bucket['key'], "sales": bucket['total']['value']}
                    for bucket in response['aggregations']['product_sales']['buckets']
                ],
                "region_breakdown": [
                    {"region": bucket['key'], "sales": bucket['total']['value']}
                    for bucket in response['aggregations']['region_sales']['buckets']
                ]
            }
            
            print(f"Sales summary processed - Total Sales: ${result['total_sales']}, Total Quantity: {result['total_quantity']}")
            return result
            
        except Exception as e:
            print(f"Sales summary fetch failed: {str(e)}")
            return {"error": str(e)}
    
    def get_recent_sales(self, limit=10):
        """Get recent sales data"""
        print(f"=== FETCHING {limit} RECENT SALES ===")
        query = {
            "size": limit,
            "sort": [{"timestamp": {"order": "desc"}}]
        }
        
        try:
            print(f"Executing query to fetch {limit} most recent sales...")
            print(f"Recent sales query: {query}")
            
            response = self.es.search(index="sales_data", body=query)
            results = [hit['_source'] for hit in response['hits']['hits']]
            
            print(f"Successfully retrieved {len(results)} recent sales records")
            return results
            
        except Exception as e:
            print(f"Recent sales fetch failed: {str(e)}")
            return {"error": str(e)}