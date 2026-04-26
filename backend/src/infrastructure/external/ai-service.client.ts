import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiServiceClient {
  private readonly logger = new Logger(AiServiceClient.name);

  // Taha'nın belirttiği Docker içi adres: http://ai-service:8000/analyze
  // Ve Render/Env desteği
  private readonly AI_URL =
    process.env.AI_SERVICE_URL || 'http://ai-service:8000/analyze';

  constructor(private readonly httpService: HttpService) {}

  async sendLogForAnalysis(payload: { log_content: string }): Promise<any> {
    try {
      this.logger.log(`AI Servisine istek gönderiliyor: ${this.AI_URL}`);

      const response = await firstValueFrom(
        this.httpService.post(this.AI_URL, payload),
      );

      this.logger.log(
        `[SCRUM-11] Analiz başarıyla Tunahan'ın servisine iletildi.`,
      );
      return response.data;
    } catch (error) {
      // Hata durumunda net log ve geriye detay dönme
      const err = error as any;
      const detail = err.response?.data?.detail || err.message;
      this.logger.error(
        `AI Servisine ulaşılamadı veya hata verdi (${this.AI_URL}): ${detail}`,
      );
      return { recommendation: null, error: `AI Servisi Hatası: ${detail}` };
    }
  }
}
