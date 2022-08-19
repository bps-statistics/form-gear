import { createEffect, createSignal, Show } from "solid-js";
import Toastify from 'toastify-js';
import { FormComponentBase } from "../../FormType";
import { locale } from "../../stores/LocaleStore";
import { InputContainer } from "./partials";

const PhotoInput: FormComponentBase = props => {
  const [label, setLabel] = createSignal('');
  const [fileSource, setFileSource] = createSignal('');
  const [disableInput] = createSignal((props.config.formMode > 1) ? true : props.component.disableInput)
  let reader = new FileReader();

  createEffect(() => {
    setLabel(props.component.label)

    if (props.value[0]) {
      let imgSrc = props.value[0].value

      setFileSource(imgSrc)
    }

  })

  let getFileContent = (data) => {
    let updatedAnswer = JSON.parse(JSON.stringify(props.value))

    if (data.target.files && data.target.files[0]) {
      var allowedExtension = ['jpeg', 'jpg', 'png', 'gif'];
      let doc = data.target.files[0];
      let ext = doc.name.split('.').pop().toLowerCase()
      if (!allowedExtension.includes(ext)) {
        toastInfo('Please submit the appropriate format!', 'bg-pink-600/70')
      } else {
        reader.readAsDataURL(doc)

        reader.onload = e => {

          var filename = doc.name
          updatedAnswer = [];

          let urlImg = URL.createObjectURL(doc)

          // updatedAnswer.push({ value: urlImg, label: filename })
          updatedAnswer.push({ value: e.target.result, label: filename, type: data.target.files[0].type })

          // console.log('hasilny adalah : ', updatedAnswer)
          props.onValueChange(updatedAnswer)
          toastInfo('Image uploaded successfully!', '')
        }
      }
    }

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

  return (
    <InputContainer component={props.component} classValidation={props.classValidation} validationMessage={props.validationMessage}>

      <input type="file" onchange={(e) => { getFileContent(e) }} accept="image/*" id={"inputFile_" + props.component.dataKey} style="color: transparent;"
        class="hidden w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        name={props.component.dataKey} />

      <button class="formgear-input-papi flex"
        classList={{
          ['formgear-input-papi-validation-' + props.classValidation]: true
        }}
        disabled={disableInput()}
        onClick={e => { (document.getElementById("inputFile_" + props.component.dataKey) as HTMLInputElement).click() }} title={locale.details.language[0].uploadImage}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {locale.details.language[0].uploadImage}
      </button>

      <Show when={fileSource() != ''}>
        <div className="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4">
          <div class="preview-class">
            <div class="container mx-auto">
              <img class="rounded-md" src={fileSource()} style={"width:100%;height:100%"} id={"img-preview" + props.component.dataKey} />
            </div>
          </div>
        </div>
      </Show>
    </InputContainer>
  )
}

export default PhotoInput