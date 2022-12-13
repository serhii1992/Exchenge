export const onlyNumbers = (value: string): string => value.replace(/[^\d.]|\.(?=\.+)/g,'').replace(/^\D/g,'0.').replace(/(?<=\.|(\..*))\.$/g,'');

export const removeDot = (str: string): string => str.replace(/\.$/g,'')