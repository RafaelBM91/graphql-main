import Constructor from '../utils/Constructor';
import { CollectionModel, ComposeModel } from '../models';

const WithMutation = <TBase extends Constructor> (Base: TBase) =>
    class Mutation extends Base {
        public collection: CollectionModel;
        protected resolveOptionName: Function;
        protected resolveArguments: Function;
        protected resolveVariable: Function;
        protected RegistryFragments: Function;
        protected compose: Function;
        public mutation = (...args: any[]): void => {
            try {
                this.resolveArguments(args, (query: string) => {
                    let name: string = this.resolveOptionName(
                        query,
                        'mutation',
                        Object.keys(this.collection.mutation).length
                    );
                    let variables: string[] = this.resolveVariable(query);
                    let fragments: string[] = this.RegistryFragments(query);
                    let object: ComposeModel = {
                        name,
                        query,
                        variables,
                        fragments
                    };
                    this.collection.mutation[name] = {
                        ...object,
                        compose: this.compose(object)
                    }
                });
            } catch (e) {
                console.error(e);
            }
        }
    }

export default  WithMutation;
