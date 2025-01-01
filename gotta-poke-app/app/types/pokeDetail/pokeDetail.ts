export type PokeDetail = {
  // 설명글
  flavor_text_entries: FlavorText[];
  // 키워드
  genera: Genera[];
  // 이름
  names: Names[];
  id: number;
};
export type Names = {
  language: Language;
  name: string;
};
export type Genera = {
  genus: string;
  language: Language;
};
type Language = {
  name: string;
  url: string;
};
type FlavorText = {
  flavor_text: string;
};
