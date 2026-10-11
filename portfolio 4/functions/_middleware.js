const PASSWORD = 'atelier';
const SESSION_TOKEN = '6f3e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f';
const PUBLIC_ADMIN = ['/admin/login.html'];

function checkAuth(request) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return false;
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const sessionCookie = cookies.find(c => c.startsWith('portfolio_admin='));
  if (!sessionCookie) return false;
  const token = sessionCookie.split('=')[1];
  return token === SESSION_TOKEN;
}

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Protect admin routes
  if (path.startsWith('/admin/') && !PUBLIC_ADMIN.includes(path)) {
    if (!checkAuth(request)) {
      return Response.redirect(url.origin + '/admin/login.html', 303);
    }
  }

  return next();
}
