import { mergeProps, onCleanup, onMount } from "solid-js";
import LogoImg from "../assets/loading.png";
// import { useLoaderDispatch } from "./FormLoaderProvider";

export default function FormLoader(props) {

    // const { removeLoader } = useLoaderDispatch();
    let merged = mergeProps({ type: "success", autoHideDuration: 70 }, props);
    let timerRef

    onMount(() => {
        timerRef = setTimeout(() => merged.remove(), merged.autoHideDuration)
    })

    onCleanup(() => {
        clearTimeout(timerRef)
    })

    return (
        <div class="backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <svg class="w-20 h-20 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94.53 98.372"><circle cx="23.536" cy="16.331" r="8.646" style="fill:#0a77e8"/><circle cx="8.646" cy="36.698" r="8.646" style="fill:#0f9af0"/><circle cx="8.646" cy="61.867" r="8.646" style="fill:#0f9af0"/><circle cx="23.536" cy="82.233" r="8.646" style="fill:#13bdf7"/><circle cx="47.361" cy="89.726" r="8.646" style="fill:#13bdf7"/><circle cx="71.282" cy="82.233" r="8.646" style="fill:#18e0ff"/><circle cx="85.884" cy="61.867" r="8.646" style="fill:#65eaff"/><circle cx="85.884" cy="36.698" r="8.646" style="fill:#b2f5ff"/><circle cx="47.361" cy="8.646" r="8.646" style="fill:#1d4970"/></svg>
        </div>
    );
}

