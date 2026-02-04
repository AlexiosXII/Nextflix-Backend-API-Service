import { RequestContext } from 'nestjs-request-context';

export class AppRequestContext extends RequestContext {
    requestId: string;
    lang: string;
}

export class RequestContextService {
    static getContext(): AppRequestContext {
        const ctx: AppRequestContext = RequestContext?.currentContext?.req;
        return ctx;
    }

    static setRequestId(id: string): void {
        const ctx = this.getContext();
        ctx.requestId = id;
    }

    static getRequestId(): string {
        return this.getContext()?.requestId;
    }

    static setLang(lang: string): void {
        const ctx = this.getContext();
        ctx.lang = lang;
    }

    static getLang(): string {
        return this.getContext()?.lang;
    }
}
