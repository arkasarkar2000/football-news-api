const cache = new Map();

export const setCache = (key, data, ttlMs = 5 * 60 * 1000) => {
    cache.set(key, {
        data,
        expiry: Date.now() + ttlMs
    });
};

export const getCache = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
        cache.delete(key); // expired
        return null;
    }

    return entry.data;
};
