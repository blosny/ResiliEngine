import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiServiceClient {
  private readonly AI_URL = 'http://ai-service:8000/analyze';

  constructor(private readonly httpService: HttpService) {}

  async sendLogForAnalysis(payload: any): Promise<void> {
    try {
      await firstValueFrom(this.httpService.post(this.AI_URL, payload));
    } catch (error: any) {
      // error tipini any yaptık
      console.error('AI Service ulaşılamadı:', error.message);
    }
  }
}
