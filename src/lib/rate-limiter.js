import { RateLimiterMemory } from 'rate-limiter-flexible';

// Using in-memory storage for rate limiting. 
// In a serverless/production environment, consider Redis/Upstash.
const rateLimiter = new RateLimiterMemory({
    points: 5,        // 5 requests
    duration: 60,     // Per 60 seconds by IP
});

export async function checkRateLimit(ip) {
    try {
        await rateLimiter.consume(ip);
        return { success: true };
    } catch (rejRes) {
        return { success: false };
    }
}
