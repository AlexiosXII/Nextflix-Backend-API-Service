import { sanitizeArgs } from 'src/common/utils/sensitive-data/sensitive-data.helper';

/**
 * A decorator function that traces method calls within a class.
 *
 * This decorator logs the method name, arguments, and request ID when a method is called,
 * and logs the return value of the method after it completes.
 *
 * @returns A class decorator function that wraps each method of the class with tracing logic.
 *
 * @throws Will throw an error if the class does not have a logger property.
 *
 * @example
 * @MethodTracer()
 * class MyClass {
 *     myMethod(arg1: string, arg2: number) {
 *         // method implementation
 *     }
 * }
 */
export function MethodTracer() {
    return function (constructor: Function) {
        for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
            const originalMethod = constructor.prototype[key];
            if (typeof originalMethod === 'function' && key !== 'constructor') {
                constructor.prototype[key] = function (...args: any[]) {
                    const methodName = key;
                    const className = constructor.name;
                    if (!this.logger) {
                        throw new Error(
                            `Using logger in @MethodTracer, please declare logger in class properties [${className}]\nExample:\nexport class ${className} {\n    private readonly logger = new Logger(${className}.name);\n    async functionName () => {},\n}`,
                        );
                    }
                    const sanitizedArgs = sanitizeArgs(args);
                    this.logger.log(`[${className}.${methodName}] function called`);
                    this.logger.debug(
                        `[${className}.${methodName}] function called with arguments: ${JSON.stringify(sanitizedArgs)}`,
                    );
                    // Start tracer here
                    // *
                    // *
                    const result = originalMethod.apply(this, args);

                    // Handle promise-based results
                    if (result instanceof Promise) {
                        return result
                            .then((resolvedValue) => {
                                this.logger.log(`[${className}.${methodName}] function ended`);
                                this.logger.debug(
                                    `[${className}.${methodName}] returned: ${JSON.stringify(resolvedValue)}`,
                                );
                                // End tracer here
                                // *
                                // *
                                return resolvedValue;
                            })
                            .catch((error) => {
                                this.logger.error(
                                    `[${className}.${methodName}] function threw an error: ${error.message}`,
                                );
                                // End tracer here
                                // *
                                // *
                                throw error;
                            });
                    }

                    // Handle synchronous results
                    this.logger.log(`[${className}.${methodName}] function ended`);
                    this.logger.debug(`[${className}.${methodName}] returned: ${JSON.stringify(result)}`);
                    // End tracer here
                    // *
                    // *
                    return result;
                };
            }
        }
    };
}
