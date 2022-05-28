import { FormComponentBase } from "../FormType"
import { For, createMemo, Switch, Match, Show } from 'solid-js'
import { reference, setReference } from '../stores/ReferenceStore';
import { reference_index_lookup} from './../GlobalFunction'

const NestedInput: FormComponentBase = props => {

	let componentAnswerIndex = createMemo(() => {
		// return String(reference.details.findIndex(obj => obj.dataKey === props.component.sourceQuestion));
		return String(reference_index_lookup(props.component.sourceQuestion));
	})

	let sourceAnswer = createMemo(() => {
		let answer = [];
		if(props.component.sourceQuestion !== ''){
			// const componentAnswerIndex = reference.details.findIndex(obj => obj.dataKey === props.component.sourceQuestion);
			const componentAnswerIndex = reference_index_lookup(props.component.sourceQuestion);
			if(reference.details[componentAnswerIndex]){
				if(typeof reference.details[componentAnswerIndex].answer === 'object'){
					answer = reference.details[componentAnswerIndex].answer == '' ? [] : reference.details[componentAnswerIndex].answer;
					if(reference.details[componentAnswerIndex].type == 21 || reference.details[componentAnswerIndex].type == 22){
						let tmpAnswer = JSON.parse(JSON.stringify(answer));
						tmpAnswer.splice(0,1);
						answer = tmpAnswer;
					}
				} else {
					answer = reference.details[componentAnswerIndex].answer == '' ? 0 : reference.details[componentAnswerIndex].answer;
					let dummyArrayAnswer = [];
					for(let i=1; i <= Number(answer); i++){
						dummyArrayAnswer.push({value:i,label:i});
					}
					answer = dummyArrayAnswer;
				}
			}
		}
		return answer;
	})

	let handleLabelClick = (index: any) => {
        let id  = `nestedButton-${props.component.dataKey}-${index}`
        document.getElementById(id).click()
    }

    let handleOnClick = (value: string) => {
		props.onUserClick(props.component.dataKey+'#'+value);
	}

	return (
		
			<div>
				<div class="grid md:grid-cols-12 dark:border-gray-200/[.10] p-2"
						classList={{
							'border-b border-gray-300/[.40]' : sourceAnswer().length > 0
						}}	>
					<div class="font-light text-sm  pb-2.5 px-2 col-start-2 col-end-12 space-y-4 transition-all delay-100">
						<For each={sourceAnswer()}>
							{(item:any, index) => (
							<div class="grid grid-cols-12" onClick={e => handleLabelClick(index())}>
								<div class="col-span-10 mr-2">
									<Switch>											
										<Match when={(reference.details[componentAnswerIndex()].type === 28  || (reference.details[componentAnswerIndex()].type === 4 && reference.details[componentAnswerIndex()].renderType === 1) || reference.details[componentAnswerIndex()].type === 25)}>
											<input type="text" value={props.component.label + '  ____ # ' + item.label }
												class="w-full
													font-light
													px-4
													py-2.5
													text-sm
													text-gray-700
													bg-blue-50 bg-clip-padding
													dark:bg-gray-300
													border border-solid border-blue-100	
													rounded-full rounded-tl-none
													transition
													ease-in-out
													m-0
													focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
												disabled
											/>
										</Match>
										<Match when={(reference.details[componentAnswerIndex()].type !== 28)}>
											<input type="text" value={item.label}
												class="w-full
													font-light
													px-4
													py-2.5
													text-sm
													text-gray-700
													bg-blue-50 bg-clip-padding
													dark:bg-gray-300
													border border-solid border-blue-100	
													rounded-full rounded-tl-none
													transition
													ease-in-out
													m-0
													focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
												disabled
											/>
										</Match>
									</Switch>
								</div>
								<div class="col-span-2 -ml-12 space-x-1 flex justify-evenly -z-0">
									<button class="bg-blue-800 hover:bg-blue-700 text-white text-justify justify-center text-xs w-full py-2 rounded-tl-none rounded-full focus:outline-none group inline-flex items-center" 
										onClick={e => handleOnClick(item.value)} id={`nestedButton-${props.component.dataKey}-${index()}`}>
										&nbsp;&nbsp;ENTRY
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
										</svg>
									</button>
								</div>
							</div>
							)}
						</For>
					</div>
				</div>
			
			</div>
		
	)
}

export default NestedInput