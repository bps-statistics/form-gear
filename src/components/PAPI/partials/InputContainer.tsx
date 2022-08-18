import { createSignal, For, Match, Show, Switch } from 'solid-js';
import { InputContainerBase } from '.';

const InputContainer: InputContainerBase = props => {
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
                    <Show when={props.validationMessage?.length > 0}>
                        <For each={props.validationMessage}>
                            {(item: any) => (
                                <div
                                    class="text-xs font-light mt-1">
                                    <div class="flex"
                                        classList={{
                                            ' text-orange-500 dark:text-orange-200 ': props.classValidation === 1,
                                            ' text-pink-600 dark:text-pink-200 ': props.classValidation === 2,
                                        }} >
                                        <Switch>
                                            <Match when={props.classValidation === 1}>
                                                <div class="mr-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                            </Match>
                                            <Match when={props.classValidation === 2}>
                                                <div class="mr-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </Match>
                                        </Switch>
                                        <div innerHTML={item} />
                                    </div>
                                </div>
                            )}
                        </For>
                    </Show>
                </div>
            </div>
        </div>

    )
}

export default InputContainer