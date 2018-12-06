import WithQuery from './helpers/Query';
import WithMutation from './helpers/Mutation';
import WithFragment from './helpers/Fragment';
import { CollectionModel, ComposeModel, ComposeEndModel, ObjectSimpleModel } from './models';
import Constructor from './utils/Constructor';
import {
    RegExOprValid,
    RegExName,
    RegExVariable,
    RegExFragments
} from './utils/RegEx';

class DataCollection {
    protected _collection: CollectionModel = {} as any;
    constructor () {
        this.collection.query = {};
        this.collection.mutation = {};
        this.collection.fragment = {};
    }
    get collection (): CollectionModel {
        return this._collection;
    }
    set collection (change: CollectionModel) {
        this._collection = change;
    }
}

const WithCompose = <TBase extends Constructor> (Base: TBase) =>
    class Compose extends Base {
        protected comprobeVariablesPreSend: Function;
        protected RegistryFragments: Function;
        protected addFragment: Function;
        protected compose = (object: ComposeModel): Function =>
            (QueryVariables: Object = {}): ComposeEndModel => {
                try {
                    let addQuery: string = '\n';
                    let {
                        name,
                        query,
                        fragments,
                        variables
                    }: ComposeModel = object;
                    this.comprobeVariablesPreSend(variables, QueryVariables);
                    addQuery = this.addFragment(fragments, [], variables, addQuery);
                    return {
                        operationName: name,
                        query: query + addQuery,
                        variables: QueryVariables
                    };
                } catch(e) {
                    console.error(e);
                }
            }
    }

const WithGmainQL = <TBase extends Constructor> (Base: TBase) =>
    class GmainQL extends Base {
        public collection: CollectionModel;
        protected resolveArguments = (
            args: any[],
            callbackSuccess: Function
        ): void => {
            let query: string = args[0];
            if (query.length) {
                if ( RegExOprValid.test(query) ) {
                    callbackSuccess(query[0]);
                } else {
                    console.warn('Check the syntax of the query the graphql.');
                }
            }
        }
        protected resolveOptionName = (
            query: string,
            option: string,
            collectionLength: number
        ): string => {
            let queryPos: number = query.indexOf(option);
            let optionName: string = '';
            for (let x=(queryPos + (option.length + 1)); (query[x] !== '('); x++) {
                optionName += query[x];
            }
            let resultOperation = optionName.match(RegExName);
            return (resultOperation) ? resultOperation[0] : `anonymous_${collectionLength}`;
        }
        protected resolveVariable = (query: string): string[] => {
            let preSort: RegExpMatchArray = query.match(RegExVariable);
            let variableEnd: string[] = [];
            if (preSort) {
                let variableSort: string[] = preSort.slice().sort();
                for (var i=0; i<variableSort.length; i++) {
                    if (variableEnd.indexOf(variableSort[i]) === -1) {
                        variableEnd.push(variableSort[i]);
                    }
                }
            }
            return variableEnd;
        }
        protected resolveFragmentName = (fragment: string): string => {
            let fragmentPos: number = fragment.indexOf('fragment');
            let onPos: number = fragment.indexOf('on');
            let fragmentName: string = '';
            let resultFragment: RegExpMatchArray = [];
            for (let x=(fragmentPos + 9); x<onPos; x++) {
                fragmentName += fragment[x];
            }
            resultFragment = fragmentName.match(RegExName);
            if (!resultFragment) {
                throw new Error('Fragment of be have a name.');
            }
            return (resultFragment) ? resultFragment[0] : null;
        }
        protected comprobeVariablesPreSend = (
            ListVariables: string,
            QueryVariables: Object
        ): void => {
            for(let key in QueryVariables) {
                if (ListVariables.indexOf(`$${key}`) === -1) {
                    throw new Error(`missing assign variables.`);
                }
            }
        }
        protected RegistryFragments = (query: string): string[] => {
            let fragments: RegExpMatchArray = query.match(RegExFragments) || [];
            for(var i=0; i<fragments.length; i++) {
                fragments[i] = fragments[i].replace(/[.]/g, '');
            }
            return fragments;
        }
        protected addFragment = (
            fragmentArray: string[],
            virtual_fragment: string[],
            OprVariables: string[],
            addQuery: string = ''
        ): string => {
            let { fragment } = this.collection;
            fragmentArray.map(frag => {
                if (virtual_fragment.indexOf(frag) === -1) {
                    let fragment_query: string = fragment[frag].query;
                    virtual_fragment.push(frag);
                    addQuery += fragment_query + '\n';
                    this.checkFragmentVariable(fragment[frag].variables, OprVariables);
                    if (fragment[frag].fragments.length) {
                        this.addFragment(
                            fragment[frag].fragments,
                            virtual_fragment,
                            OprVariables,
                            addQuery
                        );
                    }
                }
            });
            return addQuery;
        }
        protected checkFragmentVariable = (
            fVariables: string[],
            OprVariables: string[]
        ): void => {
            for (let x=0; x<fVariables.length; x++) {
                if (OprVariables.indexOf(fVariables[x]) === -1) {
                    throw new Error(`fragment variables do not match. ~> ${fVariables[x]}`);
                }
            }
        }
    }

const ObjectGmainQL = WithGmainQL(WithMutation(WithQuery(WithFragment(WithCompose(DataCollection)))));

const gmainql = new ObjectGmainQL();

gmainql.mutation`
    mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
        createReview(episode: $ep, review: $review) {
            stars
            commentary
        }
    }
`;

gmainql.query`
    query AllUsers (
        $orderByUser: UserOrderBy,
        $orderByPost: PostOrderBy
        $orderByComment: CommentOrderBy
    ) {
        allUsers(orderBy: $orderByUser) {
            id
            name
            ...AllPostForUser
        }
    }
`;

gmainql.fragment`
    fragment AllPostForUser on User {
        posts(orderBy: $orderByPost) {
            id
            title
            ...AllCommentsForPost
        }
    }
`;

gmainql.fragment`
    fragment AllCommentsForPost on Post {
        comments (orderBy: $orderByComment) {
            id
            text
        }
    }
`;

console.log( gmainql.collection.query.AllUsers.compose({ orderByUser: 'hola', orderByPost: 'hola', orderByComment: 'hola' }) );
