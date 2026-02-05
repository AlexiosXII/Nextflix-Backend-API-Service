import { MethodCache, CacheUtils } from './method-cache.decorator';

// Mock class for testing
class TestService {
    callCount = 0;

    @MethodCache()
    async fetchData(id: number): Promise<{ id: number; data: string }> {
        this.callCount++;
        // Simulate an expensive operation
        await new Promise((resolve) => setTimeout(resolve, 100));
        return {
            id,
            data: `Data for ID ${id}`,
        };
    }

    @MethodCache()
    async fetchMultipleParams(id: number, name: string): Promise<string> {
        this.callCount++;
        return `ID: ${id}, Name: ${name}`;
    }

    @MethodCache()
    getSync(id: number): string {
        this.callCount++;
        return `Sync result for ${id}`;
    }
}

describe('MethodCache Decorator', () => {
    let service: TestService;

    beforeEach(() => {
        service = new TestService();
        CacheUtils.clearAll();
    });

    afterEach(() => {
        CacheUtils.clearAll();
    });

    it('should cache the result of an async method', async () => {
        const result1 = await service.fetchData(1);
        const result2 = await service.fetchData(1);

        expect(result1).toEqual({ id: 1, data: 'Data for ID 1' });
        expect(result2).toEqual({ id: 1, data: 'Data for ID 1' });
        expect(service.callCount).toBe(1); // Method should only be called once
    });

    it('should not cache when parameters are different', async () => {
        const result1 = await service.fetchData(1);
        const result2 = await service.fetchData(2);

        expect(result1).toEqual({ id: 1, data: 'Data for ID 1' });
        expect(result2).toEqual({ id: 2, data: 'Data for ID 2' });
        expect(service.callCount).toBe(2); // Method should be called twice
    });

    it('should handle multiple parameters in cache key', async () => {
        const result1 = await service.fetchMultipleParams(1, 'Alice');
        const result2 = await service.fetchMultipleParams(1, 'Alice');
        const result3 = await service.fetchMultipleParams(1, 'Bob');

        expect(result1).toBe('ID: 1, Name: Alice');
        expect(result2).toBe('ID: 1, Name: Alice');
        expect(result3).toBe('ID: 1, Name: Bob');
        expect(service.callCount).toBe(2); // Called once for Alice, once for Bob
    });

    it('should clear cache when CacheUtils.clearAll is called', async () => {
        await service.fetchData(1);
        expect(service.callCount).toBe(1);

        CacheUtils.clearAll();

        await service.fetchData(1);
        expect(service.callCount).toBe(2); // Method called again after cache clear
    });

    it('should return cache statistics', async () => {
        await service.fetchData(1);
        await service.fetchData(2);

        const stats = CacheUtils.getStats();
        expect(stats.keys).toBeGreaterThan(0);
    });

    it('should list cache keys', async () => {
        await service.fetchData(1);
        await service.fetchData(2);

        const keys = CacheUtils.getKeys();
        expect(keys.length).toBe(2);
        expect(keys[0]).toContain('TestService.fetchData');
    });

    it('should clear specific cache entry', async () => {
        await service.fetchData(1);
        await service.fetchData(2);

        const keys = CacheUtils.getKeys();
        CacheUtils.clear(keys[0]);

        const remainingKeys = CacheUtils.getKeys();
        expect(remainingKeys.length).toBe(1);
    });
});
