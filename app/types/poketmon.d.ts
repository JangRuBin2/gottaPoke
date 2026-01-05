declare global {
  type Cries = {
    latest: string;
    legacy: string;
  };

  type Sprites = {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
    other: {
      showdown: ShowDown;
    };
  };

  type ShowDown = {
    back_default: string;
    back_shiny: string;
    front_shiny: string;
    front_default: string;
  };
  type PokemonType = {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  };

  type Poketmon = {
    // 울음소리
    cries: Cries;
    id: number;
    name: string;
    // 정렬순서인듯함
    order: string;
    // 이미지 및 상세정보
    sprites: Sprites;
    // 무게
    weight: number;
    // 전설의 포켓몬 여부
    is_legendary?: boolean;
    // 환상의 포켓몬 여부
    is_mythical?: boolean;
    // 포켓몬 타입
    types?: PokemonType[];
  };
}
export {};
