import { ChaosLog } from '../entities/chaos-log.entity';

export interface IChaosRepository {
  // Yeni bir deney logu oluşturur
  createLog(data: Partial<ChaosLog>): Promise<ChaosLog>;

  // Tüm deney geçmişini getirir (Stage 4'teki GET /chaos/history için lazım)
  findAll(): Promise<ChaosLog[]>;
}
