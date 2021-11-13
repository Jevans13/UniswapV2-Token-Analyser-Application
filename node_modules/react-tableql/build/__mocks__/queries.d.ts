export declare const GET_ALL_FILMS = "\n{\n  allFilms {\n    title\n    episodeID\n    releaseDate\n  }\n}\n";
export declare const GET_ALL_PEOPLE = "\n{\n  allPeople {\n    name\n    gender\n    birthYear\n    eyeColor\n    hairColor\n    skinColor\n  }\n}\n";
export declare const FALSE = "\n{\n  allFilms {\n    title {\n      foo\n      bar\n    }\n    episodeID\n    releaseDate\n    foo\n    bar\n  }\n}\n";
export declare const GET_ALL_FILMS_SWAPI = "\n{\n  allFilms(first:7){\n    films{\n      title\n      episodeID\n      releaseDate\n    }\n  }\n}\n";
export declare const GET_ALL_PEOPLE_SWAPI = "\n{\n  allPeople {\n    people {\n      name\n      gender\n      birthYear\n      eyeColor\n      hairColor\n      skinColor\n    }\n  }\n}\n";
