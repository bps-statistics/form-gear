import { createEffect, createSignal, Switch, Match, Show, For } from "solid-js";
import { FormComponentBase } from "../FormType";
import Toastify from 'toastify-js'

const PhotoInput: FormComponentBase = props => {
  const [label, setLabel] = createSignal('');
  const [fileSource, setFileSource] = createSignal('');
  let reader = new FileReader();

  const config = props.config
  const [disableInput] = createSignal((config.formMode > 2 ) ? true : props.component.disableInput)

  createEffect(() => {
    setLabel(props.component.label)

    if (props.value[0]) {
      let imgSrc = props.value[0].value

      setFileSource(imgSrc)
    }

  })

  let handleOnChange = (event) => {
    let updatedAnswer = JSON.parse(JSON.stringify(props.value))
    updatedAnswer = [];


    let imgSrc = "file://" + event

    updatedAnswer.push({ value: imgSrc, label: event })


    props.onValueChange(updatedAnswer)
  }

  let setValue = (data) => {
    handleOnChange(data)
  }

  let clickUpload = () => {
    props.MobileUploadHandler(setValue)
  }

  let hideModal = () => {
    let component = document.querySelector("#popup-modal"+props.component.dataKey);
    component.classList.toggle("flex");
    component.classList.toggle("hidden");
  }

  let getFileContent = (data) => {
    let updatedAnswer = JSON.parse(JSON.stringify(props.value))

    if (data.target.files && data.target.files[0]) {
      var allowedExtension = ['jpeg', 'jpg', 'png', 'gif'];
      let doc = data.target.files[0];
      let ext = doc.name.split('.').pop().toLowerCase()
      if (!allowedExtension.includes(ext)) {
        toastInfo('Please submit the appropriate format!','bg-pink-600/70')
      } else {
        reader.readAsDataURL(doc)

        reader.onload = e => {

          var filename = doc.name
          updatedAnswer = [];

          let urlImg = URL.createObjectURL(doc)

          // updatedAnswer.push({ value: urlImg, label: filename })
          updatedAnswer.push({ value: e.target.result, label: filename, type: data.target.files[0].type })

          props.onValueChange(updatedAnswer)
          toastInfo('Image uploaded successfully!','')
        }
      }
    }

  }
  
  const toastInfo = (text:string, color:string) => {
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

	const [enableRemark] = createSignal(props.component.enableRemark !== undefined ? props.component.enableRemark : true );

  return (
    <div>
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
          <Switch>
            <Match when={config.clientMode == 2} >
                <input class="hidden"></input>
                <button class="bg-white text-gray-500 p-2 mr-2 rounded-full focus:outline-none h-10 w-10 hover:bg-pink-200 hover:text-pink-400 hover:border-pink-200 border-2 border-gray-300  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400" 
                  disabled = { disableInput() }
                  onClick={() => clickUpload()}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
            </Match>
            <Match when={config.clientMode == 1}>
                <input type="file" onchange={(e) => { getFileContent(e) }} accept="image/*" id={"inputFile_" + props.component.dataKey} style="color: transparent;" 
                class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  name={props.component.dataKey} />
                <button class="bg-white text-gray-500 p-2 mr-2 rounded-full focus:outline-none h-10 w-10 hover:bg-pink-200 hover:text-pink-400 hover:border-pink-200 border-2 border-gray-300  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400" 
                  disabled = { disableInput() }
                  onClick={e => { (document.getElementById("inputFile_" + props.component.dataKey) as HTMLInputElement).click() }} title={"Pilih Foto"}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
            </Match>
          </Switch>
        
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

        <Show when={fileSource() != ''}>
          <div className="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4">
              <div class="preview-class">
                <div class="container mx-auto">
                    <img class="rounded-md" src={fileSource()} style={"width:100%;height:100%"}  id={"img-preview" + props.component.dataKey} />
                  </div>
              </div>
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

// transition ease-in-out m-0
// focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"

export default PhotoInput