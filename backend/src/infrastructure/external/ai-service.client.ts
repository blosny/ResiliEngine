import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiServiceClient {
  private readonly logger = new Logger(AiServiceClient.name);

  // Taha'nın belirttiği Docker içi adres: http://ai-service:8000/analyze
  private readonly AI_URL =
    process.env.AI_SERVICE_URL || 'http://ai-service:8000/analyze';

  constructor(private readonly httpService: HttpService) {}

  async sendLogForAnalysis(payload: any): Promise<void> {
    try {
      this.logger.log(`AI Servisine istek gönderiliyor: ${this.AI_URL}`);

      await firstValueFrom(this.httpService.post(this.AI_URL, payload));

      this.logger.log(
        `[SCRUM-11] Analiz başarıyla Tunahan'ın servisine iletildi.`,
      );
    } catch (error) {
      // Hata durumunda log bas ki Taha Docker loglarında sorunu görebilsin
      const err = error as Error;
      this.logger.error(
        `AI Servisine ulaşılamadı (${this.AI_URL}): ${err.message}`,
      );
    }
  }
}
