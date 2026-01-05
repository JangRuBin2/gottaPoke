export type PokeDetail = {
  // 설명글
  flavor_text_entries: FlavorText[];
  // 키워드
  genera: Genera[];
  // 이름
  names: Names[];
  id: number;
  // 전설의 포켓몬 여부
  is_legendary: boolean;
  // 환상의 포켓몬 여부
  is_mythical: boolean;
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
export type FlavorText = {
  flavor_text: string;
  language: Language;
};
