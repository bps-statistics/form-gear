import { Component, For } from "solid-js"
import FormInput from "./FormInput"
import { ComponentType } from "./FormType"

const FormComponent: Component<{
  onMobile: boolean
  components: ComponentType | any
  dataKey: string
  index: number[]
  config : any
  uploadHandler : any
  GpsHandler : any
  onlineSearch : any
  openMap : any
}> = props => {

  return (
    <div class="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
      <div class="space-y-3 sm:p-7 p-3">
        <For each={props.components} 
          children={(component, index) => 
            FormInput({ 
                onMobile: props.onMobile,
                component, 
                index: index(), 
                config: props.config, 
                MobileUploadHandler: props.uploadHandler,
                MobileGpsHandler: props.GpsHandler,
                MobileOnlineSearch : props.onlineSearch,
                MobileOpenMap : props.openMap})} />
      </div>
    </div>
  )
}

export default FormComponent