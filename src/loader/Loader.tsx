
import { useLoaderDispatch, useLoaderState } from "./FormLoaderProvider";
import FormLoader from "./FormLoader";

export default function Loader() {
  const { loader } = useLoaderState();
  const { removeLoader } = useLoaderDispatch();

  return (
      <div >
        {loader.map((loader) => (
          <FormLoader 
                remove={removeLoader(loader.id)}
            />
        ))}
      </div>
  );
}
