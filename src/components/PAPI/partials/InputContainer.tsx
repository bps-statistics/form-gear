import { createSignal, Show } from 'solid-js';

const InputContainer = props => {
    const [instruction, setInstruction] = createSignal(false);
    const showInstruction = () => {
        (instruction()) ? setInstruction(false) : setInstruction(true);
    }

    return (
        <div class="grid md:grid-cols-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2">
            <div class="font-light text-sm space-y-2 py-2.5 px-2">
                <div class="inline-flex space-x-2">
                    <div innerHTML={props.component.label} />
                    <Show when={props.component.required}>
                        <span class="text-pink-600">*</span>
                    </Show>
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

                    {props.optionSection}

                </div>
            </div>
            <div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-1 grid grid-cols-12">
                <div class="col-span-12">
                    {props.children}
                </div>
            </div>
        </div>

    )
}

export default InputContainer