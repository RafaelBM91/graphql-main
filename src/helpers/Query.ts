import Constructor from '../utils/Constructor';
import { CollectionModel, ComposeModel } from '../models';

const WithQuery = <TBase extends Constructor> (Base: TBase) =>
    class Query extends Base {
        public collection: CollectionModel;
        protected resolveOptionName: Function;
        protected resolveArguments: Function;
        protected resolveVariable: Function;
        protected RegistryFragments: Function;
        protected compose: Function;
        public query = (...args: any[]): void => {
            try {
                this.resolveArguments(args, (query: string) => {
                    let name: string = this.resolveOptionName(
                        query,
                        'query',
                        Object.keys(this.collection.query).length
                    );
                    let variables: string[] = this.resolveVariable(query);
                    let fragments: string[] = this.RegistryFragments(query);
                    let object: ComposeModel = {
                        name,
                        query,
                        variables,
                        fragments
                    };
                    this.collection.query[name] = {
                        ...object,
                        compose: this.compose(object)
                    }
                });
            } catch (e) {
                console.error(e);
            }
        }
    }

export default  WithQuery;
