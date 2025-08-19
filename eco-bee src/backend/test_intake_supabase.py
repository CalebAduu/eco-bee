#!/usr/bin/env python3
"""
Test script to verify that quiz results are being saved to Supabase via the /api/intake endpoint
"""

import requests
import json
import uuid

# Test data matching what the frontend sends
test_quiz_data = {
    "quiz_responses": [
        {
            "question_id": "food_today",
            "question_text": "What best describes your main meal today?",
            "answer": "plant-based",
            "category": "food"
        },
        {
            "question_id": "food_origin", 
            "question_text": "Where did your food come from?",
            "answer": "local",
            "category": "food"
        },
        {
            "question_id": "clothing_today",
            "question_text": "What materials make up most of your outfit today?",
            "answer": "cotton",
            "category": "clothing"
        },
        {
            "question_id": "transport_today",
            "question_text": "How did you get here today?",
            "answer": "bicycle",
            "category": "transport"
        },
        {
            "question_id": "distance_traveled",
            "question_text": "Approximately how far did you travel today (total)?",
            "answer": "5_20km",
            "category": "transport"
        },
        {
            "question_id": "water_usage",
            "question_text": "How would you rate your water consciousness today?",
            "answer": "5",
            "category": "lifestyle"
        },
        {
            "question_id": "waste_reduction",
            "question_text": "Which waste reduction actions did you take today?",
            "answer": ["reusable_bag", "composted"],
            "category": "lifestyle"
        },
        {
            "question_id": "reflection",
            "question_text": "What's one thing you could change to reduce your environmental impact?",
            "answer": "Use public transport more often",
            "category": "reflection"
        }
    ],
    "items": [],
    "session_id": f"test_session_{uuid.uuid4().hex[:8]}",
    "user_id": None
}

def test_intake_endpoint():
    """Test the /api/intake endpoint to ensure it saves to Supabase"""
    url = "http://localhost:8000/api/intake"
    
    print("🧪 Testing /api/intake endpoint with Supabase integration...")
    print(f"📨 Sending test quiz data with session ID: {test_quiz_data['session_id']}")
    
    try:
        response = requests.post(url, json=test_quiz_data)
        
        if response.status_code == 200:
            print("✅ /api/intake request successful!")
            result = response.json()
            
            # Print key results
            if "scoring_result" in result:
                scoring = result["scoring_result"]
                print(f"📊 EcoScore: {scoring.get('composite', 'N/A')}")
                print(f"🎓 Grade: {scoring.get('grade', 'N/A')}")
            
            print("🔍 Check your Supabase Table Editor for the new quiz result record!")
            print("💡 Look for records with user_id = 'anonymous_user_0001'")
            
        else:
            print(f"❌ Request failed with status {response.status_code}")
            print(f"📝 Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing endpoint: {e}")

if __name__ == "__main__":
    test_intake_endpoint()
