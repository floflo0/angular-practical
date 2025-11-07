export enum TileType {
  PLAIN,
  TREE,
  WATER,
}

export const getRandomTileType = (): TileType => {
  return Math.floor(Math.random() * 3);
};
