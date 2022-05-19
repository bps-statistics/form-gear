import { createContext, createEffect, useContext } from "solid-js";
import { createStore } from "solid-js/store";

type FormState = {
	activeComponent: ActiveComponent
	formConfig: FormConfig
}

type FormConfig = {
	clientMode: number // 1 => CAWI ; 2 => CAPI
	baseUrl: string
	lookupKey: string
	lookupValue : string
	username: string
	formMode: number // 1 => OPEN ; 2 => REJECTED ; 3 => SUBMITTED ; 4 => APPROVED ;
	lookupMode: number
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
			clientMode: props.config.clientMode, 
			baseUrl: props.config.baseUrl,
			lookupKey : props.config.lookupKey,
			lookupValue : props.config.lookupValue,
			username: props.config.username,
			formMode: (props.config.formMode !== undefined) ? props.config.formMode : 1
			lookupMode: props.config.lookupMode
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