export function toSnakeCase(obj) {
    const snakeObj = {};
    for (const [key, value] of Object.entries(obj)) {
        const snakeKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
        if (typeof value === 'object' && !Array.isArray(value)) {
            snakeObj[snakeKey] = toSnakeCase(value);
        } else {
            snakeObj[snakeKey] = value;
        }
    }
    return snakeObj;
}

export function promiseAllSettled<T>(promises: Promise<T>[]): Promise<({ status: 'fulfilled', value: T } | { status: 'rejected', reason: any })[]> {
    return Promise.all(promises.map(p => p.then(
        value => ({ status: 'fulfilled' as const, value }),
        reason => ({ status: 'rejected' as const, reason })
    ).catch(reason => ({ status: 'rejected' as const, reason }))));
}

export function flatMap(array, callback) {
    return array.reduce((acc, current) => {
        const result = callback(current);
        return Array.isArray(result)
            ? acc.concat(result)
            : acc.concat([result]);
    }, []);
}
