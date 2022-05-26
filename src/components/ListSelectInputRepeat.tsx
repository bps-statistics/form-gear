import { FormComponentBase } from "../FormType"
import { For, Switch, createResource, Match, Show, createMemo, createSignal, createEffect } from 'solid-js'
import { reference, setReference } from '../stores/ReferenceStore'
import { Select, createOptions } from "@thisbeyond/solid-select"
import "@thisbeyond/solid-select/style.css"
import Toastify from 'toastify-js'
import { locale, setLocale } from '../stores/LocaleStore'
import LogoImg from "../assets/loading.png"

const ListSelectInputRepeat: FormComponentBase = props => {
	const [flag, setFlag] = createSignal(0); //untuk flag open textinput
	const [edited, setEdited] = createSignal(0); //untuk flag id yg akan diedit / hapus
	const [localAnswer, setLocalAnswer] = createSignal(JSON.parse(JSON.stringify(props.value)));
	const [tmpSelected, setTmpSelected] = createSignal({ value: 0, label: '' });
	const [isError, setisError] = createSignal(false);

	const config = props.config
	const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

	let getLastId = createMemo(() => {
		return 0;
	})

	let options
	let getOptions

	type contentMeta = {
		name: string,
		type: string
	}

	// type contentData = {
	// 	data: [],
	// 	metadata: contentMeta[],
	// 	tableName: String,
	// }

	type optionSelect = {
		success: boolean,
		data: [],
		message: string,

	}

	const toastInfo = (text: string, color: string) => {
		Toastify({
			text: (text == '') ? "" : text,
			duration: 3000,
			gravity: "top",
			position: "right",
			stopOnFocus: true,
			className: (color == '') ? "bg-blue-600/80" : color,
			style: {
				background: "rgba(8, 145, 178, 0.7)",
				width: "400px"
			}
		}).showToast();
	}

	switch (props.component.typeOption) {
		case 1: {
			try {
				getOptions = createMemo(() => {

					let options = JSON.parse(JSON.stringify(props.component.options));

					const localAnswerLength = localAnswer().length;

					let j = 0;
					if (localAnswer()[0] !== undefined) {
						j = (localAnswer()[0].value == 0) ? 1 : 0;
					}

					for (j; j < localAnswerLength; j++) {
						if (edited() === 0 || edited() !== Number(localAnswer()[j].value)) {
							let optionsIndex = options.findIndex((item) => item.value == localAnswer()[j].value);
							options.splice(optionsIndex, 1);
						}
					}

					return options
				})
			} catch (e) {
				setisError(true)
				toastInfo(locale.details.language[0].fetchFailed, 'bg-pink-700/80')
			}

			break
		}

		case 2: {
			try {
				if (config.lookupMode === 1) {
					let url
					let params
					let urlHead
					let urlParams

					params = props.component.sourceSelect
					// url = `${config.baseUrl}/${params[0].id}`
					url = `${config.baseUrl}/${params[0].id}/filter?version=${params[0].version}`


					if (params[0].parentCondition.length > 0) {
						urlHead = url

						urlParams = params[0].parentCondition.map((item, index) => {
							let newParams = item.value.split('@');
							let tobeLookup = reference.details.find(obj => obj.dataKey == newParams[0])
							if (tobeLookup.answer) {
								if (tobeLookup.answer.length > 0) {
									let parentValue = tobeLookup.answer[tobeLookup.answer.length - 1].value
									url = `${config.lookupKey}=${item.key}&${config.lookupValue}=${parentValue}`
								}
							} else {
								url = `${config.lookupKey}=${item.key}&${config.lookupValue}=''`
							}

							return url
						}).join('&')

						// url = `${urlHead}?${urlParams}`
						url = `${urlHead}&${urlParams}`

					}

					const [fetched] = createResource<optionSelect>(url, props.MobileOnlineSearch);
					let arr = []

					getOptions = createMemo(() => {
						if (fetched()) {
							if (!fetched().success) {
								setisError(true)
								toastInfo(locale.details.language[0].fetchFailed, 'bg-pink-700/80')
							} else {
								// let cekValue = fetched().data.metadata.findIndex(item => item.name == params[0].value)
								// let cekLabel = fetched().data.metadata.findIndex(item => item.name == params[0].desc)

								let cekValue = params[0].value
								let cekLabel = params[0].desc

								fetched().data.map((item, value) => {
									arr.push(
										{
											value: item[cekValue],
											label: item[cekLabel],
										}
									)
								})
								options = arr

								const localAnswerLength = localAnswer().length;

								let j = 0;
								if (localAnswer()[0] !== undefined) {
									j = (localAnswer()[0].value == 0) ? 1 : 0;
								}

								for (j; j < localAnswerLength; j++) {
									if (edited() === 0 || edited() !== Number(localAnswer()[j].value)) {
										let optionsIndex = options.findIndex((item) => item.value == localAnswer()[j].value);
										options.splice(optionsIndex, 1);
									}
								}

								return options
							}
						}
					})
				} else if (config.lookupMode === 2) {
                    let params
                    let tempArr = []

                    params = props.component.sourceSelect
                    let id = params[0].id
                    let version = params[0].version

                    if (params[0].parentCondition.length > 0) {
                        params[0].parentCondition.map((item, index) => {
                            let newParams = item.value.split('@');

                            let tobeLookup = reference.details.find(obj => obj.dataKey == newParams[0])
                            if (tobeLookup.answer) {
                                if (tobeLookup.answer.length > 0) {
                                    let parentValue = tobeLookup.answer[tobeLookup.answer.length - 1].value.toString()
                                    tempArr.push({ "key": item.key, "value": parentValue })
                                }
							}
                        })
                    }
                    // console.log('id : ', id)
                    // console.log('version : ', version)
                    // console.log('kondisi : ', tempArr)

                    let getResult = (result) => {
						getOptions = createMemo(() => {
							if(!result.success){
								setisError(true)
								toastInfo(locale.details.language[0].fetchFailed, 'bg-pink-700/80')
							} else {
								let arr = []
								if (result.data.length > 0) {
									let cekValue = params[0].value
									let cekLabel = params[0].desc
		
									result.data.map((item, value) => {
										arr.push(
											{
												value: item[cekValue],
												label: item[cekLabel],
											}
										)
									})
									options = arr;
		
									const localAnswerLength = localAnswer().length;
	
									let j = 0;
									if (localAnswer()[0] !== undefined) {
										j = (localAnswer()[0].value == 0) ? 1 : 0;
									}
	
									for (j; j < localAnswerLength; j++) {
										if (edited() === 0 || edited() !== Number(localAnswer()[j].value)) {
											let optionsIndex = options.findIndex((item) => item.value == localAnswer()[j].value);
											options.splice(optionsIndex, 1);
										}
									}
	
									return options
								}
							}
						})

                    }

                    const fetched = props.MobileOfflineSearch(id, version, tempArr, getResult);
				}

			} catch (e) {
				setisError(true)
				toastInfo(locale.details.language[0].fetchFailed, 'bg-pink-700/80')
			}

			break;
		}

		case 3: {
			try {
				getOptions = createMemo(() => {

					let options = props.component.sourceOption !== undefined ? [] : JSON.parse(JSON.stringify(props.component.options));
					if (props.component.sourceOption !== undefined) {
						const componentAnswerIndex = reference.details.findIndex(obj => obj.dataKey === props.component.sourceOption);
						if ((reference.details[componentAnswerIndex].type === 21 || 22 || 23 || 26 || 27 || 29)
							|| (reference.details[componentAnswerIndex].type === 4 && reference.details[componentAnswerIndex].renderType === 2)) {
							if (reference.details[componentAnswerIndex].answer) {
								options = JSON.parse(JSON.stringify(reference.details[componentAnswerIndex].answer))
							} else {
								options = []
							}
						}
					}
					const localAnswerLength = localAnswer().length;

					let j = 0;
					if (localAnswer()[0] !== undefined) {
						j = (localAnswer()[0].value == 0) ? 1 : 0;
					}

					for (j; j < localAnswerLength; j++) {
						if (edited() === 0 || edited() !== Number(localAnswer()[j].value)) {
							let optionsIndex = options.findIndex((item) => item.value == localAnswer()[j].value);
							options.splice(optionsIndex, 1);
						}
					}

					return options

				})
			} catch (e) {
				setisError(true)
				toastInfo(locale.details.language[0].fetchFailed, 'bg-pink-700/80')
			}

			break

		}

		default: {
			try {
				getOptions = createMemo(() => {
					let options
					if (props.component.options) {
						options = JSON.parse(JSON.stringify(props.component.options));

						const localAnswerLength = localAnswer().length;

						let j = 0;
						if (localAnswer()[0] !== undefined) {
							j = (localAnswer()[0].value == 0) ? 1 : 0;
						}

						for (j; j < localAnswerLength; j++) {
							if (edited() === 0 || edited() !== Number(localAnswer()[j].value)) {
								let optionsIndex = options.findIndex((item) => item.value == localAnswer()[j].value);
								options.splice(optionsIndex, 1);
							}
						}


					} else {
						options = [];
					}

					return options

				})
			} catch (e) {
				setisError(true)
				toastInfo(locale.details.language[0].fetchFailed, 'bg-pink-700/80')
			}

			break;
		}
	}


	let handleOnPlus = () => {
		if (flag() === 0 && edited() === 0) {
			setFlag(1);//plus / edit
			setEdited(0);
		} else {
			toastInfo(locale.details.language[0].componentNotAllowed, '');
		}
	}

	let handleOnEdit = (id: number) => {
		if (flag() === 0 && edited() === 0) {
			setFlag(1);//plus / edit
			setEdited(id);
		} else {
			toastInfo(locale.details.language[0].componentNotAllowed, '');
		}
	}

	let handleOnCancel = (id: number) => {
		setFlag(0);
		setEdited(0);
		setTmpSelected({ value: 0, label: '' });
	}

	let handleOnDelete = (id: number) => {
		if (flag() === 0 && edited() === 0) {//buka modal
			setFlag(2);
			setEdited(id);
			modalDelete();
		} else if (flag() === 1) {//tidak bisa buka modal karena isian lain terbuka
			toastInfo(locale.details.language[0].componentNotAllowed, '');
		} else if (flag() === 2) {
			let updatedAnswer = JSON.parse(JSON.stringify(localAnswer()));
			let answerIndex = updatedAnswer.findIndex((item) => item.value == id);
			updatedAnswer.splice(answerIndex, 1);

			props.onValueChange(updatedAnswer);
			toastInfo(locale.details.language[0].componentDeleted, '');
			setFlag(0);
			setEdited(0);
		}
	}

	let handleOnSave = (id: number) => {
		if (tmpSelected().value !== 0) {
			let updatedAnswer = JSON.parse(JSON.stringify(localAnswer()));
			if (edited() === 0) {//insert
				if (updatedAnswer.length == 0) {
					updatedAnswer = [...updatedAnswer, {
						"label": "lastId#0",
						"value": "0"
					}];
				}
				updatedAnswer = [...updatedAnswer, tmpSelected()];
			} else {//update
				let answerIndex = updatedAnswer.findIndex((item) => item.value == id)
				updatedAnswer.splice(answerIndex, 1, tmpSelected());
			}

			props.onValueChange(updatedAnswer);

			if (edited() === 0) {
				toastInfo(locale.details.language[0].componentAdded, '');
			} else {
				toastInfo(locale.details.language[0].componentEdited, '');
			}
			setFlag(0);
			setEdited(0);
		} else {
			if (edited() === 0) {
				toastInfo(locale.details.language[0].componentEmpty, '');
			} else {
				setFlag(0);
				setEdited(0);
			}
		}
	}

	let handleOnChange = (value: any) => {
		setTmpSelected(value);
	}

	const modalDelete = () => {
		let titleModal = document.querySelector("#titleModalDelete");
		let contentModal = document.querySelector("#contentModalDelete");
		titleModal.innerHTML = props.component.titleModalDelete !== undefined ? props.component.titleModalDelete : 'Confirm Delete?';
		contentModal.innerHTML = props.component.contentModalDelete !== undefined ? props.component.contentModalDelete : 'Deletion will also delete related components, including child components from this parent.';
	}

	const [instruction, setInstruction] = createSignal(false);
	const showInstruction = () => {
		(instruction()) ? setInstruction(false) : setInstruction(true);
	}

	return (

		<div>
			<Show when={(flag() == 2)}>
				<div class="model-delete fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
											<p class="text-sm text-gray-500" id="contentModalDelete">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p>
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

				<Show when={!isError()}>
					<div class="font-light text-sm space-x-2 pt-2.5 px-2 flex justify-end">
						<button class="bg-pink-600 text-white p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-pink-500  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
							disabled={disableInput()}
							onClick={e => handleOnPlus()}>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
							</svg>
						</button>
					</div>
				</Show>

			</div>
			<div class="grid md:grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2">
				<div class="font-light text-sm  pb-2.5 px-2 col-start-2 col-end-12 space-y-4">
					<For each={localAnswer()}>
						{(item: any, index) => (
							<Switch>
								<Match when={(Number(item.value) > 0 && Number(item.value) === edited())}>
									<div class="grid grid-cols-12">
										<div class="col-span-10 mr-2">
											<Select
												class="formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none"
												{...createOptions(
													getOptions(),
													{ key: "label", filterable: true })}
												onChange={(e) => handleOnChange(e)}
												initialValue={item}
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
											<input type="text" id={props.component.dataKey + "_input_" + (Number(item.value))} value={item.label}
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
					<Show when={(flag() == 1 && edited() == 0)}>
						<div class="grid grid-cols-12 ">
							<div class="col-span-10 mr-2">
								<Select
									class="formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none"
									{...createOptions(getOptions(), { key: "label", filterable: true })}
									onChange={(e) => handleOnChange(e)}
								/>
							</div>
							<div class="col-span-2 flex justify-evenly p-1 space-x-1 ">
								<button class="bg-teal-400 text-white p-2 rounded-full focus:outline-none hover:bg-teal-300" onClick={e => handleOnSave(getLastId())}>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								</button>
								<button class="bg-gray-500 text-white p-2 rounded-full focus:outline-none hover:bg-gray-400" onClick={e => handleOnCancel(getLastId())}>
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
						' border-b border-orange-500 pb-3 ': props.classValidation === 1,
						' border-b border-pink-600 pb-3 ': props.classValidation === 2,
					}}>
				</div>
				<div class="col-span-12 pb-4">
					<Show when={props.validationMessage.length > 0}>
						<For each={props.validationMessage}>
							{(item: any) => (
								<div
									class="text-xs font-light mt-1">
									<div class="grid grid-cols-12"
										classList={{
											' text-orange-500 dark:text-orange-200 ': props.classValidation === 1,
											' text-pink-600 dark:text-pink-200 ': props.classValidation === 2,
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
										<div class="col-span-11 text-justify mr-1" innerHTML={item} />
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

export default ListSelectInputRepeat