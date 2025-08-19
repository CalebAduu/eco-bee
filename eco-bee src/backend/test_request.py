import requests
import json

# Test data that matches what frontend sends
test_data = {
    "quiz_responses": [
        {
            "question_id": "food_today",
            "question_text": "What best describes your main meal today?",
            "answer": "plant-based",
            "category": "food"
        }
    ],
    "items": [],
    "session_id": "test-session-123",
    "user_id": None
}

try:
    response = requests.post(
        "http://localhost:8000/api/intake",
        headers={"Content-Type": "application/json"},
        json=test_data,
        timeout=10
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {response.headers}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 422:
        print("\n❌ Validation Error Details:")
        error_data = response.json()
        for error in error_data.get("detail", []):
            print(f"  - Field: {error.get('loc', 'Unknown')}")
            print(f"    Error: {error.get('msg', 'Unknown error')}")
            print(f"    Value: {error.get('input', 'N/A')}")
    
except requests.exceptions.ConnectionError:
    print("❌ Could not connect to backend. Make sure it's running on http://localhost:8000")
except Exception as e:
    print(f"❌ Error: {e}")
