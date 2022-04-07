import { template, setTemplate } from './TemplateStore';
import { response, setResponse } from './ResponseStore';
import { reference, setReference } from './ReferenceStore';
import { sidebar, setSidebar } from './SidebarStore';
import { createComponentNested } from '../FormInput';

const generateComponentString = (index) => {
    let comp_str = `quest_tmp.details`;
    for(let i of index){
        comp_str += `.components[0][${i}]`
    }
    return comp_str;
}

export const referenceList = [];
console.time('');
const sidebarList = [];
const loopTemplate = (element, index, parent, level) => {    

    for (let i = 0; i < element.length; i++) {        
        const answerIndex = response.details.answers.findIndex(obj => obj.dataKey === element[i].dataKey);
        let answer = response.details.answers[answerIndex] !== undefined ? response.details.answers[answerIndex].answer : '';
        if((element[i].type == 21 || element[i].type == 22) && answer == "") answer =  JSON.parse(JSON.stringify(element[i].answer));
        
        const comp_str = generateComponentString([...parent,i])
    
        if(element[i].type == 1 || (element[i].type == 2 && element[i].components.length > 1)){
            sidebarList.push({
                dataKey: element[i].dataKey,
                label: element[i].label,
                description: element[i].description,
                level: level,
                index: [...parent,i],
                components: element[i].components,
                sourceQuestion: element[i].sourceQuestion !== undefined ? element[i].sourceQuestion : ''
            })
        }
        referenceList.push({         
            dataKey: element[i].dataKey,
            label: element[i].label,
            description: element[i].description !== undefined ? element[i].description : '',
            type: element[i].type,
            answer: answer,
            index: [...parent,i],
            level: level,
            expression: (element[i].expression) ? element[i].expression : '',
            componentVar: (element[i].componentVar) ? element[i].componentVar : undefined,
            render: (element[i].render) ? element[i].render : undefined,
            renderType: (element[i].renderType) ? element[i].renderType : '',
            urlPath: element[i].path,
            // path: comp_str,
            // element: element[i],
            options: (element[i].options) ? element[i].options : '',
            components: (element[i].components) ? element[i].components : '',
            sourceQuestion: element[i].sourceQuestion !== undefined ? element[i].sourceQuestion : ''
        })
        element[i].components && element[i].components.forEach((element, index) => loopTemplate(element,index, [...parent,i,0], level+1))
    }
}

template.details.components.forEach((element, index) => loopTemplate(element, index, [0], 0));
// window.localStorage.setItem("referenceList", JSON.stringify(referenceList));

setReference({details: referenceList});
setSidebar({details: sidebarList});

const createChildComponent = () => {
    for(let i = 0; i < response.details.answers.length; i++){
        const componentForeignIndex = reference.details.findIndex(obj => obj.sourceQuestion === response.details.answers[i].dataKey);
        const componentForeign = reference.details[componentForeignIndex];
        
        let componentIndex = reference.details.findIndex(obj => obj.dataKey === response.details.answers[i].dataKey);
        let value = response.details.answers[i].answer;
        
        if(componentForeign !== undefined) {
            let beforeValue = (typeof value === 'object') ? [] : 0;
            if(componentForeign.type == 21 || componentForeign.type == 22){
                beforeValue = [
                    {
                        "label": "lastId#0",
                        "value": "0"
                    }
                ]
            }
            let dataKey = response.details.answers[i].dataKey;
            let componentIndexRef = JSON.parse(JSON.stringify(reference.details[componentIndex].index));
            let dataKeyArray = dataKey.split("#");
            if(dataKeyArray.length == 1){
                componentIndexRef.length = componentIndexRef.length-2;
            } else {
                componentIndexRef.length = componentIndexRef.length-1;
            }
            let parentComponentIndex = sidebar.details.findIndex(obj => JSON.stringify(obj.index) === JSON.stringify(componentIndexRef));
            
            createComponentNested(value, beforeValue, componentIndex, parentComponentIndex, componentForeignIndex, componentForeign);
        }
        if(componentIndex !== -1) setReference('details', componentIndex, 'answer', value);
    }
}
createChildComponent();
// console.log(reference);
// console.log(sidebar);
console.timeEnd('');