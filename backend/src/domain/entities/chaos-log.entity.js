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
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, } from 'typeorm';
let ChaosLog = (() => {
    let _classDecorators = [Entity('chaos_logs')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _target_decorators;
    let _target_initializers = [];
    let _target_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _errorDetails_decorators;
    let _errorDetails_initializers = [];
    let _errorDetails_extraInitializers = [];
    let _aiAnalysis_decorators;
    let _aiAnalysis_initializers = [];
    let _aiAnalysis_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    var ChaosLog = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [PrimaryGeneratedColumn('uuid')];
            _type_decorators = [Column()];
            _target_decorators = [Column()];
            _status_decorators = [Column()];
            _duration_decorators = [Column({ type: 'int', nullable: true })];
            _errorDetails_decorators = [Column({ type: 'text', nullable: true })];
            _aiAnalysis_decorators = [Column({ type: 'text', nullable: true })];
            _timestamp_decorators = [CreateDateColumn()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _target_decorators, { kind: "field", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target, set: (obj, value) => { obj.target = value; } }, metadata: _metadata }, _target_initializers, _target_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
            __esDecorate(null, null, _errorDetails_decorators, { kind: "field", name: "errorDetails", static: false, private: false, access: { has: obj => "errorDetails" in obj, get: obj => obj.errorDetails, set: (obj, value) => { obj.errorDetails = value; } }, metadata: _metadata }, _errorDetails_initializers, _errorDetails_extraInitializers);
            __esDecorate(null, null, _aiAnalysis_decorators, { kind: "field", name: "aiAnalysis", static: false, private: false, access: { has: obj => "aiAnalysis" in obj, get: obj => obj.aiAnalysis, set: (obj, value) => { obj.aiAnalysis = value; } }, metadata: _metadata }, _aiAnalysis_initializers, _aiAnalysis_extraInitializers);
            __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ChaosLog = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
        target = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _target_initializers, void 0));
        status = (__runInitializers(this, _target_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        duration = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
        errorDetails = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _errorDetails_initializers, void 0));
        aiAnalysis = (__runInitializers(this, _errorDetails_extraInitializers), __runInitializers(this, _aiAnalysis_initializers, void 0));
        timestamp = (__runInitializers(this, _aiAnalysis_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
        constructor() {
            __runInitializers(this, _timestamp_extraInitializers);
        }
    };
    return ChaosLog = _classThis;
})();
export { ChaosLog };
let ChaosLog = (() => {
    let _classDecorators = [Entity('chaos_logs')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _target_decorators;
    let _target_initializers = [];
    let _target_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _duration_extraInitializers = [];
    let _errorDetails_decorators;
    let _errorDetails_initializers = [];
    let _errorDetails_extraInitializers = [];
    let _aiRecommendation_decorators;
    let _aiRecommendation_initializers = [];
    let _aiRecommendation_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    var ChaosLog = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [PrimaryGeneratedColumn('uuid')];
            _type_decorators = [Column()];
            _target_decorators = [Column()];
            _status_decorators = [Column()];
            _duration_decorators = [Column({ type: 'int', nullable: true })];
            _errorDetails_decorators = [Column({ type: 'text', nullable: true })];
            _aiRecommendation_decorators = [Column({ type: 'text', nullable: true })];
            _timestamp_decorators = [CreateDateColumn()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _target_decorators, { kind: "field", name: "target", static: false, private: false, access: { has: obj => "target" in obj, get: obj => obj.target, set: (obj, value) => { obj.target = value; } }, metadata: _metadata }, _target_initializers, _target_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _duration_decorators, { kind: "field", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } }, metadata: _metadata }, _duration_initializers, _duration_extraInitializers);
            __esDecorate(null, null, _errorDetails_decorators, { kind: "field", name: "errorDetails", static: false, private: false, access: { has: obj => "errorDetails" in obj, get: obj => obj.errorDetails, set: (obj, value) => { obj.errorDetails = value; } }, metadata: _metadata }, _errorDetails_initializers, _errorDetails_extraInitializers);
            __esDecorate(null, null, _aiRecommendation_decorators, { kind: "field", name: "aiRecommendation", static: false, private: false, access: { has: obj => "aiRecommendation" in obj, get: obj => obj.aiRecommendation, set: (obj, value) => { obj.aiRecommendation = value; } }, metadata: _metadata }, _aiRecommendation_initializers, _aiRecommendation_extraInitializers);
            __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ChaosLog = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        id = __runInitializers(this, _id_initializers, void 0);
        type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
        target = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _target_initializers, void 0));
        status = (__runInitializers(this, _target_extraInitializers), __runInitializers(this, _status_initializers, void 0));
        duration = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _duration_initializers, void 0));
        errorDetails = (__runInitializers(this, _duration_extraInitializers), __runInitializers(this, _errorDetails_initializers, void 0));
        aiRecommendation = (__runInitializers(this, _errorDetails_extraInitializers), __runInitializers(this, _aiRecommendation_initializers, void 0));
        timestamp = (__runInitializers(this, _aiRecommendation_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
        constructor() {
            __runInitializers(this, _timestamp_extraInitializers);
        }
    };
    return ChaosLog = _classThis;
})();
export { ChaosLog };
