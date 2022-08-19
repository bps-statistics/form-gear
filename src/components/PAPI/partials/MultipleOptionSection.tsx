import { For, Match, Switch } from "solid-js"
import { OptionSectionBase } from "."

const MultipleOptionSection: OptionSectionBase = props => {

    const tick = (value: string): boolean => {
        return (props.value) ? (props.value.some(d => String(d.value) === String(value)) ? true : false) : false;
    }

    const optionLabel = (value: string) => {
        let optionIndex = props.value.findIndex(d => String(d.value) === String(value))
        return props.value[optionIndex].label
    }

    return (
        <div class="grid font-light text-sm content-start"
            classList={{
                'grid-cols-1': props.component.cols === 1 || props.component.cols === undefined,
                'grid-cols-2': props.component.cols === 2,
                'grid-cols-3': props.component.cols === 3,
                'grid-cols-4': props.component.cols === 4,
                'grid-cols-5': props.component.cols === 5,
            }}
        >
            <For each={props.options}>
                {(item, index) => (
                    <Switch>
                        <Match when={(item.open) && (tick(item.value))}>
                            <div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12">
                                <div class="col-span-1">
                                    <label class="cursor-pointer text-sm" for={"chexbox" + index()}>
                                        <input class="form-check-input appearance-none h-4 w-4 border 
                                                            border-gray-300 rounded-sm bg-white 
                                                            checked:bg-blue-600 checked:border-blue-600 
                                                            focus:outline-none transition duration-200 align-top 
                                                            bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer
                                                            checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 
                                                            disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                                            type="checkbox"
                                            disabled
                                            value={item.value}
                                            checked={(item.value) ? tick(item.value) : false} id={"checkbox-" + props.component.dataKey + "-" + index()}
                                            onChange={e => props.onValueChange(e.currentTarget.value, item.label, item.open)}
                                        />
                                    </label>
                                </div>
                                <div class="col-span-11">
                                    <input type="text" value={optionLabel(item.value)}
                                        class="w-full
                                                            font-light
                                                            px-4
                                                            py-2.5
                                                            text-sm
                                                            text-gray-700
                                                            bg-white bg-clip-padding
                                                            border border-solid border-gray-300
                                                            rounded
                                                            transition
                                                            ease-in-out
                                                            m-0
                                                            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        onChange={e => props.onValueChange(item.value, e.currentTarget.value, item.open)}
                                    />
                                </div>
                            </div>
                        </Match>
                        <Match when={!(item.open) || !(tick(item.value))}>
                            <div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12">
                                <div class="col-span-1">
                                    <label class="cursor-pointer text-sm">
                                        <input class="form-check-input appearance-none h-4 w-4 border 
                                                                border-gray-300 rounded-sm bg-white 
                                                                checked:bg-blue-600 checked:border-blue-600 
                                                                focus:outline-none transition duration-200 mt-1 align-top 
                                                                bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer
                                                                checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 
                                                                disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                                            type="checkbox"
                                            disabled
                                            value={item.value}
                                            checked={(item.value) ? tick(item.value) : false} id={"checkbox-" + props.component.dataKey + "-" + index()} />
                                    </label>
                                </div>
                                <div class="col-span-11" innerHTML={item.label}></div>
                            </div>
                        </Match>
                    </Switch>
                )}
            </For>
        </div>
    )
}

export default MultipleOptionSection