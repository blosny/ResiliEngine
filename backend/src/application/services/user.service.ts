import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: number) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`ID'si ${id} olan kullanıcı bulunamadı!`);
    }

    return user;
  }
}
