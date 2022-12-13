type ToShortStrType = {
  str: string;
  lengthStart?: number;
  lengthEnd?: number;
};

export const toShortStr = ({ str, lengthStart = 6, lengthEnd = 4}: ToShortStrType): string => {
  const reg = new RegExp(`(.{${lengthStart}})(.*)(.{${lengthEnd}})`, "g");

  return str?.replace(reg, "$1...$3");
};
