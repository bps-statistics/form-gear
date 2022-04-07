import { createSignal, For, Match, Show, Switch } from "solid-js";
import { FormComponentBase } from "../FormType"


const ToggleInput: FormComponentBase = props => {
    const [val, setVal] = createSignal(props.value !== '' ? props.value : false);

    const [instruction, setInstruction] = createSignal(false);
    const showInstruction = () => {
      (instruction()) ? setInstruction(false) : setInstruction(true);
    }

    return (
        
    <div class="grid md:grid-cols-8 grid-cols-8 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2">
        <div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-7">            
            <div
                classList={{
                    ' border-b border-orange-500 pb-3 ' : props.classValidation === 1,
                    ' border-b border-pink-600 pb-3 ' : props.classValidation === 2,
                }}>        
                <div class="inline-flex space-x-2"> 
                    <div innerHTML={props.component.label} />          
                    <Show when={props.component.hint}>
                    <button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"
                        onClick={showInstruction}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    </Show>
                </div>
                <div class="flex mt-2">
                    <Show when={instruction()}>
                    <div class="italic text-xs font-extralight text-zinc-400 " innerHTML={props.component.hint} />
                    </Show>
                </div>
            </div>
            <Show when={props.validationMessage.length > 0}>
                <For each={props.validationMessage}>
                {(item:any) => (
                    <div 
                    class="text-xs font-light mt-1"> 
                    <div class="grid grid-cols-12"                  
                        classList={{
                        ' text-orange-500 dark:text-orange-200 ' : props.classValidation === 1,
                        ' text-pink-600 dark:text-pink-200 ' : props.classValidation === 2,
                        }} >
                        <Switch>
                        <Match when={props.classValidation === 1}>
                            <div class="col-span-1 flex justify-center items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            </div>
                        </Match>
                        <Match when={props.classValidation === 2}>
                            <div class="col-span-1 flex justify-center items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </div>
                        </Match>
                        </Switch>
                        <div class="col-span-11 text-justify mr-1" innerHTML={item}/>
                    </div>
                    </div>
                )}
                </For>
            </Show>
        </div>
        <div class="font-light text-sm space-x-2 py-2.5 px-2 flex justify-end">
            <button onClick={(e) =>  props.onValueChange(!val())}
                classList={{'bg-blue-600': val() === true, 'bg-gray-200': val()=== false, }}
                type="button"
                class="relative inline-flex flex-shrink-0
                    h-7 w-12 border-2 border-transparent rounded-full
                    cursor-pointer shadow-sm transition-colors duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                "
                >
                <span
                    classList={{'translate-x-5': val()=== true, 'translate-x-0': val()=== false, }}
                    class="relative inline-block h-6 w-6 ring-0
                    rounded-full transform bg-white shadow
                    transition duration-200 ease-in-out pointer-events-none
                    "
                >
                    <span
                    classList={{'opacity-0 ease-out duration-100': val()=== true, 'opacity-100 ease-in duration-200': val()=== false, }}
                    class="absolute inset-0 h-full w-full flex justify-center items-center transition-opacity
                    "
                    >
                    <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                        <path
                        d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        />
                    </svg>
                    </span>
                    <span
                    classList={{'opacity-100 ease-in duration-200': val()=== true, 'opacity-0 ease-out duration-100': val()=== false, }}
                    class=" absolute inset-0 h-full w-full flex items-center justify-center transition-opacity "
                    >
                    <svg
                        class="h-3 w-3 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 12 12"
                    >
                        <path
                        d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
                        />
                    </svg>
                    </span>
                </span>
            </button>
        </div>
    </div>
    
    )
}

export default ToggleInput