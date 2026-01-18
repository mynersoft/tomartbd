const rateLimitMap = new Map();

export function rateLimitMiddleware(limit = 5, windowMs = 15 * 60 * 1000) {
  return function(req) {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    const requests = rateLimitMap.get(ip) || [];
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= limit) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Too many requests. Please try again later.'
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    requests.push(now);
    rateLimitMap.set(ip, requests.slice(-10));
    
    return null;
  };
}