export const RegExName: RegExp = /[a-z-A-Z_][a-z-A-Z_0-9]*/;
export const RegExVariable: RegExp = /[$][a-zA-Z_][a-zA-Z0-9_]*/g;
export const RegExOprValid: RegExp = /(query|mutation|fragment)/;
export const RegExFragments: RegExp = /[.][.][.][a-zA-Z_][a-zA-Z_0-9]*/gm;
