# Flask Backend Integration Setup

## Running the FakeNews Dashboard with Your Flask Server

### 1. Prerequisites
- Your Flask server running on `http://localhost:5000`
- Flask server configured with CORS to allow frontend requests

### 2. Flask Server CORS Configuration
Make sure your Flask server has CORS enabled. Add this to your Flask app:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
```

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Expected Flask Endpoints

Your Flask server should provide these endpoints:

- `GET /get_posts` - Returns list of news posts
- `GET /get_trends` - Returns dataset trends and platform/region stats
- `GET /get_ai_trends` - Returns AI prediction counts
- `GET /get_filters` - Returns available filters (languages, platforms, regions)

### 5. Running Locally

1. **Start your Flask server:**
   ```bash
   python your_flask_app.py
   ```

2. **Install dependencies and run the frontend:**
   ```bash
   npm install
   npm run dev
   ```

3. **Access the dashboard:**
   Open `http://localhost:8080` in your browser

### 6. Troubleshooting

**If you see "Demo Mode Active":**
- Check browser console for API connection errors
- Verify Flask server is running on port 5000
- Ensure CORS is properly configured in Flask
- Check that all required endpoints are implemented

**Common Issues:**
- **CORS errors**: Add `flask-cors` to your Flask app
- **Connection refused**: Verify Flask server is running
- **404 errors**: Check endpoint URLs match exactly
- **Timeout errors**: Increase timeout in `client/lib/api.ts`

### 7. Example Flask Response Formats

The dashboard expects these response formats:

**GET /get_posts:**
```json
[
  {
    "title": "News title",
    "body": "News content...",
    "platform": "Twitter",
    "date": "2022-07-09",
    "label": false,
    "ai_prediction": "REAL",
    "region": "National",
    "image": "https://example.com/image.jpg"
  }
]
```

**GET /get_trends:**
```json
{
  "dataset_labels": {
    "false": 10319,
    "true": 15913
  },
  "platforms": {
    "Twitter": 21879,
    "Facebook": 625
  },
  "regions": {
    "National": 5000,
    "International": 3000
  }
}
```

**GET /get_ai_trends:**
```json
{
  "ai_prediction_counts": {
    "FAKE": 4655,
    "REAL": 21577
  }
}
```

**GET /get_filters:**
```json
{
  "languages": ["English", "Hindi", "Bengali"],
  "platforms": ["Twitter", "Facebook"],
  "regions": ["National", "International"]
}
```
