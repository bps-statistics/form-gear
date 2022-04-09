import { reference, setReference} from './stores/ReferenceStore';
import { nested, setNested} from './stores/NestedStore';
import { validation, setValidation} from './stores/ValidationStore';
import { sidebar, setSidebar} from './stores/SidebarStore';
import { preset, setPreset, Preset } from './stores/PresetStore';
import { response, setResponse, Response } from './stores/ResponseStore';
import { remark, setRemark, Remark} from './stores/RemarkStore';
import { note, setNote} from './stores/NoteStore';
import { createSignal } from 'solid-js';

export const getValue = (dataKey: string) => {
    let tmpDataKey = dataKey.split('@');
    let splitDataKey = tmpDataKey[0].split('#');
    let splLength = splitDataKey.length;
    switch(tmpDataKey[1]) {
        case '$ROW$': {
            dataKey = tmpDataKey[0];
            break;
        }
        case '$ROW1$': {
            if(splLength > 2) splitDataKey.length = splLength - 1;
            dataKey = splitDataKey.join('#');
            break;
        }
        case '$ROW2$': {
            if(splLength > 3) splitDataKey.length = splLength - 2;
            dataKey = splitDataKey.join('#');
            break;
        }
    }
    const componentIndex = reference.details.findIndex(obj => obj.dataKey === dataKey);
    let answer = (componentIndex !== -1 && (reference.details[componentIndex].answer) && (reference.details[componentIndex].enable)) ? reference.details[componentIndex].answer : ''
    return answer;
}

export const createComponent = (dataKey: string, nestedPosition: number, componentPosition: number, sidebarPosition: number, components: any, parentIndex: number[], parentName: string) => {
    // console.log('create ', dataKey, components);
    let dataKeySplit = dataKey.split('#');
    const refPosition = reference.details.findIndex(obj => obj.dataKey === dataKeySplit[0]);
    
    let newComp = JSON.parse(JSON.stringify(components));
    newComp.dataKey = newComp.dataKey+'#'+nestedPosition;
    // newComp.label = newComp.label;//tetap
    newComp.hint = newComp.hint !== undefined ? newComp.hint : false;
    newComp.description = newComp.description !== undefined ? newComp.description : '';

    let tmp_type = newComp.type;
    newComp.answer = (tmp_type === 21 || tmp_type === 22) ? [{"label":"lastId#0","value":0}] : newComp.answer ? newComp.answer : ''
    newComp.sourceSelect = newComp.sourceSelect !== undefined ? newComp.sourceSelect : [];
    if(newComp.sourceSelect.length > 0){
        newComp.sourceSelect[0].parentCondition.map((item, index) => {
            let editedParentCondition = item.value.split('@');
            if(editedParentCondition[editedParentCondition.length-1] === '$ROW$' || editedParentCondition[editedParentCondition.length-1] === '$ROW1$' || editedParentCondition[editedParentCondition.length-1] === '$ROW2$'){
               item.value = editedParentCondition[0] + '#' + nestedPosition + '@' + editedParentCondition[1];
            }

        })

        // if(newComp.sourceSelect[0].parentCondition.length > 0){
        //     let editedParentCondition = newComp.sourceSelect[0].parentCondition[0].value.split('@');
        //     if(editedParentCondition[editedParentCondition.length-1] === '$ROW$' || editedParentCondition[editedParentCondition.length-1] === '$ROW1$' || editedParentCondition[editedParentCondition.length-1] === '$ROW2$'){
        //         newComp.sourceSelect[0].parentCondition[0].value = editedParentCondition[0] + '#' + nestedPosition + '@' + editedParentCondition[1];
        //     }
        // }
    }
    //index
    if(parentIndex.length == 0){
        newComp.index = (newComp.index !== undefined) ? newComp.index : JSON.parse(JSON.stringify(reference.details[refPosition].index));
        newComp.index[newComp.index.length-2] = nestedPosition;
        let label = newComp.label.replace('$NAME$',parentName);
        newComp.label = label;
    } else {
        newComp.index = JSON.parse(JSON.stringify(parentIndex));
        newComp.index = newComp.index.concat(0, componentPosition);
    }
    newComp.level = (newComp.level !== undefined) ? newComp.level : reference.details[refPosition].level;
    newComp.options = newComp.options !== undefined ? newComp.options : undefined;
    newComp.components = newComp.components !== undefined ? newComp.components : undefined;
    // newComp.components diatur di paling bawah, untuk di loop kembali
    newComp.sourceQuestion = newComp.sourceQuestion !== undefined ? newComp.sourceQuestion+'#'+nestedPosition : undefined;
    newComp.currency = newComp.currency !== undefined ? newComp.currency : undefined;
    newComp.source = newComp.source !== undefined ? newComp.source : undefined;
    newComp.urlPath = newComp.urlPath !== undefined ? newComp.urlPath : undefined;
    newComp.parent = newComp.parent !== undefined ? newComp.parent : undefined;
    newComp.separatorFormat = newComp.separatorFormat !== undefined ? newComp.separatorFormat : undefined;
    newComp.typeOption = newComp.typeOption !== undefined ? newComp.typeOption : undefined;
    newComp.isDecimal = newComp.isDecimal !== undefined ? newComp.isDecimal : undefined;
    newComp.maskingFormat = newComp.maskingFormat !== undefined ? newComp.maskingFormat : undefined;
    let originSourceOption = newComp.sourceOption;
    if(originSourceOption !== undefined && originSourceOption !== ''){
        let tmpKey = originSourceOption.split('@');
        let compNew;
        let tmpKey_len = tmpKey.length;
        if(tmpKey[tmpKey_len-1] === '$ROW$' || tmpKey[tmpKey_len-1] === '$ROW1$' || tmpKey[tmpKey_len-1] === '$ROW2$'){
            compNew = tmpKey[0] + '#' + nestedPosition + '@' + tmpKey[1]
        } else {
            compNew = originSourceOption;
        }
        newComp.sourceOption = compNew;
    }
    //variabel
    newComp.componentVar = newComp.componentVar !== undefined ? newComp.componentVar : [];
    let originCompVar = newComp.componentVar;
    if(newComp.componentVar.length !== 0){
        const editedComponentVar = newComp.componentVar.map(comp => {
            let tmpKey = comp.split('@');
            let compNew;
            let tmpKey_len = tmpKey.length;
            if(tmpKey[tmpKey_len-1] === '$ROW$' || tmpKey[tmpKey_len-1] === '$ROW1$' || tmpKey[tmpKey_len-1] === '$ROW2$'){
                compNew = tmpKey[0] + '#' + nestedPosition + '@' + tmpKey[1]
            } else {
                compNew = comp;
            }
            return compNew;
        })
        newComp.componentVar = editedComponentVar;
    }
    
    if(newComp.expression !== undefined){
        let originExpression = newComp.expression;
        let cr_len = newComp.componentVar.length;
        for(let cr=0; cr < cr_len; cr++){
            originExpression = originExpression.replace(originCompVar[cr], newComp.componentVar[cr]);
        }
        newComp.expression = originExpression;
    } else {
        newComp.expression = undefined
    }

    newComp.render = (newComp.render) ? newComp.render : undefined,
    newComp.renderType = (newComp.renderType) ? newComp.renderType : undefined,
    //enable
    // newComp.enable = newComp.enableCondition === undefined || newComp.enableCondition === '' ? true : false;
    newComp.componentEnable = newComp.componentEnable !== undefined ? newComp.componentEnable : [];
    let originCompEnable = newComp.componentEnable;
    if(newComp.componentEnable.length !== 0){
        const editedComponentEnable = newComp.componentEnable.map(comp => {
            let tmpKey = comp.split('@');
            let compNew;
            if(tmpKey[tmpKey.length-1] === '$ROW$' || tmpKey[tmpKey.length-1] === '$ROW1$' || tmpKey[tmpKey.length-1] === '$ROW2$'){
                compNew = tmpKey[0] + '#' + nestedPosition + '@' + tmpKey[1]
            } else {
                compNew = comp;
            }
            return compNew;
        })
        newComp.componentEnable = editedComponentEnable;
    }
    if(newComp.enableCondition !== undefined){
        let originEnableCondition = newComp.enableCondition;
        let ce_len = newComp.componentEnable.length;
        for(let ce=0; ce < ce_len; ce++){
            originEnableCondition = originEnableCondition.replace(originCompEnable[ce], newComp.componentEnable[ce]);
        }
        newComp.enableCondition = originEnableCondition;
    } else {
        newComp.enableCondition = undefined
    }
    newComp.enable = (newComp.enableCondition === undefined || newComp.enableCondition === '') ? true : eval(newComp.enableCondition);
    //
    newComp.enableRemark = newComp.enableRemark !== undefined ? newComp.enableRemark : true;
    newComp.client = newComp.client !== undefined ? newComp.client : true;
    newComp.titleModalDelete = newComp.titleModalDelete !== undefined ? newComp.titleModalDelete : undefined;
    newComp.contentModalDelete = newComp.contentModalDelete !== undefined ? newComp.contentodalDelete : undefined;
    //validation
    newComp.validationState = 0;
    newComp.validationMessage = [];
    newComp.componentValidation = newComp.componentValidation !== undefined ? newComp.componentValidation : [];
    let originCompVal = newComp.componentValidation;
    if(newComp.componentValidation.length !== 0){
        const editedComponentValidation = newComp.componentValidation.map(comp => {
            let tmpKey = comp.split('@');
            let compNew;
            if(tmpKey[tmpKey.length-1] === '$ROW$' || tmpKey[tmpKey.length-1] === '$ROW1$' || tmpKey[tmpKey.length-1] === '$ROW2$'){
                compNew = tmpKey[0] + '#' + nestedPosition + '@' + tmpKey[1]
            } else {
                compNew = comp;
            }
            return compNew;
        })
        newComp.componentValidation = editedComponentValidation;
    }
    newComp.validations = newComp.validations !== undefined ? newComp.validations : [];
    if(newComp.validations.length !== 0){
        const editedVal = newComp.validations.map(val => {
            let editedTest = val.test;
            let cv_len = newComp.componentValidation.length;
            for(let cv=0; cv < cv_len; cv++){
                editedTest = editedTest.replace(originCompVal[cv], newComp.componentValidation[cv]);
            }
            val.test = editedTest;
            return val;
        })
        newComp.validations = JSON.parse(JSON.stringify(editedVal));
    }
    
    // console.log('newComp',dataKey, nestedPosition, componentPosition);
    // console.log('newComp',newComp, componentPosition);
    newComp.hasRemark = false;
    if ( newComp.enableRemark === undefined || (newComp.enableRemark !== undefined && newComp.enableRemark )){  
        let remarkPosition = remark.details.notes.findIndex(obj => obj.dataKey === newComp.dataKey);
        if(remarkPosition !== -1){
            let newNote = remark.details.notes[remarkPosition];
            let updatedNote = JSON.parse(JSON.stringify(note.details.notes));
            updatedNote.push(newNote);
            newComp.hasRemark = true;
            setNote('details','notes',updatedNote);
        }
    }
    if(tmp_type < 3){
        let comp_array = [];
        newComp.components[0].forEach((element, index) => 
            comp_array.push(createComponent(element.dataKey, nestedPosition, index, sidebarPosition, newComp.components[0][index], JSON.parse(JSON.stringify(newComp.index)), null))
        )
        newComp.components[0] = JSON.parse(JSON.stringify(comp_array));
    }
    return newComp;
}

export const insertSidebarArray = (dataKey: string, answer: any, beforeAnswer: any, sidebarPosition: number) => {
    // console.log('insertComp',dataKey, answer, beforeAnswer);
    // console.log('cek nested', nested);
    const refPosition = reference.details.findIndex(obj => obj.dataKey === dataKey);
    let defaultRef = JSON.parse(JSON.stringify(reference.details[refPosition]));
    
    // let nestPosition = nested.details.findIndex(obj => obj.dataKey === dataKey);
    // let defaultRef = JSON.parse(JSON.stringify(nested.details[nestPosition]));
    let components = [];
    // console.log('iniarray',dataKey, refPosition, defaultRef);
    defaultRef.components[0].forEach( (element, index) => {
        let tmpDataKey = defaultRef.components[0][index].dataKey.split('@');
        let newDataKey = tmpDataKey[0].split('#');
        let valPosition = validation.details.testFunctions.findIndex(obj => obj.dataKey === newDataKey[0]);
        if(defaultRef.level == 1){
            defaultRef.components[0][index].validations = (valPosition !== -1) ? validation.details.testFunctions[valPosition].validations : [];
            defaultRef.components[0][index].componentValidation = (valPosition !== -1) ? validation.details.testFunctions[valPosition].componentValidation : [];
        } else {
            if(valPosition !== -1){
                let newC = JSON.parse(JSON.stringify(validation.details.testFunctions[valPosition]));
                let originCompVal = newC.componentValidation;
                let newOriginComp
                if(newC.componentValidation.length !== 0){
                    const editedComponentValidation = newC.componentValidation.map(comp => {
                        let tmpKey = comp.split('@');
                        let compNew;
                        if(tmpKey[tmpKey.length-1] === '$ROW$' || tmpKey[tmpKey.length-1] === '$ROW1$' || tmpKey[tmpKey.length-1] === '$ROW2$'){
                            compNew = tmpKey[0] + '#' + newDataKey[1] + '@' + tmpKey[1]
                        } else {
                            compNew = comp;
                        }
                        return compNew;
                    })
                    newOriginComp = editedComponentValidation;
                    defaultRef.components[0][index].componentValidation = newOriginComp;
                }
                
                if(newC.validations.length !== 0){
                    const editedVal = newC.validations.map(val => {
                        let editedTest = val.test;
                        let cv_len = newC.componentValidation.length;
                        for(let cv=0; cv < cv_len; cv++){
                            editedTest = editedTest.replace(originCompVal[cv], newOriginComp[cv]);
                        }
                        val.test = editedTest;
                        return val;
                    })
                    defaultRef.components[0][index].validations = JSON.parse(JSON.stringify(editedVal));
                }
            }
        }
        let newComp = createComponent(defaultRef.components[0][index].dataKey, (Number(answer.value)), Number(index), sidebarPosition, defaultRef.components[0][index], [], answer.label);
        components.push(newComp);
        //insert ke reference
        if(reference.details.findIndex(obj => obj.dataKey === newComp.dataKey) === -1){
            let updatedRef = JSON.parse(JSON.stringify(reference.details));
            let newIndexLength = newComp.index.length;
            for(let looping = newIndexLength; looping > 1; looping--){
                let loopingState = true;
                let myIndex = JSON.parse(JSON.stringify(newComp.index))
                myIndex.length = looping;
                let refLength = reference.details.length;
                for(let y = refLength-1; y >= 0; y--){
                    let refIndexToBeFound = JSON.parse(JSON.stringify(reference.details[y].index));
                    refIndexToBeFound.length = looping;
                    if(JSON.stringify(refIndexToBeFound) === JSON.stringify(myIndex)){
                        updatedRef.splice(y+1, 0, newComp);
                        loopingState = false;
                        break;
                    }
                }
                if(!loopingState) break;
            }
            setReference('details',updatedRef);

            let answer = [];
            // answer = (typeof answer === 'number' || typeof answer === 'string') ? 0 : [];
            answer = (newComp.answer) ? newComp.answer : answer;
            
            const presetIndex = preset.details.predata.findIndex(obj => obj.dataKey === newComp.dataKey);
            answer = (presetIndex !== -1 && preset.details.predata[presetIndex] !== undefined) ? preset.details.predata[presetIndex].answer : answer;
            
            let answerIndex = response.details.answers.findIndex(obj => obj.dataKey === newComp.dataKey);
            answer = (answerIndex !== -1 && response.details.answers[presetIndex] !== undefined) ? response.details.answers[presetIndex].answer : answer;
            
            const getRowIndex = (positionOffset:number) => {
                let editedDataKey = newComp.dataKey.split('@');
                let splitDataKey = editedDataKey[0].split('#');
                let splLength = splitDataKey.length;
                let reducer = positionOffset+1;
                return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength-reducer]);
            }
            const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
            if(Number(newComp.type) === 4) answer = eval(newComp.expression);
            saveAnswer(newComp.dataKey, 'answer', answer, sidebarPosition, null);
        }
    })
    
    let newSide = {
        dataKey: dataKey + '#' + answer.value,
        label: defaultRef.label,
        description: answer.label,
        level: defaultRef.level,
        index: [...defaultRef.index, Number(answer.value)],
        components: [components],
        sourceQuestion: defaultRef.sourceQuestion !== undefined ? defaultRef.sourceQuestion : '',
        enable: defaultRef.enable !== undefined ? defaultRef.enable : true,
        enableCondition: (defaultRef.enableCondition === undefined) ? true : eval(defaultRef.enableCondition),
        componentEnable: defaultRef.componentEnable !== undefined ? defaultRef.componentEnable : []

    }
    let updatedSidebar = JSON.parse(JSON.stringify(sidebar.details));
    if(sidebar.details.findIndex(obj => obj.dataKey === newSide.dataKey) === -1){
        let newSideLength = newSide.index.length;
        for(let looping = newSideLength; looping > 1; looping--){
            let loopingState = true;
            let myIndex = JSON.parse(JSON.stringify(newSide.index))
            myIndex.length = looping;
            let sideLength = sidebar.details.length;
            for(let y = sideLength-1; y >= sidebarPosition; y--){
                let sidebarIndexToBeFound = JSON.parse(JSON.stringify(sidebar.details[y].index));
                sidebarIndexToBeFound.length = looping;
                if(JSON.stringify(sidebarIndexToBeFound) === JSON.stringify(myIndex)){
                    updatedSidebar.splice(y+1, 0, newSide);
                    loopingState = false;
                    break;
                }
            }
            if(!loopingState) break;
        }
    }
    setSidebar('details',updatedSidebar);
}

export const deleteSidebarArray = (dataKey: string, answer: any, beforeAnswer: any, sidebarPosition: number) => {
    // console.log('deleteComp',dataKey, answer, beforeAnswer, sidebarPosition);
    const refPosition = reference.details.findIndex(obj => obj.dataKey === dataKey);
    let updatedRef = JSON.parse(JSON.stringify(reference.details));
    let updatedSidebar = JSON.parse(JSON.stringify(sidebar.details));

    let componentForeignIndexRef = JSON.parse(JSON.stringify(reference.details[refPosition].index));
    let newComponentForeignIndexRef = [...componentForeignIndexRef, Number(beforeAnswer.value)];
    
    let refLength = reference.details.length
    for(let j= refLength-1; j > refPosition; j--){
        let tmpChildIndex = JSON.parse(JSON.stringify(reference.details[j].index));
        tmpChildIndex.length = newComponentForeignIndexRef.length;
        if(JSON.stringify(tmpChildIndex) === JSON.stringify(newComponentForeignIndexRef)){
            updatedRef.splice(j, 1);
        }
    }
    let sideLength = sidebar.details.length;
    for(let x = sideLength-1; x > sidebarPosition; x--){
        let tmpSidebarIndex = JSON.parse(JSON.stringify(sidebar.details[x].index));
        tmpSidebarIndex.length = newComponentForeignIndexRef.length;
        if(JSON.stringify(tmpSidebarIndex) === JSON.stringify(newComponentForeignIndexRef)){
            updatedSidebar.splice(x, 1);
        }
    }
    
    setReference('details',updatedRef);
    setSidebar('details',updatedSidebar);
}

export const changeSidebarArray = (dataKey: string, answer: any, beforeAnswer: any, sidebarPosition: number) => {
    // console.log('changeComp',dataKey, answer, beforeAnswer, sidebarPosition);
    const refPosition = reference.details.findIndex(obj => obj.dataKey === dataKey);

    let now = [];
    let nestedPositionNow = -1;
    
    let answerLength = answer.length;
    let beforeAnswerLength = beforeAnswer.length;
    answer.forEach( (element,index) => {
        if(beforeAnswer.findIndex(obj => Number(obj.value) === Number(answer[index].value)) === -1) {
            now.push(answer[index]);
            nestedPositionNow = Number(index);
        }
    });
    let changedValue = -1;
    if(nestedPositionNow === -1){//berarti cuma beda label di bagian sidebar
        for(let i=0; i < answerLength; i++) {
            for(let j=0; j < beforeAnswerLength; j++) {
                if(answer[i].value === beforeAnswer[j].value){
                    if(answer[i].label !== beforeAnswer[j].label){
                        changedValue = Number(answer[i].value);
                        nestedPositionNow = i;
                        break;
                    }
                }
            }
            if(changedValue !== -1){
                break;
            }
        }
        
        let componentForeignIndexRef = JSON.parse(JSON.stringify(reference.details[refPosition].index));
        let newComponentForeignIndexRef = componentForeignIndexRef.concat(Number(answer[nestedPositionNow].value));
        let sidebarPosition = sidebar.details.findIndex(obj => JSON.stringify(obj.index) === JSON.stringify(newComponentForeignIndexRef));
        let updatedSidebarDescription = answer[nestedPositionNow].label;
        let oldDesc = sidebar.details[sidebarPosition].description;
        
        // setSidebar('details', sidebarPosition, 'description', updatedSidebarDescription);
        let newSidebarComp = JSON.parse(JSON.stringify(sidebar.details[sidebarPosition]));
        let editedComp = [];
        newSidebarComp.components[0].forEach((element, index) => {
            let editedLabel = element.label.replace(oldDesc, updatedSidebarDescription);
            element.label = editedLabel;
            editedComp.push(element);
        })
        
        newSidebarComp.description = updatedSidebarDescription;
        newSidebarComp.components[0] = editedComp;
        
        setSidebar('details', sidebarPosition, newSidebarComp);
    } else {
        let valueToAdd = JSON.parse(JSON.stringify(answer))
        let beforeValueToDel = JSON.parse(JSON.stringify(beforeAnswer))
        for(let i=0; i < answerLength; i++) {
            let cekBefore = beforeValueToDel.findIndex(obj => Number(obj.value) === Number(answer[i].value))
            if(cekBefore !== -1) beforeValueToDel.splice(cekBefore,1)
            let cekValue = valueToAdd.findIndex(obj => Number(obj.value) === Number(beforeAnswer[i].value))
            if(cekValue !== -1) valueToAdd.splice(cekValue,1)
        }
        // console.log('valuetoa', valueToAdd);
        // console.log('beforeVal', beforeValueToDel);
        insertSidebarArray(dataKey, valueToAdd[0], [], sidebarPosition);
        deleteSidebarArray(dataKey, [], beforeValueToDel[0], sidebarPosition);
    }
}

export const insertSidebarNumber = (dataKey: string, answer: any, beforeAnswer: any, sidebarPosition: number) => {
    const refPosition = reference.details.findIndex(obj => obj.dataKey === dataKey);
    let defaultRef = JSON.parse(JSON.stringify(reference.details[refPosition]));
    let components = [];
    let now = (Number(beforeAnswer)+1);
    // console.log('ininumber',defaultRef.components[0]);
    for(let c in defaultRef.components[0]){
        // console.log(defaultRef.components[0][c].dataKey+'#'+(Number(beforeAnswer)+1));
        let tmpDataKey = defaultRef.components[0][c].dataKey.split('@');
        let newDataKey = tmpDataKey[0].split('#');
        let valPosition = validation.details.testFunctions.findIndex(obj => obj.dataKey === newDataKey[0]);
        if(defaultRef.level == 1){
            defaultRef.components[0][c].validations = (valPosition !== -1) ? validation.details.testFunctions[valPosition].validations : [];
            defaultRef.components[0][c].componentValidation = (valPosition !== -1) ? validation.details.testFunctions[valPosition].componentValidation : [];
        } else {
            if(valPosition !== -1){
                let newC = JSON.parse(JSON.stringify(validation.details.testFunctions[valPosition]));
                let originCompVal = newC.componentValidation;
                let newOriginComp
                if(newC.componentValidation.length !== 0){
                    const editedComponentValidation = newC.componentValidation.map(comp => {
                        let tmpKey = comp.split('@');
                        let compNew;
                        if(tmpKey[tmpKey.length-1] === '$ROW$' || tmpKey[tmpKey.length-1] === '$ROW1$' || tmpKey[tmpKey.length-1] === '$ROW2$'){
                            compNew = tmpKey[0] + '#' + newDataKey[1] + '@' + tmpKey[1]
                        } else {
                            compNew = comp;
                        }
                        return compNew;
                    })
                    newOriginComp = editedComponentValidation;
                    defaultRef.components[0][c].componentValidation = newOriginComp;
                }
                
                if(newC.validations.length !== 0){
                    const editedVal = newC.validations.map(val => {
                        let editedTest = val.test;
                        let cv_len = newC.componentValidation.length;
                        for(let cv=0; cv < cv_len; cv++){
                            editedTest = editedTest.replace(originCompVal[cv], newOriginComp[cv]);
                        }
                        val.test = editedTest;
                        return val;
                    })
                    defaultRef.components[0][c].validations = JSON.parse(JSON.stringify(editedVal));
                }
            }
        }
        let checkedDataKey = defaultRef.components[0][c].dataKey+'#'+now.toString();
        if(reference.details.findIndex(obj => obj.dataKey === checkedDataKey) === -1){
            let newComp = createComponent(defaultRef.components[0][c].dataKey, now, Number(c), sidebarPosition, defaultRef.components[0][c], [], now.toString());
            components.push(newComp);
        //insert ke reference
            let updatedRef = JSON.parse(JSON.stringify(reference.details));
            let newIndexLength = newComp.index.length;
            for(let looping = newIndexLength; looping > 1; looping--){
                let loopingState = true;
                let myIndex = JSON.parse(JSON.stringify(newComp.index))
                myIndex.length = looping;
                let refLength = reference.details.length;
                for(let y = refLength-1; y >= refPosition; y--){
                    let refIndexToBeFound = JSON.parse(JSON.stringify(reference.details[y].index));
                    refIndexToBeFound.length = looping;
                    if(JSON.stringify(refIndexToBeFound) === JSON.stringify(myIndex)){
                        updatedRef.splice(y+1, 0, newComp);
                        loopingState = false;
                        break;
                    }
                }
                if(!loopingState) break;
            }
            setReference('details',updatedRef);

            let answer = 0; 
            // answer = (typeof answer === 'number' || typeof answer === 'string') ? 0 : [];
            answer = (newComp.answer) ? newComp.answer : answer;
            
            const presetIndex = preset.details.predata.findIndex(obj => obj.dataKey === newComp.dataKey);
            answer = (presetIndex !== -1 && preset.details.predata[presetIndex] !== undefined) ? preset.details.predata[presetIndex].answer : answer;
            
            let answerIndex = response.details.answers.findIndex(obj => obj.dataKey === newComp.dataKey);
            answer = (answerIndex !== -1 && response.details.answers[presetIndex] !== undefined) ? response.details.answers[presetIndex].answer : answer;
            const getRowIndex = (positionOffset:number) => {
                let editedDataKey = newComp.dataKey.split('@');
                let splitDataKey = editedDataKey[0].split('#');
                let splLength = splitDataKey.length;
                let reducer = positionOffset+1;
                return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength-reducer]);
            }
            const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
            if(Number(newComp.type) === 4) answer = eval(newComp.expression);
            saveAnswer(newComp.dataKey, 'answer', answer, sidebarPosition, null);
        } else {
            break;
        }
    }

    if(components.length > 0){
        let newSide = {
            dataKey: dataKey + '#' + now,
            label: defaultRef.label,
            description: '<i>___________ # ' + now + '</i>',
            level: defaultRef.level,
            index: [...defaultRef.index,now],
            components: [components],
            sourceQuestion: defaultRef.sourceQuestion !== undefined ? defaultRef.sourceQuestion + '#' + (Number(beforeAnswer)+1) : '',
            enable: defaultRef.enable !== undefined ? defaultRef.enable : true,
            enableCondition: (defaultRef.enableCondition === undefined) ? true : eval(defaultRef.enableCondition),
            componentEnable: defaultRef.componentEnable !== undefined ? defaultRef.componentEnable : []
        }
        let updatedSidebar = JSON.parse(JSON.stringify(sidebar.details));
        if(sidebar.details.findIndex(obj => obj.dataKey === newSide.dataKey) === -1){
            let newSideLength = newSide.index.length
            for(let looping = newSideLength; looping > 1; looping--){
                let loopingState = true;
                let myIndex = JSON.parse(JSON.stringify(newSide.index))
                myIndex.length = looping;
                let sideLength = sidebar.details.length
                for(let y = sideLength-1; y >= sidebarPosition; y--){
                    let sidebarIndexToBeFound = JSON.parse(JSON.stringify(sidebar.details[y].index));
                    sidebarIndexToBeFound.length = looping;
                    if(JSON.stringify(sidebarIndexToBeFound) === JSON.stringify(myIndex)){
                        updatedSidebar.splice(y+1, 0, newSide);
                        loopingState = false;
                        break;
                    }
                }
                if(!loopingState) break;
            }
        }
        setSidebar('details',updatedSidebar);
    }
    if(now < answer) insertSidebarNumber(dataKey, answer, now, sidebarPosition);    
}

export const deleteSidebarNumber = (dataKey: string, answer: any, beforeAnswer: any, sidebarPosition: number) => {
    // console.log('deleteComp',dataKey, answer, beforeAnswer, sidebarPosition);
    const refPosition = reference.details.findIndex(obj => obj.dataKey === dataKey);
    let updatedRef = JSON.parse(JSON.stringify(reference.details));
    let updatedSidebar = JSON.parse(JSON.stringify(sidebar.details));

    let componentForeignIndexRef = JSON.parse(JSON.stringify(reference.details[refPosition].index));
    let newComponentForeignIndexRef = [...componentForeignIndexRef, Number(beforeAnswer)];
    // console.log('newComponent',beforeAnswer, newComponentForeignIndexRef)
    let refLength = reference.details.length;
    for(let j=refLength-1; j > refPosition; j--){
        let tmpChildIndex = JSON.parse(JSON.stringify(reference.details[j].index));
        tmpChildIndex.length = newComponentForeignIndexRef.length;
        if(JSON.stringify(tmpChildIndex) === JSON.stringify(newComponentForeignIndexRef)){
            updatedRef.splice(j, 1);
        }
    }
    let sideLength = sidebar.details.length
    for(let x = sideLength-1; x > sidebarPosition; x--){
        let tmpSidebarIndex = JSON.parse(JSON.stringify(sidebar.details[x].index));
        tmpSidebarIndex.length = newComponentForeignIndexRef.length;
        if(JSON.stringify(tmpSidebarIndex) === JSON.stringify(newComponentForeignIndexRef)){
            updatedSidebar.splice(x, 1);
        }
    }
    
    setReference('details',updatedRef);
    setSidebar('details',updatedSidebar);
    let now = beforeAnswer-1;
    // console.log('now', now, beforeAnswer, answer);
    if(now > answer) deleteSidebarNumber(dataKey, answer, now, sidebarPosition);
}

export const runVariableComponent = (dataKey: string, activeComponentPosition: number) => {
    const getRowIndex = (positionOffset:number) => {
        let editedDataKey = dataKey.split('@');
        let splitDataKey = editedDataKey[0].split('#');
        let splLength = splitDataKey.length;
        let reducer = positionOffset+1;
        return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength-reducer]);
    }
    const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
    const refPosition = reference.details.findIndex(obj => obj.dataKey === dataKey);
    let updatedRef = JSON.parse(JSON.stringify(reference.details[refPosition]));
    let answerVariable = eval(updatedRef.expression);
    saveAnswer(dataKey, 'answer', answerVariable, activeComponentPosition, null);
}

export const runEnabling = (dataKey: string, activeComponentPosition: number, prop:any | null, enableCondition:string) => {
    const getProp = (config: string) => {
        switch(config) {
            case 'clientMode': {
                return prop.clientMode;
            }
            case 'baseUrl': {
                return prop.baseUrl;
            }
        }
    }
    const getRowIndex = (positionOffset:number) => {
        let editedDataKey = dataKey.split('@');
        let splitDataKey = editedDataKey[0].split('#');
        let splLength = splitDataKey.length;
        let reducer = positionOffset+1;
        return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength-reducer]);
    }
    const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
    
    //sejak awal buat reference harusnya enable sudah ada
    let enable = eval(enableCondition);
    saveAnswer(dataKey, 'enable', enable, activeComponentPosition, null);
}

export const runValidation = (dataKey:string, updatedRef:any, activeComponentPosition: number) => {
    const getRowIndex = (positionOffset:number) => {
        let editedDataKey = dataKey.split('@');
        let splitDataKey = editedDataKey[0].split('#');
        let splLength = splitDataKey.length;
        let reducer = positionOffset+1;
        return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength-reducer]);
    }
    const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
    
    updatedRef.validationMessage = [];
    updatedRef.validationState = 0;
    let biggest = 0;
    for(let i in updatedRef.validations){
        let result = eval(updatedRef.validations[i].test);
        if(result){
            updatedRef.validationMessage.push(updatedRef.validations[i].message);
            biggest = (biggest < updatedRef.validations[i].type) ? updatedRef.validations[i].type : biggest;
        }
    }
    updatedRef.validationState = biggest;
    
    saveAnswer(dataKey, 'validate', updatedRef, activeComponentPosition, null);
}

export const saveAnswer = (dataKey: string, attributeParam: any, answer: any, activeComponentPosition: number, prop:any | null) => {
    const refPosition = reference.details.findIndex(obj => obj.dataKey === dataKey);

    if(attributeParam === 'answer' || attributeParam === 'enable'){
        
        let beforeAnswer = (typeof answer === 'number' || typeof answer === 'string') ? 0 : [];
        beforeAnswer = (reference.details[refPosition]) ? reference.details[refPosition].answer : beforeAnswer;
        setReference('details', refPosition, attributeParam, answer);
        //validate untuk dataKey sendiri
        runValidation(dataKey, JSON.parse(JSON.stringify(reference.details[refPosition])), activeComponentPosition);
        
        //enabling ~ berjalan ketika answer
        if(attributeParam === 'answer') {
            const hasSideCompEnable = JSON.parse(JSON.stringify(sidebar.details.filter(obj => {
                if(obj.componentEnable !== undefined){
                    const cekInsideIndex = obj.componentEnable.findIndex(objChild => {
                        let newDataKey = '';
                        let tmpDataKey = objChild.split('@');
                        let splitDataKey = tmpDataKey[0].split('#');
                        let splLength = splitDataKey.length;
                        switch(tmpDataKey[1]) {
                            case '$ROW$': {
                                newDataKey = tmpDataKey[0];
                                break;
                            }
                            case '$ROW1$': {
                                if(splLength > 2) splitDataKey.length = splLength - 1;
                                newDataKey = splitDataKey.join('#');
                                break;
                            }
                            case '$ROW2$': {
                                if(splLength > 3) splitDataKey.length = splLength - 2;
                                newDataKey = splitDataKey.join('#');
                                break;
                            }
                            default: {
                                newDataKey = objChild;
                                break;
                            }
                        }
                        return (newDataKey === dataKey) ? true : false;
                    });
                    return (cekInsideIndex == -1) ? false : true;
                }
            })));
            if(hasSideCompEnable.length > 0) {//berarti dataKey ini ada di minimal 1 enable
                hasSideCompEnable.forEach(sidebarEnable => {
                    let sidePosition = sidebar.details.findIndex(objSide => objSide.dataKey === sidebarEnable.dataKey);
                    let enableSide = eval(sidebarEnable.enableCondition);
                    setSidebar('details',sidePosition,'enable',enableSide);
                    let updatedRef = JSON.parse(JSON.stringify(reference.details));
                    sidebarEnable.components[0].forEach(element => {
                        let refPos = updatedRef.findIndex(objRef => objRef.dataKey === element.dataKey);
                        if(refPos !== -1) setReference('details',refPos,'enable',enableSide);
                    });
                })
            }

            const hasComponentEnable = JSON.parse(JSON.stringify(reference.details.filter(obj => {
                if(obj.componentEnable !== undefined){
                    const cekInsideIndex = obj.componentEnable.findIndex(objChild => {
                        let newDataKey = '';
                        let tmpDataKey = objChild.split('@');
                        let splitDataKey = tmpDataKey[0].split('#');
                        let splLength = splitDataKey.length;
                        switch(tmpDataKey[1]) {
                            case '$ROW$': {
                                newDataKey = tmpDataKey[0];
                                break;
                            }
                            case '$ROW1$': {
                                if(splLength > 2) splitDataKey.length = splLength - 1;
                                newDataKey = splitDataKey.join('#');
                                break;
                            }
                            case '$ROW2$': {
                                if(splLength > 3) splitDataKey.length = splLength - 2;
                                newDataKey = splitDataKey.join('#');
                                break;
                            }
                            default: {
                                newDataKey = objChild;
                                break;
                            }
                        }
                        return (newDataKey === dataKey) ? true : false;
                    });
                    return (cekInsideIndex == -1) ? false : true;
                }
            })));
            if(hasComponentEnable.length > 0) {//berarti dataKey ini ada di minimal 1 enable
                hasComponentEnable.forEach(elementEnable => {
                    runEnabling(elementEnable.dataKey, activeComponentPosition, prop, elementEnable.enableCondition);
                })
            }
        }

        if(reference.details[refPosition].enable) {
            //validating ~ berjalan baik ketika answer atau enable
            const hasComponentValidation = JSON.parse(JSON.stringify(reference.details.filter(obj => {
                if(obj.componentValidation !== undefined){
                    const cekInsideIndex = obj.componentValidation.findIndex(objChild => {
                        let newDataKey = '';
                        let tmpDataKey = objChild.split('@');
                        let splitDataKey = tmpDataKey[0].split('#');
                        let splLength = splitDataKey.length;
                        switch(tmpDataKey[1]) {
                            case '$ROW$': {
                                newDataKey = tmpDataKey[0];
                                break;
                            }
                            case '$ROW1$': {
                                if(splLength > 2) splitDataKey.length = splLength - 1;
                                newDataKey = splitDataKey.join('#');
                                break;
                            }
                            case '$ROW2$': {
                                if(splLength > 3) splitDataKey.length = splLength - 2;
                                newDataKey = splitDataKey.join('#');
                                break;
                            }
                            default: {
                                newDataKey = objChild;
                                break;
                            }
                        }
                        return (newDataKey === dataKey) ? true : false;
                    });
                    return (cekInsideIndex == -1) ? false : true;
                }
            })));
            if(hasComponentValidation.length > 0) {//berarti dataKey ini ada di minimal 1 validasi
                hasComponentValidation.forEach(elementVal => {
                    runValidation(elementVal.dataKey, JSON.parse(JSON.stringify(elementVal)), activeComponentPosition);
                });
            }

            //variabel ~ berjalan ketika enable = TRUE
            const hasComponentVar = JSON.parse(JSON.stringify(reference.details.filter(obj => {
                if(obj.componentVar !== undefined){
                    const cekInsideIndex = obj.componentVar.findIndex(objChild => {
                        let newKey = dataKey.split('@');//mereduce @
                        let newNewKey = newKey[0].split('#');//menghilangkan row nya
                        return (objChild === newNewKey[0]) ? true : false;
                    });
                    return (cekInsideIndex == -1) ? false : true;
                }
            })));
        
            if(hasComponentVar.length > 0) {//berarti dataKey ini ada di minimal 1 variable
                hasComponentVar.forEach(elementVar => {
                    runVariableComponent(elementVar.dataKey, 0);
                });
            }
            
            const hasComponentUsing = JSON.parse(JSON.stringify(reference.details.filter(obj => (obj.type === 2 && obj.sourceQuestion == dataKey))));
            
            if(hasComponentUsing.length > 0) {//berarti dataKey ini digunakan sebagai sumber Nested minimal di 1 component
                // console.log('dataKey', dataKey, answer);
                console.time('buat roster');
                hasComponentUsing.forEach(element => {
                    
                    if(typeof answer === 'number' || typeof answer === 'string'){
                        beforeAnswer = (beforeAnswer === undefined) ? 0 : beforeAnswer;
                        (Number(answer) > Number(beforeAnswer)) ?
                            insertSidebarNumber(element.dataKey, answer, beforeAnswer, activeComponentPosition)
                            :
                            deleteSidebarNumber(element.dataKey, answer, beforeAnswer, activeComponentPosition)
                            ;
                    } else if(typeof answer === 'object'){
                        beforeAnswer = (beforeAnswer === undefined) ? [] : beforeAnswer;
                        answer = JSON.parse(JSON.stringify(answer));
                        beforeAnswer = JSON.parse(JSON.stringify(beforeAnswer));
                        
                        if(answer.length > 0){
                            let tmp_index = answer.findIndex(obj => Number(obj.value) === 0);
                            if(tmp_index !== -1){
                                let tmp_label = answer[tmp_index].label.split('#');
                                if(tmp_label[1]) answer.splice(tmp_index, 1);
                            }
                        }
                        if(beforeAnswer.length > 0){
                            let tmp_index = beforeAnswer.findIndex(obj => Number(obj.value) === 0);
                            if(tmp_index !== -1){
                                let tmp_label = beforeAnswer[tmp_index].label.split('#');
                                if(tmp_label[1]) beforeAnswer.splice(tmp_index, 1);
                            }
                        }
                        let answerLength = answer.length;
                        let beforeAnswerLength = beforeAnswer.length;
                        if(answerLength > beforeAnswerLength){
                            answer.forEach(componentAnswer => {
                                let checked = element.dataKey+'#'+Number(componentAnswer.value);
                                if(sidebar.details.findIndex(obj => obj.dataKey === checked) === -1){
                                    insertSidebarArray(element.dataKey, componentAnswer, [], activeComponentPosition);
                                }
                            });
                        } else if(answerLength < beforeAnswerLength){
                            if(answer.length > 0) {
                                beforeAnswer.forEach(component => {
                                    if(answer.findIndex(obj => Number(obj.value) === Number(component.value)) === -1) {
                                        deleteSidebarArray(element.dataKey, [], component, activeComponentPosition);
                                    }
                                })
                            } else {
                                deleteSidebarArray(element.dataKey, [], beforeAnswer[0], activeComponentPosition);
                            }
                        } else if(answerLength === beforeAnswerLength){
                            answerLength > 0 && changeSidebarArray(element.dataKey, answer, beforeAnswer, activeComponentPosition);
                        }
                    }
                });
                console.timeEnd('buat roster');
            }
        }
    } else if(attributeParam === 'validate'){
        setReference('details', refPosition, answer);
    }
}