import { ChaosLog } from '../entities/chaos-log.entity';

export interface IChaosRepository {
  createLog(data: Partial<ChaosLog>): Promise<ChaosLog>;
  findAll(): Promise<ChaosLog[]>;
}
