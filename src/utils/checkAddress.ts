export const checkAddress = (address: string) => {
  return address.match(/0[x].*/) && address.length == 42;
};
