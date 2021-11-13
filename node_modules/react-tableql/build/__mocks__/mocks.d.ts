export declare const mocks: {
    Query: () => {
        allFilms: () => {
            title: string;
            episodeID: number;
            openingCrawl: string;
            director: string;
            producer: string;
            releaseDate: string;
        }[];
        allPeople: () => ({
            id: string;
            name: string;
            height: number;
            mass: number;
            hairColor: string;
            skinColor: string;
            eyeColor: string;
            birthYear: string;
            gender: string;
        } | {
            id: string;
            name: string;
            height: number;
            mass: null;
            hairColor: string;
            skinColor: string;
            eyeColor: string;
            birthYear: string;
            gender: string;
        } | {
            id: string;
            name: string;
            height: null;
            mass: null;
            hairColor: string;
            skinColor: string;
            eyeColor: string;
            birthYear: string;
            gender: string;
        })[];
    };
};
export declare const testMocks: ({
    request: {
        query: import("@apollo/client").DocumentNode;
    };
    result: {
        data: {
            allFilms: {
                title: string;
                episodeID: number;
                openingCrawl: string;
                director: string;
                producer: string;
                releaseDate: string;
            }[];
        };
    };
} | {
    request: {
        query: import("@apollo/client").DocumentNode;
    };
    result: {
        data: {
            allFilms: ({
                id: string;
                name: string;
                height: number;
                mass: number;
                hairColor: string;
                skinColor: string;
                eyeColor: string;
                birthYear: string;
                gender: string;
            } | {
                id: string;
                name: string;
                height: number;
                mass: null;
                hairColor: string;
                skinColor: string;
                eyeColor: string;
                birthYear: string;
                gender: string;
            } | {
                id: string;
                name: string;
                height: null;
                mass: null;
                hairColor: string;
                skinColor: string;
                eyeColor: string;
                birthYear: string;
                gender: string;
            })[];
        };
    };
})[];
