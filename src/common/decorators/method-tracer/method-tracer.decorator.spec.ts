import { MethodTracer } from './method-tracer.decorator';

class MockLogger {
    log = jest.fn();
    debug = jest.fn();
}

@MethodTracer()
class TestClass {
    logger = new MockLogger();

    method1(arg1: string, arg2: number) {
        return `${arg1} ${arg2}`;
    }

    method2(arg1: string) {
        return arg1.toUpperCase();
    }
}

describe('MethodTracer Decorator', () => {
    let testInstance: TestClass;

    beforeEach(() => {
        testInstance = new TestClass();
    });

    it('should log method calls and arguments', () => {
        const arg1 = 'test';
        const arg2 = 123;
        const result = testInstance.method1(arg1, arg2);

        expect(testInstance.logger.log).toHaveBeenCalledWith('[TestClass.method1] function called');
        expect(testInstance.logger.debug).toHaveBeenCalledWith(
            `[TestClass.method1] function called with arguments: ["${arg1}",${arg2}]`,
        );
        expect(testInstance.logger.log).toHaveBeenCalledWith('[TestClass.method1] function ended');
        expect(testInstance.logger.debug).toHaveBeenCalledWith(`[TestClass.method1] returned: "${arg1} ${arg2}"`);
        expect(result).toBe(`${arg1} ${arg2}`);
    });

    it('should log method calls and arguments for another method', () => {
        const arg1 = 'hello';
        const result = testInstance.method2(arg1);

        expect(testInstance.logger.log).toHaveBeenCalledWith('[TestClass.method2] function called');
        expect(testInstance.logger.debug).toHaveBeenCalledWith(
            `[TestClass.method2] function called with arguments: ["${arg1}"]`,
        );
        expect(testInstance.logger.log).toHaveBeenCalledWith('[TestClass.method2] function ended');
        expect(testInstance.logger.debug).toHaveBeenCalledWith(`[TestClass.method2] returned: "${arg1.toUpperCase()}"`);
        expect(result).toBe(arg1.toUpperCase());
    });

    it('should throw an error if logger is not defined', () => {
        @MethodTracer()
        class NoLoggerClass {
            method() {
                // Method intentionally left blank
            }
        }

        const instance = new NoLoggerClass();
        expect(() => instance.method()).toThrow(
            'Using logger in @MethodTracer, please declare logger in class properties [NoLoggerClass]',
        );
    });
});
