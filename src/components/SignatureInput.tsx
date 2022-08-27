import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js"
import { FormComponentBase } from "../FormType"
import SignaturePad from "signature_pad"
import Toastify from 'toastify-js'

const SignatureInput: FormComponentBase = props => {
  const [fileSource, setFileSource] = createSignal('');
  const [signatureData, setSignatureData] = createSignal([]);
  const [signaturePng, setSignaturePng] = createSignal('');
  const [saveBtn, setSaveBtn] = createSignal(true);

  const config = props.config
  const [disableInput] = createSignal((config.formMode > 1 ) ? true : props.component.disableInput)

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
  const [disableClickRemark] = createSignal((config.formMode > 2  && props.comments == 0 ) ? true : false);
 
  createEffect(() =>{

    const canvas = document.querySelector("canvas");    
    const signaturePad = new SignaturePad(canvas);
    signaturePad.clear();
    setSignatureData(signaturePad.toData())
    setSignaturePng(signaturePad.toDataURL('image/png'))
    
    if (props.value[0]) {
      setSaveBtn(false)
      let imgSrc = props.value[0].value
      let signatureSrc = props.value[0].signature
      const signaturePad = new SignaturePad(canvas);
      signaturePad.clear();
      signaturePad.fromData(signatureSrc);
      // signaturePad.fromDataURL(imgSrc);
      // setFileSource(imgSrc)
    }

  })
  
  const resizeCanvas = () => {
    createEffect(() =>{
      const canvas = document.querySelector("canvas");
      let ratio = Math.max(window.devicePixelRatio || 1, 1);
      if (canvas) {       
        canvas.width = canvas.offsetWidth  * ratio;
        canvas.height = canvas.width * (window.innerWidth < 720 ? 0.28 : 0.18);
        canvas.getContext("2d").scale(ratio, ratio); 
          
        if (props.value[0]) {
          setSaveBtn(false) 
          let imgSrc = props.value[0].value
          let signatureSrc = props.value[0].signature
          const signaturePad = new SignaturePad(canvas);
          signaturePad.clear();
          signaturePad.fromData(signatureSrc);
          // signaturePad.fromDataURL(imgSrc);
          setFileSource(imgSrc)
        }
      }
    })
  }  
  window.onresize = resizeCanvas;
  resizeCanvas();

  const clearPad = (event: MouseEvent) => {
    const canvas = document.querySelector("canvas");
    const signaturePad = new SignaturePad(canvas);
    signaturePad.clear();
    setSaveBtn(true);
    

    let updatedAnswer = JSON.parse(JSON.stringify(props.value))
    updatedAnswer = [];    
    props.onValueChange(updatedAnswer)
  }
  
  const saveSignature = (event: MouseEvent) => {
    const canvas = document.querySelector('canvas');
    const dataURL = canvas.toDataURL();

    if(signatureData().length > 0){
      let updatedAnswer = JSON.parse(JSON.stringify(props.value))
      updatedAnswer = [];

      updatedAnswer.push({ value: dataURL, type: 'image/png', signature:signatureData() })
      
      props.onValueChange(updatedAnswer)
      toastInfo('Signature acquired!','')
    }else{
      toastInfo('Please provide the appropriate signature!','bg-pink-600/70')
    }
  }

  
  const downloadSignature = (e) => {
    e.preventDefault()

    // console.log(props)
    if (props.value[0]) {
      const a = document.createElement('a')
      a.download = props.component.dataKey + '.png'
      a.href = props.value[0].value
      const clickEvt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
      })
      a.dispatchEvent(clickEvt)
      a.remove()
    }

  }
  
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

        <div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end items-end -mt-2">
          <Show when={props.value[0]}>
            <button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-teal-200 hover:text-teal-400 hover:border-teal-200 border-2 border-gray-300 "
                onClick={e => downloadSignature(e)}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </button>
          </Show>
          <Show when={saveBtn()}>
            <button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full  hover:bg-teal-100 hover:text-teal-400 hover:border-teal-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
              onClick={(e) => saveSignature(e)}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </Show>
            <button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full  hover:bg-amber-100 hover:text-amber-400 hover:border-amber-100 border-2 border-gray-300 disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
              onClick={(e) => clearPad(e)}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>     
          <Show when={enableRemark()}>
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
          </Show>
        </div>        
        
        <div className="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4 -mt-2">
          <div class="preview-class">
            <div class="container mx-auto space-y-3 ">
              <canvas id="signature-pad" class="relative rounded-lg w-full bg-white border-b-8 border-gray-100  border"  />
              {/* <img class="relative w-full  border-b-8 border-gray-100  border" src={fileSource()}  id={"signature-img_" + props.component.dataKey} /> */}
            </div>
          </div>
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

export default SignatureInput