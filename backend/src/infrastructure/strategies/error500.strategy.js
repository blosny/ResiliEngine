import { HttpException, HttpStatus } from '@nestjs/common';
export class Error500Strategy {
    name = 'ERROR_500';
    async execute() {
        throw new HttpException('Chaos Error 500', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
