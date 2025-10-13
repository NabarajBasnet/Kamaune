/**
 * Creates a debounced version of the provided function.
 * The debounced function will delay invoking the original function
 * until after the specified wait time has elapsed since the last time it was called.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A new debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

/**
 * Creates a debounced version of the provided function that returns a Promise.
 * The debounced function will delay invoking the original function
 * until after the specified wait time has elapsed since the last time it was called.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A new debounced function that returns a Promise
 */
export function debouncePromise<T extends (...args: any[]) => Promise<any>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
    let timeout: NodeJS.Timeout | null = null;
    let latestResolve: ((value: ReturnType<T>) => void) | null = null;
    let latestReject: ((reason?: any) => void) | null = null;

    return (...args: Parameters<T>): Promise<ReturnType<T>> => {
        return new Promise<ReturnType<T>>((resolve, reject) => {
            // Cancel the previous timeout if it exists
            if (timeout !== null) {
                clearTimeout(timeout);
            }

            // Reject the previous promise if it exists
            if (latestReject) {
                latestReject(new Error('Debounced'));
            }

            // Store the new resolve and reject functions
            latestResolve = resolve;
            latestReject = reject;

            // Set a new timeout
            timeout = setTimeout(async () => {
                try {
                    const result = await func(...args);
                    if (latestResolve) {
                        latestResolve(result);
                    }
                } catch (error) {
                    if (latestReject) {
                        latestReject(error);
                    }
                } finally {
                    timeout = null;
                    latestResolve = null;
                    latestReject = null;
                }
            }, wait);
        });
    };
}