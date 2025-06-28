import { inngest } from '../../../config/inngest';

export async function POST(req) {
  try {
    const body = await req.json();
    const { eventName, eventData } = body;

    if (!eventName) {
      return new Response('Event name is required', { status: 400 });
    }

    // Send test event to Inngest
    await inngest.send({
      name: eventName,
      data: eventData || {},
    });

    console.log(`Test event sent to Inngest: ${eventName}`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Event ${eventName} sent to Inngest` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending test event:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ 
    message: 'Inngest test endpoint is working',
    availableEvents: [
      'clerk/user.created',
      'clerk/user.updated', 
      'clerk/user.deleted'
    ]
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
} 