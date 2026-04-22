import { ChaosLog } from '../entities/chaos-log.entity';

export interface IChaosRepository {
  // Yeni bir deney logu oluşturur
  createLog(data: Partial<ChaosLog>): Promise<ChaosLog>;

  // Tüm deney geçmişini getirir (Stage 4'teki GET /chaos/history için lazım)
  findAll(): Promise<ChaosLog[]>;
}
import { ChaosLog } from '../entities/chaos-log.entity';

export interface IChaosRepository {
  createLog(data: Partial<ChaosLog>): Promise<ChaosLog>;
  findAll(): Promise<ChaosLog[]>;
  updateLog(id: string, data: Partial<ChaosLog>): Promise<ChaosLog>;
  clearLogs(): Promise<void>;
}
