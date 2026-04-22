var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
let AiServiceClient = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AiServiceClient = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AiServiceClient = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        httpService;
        AI_URL = 'http://ai-service:8000/analyze';
        constructor(httpService) {
            this.httpService = httpService;
        }
        async sendLogForAnalysis(payload) {
            try {
                await firstValueFrom(this.httpService.post(this.AI_URL, payload));
            }
            catch (error) {
                // error tipini any yaptık
                console.error('AI Service ulaşılamadı:', error.message);
            }
        }
    };
    return AiServiceClient = _classThis;
})();
export { AiServiceClient };
import { Logger } from '@nestjs/common';
let AiServiceClient = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AiServiceClient = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AiServiceClient = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        httpService;
        logger = new Logger(AiServiceClient.name);
        // Taha'nın belirttiği Docker içi adres: http://ai-service:8000/analyze
        AI_URL = process.env.AI_SERVICE_URL || 'http://ai-service:8000/analyze';
        constructor(httpService) {
            this.httpService = httpService;
        }
        async sendLogForAnalysis(payload) {
            try {
                this.logger.log(`AI Servisine istek gönderiliyor: ${this.AI_URL}`);
                const response = await firstValueFrom(this.httpService.post(this.AI_URL, payload));
                this.logger.log(`[SCRUM-11] Analiz başarıyla Tunahan'ın servisine iletildi.`);
                return response.data;
            }
            catch (error) {
                // Hata durumunda net log ve geriye detay dönme
                const err = error;
                const detail = err.response?.data?.detail || err.message;
                this.logger.error(`AI Servisine ulaşılamadı veya hata verdi (${this.AI_URL}): ${detail}`);
                return { recommendation: null, error: `AI Servisi Hatası: ${detail}` };
            }
        }
    };
    return AiServiceClient = _classThis;
})();
export { AiServiceClient };
