import Constructor from '../utils/Constructor';
import { CollectionModel, ComposeModel } from '../models';

const WithFragment = <TBase extends Constructor> (Base: TBase) =>
    class Fragment extends Base {
        public collection: CollectionModel;
        protected resolveFragmentName: Function;
        protected resolveArguments: Function;
        protected resolveVariable: Function;
        protected RegistryFragments: Function;
        protected compose: Function;
        public fragment = (...args: any[]): void => {
            try {
                this.resolveArguments(args, (query: string) => {
                    let name: string = this.resolveFragmentName(query);
                    let variables: string[] = this.resolveVariable(query);
                    let fragments: string[] = this.RegistryFragments(query);
                    let object: ComposeModel = {
                        name,
                        query,
                        variables,
                        fragments
                    };
                    this.collection.fragment[name] = {
                        ...object,
                        compose: this.compose(object)
                    }
                });
            } catch (e) {
                console.error(e);
            }
        }
    }

export default  WithFragment;
