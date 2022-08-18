export const handleInputKeyDown = (e: any, props: any) => {
    handleEnterPress(e, props)
}

export const handleEnterPress = (e: any, props: any) => {
    if (e.keyCode == 13) {
        if (e.shiftKey) {
            e.stopPropagation()
            return;
        }
        e.preventDefault();

        const inputs =
            Array.prototype.slice.call(document.querySelectorAll("input:not(:disabled),textarea:not(.hidden-input):not(:disabled)"))
        const index =
            (inputs.indexOf(document.activeElement) + 1) % inputs.length
        const input = inputs[index]

        input.focus()
        input.select()
    }
}