import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PathExtractorService {
  private readonly logger = new Logger(PathExtractorService.name);

  /**
   * SCRUM-37: Log satırlarının içinden dosya yollarını ayıklar.
   * Node.js (Stack Trace) ve Python log formatlarına uyumludur.
   */
  extractPaths(logContent: string): string[] {
    // REGEX AÇIKLAMASI:
    // (?:[a-zA-Z]:\\|[\\/]) -> Windows (C:\) veya Linux (/) kök dizin başlangıcı
    // [\w\-.\\/]+           -> Dosya ve klasör karakterleri (harf, rakam, nokta, tire, bölü)
    // \.(ts|js|py)          -> Sadece .ts, .js veya .py uzantılı dosyalar
    const pathRegex = /(?:[a-zA-Z]:\\|[\\/])[\w\-.\\/]+\.(ts|js|py)/g;

    // İçerikteki tüm eşleşmeleri bul
    const matches = logContent.match(pathRegex);

    if (!matches) {
      return [];
    }

    // Tekrar eden yolları temizle (Unique list)
    return Array.from(new Set(matches));
  }
}
