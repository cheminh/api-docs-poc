---
sidebar_position: 2
---

# Getting Started

Quick guide to start using the TripX Distribution API.

## Authentication

All API requests require authentication using an API key. Include your API key in the `Authorization` header:

### UAT Example

```bash
curl https://tripx-distribution-api.prd.aks.manulife.ca/flights/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Production Example

```bash
curl https://tripx-distribution-api.prod.aks.manulife.ca/flights/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

## Get Your API Key

1. Sign up at [dashboard.tripx.com](https://dashboard.tripx.com)
2. Navigate to **API Keys**
3. Click **Create API Key**
4. Copy your key (starts with `tripx_`)

## Base URLs

### UAT Environment

- **Base URL**: `https://tripx-distribution-api.prd.aks.manulife.ca`
- **Purpose**: Testing and development

### Production Environment

- **Base URL**: `https://tripx-distribution-api.prod.aks.manulife.ca`
- **Purpose**: Live production use

## Making Your First Request

### UAT Example

```bash
curl https://tripx-distribution-api.prd.aks.manulife.ca/flights/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "JFK",
    "destination": "LAX",
    "departureDate": "2025-12-25",
    "passengers": 2
  }'
```

### Production Example

```bash
curl https://tripx-distribution-api.prod.aks.manulife.ca/flights/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "JFK",
    "destination": "LAX",
    "departureDate": "2025-12-25",
    "passengers": 2
  }'
```

## Response Format

All responses are in JSON format:

```json
{
  "flights": [...],
  "totalResults": 25
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Server Error

## Rate Limits

- Free: 100 requests/hour
- Basic: 1,000 requests/hour
- Pro: 10,000 requests/hour

Rate limit info is included in response headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

## Next Steps

Explore the complete [API Reference](/docs/api) for detailed endpoint documentation and interactive examples.
