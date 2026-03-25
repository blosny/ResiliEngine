import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChaosLog } from '../../domain/entities/chaos-log.entity';
import { IChaosRepository } from '../../domain/interfaces/chaos-repository.interface';

@Injectable()
export class TypeOrmChaosRepository implements IChaosRepository {
  constructor(
    @InjectRepository(ChaosLog)
    private readonly repository: Repository<ChaosLog>,
  ) {}

  async createLog(data: Partial<ChaosLog>): Promise<ChaosLog> {
    const log = this.repository.create(data);
    return await this.repository.save(log);
  }

  // STAGE 4: Geçmişi getiren metod
  async findAll(): Promise<ChaosLog[]> {
    return await this.repository.find({
      order: { timestamp: 'DESC' }, // En yeni deney en üstte
    });
  }
}
