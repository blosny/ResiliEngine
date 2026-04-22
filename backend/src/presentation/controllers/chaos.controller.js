var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { Controller, Post, Get } from '@nestjs/common';
let ChaosController = (() => {
    let _classDecorators = [Controller('chaos')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _trigger_decorators;
    let _getHistory_decorators;
    var ChaosController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _trigger_decorators = [Post('trigger')];
            _getHistory_decorators = [Get('history')];
            __esDecorate(this, null, _trigger_decorators, { kind: "method", name: "trigger", static: false, private: false, access: { has: obj => "trigger" in obj, get: obj => obj.trigger }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ChaosController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        chaosService = __runInitializers(this, _instanceExtraInitializers);
        latency;
        error500;
        constructor(chaosService, latency, error500) {
            this.chaosService = chaosService;
            this.latency = latency;
            this.error500 = error500;
        }
        /**
         * POST /chaos/trigger
         * Yeni bir kaos deneyi başlatır.
         */
        async trigger(body) {
            // Strategy Pattern: Gelen tip'e göre strateji seçimi
            if (body.type === 'LATENCY') {
                this.chaosService.setStrategy(this.latency);
            }
            else if (body.type === 'ERROR_500') {
                this.chaosService.setStrategy(this.error500);
            }
            // Servis içindeki yeni metod ismini çağırıyoruz
            return await this.chaosService.executeStrategy({
                target: body.target,
                params: body.params,
            });
        }
        /**
         * GET /chaos/history
         * STAGE 4: Tüm deney geçmişini listeleyen endpoint.
         */
        async getHistory() {
            return await this.chaosService.getHistory();
        }
    };
    return ChaosController = _classThis;
})();
export { ChaosController };
let ChaosController = (() => {
    let _classDecorators = [Controller('chaos')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getHistory_decorators;
    let _trigger_decorators;
    let _clearHistoryMethodFallback_decorators;
    var ChaosController = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getHistory_decorators = [Get('history')];
            _trigger_decorators = [Post('trigger')];
            _clearHistoryMethodFallback_decorators = [Get('history/clear')];
            __esDecorate(this, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _trigger_decorators, { kind: "method", name: "trigger", static: false, private: false, access: { has: obj => "trigger" in obj, get: obj => obj.trigger }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _clearHistoryMethodFallback_decorators, { kind: "method", name: "clearHistoryMethodFallback", static: false, private: false, access: { has: obj => "clearHistoryMethodFallback" in obj, get: obj => obj.clearHistoryMethodFallback }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ChaosController = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        chaosService = __runInitializers(this, _instanceExtraInitializers);
        latency;
        error500;
        chaosRepository;
        constructor(chaosService, latency, error500, chaosRepository) {
            this.chaosService = chaosService;
            this.latency = latency;
            this.error500 = error500;
            this.chaosRepository = chaosRepository;
        }
        async getHistory() {
            const logs = await this.chaosRepository.findAll();
            return logs.map(log => ({
                id: log.id,
                message: log.errorDetails || `Kaos deneyi: ${log.type}`,
                type: log.type,
                aiRecommendation: log.aiRecommendation
            }));
        }
        async trigger(body) {
            const typeUpper = body.type?.toUpperCase();
            if (typeUpper === 'LATENCY')
                Object.assign(this.chaosService, { strategy: this.latency }); // Using setStrategy dynamically
            this.chaosService.setStrategy(typeUpper === 'LATENCY' ? this.latency : this.error500);
            return await this.chaosService.run({
                target: body.target || 'System',
                params: body.params,
            });
        }
        async clearHistoryMethodFallback() {
            await this.chaosRepository.clearLogs();
            return { success: true };
        }
    };
    return ChaosController = _classThis;
})();
export { ChaosController };
