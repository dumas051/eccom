# eccom

A modern e-commerce platform built with Next.js, featuring customer support ticket system.

## Features

### Customer Support System
- **User Support Tickets**: Customers can create support tickets with categories, priorities, and detailed messages
- **Seller Support Management**: Sellers can view, filter, and respond to customer support tickets
- **Real-time Updates**: Ticket status updates and responses are reflected immediately
- **Ticket Categories**: General Inquiry, Product Support, Order Status, Technical Support, Returns & Refunds, Billing, Other
- **Priority Levels**: Low, Medium, High, Urgent
- **Status Tracking**: Open, In Progress, Resolved, Closed

### Support Ticket Features
- Create new support tickets with subject, message, category, and priority
- View ticket history and responses
- Filter tickets by status and priority (for sellers)
- Update ticket status (for sellers)
- Add responses to tickets (for sellers)
- Real-time notifications and updates

### User Interface
- Clean, modern UI with responsive design
- Easy-to-use ticket creation form
- Intuitive seller dashboard for ticket management
- Status indicators with color coding
- Mobile-friendly interface

## API Endpoints

### Support Tickets
- `POST /api/support/create-ticket` - Create a new support ticket
- `GET /api/support/tickets` - Get all tickets (filtered by user role)
- `GET /api/support/ticket/[id]` - Get specific ticket details
- `PUT /api/support/ticket/[id]` - Update ticket (add response or change status)

## Pages
- `/support` - Customer support page for creating and viewing tickets
- `/seller/support` - Seller support management dashboard

## Navigation
- Support link added to main navigation
- Support menu item added to user dropdown
- Support menu item added to seller sidebar