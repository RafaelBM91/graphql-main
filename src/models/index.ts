export interface ObjectSimpleModel {
    name: string;
    query: string;
    variables: string[];
    fragments: string[];
    compose: Function;
}

export interface ObjectModel {
    [key: string]: ObjectSimpleModel;
}

export interface CollectionModel {
    query: ObjectModel;
    mutation: ObjectModel;
    fragment: ObjectModel;
}

export interface ComposeModel {
    name: string;
    query: string;
    variables: string[];
    fragments: string[];
}

export interface ComposeEndModel {
    operationName: string;
    query: string;
    variables: Object;
}
