import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/all-products',
    '/product/(.*)',
    '/about-us',
    '/contact',
    '/track-order',
    '/privacy-policy',
    '/api/product/(.*)',
    '/api/email/(.*)',
    '/api/webhooks/(.*)',
    '/api/test-(.*)',
    '/api/debug-(.*)',
    '/api/fix-(.*)',
  ],
  ignoredRoutes: [
    '/api/webhooks/(.*)',
  ],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};