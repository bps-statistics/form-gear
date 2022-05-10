import { createEffect, createSignal, Switch, Match, Show, For } from "solid-js";
import { FormComponentBase } from "../FormType";
import Toastify from 'toastify-js'
import dayjs from "dayjs";

const NowInput: FormComponentBase = props => {
  const [showModal, setShowModal] = createSignal(0);
  
  const [instruction, setInstruction] = createSignal(false);
  const showInstruction = () => {
    (instruction()) ? setInstruction(false) : setInstruction(true);
  }

  const [enableRemark] = createSignal(props.component.enableRemark !== undefined ? props.component.enableRemark : true);

  const handleOnClick = () => {
    setShowModal(1);
    modalConfirmation();
  }

  const handleOnPick = () => {
    let dateNow = dayjs().format('YYYY-MM-DD HH:mm:ss');
    props.onValueChange(dateNow);
  }

  let handleOnCancel = () => {
		setShowModal(0);
	}

  const modalConfirmation = () => {
		let titleModal = document.querySelector("#titleModalConfirmation");
		let contentModal = document.querySelector("#contentModalConfirmation");
		titleModal.innerHTML = props.component.titleModalConfirmation !== undefined ? props.component.titleModalConfirmation : 'Confirmation' ;
		contentModal.innerHTML = props.component.contentModalConfirmation !== undefined ? props.component.contentModalConfirmation : 'Are you certain to generate the current time?';
  }

  return (
    <div>
      <Show when={(showModal() == 1) }>
				<div class="modal-confirmation fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
					<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
						
						<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

						<div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
						<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<div class="sm:flex sm:items-start">
							<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
							</div>
							<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 class="text-lg leading-6 font-medium text-gray-900" id="titleModalConfirmation">Confirmation</h3>
								<div class="mt-2">
								<p class="text-sm text-gray-500" id="contentModalConfirmation">Are you sure you want to get present time?</p>
								</div>
							</div>
							</div>
						</div>
						<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
							<button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={e => handleOnPick()}>Get Time</button>
							<button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={e => handleOnCancel()}>Cancel</button>
						</div>
						</div>
					</div>
				</div>
			</Show>

      <div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2">
              
        <div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11">
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

        <div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end items-end -mt-2">
          <button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-teal-200 hover:text-teal-400 hover:border-teal-200 border-2 border-gray-300  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
            onClick={() => handleOnClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <Show when={enableRemark()}>
            <button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full  hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 " onClick={e => props.openRemark(props.component.dataKey)}>
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
          </Show>
        </div>
        
        <Show when={props.value !== ''}>
          <div className="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4 -mt-2">
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{props.value}</span>
          </div>
        </Show>

        <div class="col-span-12"
            classList={{
                ' border-b border-orange-500 pb-3 ' : props.classValidation === 1,
                ' border-b border-pink-600 pb-3 ' : props.classValidation === 2,
            }}>    

        </div>
        <div class="col-span-12 pb-4">
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
               

      </div>
    </div>

  )
}

export default NowInput