export interface IDiscogsDatabase {
  search?(params: string[], cb: () => void): void;
}
