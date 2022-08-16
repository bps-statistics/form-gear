import { ClientMode } from "../constants"
import { scrollCenterInput } from "../GlobalFunction"
import { setInput } from "../stores/InputStore"

export const handleInputFocus = (e: any, props: any) => {
    if (props.config.clientMode == ClientMode.PAPI) {
        const elem = props.isNestedInput ? e.target.offsetParent : e.target
        const scrollContainer = props.isNestedInput ? document.querySelector(".nested-container") as HTMLElement : null
        setInput('currentDataKey', props.component.dataKey)
        scrollCenterInput(elem, scrollContainer)
    }
}
