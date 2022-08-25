import { createEffect, createSignal, Switch, Match, Show, For } from "solid-js"
import { FormComponentBase } from "../FormType"
import Toastify from 'toastify-js'
import Papa from 'papaparse'
import { locale, setLocale } from '../stores/LocaleStore'

const CsvInput: FormComponentBase = props => {
    const [thead, setTHead] = createSignal([]);
    const [tbody, setTbody] = createSignal([]);
    const [label, setLabel] = createSignal('');
    const [isUploading, setIsUploading] = createSignal(false);
    const [fileSource, setFileSource] = createSignal('');
    
    let reader = new FileReader();

    const config = props.config
    const [disableInput] = createSignal((config.formMode > 1) ? true : props.component.disableInput)

    createEffect(() => {

        if (props.value) {
            // console.log('json',props.value)
            // console.log('thead',Object.keys(props.value[0]))
            // console.log('tbody',[...[Object.values(props.value[0])],Object.values(props.value[1]),Object.values(props.value[2]),Object.values(props.value[3]),Object.values(props.value[4])])
            // console.log('rows',props.value.length+1)

            setTHead(Object.keys(props.value[0]))
            setTbody([...[Object.values(props.value[0])], Object.values(props.value[1]), Object.values(props.value[2]), Object.values(props.value[3]), Object.values(props.value[4])])
        }

    })

    let getFileContent = (data) => {
        setIsUploading(true)
        let updatedAnswer = JSON.parse(JSON.stringify(props.value))

        if (data.target.files && data.target.files[0]) {
            var allowedExtension = ['csv', 'txt'];
            let doc = data.target.files[0];
            let ext = doc.name.split('.').pop().toLowerCase()

            if (!allowedExtension.includes(ext)) {
                toastInfo(locale.details.language[0].fileInvalidFormat, 'bg-pink-600/70')
            } else {
                
                let docSize = (doc.size / (1024*1024)).toFixed(2)

                let validMinDocSize = true, validMaxDocSize = true;

                if(props.component.sizeInput){
                    validMinDocSize = props.component.sizeInput[0].min !== undefined ? 
                                            ( Number(docSize) > Number(props.component.sizeInput[0].min) ) : true;

                    validMaxDocSize = props.component.sizeInput[0].max !== undefined ? 
                                            ( Number(docSize) < Number(props.component.sizeInput[0].max) ) : true;
                    
                    !(validMaxDocSize) && toastInfo(locale.details.language[0].fileInvalidMaxSize + props.component.sizeInput[0].max, 'bg-pink-600/70')
                    !(validMinDocSize) && toastInfo(locale.details.language[0].fileInvalidMinSize + props.component.sizeInput[0].min, 'bg-pink-600/70')
                    
                    setIsUploading(false)

                }

                
                if( (validMinDocSize) && (validMaxDocSize) ) {
                        
                    reader.readAsDataURL(doc)
                    reader.onload = e => {

                        Papa.parse(doc, {
                            download: true,
                            delimiter: "",	// auto-detect
                            complete: function (results) {
                                let keys = results.data[0];
                                let rows = [...[results.data[1]], results.data[2], results.data[3], results.data[4], results.data[5]];
                                let jsonCsv = results.data.slice(1).map((item) => {
                                    var arr = {};
                                    keys.forEach((i, v) => {
                                        arr[i] = item[v]
                                    })
                                    return arr
                                });
                                // console.log('keys', keys)
                                // console.log('rows', rows)
                                // console.log('jsonCsv', jsonCsv)

                                setTHead(keys)
                                setTbody(rows)

                                setIsUploading(false)
                                props.onValueChange(jsonCsv)
                                toastInfo(locale.details.language[0].fileUploaded, '')

                            }
                        });

                    }

                }
                
                 
            }
        }

    }
    const downloadFile = ({ data, fileName, fileType }) => {
        // Create a blob with the data we want to download as a file
        const blob = new Blob([data], { type: fileType })
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        const a = document.createElement('a')
        a.download = fileName
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }

    const downloadCsv = (e) => {
        e.preventDefault()

        //json
        // downloadFile({
        //     data: JSON.stringify(props.value),
        //     fileName: props.component.dataKey+'.json',
        //     fileType: 'text/json',
        // })

        //csv
        downloadFile({
            data: Papa.unparse(props.value,
                {
                    quotes: false, //or array of booleans
                    quoteChar: '"',
                    escapeChar: '"',
                    delimiter: "|",
                    header: true,
                    newline: "\r\n",
                    skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
                    columns: null //or array of strings
                }),
            fileName: props.component.dataKey + '.csv',
            fileType: 'text/csv',
        })
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

    const [instruction, setInstruction] = createSignal(false);
    const showInstruction = () => {
        (instruction()) ? setInstruction(false) : setInstruction(true);
    }

    const [enableRemark] = createSignal(props.component.enableRemark !== undefined ? props.component.enableRemark : true);
    const [disableClickRemark] = createSignal((config.formMode > 2 && props.comments == 0) ? true : false);

    return (
        <div>
            <Show when={isUploading()}>
                <div class="backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                    <svg class="w-20 h-20 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94.53 98.372"><circle cx="23.536" cy="16.331" r="8.646" style="fill:#0a77e8" /><circle cx="8.646" cy="36.698" r="8.646" style="fill:#0f9af0" /><circle cx="8.646" cy="61.867" r="8.646" style="fill:#0f9af0" /><circle cx="23.536" cy="82.233" r="8.646" style="fill:#13bdf7" /><circle cx="47.361" cy="89.726" r="8.646" style="fill:#13bdf7" /><circle cx="71.282" cy="82.233" r="8.646" style="fill:#18e0ff" /><circle cx="85.884" cy="61.867" r="8.646" style="fill:#65eaff" /><circle cx="85.884" cy="36.698" r="8.646" style="fill:#b2f5ff" /><circle cx="47.361" cy="8.646" r="8.646" style="fill:#1d4970" /></svg>
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

                <div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end -mt-2">

                    <input type="file" onchange={(e) => { getFileContent(e) }} accept=".csv" id={"inputFile_" + props.component.dataKey} style="color: transparent;"
                        class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        name={props.component.dataKey} />

                    <Show when={props.value}>
                        <button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-teal-200 hover:text-teal-400 hover:border-teal-200 border-2 border-gray-300 "
                            onClick={e => downloadCsv(e)}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                    </Show>

                    <button class="bg-white text-gray-500 p-2 mr-2 rounded-full focus:outline-none h-10 w-10 hover:bg-fuchsia-200 hover:text-fuchsia-400 hover:border-fuchsia-200 border-2 border-gray-300  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                        disabled={disableInput()}
                        onClick={e => { (document.getElementById("inputFile_" + props.component.dataKey) as HTMLInputElement).click() }} title={locale.details.language[0].uploadCsv}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </button>
                    <Show when={enableRemark()}>
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
                    </Show>
                </div>

                {/* <Show when={fileSource() != ''}> */}
                <Show when={props.value}>
                    <div className="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4">
                        <div class="preview-class">
                            <div class="container mx-auto">
                                <div class="scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-500 
                        overflow-x-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                                    <table class="table-auto w-full">
                                        <thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                            <tr>
                                                <For each={thead()}>
                                                    {(item, index) => (
                                                        <th class="p-2 whitespace-nowrap">
                                                            <div class="font-semibold text-left">{item}</div>
                                                        </th>
                                                    )}
                                                </For>
                                            </tr>
                                        </thead>
                                        <tbody class="text-sm divide-y divide-gray-100">
                                            <For each={tbody()}>
                                                {(item, index) => (
                                                    <tr>
                                                        <For each={item}>
                                                            {(item_td, index_td) => (
                                                                <td class="p-2 whitespace-nowrap">
                                                                    <div class="text-left">{item_td}</div>
                                                                </td>
                                                            )}
                                                        </For>
                                                    </tr>
                                                )}
                                            </For>
                                        </tbody>
                                    </table>
                                </div>
                                <br />
                                <span class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800">{"rows : " + Number(props.value.length + 1)}</span>
                                <span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{"cols : " + thead().length}</span>
                            </div>
                        </div>
                    </div>
                </Show>

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

// transition ease-in-out m-0
// focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"

export default CsvInput