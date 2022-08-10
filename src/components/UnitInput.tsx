import { createSignal, createResource, createEffect, Show, For, Switch, Match } from "solid-js"
import { FormComponentBase } from "../FormType"
import { Select, createOptions } from "@thisbeyond/solid-select"
import { reference } from '../stores/ReferenceStore'
import Toastify from 'toastify-js'
import { locale } from '../stores/LocaleStore'

const UnitInput: FormComponentBase = props => {
    const config = props.config
    const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)
    const [label, setLabel] = createSignal('');
    const [isLoading, setLoading] = createSignal(false);
    const [options, setOptions] = createSignal([]);
    const [selectedOption, setSelectedOption] = createSignal('');
    const isPublic = false;

    let classInput = 'w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';

    const [instruction, setInstruction] = createSignal(false);
    const showInstruction = () => {
        (instruction()) ? setInstruction(false) : setInstruction(true);
    }
    const [enableRemark] = createSignal(props.component.enableRemark !== undefined ? props.component.enableRemark : true);
    const [disableClickRemark] = createSignal((config.formMode > 2 && props.comments == 0) ? true : false);

    const toastInfo = (text: string) => {
        Toastify({
            text: (text == '') ? "" : text,
            duration: 3000,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            className: "bg-pink-700/80",
            style: {
                background: "rgba(8, 145, 178, 0.7)",
                width: "400px"
            }
        }).showToast();
    }

    let handleOnChange = (value: any, unit: any, isChange: any) => {
        if (isChange == 2 && unit.value != '' && unit.value != undefined) {
            let updatedAnswer = JSON.parse(JSON.stringify(props.value))
            updatedAnswer = []
            updatedAnswer.push({
                value: value,
                unit: unit
            });
            props.onValueChange(updatedAnswer)
        } else {
            let updatedAnswer = JSON.parse(JSON.stringify(props.value))
            updatedAnswer = []
            updatedAnswer.push({
                value: value,
                unit: unit
            });
            props.onValueChange(updatedAnswer)
        }
    }

    type optionSelect = {
        success: boolean,
        data: [],
        message: string,

    }

    switch (props.component.typeOption) {
        case 1: {
            try {
                let options = props.component.options.map((item, value) => {
                    return {
                        value: item.value,
                        label: item.label,
                    }
                })

                let checker = props.value ? props.value != '' ? props.value[0].unit ? props.value[0].unit.value ? props.value[0].unit.value != '' ? props.value[0].unit.value : '' : '' : '' : '' : ''

                createEffect(() => {
                    setLabel(props.component.label)
                    setOptions(options)
                    let ans = options.filter(val => (val.value.includes(checker)))[0] && checker != '' ? options.filter(val => (val.value.includes(checker)))[0].label : 'Select Unit'
                    setSelectedOption(ans)
                    setLoading(true)
                })
            } catch (e) {
                toastInfo(locale.details.language[0].fetchFailed)
            }

            break;
        }

        case 2: {
            try {
                if (config.lookupMode === 1) {
                    let url
                    let params
                    let urlHead
                    let urlParams

                    if (!isPublic) {
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
                                        let parentValue = encodeURI(tobeLookup.answer[tobeLookup.answer.length - 1].value)
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
                    } else {
                        url = `${config.baseUrl}`
                    }
                    // console.log('Lookup URL ', url)

                    const [fetched] = createResource<optionSelect>(url, props.MobileOnlineSearch);
                    let checker = props.value ? props.value != '' ? props.value[0].unit ? props.value[0].unit.value ? props.value[0].unit.value != '' ? props.value[0].unit.value : '' : '' : '' : '' : ''

                    createEffect(() => {
                        setLabel(props.component.label)

                        if (fetched()) {
                            if (!fetched().success) {
                                toastInfo(locale.details.language[0].fetchFailed)
                            } else {
                                let arr

                                if (!isPublic) {
                                    arr = []
                                    // let cekValue = fetched().data.metadata.findIndex(item => item.name == params[0].value)
                                    // let cekLabel = fetched().data.metadata.findIndex(item => item.name == params[0].desc)

                                    let cekValue = params[0].value
                                    let cekLabel = params[0].desc

                                    // fetched().data.data.map((item, value) => {
                                    //     arr.push(
                                    //         {
                                    //             value: item[cekValue],
                                    //             label: item[cekLabel],
                                    //         }
                                    //     )
                                    // })


                                    fetched().data.map((item, value) => {
                                        arr.push(
                                            {
                                                value: item[cekValue],
                                                label: item[cekLabel],
                                            }
                                        )
                                    })
                                } else {
                                    arr = fetched().data
                                }

                                let ans = arr.find(obj => obj.value == checker) && checker != '' ? arr.find(obj => obj.value == checker).label : 'Select Unit'

                                setOptions(arr)
                                setSelectedOption(ans)
                                setLoading(true)
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
                        let arr = []

                        if (result.data.length > 0) {
                            let cekValue = params[0].value
                            let cekLabel = params[0].desc
                            let checker = props.value ? props.value != '' ? props.value[0].unit ? props.value[0].unit.value ? props.value[0].unit.value != '' ? props.value[0].unit.value : '' : '' : '' : '' : ''

                            result.data.map((item, value) => {
                                arr.push(
                                    {
                                        value: item[cekValue],
                                        label: item[cekLabel],
                                    }
                                )
                            })

                            let ans = arr.find(obj => obj.value == checker) && checker != '' ? arr.find(obj => obj.value == checker).label : 'Select Unit'
                            setLabel(props.component.label)
                            setOptions(arr)
                            setSelectedOption(ans)
                            setLoading(true)
                        }
                    }

                    const fetched = props.MobileOfflineSearch(id, version, tempArr, getResult);
                }
            } catch (e) {
                toastInfo(locale.details.language[0].fetchFailed)
            }

            break;
        }

        case 3: {
            try {
                let optionsSource
                let finalOptions
                let checker = props.value ? props.value != '' ? props.value[0].unit ? props.value[0].unit.value ? props.value[0].unit.value != '' ? props.value[0].unit.value : '' : '' : '' : '' : ''

                if (props.component.sourceOption !== undefined && props.component.typeOption === 3) {
                    const componentAnswerIndex = reference.details.findIndex(obj => obj.dataKey === props.component.sourceOption);

                    if ((reference.details[componentAnswerIndex].type === 21 || 22 || 23 || 26 || 27 || 29)
                        || (reference.details[componentAnswerIndex].type === 4 && reference.details[componentAnswerIndex].renderType === 2)) {
                        optionsSource = reference.details[componentAnswerIndex].answer
                        if (optionsSource != undefined) {
                            finalOptions = optionsSource.filter((item, value) => item.value != 0).map((item, value) => {
                                return {
                                    value: item.value,
                                    label: item.label,
                                }
                            })

                        } else {
                            finalOptions = []
                        }
                    }
                }
                let ans = finalOptions.find(obj => obj.value == checker) && checker != '' ? finalOptions.find(obj => obj.value == checker).label : 'Select Unit'

                createEffect(() => {
                    setLabel(props.component.label)

                    setOptions(finalOptions)
                    setSelectedOption(ans)
                    setLoading(true)
                })

            } catch (e) {
                toastInfo(locale.details.language[0].fetchFailed)
            }

            break;
        }

        default: {
            try {
                let options
                if (props.component.options) {
                    options = props.component.options.map((item, value) => {
                        return {
                            value: item.value,
                            label: item.label,
                        }
                    })

                } else {

                    options = []
                }

                let checker = props.value ? props.value != '' ? props.value[0].unit ? props.value[0].unit.value ? props.value[0].unit.value != '' ? props.value[0].unit.value : '' : '' : '' : '' : ''

                createEffect(() => {
                    setLabel(props.component.label)
                    setOptions(options)
                    let ans = options.filter(val => (val.value.includes(checker)))[0] && checker != '' ? options.filter(val => (val.value.includes(checker)))[0].label : 'Select Unit'
                    setSelectedOption(ans)
                    setLoading(true)

                })
            } catch (e) {
                toastInfo(locale.details.language[0].fetchFailed)
            }

            break;
        }
    }

    return (
        <div class="grid md:grid-cols-3  p-2 border-b border-gray-300/[.40] dark:border-gray-200/[.10]">
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
                        'col-span-5 lg:mr-1': enableRemark(),
                        'col-span-5 mr-1': !(enableRemark()),
                    }}  >
                    <Show when={props.component.lengthInput === undefined}>
                        <input value={props.value != undefined ? props.value != '' ? props.value[0].value : '' : ''} type="number"
                            name={props.component.dataKey}
                            class={classInput}
                            classList={{
                                ' border border-solid border-gray-300 ': props.classValidation === 0,
                                ' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
                                ' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
                            }}
                            placeholder="Value"
                            disabled={disableInput()}
                            onChange={(e) => {
                                handleOnChange(e ? e.currentTarget.value : '', props.value != undefined && props.value != '' ? props.value[0].unit ? props.value[0].unit : { value: '', label: '' } : { value: '', label: '' }, 1)
                            }}
                        />
                    </Show>
                    <Show when={props.component.lengthInput !== undefined && props.component.lengthInput.length > 0}>
                        <input value={props.value != undefined ? props.value != '' ? props.value[0].value : '' : ''} type="number"
                            name={props.component.dataKey}
                            class={classInput}
                            classList={{
                                ' border border-solid border-gray-300 ': props.classValidation === 0,
                                ' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
                                ' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
                            }}
                            placeholder="Value"
                            disabled={disableInput()}
                            onChange={(e) => {
                                handleOnChange(e ? e.currentTarget.value : '', props.value != undefined && props.value != '' ? props.value[0].unit ? props.value[0].unit : { value: '', label: '' } : { value: '', label: '' }, 1)
                            }}
                            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                            maxlength={props.component.lengthInput[0].maxlength !== undefined ? props.component.lengthInput[0].maxlength : ''}
                            minlength={props.component.lengthInput[0].minlength !== undefined ? props.component.lengthInput[0].minlength : ''}
                            max={props.component.rangeInput ? props.component.rangeInput[0].max !== undefined ? props.component.rangeInput[0].max : '' : ''}
                            min={props.component.rangeInput ? props.component.rangeInput[0].min !== undefined ? props.component.rangeInput[0].min : '' : ''}
                        />
                    </Show>
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
                <div class=""
                    classList={{
                        'col-span-6 lg:-mr-2': enableRemark(),
                        'col-span-6': !(enableRemark()),
                    }}  >
                    <Select
                        class="formgear-select w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                        {...createOptions(
                            options() || [],
                            { key: "label", filterable: true })}
                        disabled={disableInput()} placeholder="Unit"
                        onChange={(e) => handleOnChange(props.value != undefined ? props.value != '' ? props.value[0].value : '' : '', { value: e ? e.value : '', label: e ? e.label : '' }, 2)}
                        initialValue={{ value: props.value ? props.value != '' ? props.value[0].unit ? props.value[0].unit.value ? props.value[0].unit.value != '' ? props.value[0].unit.value : '' : '' : '' : '' : '', label: selectedOption }} />
                </div>
                <Show when={enableRemark()}>
                    <div class=" flex justify-end ">
                        <button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full  hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                            disabled={disableClickRemark()}
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

export default UnitInput