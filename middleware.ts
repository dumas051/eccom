import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/',
    '/cart',
    '/all-products',
    '/product/(.*)',
    '/about-us',
    '/contact',
    '/track-order',
    '/privacy-policy',
    '/my-orders',
    '/add-address',
    '/order-placed',
    '/seller/(.*)',
    '/api/(.*)',
    '/api/product/(.*)',
    '/api/order/(.*)',
    '/api/user/(.*)',
    '/api/email/(.*)',
    '/api/webhooks/(.*)',
    '/api/test-(.*)',
    '/api/debug-(.*)',
    '/api/fix-(.*)',
  ],
};