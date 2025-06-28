# Inngest + Vercel Setup Guide

## Issues Fixed

1. **Missing Clerk Webhook Endpoint**: Created `/api/webhooks/clerk/route.js` to receive Clerk events
2. **Middleware Interference**: Updated middleware to exclude Inngest and webhook endpoints
3. **Improved Error Handling**: Enhanced Inngest functions with better logging and error handling
4. **Added Test Endpoint**: Created `/api/test-inngest/route.js` for manual testing
5. **Fixed Profile Issue**: Fixed userData initialization in AppContext (was `false`, now `null`)
6. **Added Environment Variables**: Proper Inngest configuration with signing keys

## Required Environment Variables

Copy `env.example` to `.env.local` and fill in your values:

```env
# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Clerk
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Database
MONGODB_URI=your_mongodb_connection_string

# App
NEXT_PUBLIC_CURRENCY=$
```

## Setup Steps

### 1. Inngest Dashboard Setup

1. Go to [Inngest Dashboard](https://cloud.inngest.com/)
2. Create a new app or use existing one
3. Copy the Event Key and Signing Key from your app settings
4. Add these to your environment variables

### 2. Clerk Webhook Setup

1. Go to your Clerk Dashboard
2. Navigate to Webhooks section
3. Create a new webhook endpoint
4. Set the endpoint URL to: `https://your-domain.vercel.app/api/webhooks/clerk`
5. Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
6. Copy the webhook secret and add to environment variables

### 3. Vercel Deployment

1. Push your code to GitHub
2. Deploy to Vercel
3. Add all environment variables in Vercel dashboard
4. Ensure the Inngest endpoint is accessible at: `https://your-domain.vercel.app/api/inngest`

## Testing

### Test Inngest Connection

```bash
# Test the Inngest endpoint
curl https://your-domain.vercel.app/api/inngest

# Test manual event sending
curl -X POST https://your-domain.vercel.app/api/test-inngest \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "clerk/user.created",
    "eventData": {
      "id": "test_user_123",
      "first_name": "Test",
      "last_name": "User",
      "email_addresses": [{"email_address": "test@example.com"}],
      "image_url": "https://example.com/avatar.jpg"
    }
  }'
```

### Test Clerk Webhook

1. Create a test user in Clerk
2. Check Inngest dashboard for function execution
3. Verify user is created in your database

## Troubleshooting

### Common Issues

1. **Functions not executing**: Check Inngest dashboard for errors
2. **Webhook not receiving events**: Verify Clerk webhook URL and secret
3. **Database connection issues**: Check MongoDB connection string
4. **Middleware blocking requests**: Ensure middleware excludes Inngest endpoints
5. **Profile not visible**: Fixed userData initialization issue

### Debug Steps

1. Check Vercel function logs
2. Monitor Inngest dashboard for function runs
3. Test with the manual endpoint first
4. Verify all environment variables are set
5. Check browser console for JavaScript errors

## File Structure

```
app/
├── api/
│   ├── inngest/
│   │   └── route.js          # Inngest serve endpoint
│   ├── webhooks/
│   │   └── clerk/
│   │       └── route.js      # Clerk webhook handler
│   └── test-inngest/
│       └── route.js          # Manual test endpoint
config/
└── inngest.js               # Inngest functions
context/
└── AppContext.jsx           # Fixed userData initialization
middleware.ts                # Updated middleware
env.example                  # Environment variables template
```

## Recent Fixes

### Profile Issue Fix
- **Problem**: `userData` was initialized as `false` instead of `null`
- **Error**: "right-hand side of 'in' should be an object, got boolean"
- **Solution**: Changed `useState(false)` to `useState(null)` in AppContext

### Inngest Configuration
- Added proper environment variable support
- Added signing key for production
- Improved error handling and logging

## Next Steps

1. Copy `env.example` to `.env.local`
2. Fill in your environment variables
3. Deploy to Vercel
4. Set up environment variables in Vercel dashboard
5. Configure Clerk webhook
6. Test with real user creation
7. Monitor Inngest dashboard for successful executions 