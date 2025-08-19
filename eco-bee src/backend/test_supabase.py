#!/usr/bin/env python3
"""
Test script to verify Supabase connection and quiz results saving
Run this from the backend directory after setting up your .env file
"""

import os
import sys
import json
from datetime import datetime
import uuid

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

def test_supabase_connection():
    """Test the Supabase connection and table operations"""
    
    # Check if environment variables are set
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ SUPABASE_URL or SUPABASE_KEY not found in .env file")
        print("Please add these to your backend/.env file:")
        print("SUPABASE_URL=https://your-project.supabase.co")
        print("SUPABASE_KEY=your-service-role-key")
        return False
    
    print(f"✅ Found Supabase URL: {supabase_url}")
    print(f"✅ Found Supabase Key: {supabase_key[:20]}...")
    
    try:
        from supabase import create_client
        client = create_client(supabase_url, supabase_key)
        print("✅ Supabase client created successfully")
    except ImportError:
        print("❌ Supabase library not installed. Run: pip install supabase")
        return False
    except Exception as e:
        print(f"❌ Failed to create Supabase client: {e}")
        return False
    
    # Test database connection with a simple query
    try:
        # Try to query the quiz_results table
        response = client.table('quiz_results').select('id').limit(1).execute()
        print("✅ Successfully connected to quiz_results table")
        print(f"📊 Current records in table: {len(response.data) if response.data else 0}")
    except Exception as e:
        print(f"❌ Failed to query quiz_results table: {e}")
        print("💡 Make sure you've run the SQL schema in your Supabase SQL editor")
        return False
    
    # Test inserting a sample record
    try:
        sample_record = {
            "id": str(uuid.uuid4()),
            "dummy_user_id": "test_user_001",
            "session_id": f"test_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.utcnow().isoformat(),
            "quiz_responses": [
                {
                    "question_id": "q1",
                    "question_text": "What type of transport do you use most?",
                    "answer": "public_transport",
                    "category": "transportation"
                }
            ],
            "scoring_result": {
                "composite": 75.5,
                "grade": "B+",
                "per_boundary_averages": {
                    "climate": 70.0,
                    "biosphere": 80.0,
                    "biogeochemical": 75.0,
                    "freshwater": 78.0,
                    "aerosols": 72.0
                }
            },
            "user_metadata": {
                "test_record": True,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        response = client.table('quiz_results').insert(sample_record).execute()
        
        if response.data:
            print("✅ Successfully inserted test record")
            print(f"📋 Inserted record ID: {response.data[0]['id']}")
            
            # Clean up the test record
            client.table('quiz_results').delete().eq('id', response.data[0]['id']).execute()
            print("🧹 Test record cleaned up")
        else:
            print("⚠️ Insert returned no data")
            
    except Exception as e:
        print(f"❌ Failed to insert test record: {e}")
        return False
    
    print("\n🎉 All tests passed! Supabase is ready for quiz results.")
    return True

def test_api_endpoint():
    """Test the /api/save-results endpoint"""
    try:
        import requests
        
        # Sample payload similar to what the frontend will send
        test_payload = {
            "quiz_responses": [
                {
                    "question_id": "transport",
                    "question_text": "How do you usually travel to campus?",
                    "answer": "bicycle",
                    "category": "transportation"
                },
                {
                    "question_id": "food",
                    "question_text": "What describes your diet?",
                    "answer": "mostly_vegetarian",
                    "category": "nutrition"
                }
            ],
            "scoring_result": {
                "composite": 82.5,
                "grade": "A-",
                "per_boundary_averages": {
                    "climate": 85.0,
                    "biosphere": 88.0,
                    "biogeochemical": 80.0,
                    "freshwater": 82.0,
                    "aerosols": 77.0
                },
                "recommendations": [
                    {
                        "action": "Switch to renewable energy",
                        "impact": "Reduce climate impact by 15%",
                        "boundary": "climate"
                    }
                ]
            },
            "user_metadata": {
                "test_api_call": True,
                "timestamp": datetime.utcnow().isoformat()
            },
            "session_id": f"api_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
        
        print("\n🧪 Testing API endpoint...")
        
        # Assuming the FastAPI server is running on localhost:8000
        response = requests.post(
            'http://localhost:8000/api/save-results',
            json=test_payload,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API endpoint test successful")
            print(f"📋 API Response: {json.dumps(result, indent=2)}")
        else:
            print(f"❌ API endpoint test failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server")
        print("💡 Make sure your FastAPI server is running: uvicorn app:app --reload")
    except Exception as e:
        print(f"❌ API test failed: {e}")

if __name__ == "__main__":
    print("🔬 EcoBee Supabase Setup Test")
    print("=" * 40)
    
    # Test database connection
    db_success = test_supabase_connection()
    
    if db_success:
        # Test API endpoint
        test_api_endpoint()
    
    print("\n" + "=" * 40)
    print("Test complete!")
