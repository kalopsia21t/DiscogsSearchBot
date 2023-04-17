type IParams = {
  title?: string;
  release_title?: string;
  style?: string;
};

export interface IDiscogsDatabase {
  search?(params: IParams, cb: (err: any, data: any) => void): void;
}
