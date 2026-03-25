export interface IChaosStrategy {
  name: string;
  execute(config?: any): Promise<void>;
}
