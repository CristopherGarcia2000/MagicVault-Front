export type Card = {
  name: string
  type_line: string  
  oracle_text: string
  image_uris : {
    png:string
  }
  mana_cost: string,
  power: number,
  toughness: number,
  colors: string[]
  color_identity: string[],
  prices: {
    eur: number | null;
    eur_foil: number | null;
  };
};