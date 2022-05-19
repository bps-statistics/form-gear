import { createContext, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";

const LoaderStateContext = createContext<{"loader"}>();
const LoaderDispatchContext = createContext<{"setLoader", "removeLoader"}>();

const initialState = {
    loader: [],
  };
export default function FormLoaderProvider(props) {
    const [store, setStore] = createStore(initialState);

    function setLoader() {
        setStore(
            "loader",
                produce((loader : []) => {
                    loader.push({
                        id : 1,
                    });
                })
        );
    }

    const removeLoader = (id) => () => {
        setStore(
          "loader",
          produce((loader : []) => {
            const index = loader.findIndex((s) => s.id === id);
            if (index > -1) {
              loader.splice(index, 1);
            }
          })
        );
      };


    // function removeLoader() {
    //     console.log('rem',store)
    //     setStore("loader", []);
    //     console.log('end rem',store)
    // }

    return (
        <LoaderStateContext.Provider value={store}>
            <LoaderDispatchContext.Provider
                    value={{
                        setLoader,
                        removeLoader
                    }}
                >
                {props.children}
            </LoaderDispatchContext.Provider>
        </LoaderStateContext.Provider>
    );
}


export const useLoaderState = () => useContext(LoaderStateContext);
export const useLoaderDispatch = () => useContext(LoaderDispatchContext);
