import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('chaos_logs')
export class ChaosLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  target: string;

  @Column()
  status: string;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'text', nullable: true }) // nullable: true olduğundan emin ol
  errorDetails?: string;

  @CreateDateColumn()
  timestamp: Date;
}
