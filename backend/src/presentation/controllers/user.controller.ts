import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../../application/services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.getUserById(+id); // + işareti string'i number'a çevirir
  }
}
