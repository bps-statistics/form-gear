import { createContext, createEffect, useContext } from "solid-js";
import { createStore } from "solid-js/store";

type FormState = {
	activeComponent: ActiveComponent
	formConfig: FormConfig
}

type FormConfig = {
	username: string
	clientMode: number
	baseUrl: string
	lookupKey: string
	lookupValue : string
}

type ActiveComponent = {
	dataKey: string
	label: string
	index: number[]
	position: number	
}

type FormAction = {
	setActiveComponent?: (newComponent: ActiveComponent) => void
	setFormConfig?: (newConfig: FormConfig) => void
}

type FormStore = [
	FormState,
	FormAction
]

const FormContext = createContext<FormStore>();

export function FormProvider(props) {
	const [form, setState] = createStore<FormState>({
        activeComponent: {dataKey: '', label: '', index: [], position: 0},
		formConfig: {
			username: props.config.username,
			clientMode: props.config.clientMode, 
			baseUrl: props.config.baseUrl,
			lookupKey : props.config.lookupKey,
			lookupValue : props.config.lookupValue
		}
    })

	let store: FormStore = [
		form,
		{
			setActiveComponent(component) {
				setState("activeComponent", component);
			},
			setFormConfig(component) {
				setState("formConfig", component);
			}
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