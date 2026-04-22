import { ChaosLog } from '../entities/chaos-log.entity';

export interface IChaosRepository {
  /**
   * Yeni bir deney logu oluşturur.
   */
  createLog(data: Partial<ChaosLog>): Promise<ChaosLog>;

  /**
   * Tüm deney geçmişini getirir.
   */
  findAll(): Promise<ChaosLog[]>;

  /**
   * Belirli bir logu günceller (AI analizi vb. için).
   */
  updateLog(id: string, data: Partial<ChaosLog>): Promise<ChaosLog>;

  /**
   * Tüm logları temizler.
   */
  clearLogs(): Promise<void>;
}
