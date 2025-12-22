export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const CN = (values: string[]) => {
  return values.join(" ");
};

export const getLegend = () => {
  const legendArray: number[] = [
    6, 9, 37, 38, 58, 25, 133, 104, 105, 132, 134, 135, 136, 144, 149, 150, 151,
    147, 148, 149, 172, 196, 197, 216, 258, 393, 394, 395, 470, 471, 501, 502,
    700, 778,
  ];
  const randomIndex = Math.floor(Math.random() * legendArray.length);
  return legendArray[randomIndex];
};

export const getRandomNumber = () => Math.floor(Math.random() * 1025) + 1;

export const $ERR = (error: any) => {
  return error instanceof Error
    ? error.message
    : typeof error === "string"
    ? error
    : "에러가 발생했습니다.";
};
