const NodeCache = require('node-cache');

// Initialize cache with TTL from environment variable (in hours), default to 1 hour
const cacheTTLHours = parseInt(process.env.CACHE_TTL_HOURS || '1', 10);
const cacheTTLSeconds = cacheTTLHours * 3600;

// Create a single cache instance
const cache = new NodeCache({
    stdTTL: cacheTTLSeconds,
    checkperiod: cacheTTLSeconds * 0.2, // Check for expired keys every 20% of TTL
    useClones: false, // For better performance, don't clone cached objects
});

/**
 * Generates a cache key based on the class name, method name, and its parameters.
 *
 * @param className - The name of the class containing the method
 * @param methodName - The name of the method being cached
 * @param args - The arguments passed to the method
 * @returns A unique string to use as a cache key
 */
function generateCacheKey(className: string, methodName: string, args: any[]): string {
    const argsString = JSON.stringify(args);
    return `${className}.${methodName}:${argsString}`;
}

/**
 * A method decorator that caches the result of a method.
 *
 * This decorator:
 * 1. Generates a cache key based on the method name and its parameters
 * 2. Checks if a cached result exists for that key
 * 3. Returns the cached result if it exists
 * 4. Otherwise, executes the method, caches the result, and returns it
 *
 * The cache TTL (Time To Live) is configured via the CACHE_TTL_HOURS environment variable.
 * If not set, it defaults to 1 hour.
 *
 * @returns A method decorator function
 *
 * @example
 * class MyService {
 *     @MethodCache()
 *     async fetchData(id: number): Promise<Data> {
 *         // expensive operation
 *         return data;
 *     }
 * }
 */
export function MethodCache() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const className = target.constructor.name;

        descriptor.value = async function (...args: any[]) {
            // Generate cache key
            const cacheKey = generateCacheKey(className, propertyKey, args);

            // Check if result is cached
            const cachedResult = cache.get(cacheKey);
            if (cachedResult !== undefined) {
                // Return cached result
                return cachedResult;
            }

            // Execute the original method
            const result = await originalMethod.apply(this, args);

            // Cache the result
            cache.set(cacheKey, result);

            return result;
        };

        return descriptor;
    };
}

/**
 * Utility function to manually clear the cache or specific keys
 * Useful for testing or when you need to invalidate cache
 */
export const CacheUtils = {
    /**
     * Clear all cached data
     */
    clearAll: () => cache.flushAll(),

    /**
     * Clear a specific cache entry
     * @param key - The cache key to delete
     */
    clear: (key: string) => cache.del(key),

    /**
     * Get cache statistics
     */
    getStats: () => cache.getStats(),

    /**
     * Get all cache keys
     */
    getKeys: () => cache.keys(),
};
