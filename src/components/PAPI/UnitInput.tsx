import { createSignal, createResource, createEffect, Show, For, Switch, Match } from "solid-js"
import { FormComponentBase } from "../../FormType"
import { Select, createOptions } from "@thisbeyond/solid-select"
import { reference } from '../../stores/ReferenceStore'
import Toastify from 'toastify-js'
import { locale } from '../../stores/LocaleStore'
import { FiChevronDown } from 'solid-icons/fi'
import { InputContainer } from "./partials"

const UnitInput: FormComponentBase = props => {
    const config = props.config
    const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)
    const [label, setLabel] = createSignal('');
    const [isLoading, setLoading] = createSignal(false);
    const [options, setOptions] = createSignal([]);
    const [selectedOption, setSelectedOption] = createSignal('');
    const isPublic = false;

    let classInput = 'w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400';

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
        <InputContainer component={props.component} classValidation={props.classValidation} validationMessage={props.validationMessage}>
            <div class="relative">
                <Show when={props.component.lengthInput === undefined}>
                    <input value={props.value != undefined ? props.value != '' ? props.value[0].value : '' : ''} type="number"
                        name={props.component.dataKey}
                        class={classInput + 'block pr-20'}
                        classList={{
                            ' border border-solid border-gray-300 ': props.classValidation === 0,
                            ' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
                            ' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
                        }}
                        placeholder=""
                        disabled={disableInput()}
                        onChange={(e) => {
                            handleOnChange(e ? e.currentTarget.value : '', props.value != undefined && props.value != '' ? props.value[0].unit ? props.value[0].unit : { value: '', label: '' } : { value: '', label: '' }, 1)
                        }}
                    />
                </Show>
                <Show when={props.component.lengthInput !== undefined && props.component.lengthInput.length > 0}>
                    <input value={props.value != undefined ? props.value != '' ? props.value[0].value : '' : ''} type="number"
                        name={props.component.dataKey}
                        class={classInput + 'block pr-20'}
                        classList={{
                            ' border border-solid border-gray-300 ': props.classValidation === 0,
                            ' border-orange-500 dark:bg-orange-100 ': props.classValidation === 1,
                            ' border-pink-600 dark:bg-pink-100 ': props.classValidation === 2,
                        }}
                        placeholder=""
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
                <div class="absolute inset-y-0 right-0 flex items-center">
                    <Select
                        class="formgear-select-unit  w-full rounded font-light text-sm text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-0 border-transparent focus:outline-none  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                        {...createOptions(
                            options() || [],
                            { key: "label", filterable: true })}
                        disabled={disableInput()} placeholder="Unit"
                        onChange={(e) => handleOnChange(props.value != undefined ? props.value != '' ? props.value[0].value : '' : '', { value: e ? e.value : '', label: e ? e.label : '' }, 2)}
                        initialValue={{ value: props.value ? props.value != '' ? props.value[0].unit ? props.value[0].unit.value ? props.value[0].unit.value != '' ? props.value[0].unit.value : '' : '' : '' : '' : '', label: selectedOption }} />
                    <FiChevronDown size={20} class="text-gray-400  mr-3" />
                </div>
            </div>
        </InputContainer>
    )
}

export default UnitInput