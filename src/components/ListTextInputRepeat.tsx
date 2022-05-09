import { FormComponentBase } from "../FormType"
import { For, Switch, Match, Show, createMemo, createSignal } from 'solid-js'
import Toastify from 'toastify-js'

const ListTextInputRepeat: FormComponentBase = props => {
	const [flag, setFlag] = createSignal(0); //untuk flag open textinput
	const [edited, setEdited] = createSignal(0); //untuk flag id yg akan diedit
	const [localAnswer, setLocalAnswer] = createSignal(JSON.parse(JSON.stringify(props.value)))
	const [tmpInput, setTmpInput] = createSignal('');

	const config = props.config
	const [disableInput] = createSignal((config.formMode > 2 ) ? true : props.component.disableInput)

	let getLastId = createMemo(() => {
		const lastId = props.value[0].label.split("#");
		return Number(lastId[1]);
	})

	let handleOnPlus = () => {
		if(flag() === 0 && edited() === 0){
			setFlag(1);//plus / edit
			setEdited(0);
		} else {
			toastInfo("Only 1 component is allowed to edit");
		}
	}

	let handleOnEdit = (id:number) => {
		if(flag() === 0 && edited() === 0){
			setFlag(1);//plus / edit
			setEdited(id);
		} else {
			toastInfo("Only 1 component is allowed to edit");
		}
	}
	
	let handleOnCancel = (id:number) => {
		setFlag(0);
		setEdited(0);
		setTmpInput('');
	}

	let handleOnDelete = (id:number) => {
		if(flag() === 0 && edited() === 0){
			setFlag(2);
			setEdited(id);
			modalDelete();
		} else if(flag() === 1){
			toastInfo("Only 1 component is allowed to edit");
		} else if(flag() === 2){
			let updatedAnswer = JSON.parse(JSON.stringify(localAnswer()));
			let answerIndex = updatedAnswer.findIndex((item) => item.value == id);
			updatedAnswer.splice(answerIndex,1);
			
			props.onValueChange(updatedAnswer);
			toastInfo("The component was successfully deleted!");
			setFlag(0);
			setEdited(0);
		}
	}

	let handleOnSave = (id:number) => {
		if(tmpInput() !== ""){
			let duplicate = 0;
			const localAnswerLength = localAnswer().length;
			if(localAnswerLength > 0){
				for(let j = 0; j < localAnswerLength; j++){
					if(localAnswer()[j].label === tmpInput().trim()){
						duplicate = 1;
						break;
					}
				}
			}
			if(duplicate === 0){
				let updatedAnswer = JSON.parse(JSON.stringify(localAnswer()));
				if(edited() === 0){
					updatedAnswer = [...updatedAnswer,{"value":id,"label":tmpInput()}];
					updatedAnswer[0].label = "lastId#"+id;
				} else {
					let answerIndex = updatedAnswer.findIndex((item) => item.value == id)
					updatedAnswer[answerIndex].label = tmpInput();
				}
				
				props.onValueChange(updatedAnswer);
				if(edited() === 0){
					toastInfo("The component was successfully added!");
				} else {
					toastInfo("The component was successfully edited!");
				}
				setFlag(0);
				setEdited(0);
			} else {
				toastInfo("This component has already being selected");
			}
		} else {
			if(edited() === 0){
				toastInfo("The component can not be empty");
			} else {
				setFlag(0);
				setEdited(0);
			}
		}
	}

	let handleOnChange = (e:any) => {
		setTmpInput(e.target.value.trim());
    }

	const modalDelete = () => {
		let titleModal = document.querySelector("#titleModalDelete");
		let contentModal = document.querySelector("#contentModalDelete");
		titleModal.innerHTML = props.component.titleModalDelete !== undefined ? props.component.titleModalDelete : 'Confirm Delete?' ;
		contentModal.innerHTML = props.component.contentModalDelete !== undefined ? props.component.contentModalDelete : 'Deletion will also delete related components, including child components from this parent.';
    }

	const toastInfo = (text:string) => {
		Toastify({
			text: (text == '') ? "The component was successfully deleted!" : text,
			duration: 3000,
			gravity: "top", 
			position: "right", 
			stopOnFocus: true, 
			className: "bg-blue-600/80",
			style: {
				background: "rgba(8, 145, 178, 0.7)",
				width: "400px"
			}
		}).showToast();
	}
	
	const [instruction, setInstruction] = createSignal(false);
	const showInstruction = () => {
	  (instruction()) ? setInstruction(false) : setInstruction(true);
	}
  	
	return (
		<div>
			<Show when={(flag() == 2) }>
				<div class="modal-delete fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
					<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
						
						<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

						<div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
						<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<div class="sm:flex sm:items-start">
							<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
								<svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
							<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 class="text-lg leading-6 font-medium text-gray-900" id="titleModalDelete">Deactivate account</h3>
								<div class="mt-2">
								<p class="text-sm text-gray-500" id="contentModalDelete">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undonssse.</p>
								</div>
							</div>
							</div>
						</div>
						<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
							<button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={e => handleOnDelete(edited())}>Delete</button>
							<button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={e => handleOnCancel(edited())}>Cancel</button>
						</div>
						</div>
					</div>
				</div>
			</Show>
			<div class="grid grid-cols-6 p-2">

				<div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-5">
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

				<div class="font-light text-sm space-x-2 pt-2.5 px-2 flex justify-end ">
					<button class="bg-pink-600 text-white p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-pink-500  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400" 
						disabled = { disableInput() }
						onClick={e => handleOnPlus()}>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
						</svg>
					</button>
				</div>				
				
			</div>
			<div class="grid md:grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2">
				<div class="font-light text-sm  pb-2.5 px-2 col-start-2 col-end-12 space-y-4 transition-all delay-100">
					<For each={localAnswer()}>
						{(item:any, index) => (
							<Switch>
								<Match when={(Number(item.value) > 0 && Number(item.value) === edited())}>
									<div class="grid grid-cols-12">
										<div class="col-span-10 mr-2">
											<input type="text" id={ props.component.dataKey+"_input_"+(Number(item.value))} value={item.label}
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
												onchange={(e) => handleOnChange(e)}
											/>
										</div>
										<div class="col-span-2 flex justify-evenly p-1 space-x-1 ">
											<button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300" onClick={e => handleOnSave(Number(item.value))}>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
													<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
												</svg>
											</button>
											<button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400" onClick={e => handleOnCancel(Number(item.value))}>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
													<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
												</svg>
											</button>
										</div>
									</div>
								</Match>
								<Match when={(Number(item.value) > 0 && Number(item.value) !== edited())}>
									<div class="grid grid-cols-12">
										<div class="col-span-10 mr-2">
											<input type="text" id={ props.component.dataKey+"_input_"+(Number(item.value))} value={item.label}
												class="w-full
													font-light
													px-4
													py-2.5
													text-sm
													text-gray-700
													bg-gray-200 bg-clip-padding
													dark:bg-gray-300
													border border-solid border-gray-300
													rounded
													transition
													ease-in-out
													m-0
													focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
													disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
												disabled
											/>
										</div>
										<div class="col-span-2 flex justify-evenly p-1 space-x-1 ">
											<button class="bg-orange-400 text-white p-2 rounded-full focus:outline-none hover:bg-orange-300" onClick={e => handleOnEdit(Number(item.value))}>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
													<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
												</svg>
											</button>
											<button class="bg-red-600 text-white p-2 rounded-full focus:outline-none hover:bg-red-500" onClick={e => handleOnDelete(Number(item.value))}>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
													<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
												</svg>
											</button>
										</div>
									</div>
								</Match>
							</Switch>
						)}
					</For>
					<Show when={(flag() == 1 && edited() == 0) }>
						<div class="grid grid-cols-12 ">
							<div class="col-span-10 mr-2">
								<input type="text" id={ props.component.dataKey+"_input_"+(getLastId()+1)}
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
									onchange={(e) => handleOnChange(e)}
								/>
							</div>
							<div class="col-span-2 flex justify-evenly p-1 space-x-1 ">
								<button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300" onClick={e => handleOnSave((getLastId()+1))}>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								</button>
								<button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400" onClick={e => handleOnCancel((getLastId()+1))}>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
									</svg>
								</button>
							</div>
						</div>
					</Show>
				</div>
				
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

export default ListTextInputRepeat