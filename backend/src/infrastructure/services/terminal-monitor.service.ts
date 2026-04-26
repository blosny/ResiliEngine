import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { spawn, ChildProcess } from 'child_process';
import { Subject } from 'rxjs';

@Injectable()
export class TerminalMonitorService implements OnModuleDestroy {
  private readonly logger = new Logger(TerminalMonitorService.name);
  private child: ChildProcess | null = null;

  private logStream = new Subject<string>();
  public log$ = this.logStream.asObservable();

  // İsmin tam olarak 'monitorCommand' olduğundan emin oluyoruz:
  monitorCommand(command: string, args: string[] = []) {
    this.logger.log(`Sistem izleniyor: ${command} ${args.join(' ')}`);

    this.child = spawn(command, args, {
      shell: true,
      stdio: 'pipe',
    });

    this.child.stdout?.on('data', (data) => {
      const output = data.toString();
      this.logStream.next(output);
      console.log(`[TERMINAL-OUT]: ${output}`);
    });

    this.child.stderr?.on('data', (data) => {
      const errorOutput = data.toString();
      this.logStream.next(`[ERROR]: ${errorOutput}`);
      console.error(`[TERMINAL-ERR]: ${errorOutput}`);
    });

    this.child.on('close', (code) => {
      this.logger.warn(`İzlenen terminal süreci kapandı. Kod: ${code}`);
    });
  }

  onModuleDestroy() {
    if (this.child) {
      this.child.kill();
    }
  }
}
