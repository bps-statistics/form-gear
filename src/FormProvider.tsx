import { createContext, createEffect, useContext } from "solid-js";
import { createStore } from "solid-js/store";

type FormState = {
	activeComponent: ActiveComponent
}

type ActiveComponent = {
	dataKey: string
	label: string
	index: number[]
	position: number	
}

type FormAction = {
	setActiveComponent?: (newComponent: ActiveComponent) => void
}

type FormStore = [
	FormState,
	FormAction
]

const FormContext = createContext<FormStore>();

export function FormProvider(props) {
	const [form, setState] = createStore<FormState>({
        activeComponent: {dataKey: '', label: '', index: [], position: 0},
    })

	let store: FormStore = [
		form,
		{
			setActiveComponent(component) {
				setState("activeComponent", component);
			},
		}
	];

	return (
		<FormContext.Provider value={store}>
			{props.children}
		</FormContext.Provider>
	)
}

export function useForm() {
	return useContext(FormContext);
}