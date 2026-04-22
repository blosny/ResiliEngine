import { HttpException, HttpStatus } from '@nestjs/common';
export class HttpErrorStrategy {
    name = 'Internal Server Error Injection';
    async execute() {
        console.log(`[Chaos] 500 Internal Server Error fırlatılıyor...`);
        throw new HttpException('Chaos Engine: Yapay hata enjekte edildi!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
