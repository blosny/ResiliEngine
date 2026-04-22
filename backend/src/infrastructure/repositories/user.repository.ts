import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  /**
   * Veritabanındaki tüm kullanıcıları listeler.
   */
  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  /**
   * ID bazlı kullanıcı araması yapar.
   */
  async findById(id: number): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }
}
