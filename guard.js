const { spawn } = require('child_process');
const http = require('http');

// Komut satırı argümanlarını al
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Kullanım: node guard.js <komut> [argümanlar...]");
  process.exit(1);
}

const command = args[0];
const commandArgs = args.slice(1);

console.log(`\x1b[36m[ResiliEngine Guard]\x1b[0m İzleme başlatıldı: ${command} ${commandArgs.join(' ')}\n`);

// Kullanıcının komutunu çalıştır
const child = spawn(command, commandArgs, {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe']
});

// Hata/Exception yakalamak için Regex (Örn: Error, Exception, Fail, TypeError vb.)
const errorRegex = /(error|exception|fail|typeerror|referenceerror|syntaxerror|cannot find module)/i;

// Backend API'mize post atan yardımcı fonksiyon
function sendErrorToBackend(logText) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ log: logText });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/chaos/terminal-error',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve());
    });

    req.on('error', (e) => {
      resolve(); // Backend ayakta değilse sessizce geç
    });

    req.write(postData);
    req.end();
  });
}

let errorBuffer = '';
let debounceTimer = null;
let pendingRequests = 0;

function processLog(text, isErrorStream) {
  // Orijinal çıktıyı yazılımcının ekranına bas (akışı bozma)
  if (isErrorStream) {
    process.stderr.write(text);
  } else {
    process.stdout.write(text);
  }

  // Regex ile kontrol et
  if (errorRegex.test(text) || isErrorStream) {
    errorBuffer += text + '\n';
    
    // Aynı hatayı peş peşe 100 kere atmamak için debounce uyguluyoruz (500ms)
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const logToSend = errorBuffer.trim();
      errorBuffer = '';
      if (logToSend) {
        pendingRequests++;
        await sendErrorToBackend(logToSend);
        pendingRequests--;
      }
    }, 500);
  }
}

// Çıktıları dinle
child.stdout.on('data', (data) => {
  processLog(data.toString(), false);
});

child.stderr.on('data', (data) => {
  processLog(data.toString(), true);
});

child.on('close', async (code) => {
  // Eğer buffer'da kalan veya gönderilen bir şeyler varsa bekle
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    if (errorBuffer.trim()) {
      pendingRequests++;
      await sendErrorToBackend(errorBuffer.trim());
      pendingRequests--;
    }
  }

  // Devam eden HTTP isteklerini bekle
  const waitInterval = setInterval(() => {
    if (pendingRequests === 0) {
      clearInterval(waitInterval);
      console.log(`\n\x1b[36m[ResiliEngine Guard]\x1b[0m İzleme tamamlandı. Çıkış kodu: ${code}`);
      process.exit(code);
    }
  }, 100);
});
