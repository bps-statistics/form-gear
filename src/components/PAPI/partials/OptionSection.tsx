import { For, Match, Switch } from "solid-js"
import { OptionSectionBase } from "."
import { handleInputFocus, handleInputKeyDown } from "../../../events"

const OptionSection: OptionSectionBase = props => {
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
                    <div class="font-light text-sm space-x-2 py-2.5 px-4 grid grid-cols-12">
                        <div class="col-span-1 text-center">
                            <label class="cursor-pointer text-sm" for={props.component.dataKey + index()}>
                                <input type="radio" checked={props.settedValue === item.value}
                                    class="checked:disabled:bg-gray-500 checked:dark:disabled:bg-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                                    value={item.value} name={props.component.dataKey} id={"radio-" + props.component.dataKey + "-" + index()}
                                    disabled />
                            </label>
                        </div>
                        <Switch>
                            <Match when={(item.open) && (props.settedValue === item.value)}>
                                <div class="col-span-11">
                                    <input type="text" value={(props.value) ? props.value.length > 0 ? props.value[0].label : item.label : item.label}
                                        name={props.component.dataKey} id={props.component.dataKey}
                                        class="w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding
                                    border border-solid border-gray-300 rounded transition ease-in-out m-0
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                                    disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                                        disabled={props.disableInput}
                                        onKeyDown={e => handleInputKeyDown(e, props)}
                                        onFocus={e => handleInputFocus(e, props)}
                                        onChange={e => props.onValueChange(item.value, e.currentTarget.value, item.open)}
                                    />
                                </div>
                            </Match>
                            <Match when={!(item.open) || (props.settedValue !== item.value)}>
                                <div class="col-span-11" innerHTML={item.label}></div>
                            </Match>
                        </Switch>
                    </div>
                )}
            </For>
        </div>
    )
}

export default OptionSection