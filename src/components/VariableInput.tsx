import { For, Switch, Match, Show, createSignal, createEffect } from "solid-js";
import { FormComponentBase } from "../FormType";

const VariableInput: FormComponentBase = props => {
  
	const config = props.config
	const [disableInput] = createSignal((config.formMode > 1 ) ? true : props.component.disableInput)

  let classInput = 'w-full font-light px-4 py-2.5 text-sm text-gray-700 bg-gray-200 bg-clip-padding dark:bg-gray-300 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';
  
  const [answer, setAnswer] = createSignal(props.value)

  createEffect(() => {
    setAnswer(props.value);
  })
  
  return (
      <Show when={(props.component.render)}>
        <div class="grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2">
          <div class="font-light text-sm space-x-2 py-2.5 px-2">
            <div innerHTML={props.component.label} />
          </div>
          <div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-2">
            <Switch>
              <Match when={(props.component.render) && props.component.renderType <= 1}>
                <input  value={ props.value } type="text" 
                        name={ props.component.dataKey } 
												class={classInput}
												disabled
                />
                <small>{props.validationMessage}</small>
              </Match>
              <Match when={(props.component.render) && props.component.renderType === 2}>
                <div class="grid space-y-4">
                  <For each={props.value}>
                    {(item:any, index) => (
                        <input  value={ item.label } type="text" 
                                class={classInput}
                                disabled
                        />
                    )}
                  </For>
                  </div>
              </Match>
            </Switch>
          </div>
        </div>
      </Show>
  )
}

export default VariableInput