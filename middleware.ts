import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
    '/seller(.*)',
    '/cart(.*)',
    '/my-orders(.*)',
    '/add-address(.*)',
    '/api/user(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        const user = await auth();
        if (!user.userId) {
            const url = new URL(req.url);
            url.pathname = '/sign-in';
            return Response.redirect(url);
        }
    }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};