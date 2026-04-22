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
import { Injectable, Logger, HttpException } from '@nestjs/common';
let ChaosEngineService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ChaosEngineService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ChaosEngineService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        chaosRepository;
        aiClient;
        logger = new Logger(ChaosEngineService.name);
        strategy;
        constructor(chaosRepository, aiClient) {
            this.chaosRepository = chaosRepository;
            this.aiClient = aiClient;
        }
        /**
         * Stratejiyi dinamik olarak değiştirmemizi sağlar (Strategy Pattern).
         */
        setStrategy(strategy) {
            this.logger.log(`Strateji atandı: ${strategy.name}`);
            this.strategy = strategy;
        }
        /**
         * STAGE 4: Geçmiş kaos deneylerini ve AI analizlerini veritabanından getirir.
         */
        async getHistory() {
            this.logger.log('Kaos geçmişi veritabanından çekiliyor...');
            return await this.chaosRepository.findAll();
        }
        /**
         * STAGE 4 GÖREVİ: Deneyi çalıştıran ana metod.
         * Taha'nın testlerde beklediği isim: executeStrategy
         */
        async executeStrategy(config) {
            if (!this.strategy) {
                this.logger.warn('Çalıştırılacak bir strateji seçilmedi!');
                throw new HttpException('No chaos strategy selected', 400);
            }
            const startTime = Date.now();
            let status = 'SUCCESS';
            let errorDetails = '';
            try {
                this.logger.log(`[Chaos Engine] Deney Başlıyor: ${this.strategy.name} -> Hedef: ${config.target}`);
                // Hata enjeksiyonunu gerçekleştir
                await this.strategy.execute(config.params);
            }
            catch (err) {
                // TS18046 Çözümü: Unknown error tipini yönetiyoruz
                status = 'FAILED';
                errorDetails = err instanceof Error ? err.message : String(err);
                this.logger.error(`[Chaos Engine] Hata Enjekte Edildi: ${errorDetails}`);
                // Testlerin (Jest) hatayı yakalayabilmesi için tekrar fırlatıyoruz
                throw err;
            }
            finally {
                const duration = Date.now() - startTime;
                try {
                    // 1. Veritabanına Log Kaydet (Repository Pattern)
                    const log = await this.chaosRepository.createLog({
                        type: this.strategy.name,
                        target: config.target,
                        status,
                        duration,
                        errorDetails,
                    });
                    // 2. SCRUM-11: Tunahan'ın AI Servisine Gönder
                    await this.aiClient.sendLogForAnalysis({
                        experimentId: log.id,
                        type: log.type,
                        target: log.target,
                        status: log.status,
                        metrics: { duration },
                        timestamp: log.timestamp,
                    });
                }
                catch (internalErr) {
                    this.logger.error('Loglama veya AI servisi hatası:', internalErr);
                }
            }
        }
    };
    return ChaosEngineService = _classThis;
})();
export { ChaosEngineService };
let ChaosEngineService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ChaosEngineService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ChaosEngineService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        chaosRepository;
        aiClient;
        logger = new Logger(ChaosEngineService.name);
        strategy;
        constructor(chaosRepository, aiClient) {
            this.chaosRepository = chaosRepository;
            this.aiClient = aiClient;
        }
        setStrategy(strategy) {
            this.strategy = strategy;
        }
        async run(config) {
            if (!this.strategy)
                return { success: false, message: 'No strategy selected' };
            const startTime = Date.now();
            let status = 'SUCCESS';
            let errorDetails = '';
            try {
                await this.strategy.execute(config.params);
            }
            catch (err) {
                // HATA 2 ÇÖZÜMÜ: 'err' unknown olduğu için tip kontrolü yapıyoruz (TS18046)
                status = 'FAILED';
                if (err instanceof Error) {
                    errorDetails = err.message;
                }
                else {
                    errorDetails = String(err);
                }
                throw err;
            }
            finally {
                const duration = Date.now() - startTime;
                try {
                    const log = await this.chaosRepository.createLog({
                        type: this.strategy.name,
                        target: config.target,
                        status,
                        duration,
                        errorDetails,
                    });
                    const aiResponse = await this.aiClient.sendLogForAnalysis({
                        log_content: `Hata Türü: ${log.type}, Hedef: ${log.target}, Durum: ${log.status}, Mesaj: ${log.errorDetails || 'Yok'}`
                    });
                    if (aiResponse && aiResponse.recommendation) {
                        await this.chaosRepository.updateLog(log.id, {
                            aiRecommendation: aiResponse.recommendation
                        });
                    }
                    else if (aiResponse && aiResponse.error) {
                        await this.chaosRepository.updateLog(log.id, {
                            aiRecommendation: `[HATA] ${aiResponse.error}`
                        });
                    }
                    else {
                        await this.chaosRepository.updateLog(log.id, {
                            aiRecommendation: `[BİLGİ] AI Analizi tamamlanamadı (Servise ulaşılamadı).`
                        });
                    }
                }
                catch (logErr) {
                    this.logger.error('Logging or AI delivery failed', logErr instanceof Error ? logErr.message : String(logErr));
                }
            }
        }
    };
    return ChaosEngineService = _classThis;
})();
export { ChaosEngineService };
