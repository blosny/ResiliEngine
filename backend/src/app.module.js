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
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { UserController } from './presentation/controllers/user.controller';
import { ChaosController } from './presentation/controllers/chaos.controller';
import { AppService } from './app.service';
import { UserService } from './application/services/user.service';
import { ChaosEngineService } from './application/services/chaos-engine.service';
import { AiServiceClient } from './infrastructure/external/ai-service.client';
import { User } from './domain/entities/user.entity';
import { ChaosLog } from './domain/entities/chaos-log.entity';
import { TypeOrmUserRepository } from './infrastructure/repositories/user.repository';
import { TypeOrmChaosRepository } from './infrastructure/repositories/chaos.repository';
import { LatencyStrategy } from './infrastructure/strategies/latency.strategy';
import { Error500Strategy } from './infrastructure/strategies/error500.strategy';
import { ChaosInterceptor } from './presentation/interceptors/chaos.interceptor';
let AppModule = (() => {
    let _classDecorators = [Module({
            imports: [
                HttpModule,
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    url: process.env.DATABASE_URL ||
                        'postgresql://resiliengine_user:password123@db:5432/resiliengine_db',
                    entities: [User, ChaosLog],
                    synchronize: true,
                    ssl: process.env.DATABASE_URL &&
                        !process.env.DATABASE_URL.includes('db:5432') &&
                        !process.env.DATABASE_URL.includes('localhost')
                        ? { rejectUnauthorized: false }
                        : false,
                }),
                TypeOrmModule.forFeature([User, ChaosLog]),
            ],
            controllers: [AppController, UserController, ChaosController],
            providers: [
                AppService,
                UserService,
                ChaosEngineService,
                AiServiceClient,
                LatencyStrategy,
                Error500Strategy,
                { provide: 'IUserRepository', useClass: TypeOrmUserRepository },
                { provide: 'IChaosRepository', useClass: TypeOrmChaosRepository },
                { provide: APP_INTERCEPTOR, useClass: ChaosInterceptor },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return AppModule = _classThis;
})();
export { AppModule };
