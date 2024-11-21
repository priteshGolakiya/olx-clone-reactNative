import { useRef, useCallback } from 'react';

interface DebounceOptions {
    delay?: number;
    maxWait?: number;
    leading?: boolean;
    trailing?: boolean;
}

export function useDebounce<T extends (...args: any[]) => any>(
    func: T,
    options: DebounceOptions = {}
): T {
    const {
        delay = 500,
        maxWait,
        leading = false,
        trailing = true,
    } = options;

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastInvokeRef = useRef<number>(0);
    const lastArgsRef = useRef<Parameters<T> | null>(null);
    const lastCallRef = useRef<number>(0);

    const clearTimeouts = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (maxTimeoutRef.current) {
            clearTimeout(maxTimeoutRef.current);
            maxTimeoutRef.current = null;
        }
    };

    // Clean up timeouts on unmount
    const cleanup = useCallback(() => {
        clearTimeouts();
    }, []);

    return useCallback((...args: Parameters<T>) => {
        const now = Date.now();
        const isInvoking = leading && !timeoutRef.current;

        lastArgsRef.current = args;
        lastCallRef.current = now;

        const invokeFunction = () => {
            const args = lastArgsRef.current;
            lastInvokeRef.current = Date.now();
            clearTimeouts();

            if (args) {
                func(...args);
            }
        };

        const startTimer = (wait: number) => {
            clearTimeouts();

            if (maxWait && !maxTimeoutRef.current) {
                maxTimeoutRef.current = setTimeout(() => {
                    if (trailing || (leading && lastArgsRef.current)) {
                        invokeFunction();
                    }
                }, maxWait);
            }

            timeoutRef.current = setTimeout(() => {
                if (trailing) {
                    invokeFunction();
                }
            }, wait);
        };

        if (isInvoking) {
            invokeFunction();
        } else {
            startTimer(delay);
        }

        return cleanup;
    }, [func, delay, maxWait, leading, trailing, cleanup]) as T;
}