# TradingView Webhook Dashboard

A simple dashboard application that receives and displays trading signals from TradingView alerts.

## Features

- Secure login system
- Webhook endpoint for TradingView alerts
- Real-time signal dashboard with infinite scrolling
- Automatic refresh of trading signals
- Responsive design for mobile and desktop

## Project Structure

```
tradingview-webhook-dashboard/
├── public/                # Static files
│   ├── index.html         # Login page
│   ├── data.html          # Dashboard page
│   └── style.css          # Styles for both pages
├── data/                  # Data storage (created automatically)
│   └── signals.json       # Stored signals
├── server.js              # Main server file
├── package.json           # Node.js dependencies
└── vercel.json            # Vercel deployment configuration
```

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`

## Deployment to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel`

## Setting Up TradingView Alerts

1. In TradingView, create a new alert
2. Select "Webhook URL" as the alert action
3. Enter your webhook URL: `https://your-vercel-app.vercel.app/webhook`
4. Format your alert message as JSON with your desired signal information:

```json
{
  "symbol": "{{ticker}}",
  "price": {{close}},
  "action": "BUY",
  "strategy": "Moving Average Crossover",
  "timeframe": "{{interval}}"
}
```

## Accessing the Dashboard

1. Visit your deployed application URL
2. Login with the credentials:
   - Username: bhagi
   - Password: bhagi20

## Security Notes

- For production use, implement a more secure authentication system
- Consider adding API keys for webhook authentication
- Encrypt sensitive data properly
#   N i f t y _ S i g n a l _ W e b a p p  
 