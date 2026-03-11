export interface IChaosStrategy {
  name: string;
  execute(): Promise<void>;
}