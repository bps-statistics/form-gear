import { createMemo, createSignal, For, Match, Show, Switch } from "solid-js"
import { FormComponentBase } from "../FormType"

const DateTimeLocalInput: FormComponentBase = props => {
  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1 ) ? true : props.component.disableInput)

  let classInput = 'w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';
  
  const [instruction, setInstruction] = createSignal(false);
  const showInstruction = () => {
    (instruction()) ? setInstruction(false) : setInstruction(true);
  }

  const [disableClickRemark] = createSignal((config.formMode > 2  && props.comments == 0 ) ? true : false);
  const [enableRemark] = createSignal(props.component.enableRemark !== undefined ? props.component.enableRemark : true );

  let today = new Date();
  let dd = String(today.getDate());
  let mm = String(today.getMonth() + 1); //January is 0!
  let yyyy = String(today.getFullYear());
  if(Number(dd) < 10){
      dd = '0' + dd
  } 
  if(Number(mm) < 10){
      mm = '0' + mm
  } 
  
  let todayDate = yyyy + '-' + mm + '-' + dd;

  let minDate : any, maxDate: any;
  createMemo(() => {
    if(props.component.rangeInput){
      minDate = (props.component.rangeInput[0].min !== undefined ) ? (props.component.rangeInput[0].min === 'today') ? todayDate : props.component.rangeInput[0].min : '';
      maxDate = (props.component.rangeInput[0].max !== undefined ) ? (props.component.rangeInput[0].max === 'today') ? todayDate : props.component.rangeInput[0].max : '';
    }
  })
  
  return (
		<div class="md:grid md:grid-cols-3 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2">
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
        </div>
      </div>
      <div class="font-light text-sm space-x-2 py-2.5 px-2 md:col-span-2 grid grid-cols-12">
        <div class=""
             classList={{
              'col-span-11 lg:-mr-4' : enableRemark(),
              'col-span-12' : !(enableRemark()),
             }}  >
          <input value={ props.value } type="datetime-local"
                name={ props.component.dataKey } 
                class={ classInput }
                classList={{
                  ' border border-solid border-gray-300 ' : props.classValidation === 0,
                  ' border-orange-500 dark:bg-orange-100 ' : props.classValidation === 1,
                  ' border-pink-600 dark:bg-pink-100 ' : props.classValidation === 2,
                }}
                placeholder="" 
                disabled = { disableInput() }
                onChange={(e) => {
                  props.onValueChange(e.currentTarget.value);
                } }
                min = {minDate+'T00:00'}    
                max = {maxDate+'T23:59'}
          />
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
        <Show when={enableRemark()}>
          <div class=" flex justify-end ">           
              <button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full  hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                  disabled = { disableClickRemark() }
                  onClick={e => props.openRemark(props.component.dataKey)}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6
                            text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full"
                      classList={{
                        'hidden': props.comments === 0
                      }}>
                    {props.comments}
                </span>
              </button>
          </div>
        </Show>
      </div>
    </div>

  )
}

export default DateTimeLocalInput