import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async getUserById(id: number) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`ID'si ${id} olan kullanıcı bulunamadı!`);
    }

    return user;
  }
}
