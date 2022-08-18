import { reference, referenceMap, setReference, setReferenceEnableFalse, setReferenceMap } from './stores/ReferenceStore';
// import { sidebarIndexMap, setSidebarIndexMap } from './stores/ReferenceStore';
import { batch, createSignal } from 'solid-js';
import { locale } from './stores/LocaleStore';
import { note, setNote } from './stores/NoteStore';
import { preset } from './stores/PresetStore';
import { compEnableMap, compValidMap, compVarMap, referenceHistory, referenceHistoryEnable, setCompEnableMap, setCompSourceOptionMap, setCompSourceQuestionMap, setCompValidMap, setCompVarMap, setReferenceHistory, setSidebarHistory, sidebarHistory } from './stores/ReferenceStore';
import { remark } from './stores/RemarkStore';
import { response } from './stores/ResponseStore';
import { setSidebar, sidebar } from './stores/SidebarStore';
import { template } from './stores/TemplateStore';
import { validation } from './stores/ValidationStore';

import Toastify from 'toastify-js';
import { input } from './stores/InputStore';
import { ControlType, OPTION_INPUT_CONTROL } from './FormType';
import { ClientMode } from './constants';
import dayjs from 'dayjs';

export const default_eval_enable = true
export const default_eval_validation = true
var getConfig;
export const globalConfig = (config: any) => {
    getConfig = config
}

export const getValue = (dataKey: string) => {
    let tmpDataKey = dataKey.split('@');
    let splitDataKey = tmpDataKey[0].split('#');
    let splLength = splitDataKey.length;
    switch (tmpDataKey[1]) {
        case '$ROW$': {
            dataKey = tmpDataKey[0];
            break;
        }
        case '$ROW1$': {
            if (splLength > 2) splitDataKey.length = splLength - 1;
            dataKey = splitDataKey.join('#');
            break;
        }
        case '$ROW2$': {
            if (splLength > 3) splitDataKey.length = splLength - 2;
            dataKey = splitDataKey.join('#');
            break;
        }
    }

    const componentIndex = referenceIndexLookup(dataKey)
    let answer = (componentIndex !== -1 && (reference.details[componentIndex].answer) && (reference.details[componentIndex].enable)) ? reference.details[componentIndex].answer : ''
    return answer;
}

export const createComponent = (dataKey: string, nestedPosition: number, componentPosition: number, sidebarPosition: number, components: any, parentIndex: number[], parentName: string) => {
    const eval_enable = (eval_text, dataKey) => {
        try {
            return eval(eval_text)
        } catch (e) {
            console.log(e)
            toastInfo(locale.details.language[0].errorEnableExpression + dataKey, 3000, "", "bg-pink-600/80");
            return default_eval_enable
        }
    }

    let newComp = JSON.parse(JSON.stringify(components));
    newComp.dataKey = newComp.dataKey + '#' + nestedPosition;
    newComp.name = newComp.name + '#' + nestedPosition;

    let tmp_type = newComp.type;
    newComp.answer = (tmp_type === 21 || tmp_type === 22) ? [{ "label": "lastId#0", "value": 0 }] : newComp.answer ? newComp.answer : ''
    newComp.sourceSelect = newComp.sourceSelect !== undefined ? newComp.sourceSelect : [];
    if (newComp.sourceSelect.length > 0) {
        if (newComp.sourceSelect[0].parentCondition.length > 0) {
            newComp.sourceSelect[0].parentCondition.map((item, index) => {
                let editedParentCondition = item.value.split('@');
                if (editedParentCondition[editedParentCondition.length - 1] === '$ROW$' || editedParentCondition[editedParentCondition.length - 1] === '$ROW1$' || editedParentCondition[editedParentCondition.length - 1] === '$ROW2$') {
                    item.value = editedParentCondition[0] + '#' + nestedPosition + '@' + editedParentCondition[1];
                }

            })
        }
    }

    if (parentIndex.length == 0) {
        newComp.index[newComp.index.length - 2] = nestedPosition;
        let label = newComp.label.replace('$NAME$', parentName);
        newComp.label = label;
    } else {
        newComp.index = JSON.parse(JSON.stringify(parentIndex));
        newComp.index = newComp.index.concat(0, componentPosition);
    }

    newComp.sourceQuestion = newComp.sourceQuestion !== undefined ? newComp.sourceQuestion + '#' + nestedPosition : undefined;

    let originSourceOption = newComp.sourceOption;
    if (originSourceOption !== undefined && originSourceOption !== '') {
        let tmpKey = originSourceOption.split('@');
        let compNew;
        if (tmpKey[1] === '$ROW$' || tmpKey[1] === '$ROW1$' || tmpKey[1] === '$ROW2$') {
            compNew = tmpKey[0] + '#' + nestedPosition + '@' + tmpKey[1]
        } else {
            compNew = originSourceOption;
        }
        newComp.sourceOption = compNew;
    }
    //variabel
    newComp.componentVar = newComp.componentVar !== undefined ? newComp.componentVar : [];
    let originCompVar = newComp.componentVar;
    if (newComp.componentVar.length !== 0) {
        const editedComponentVar = newComp.componentVar.map(comp => {
            let tmpKey = comp.split('@');
            let compNew;
            if (tmpKey[1] === '$ROW$' || tmpKey[1] === '$ROW1$' || tmpKey[1] === '$ROW2$') {
                compNew = tmpKey[0] + '#' + nestedPosition + '@' + tmpKey[1]
            } else {
                compNew = comp;
            }
            return compNew;
        })
        newComp.componentVar = editedComponentVar;
    }

    if (newComp.expression !== undefined) {
        let originExpression = newComp.expression;
        let cr_len = newComp.componentVar.length;
        for (let cr = 0; cr < cr_len; cr++) {
            originExpression = originExpression.replace(originCompVar[cr], newComp.componentVar[cr]);
        }
        newComp.expression = originExpression;
    } else {
        newComp.expression = undefined
    }

    //enable
    newComp.componentEnable = newComp.componentEnable !== undefined ? newComp.componentEnable : [];
    let originCompEnable = newComp.componentEnable;
    if (newComp.componentEnable.length !== 0) {
        const editedComponentEnable = newComp.componentEnable.map(comp => {
            let tmpKey = comp.split('@');
            let compNew;
            if (tmpKey[1] === '$ROW$' || tmpKey[1] === '$ROW1$' || tmpKey[1] === '$ROW2$') {
                compNew = tmpKey[0] + '#' + nestedPosition + '@' + tmpKey[1]
            } else {
                compNew = comp;
            }
            return compNew;
        })
        newComp.componentEnable = editedComponentEnable;
    }
    if (newComp.enableCondition !== undefined) {
        let originEnableCondition = newComp.enableCondition;
        let ce_len = newComp.componentEnable.length;
        for (let ce = 0; ce < ce_len; ce++) {
            originEnableCondition = originEnableCondition.replace(originCompEnable[ce], newComp.componentEnable[ce]);
        }
        newComp.enableCondition = originEnableCondition;
    } else {
        newComp.enableCondition = undefined
    }
    newComp.enable = (newComp.enableCondition === undefined || newComp.enableCondition === '') ? true : eval_enable(newComp.enableCondition, newComp.dataKey);

    newComp.hasRemark = false;
    if (newComp.enableRemark === undefined || (newComp.enableRemark !== undefined && newComp.enableRemark)) {
        let remarkPosition = remark.details.notes.findIndex(obj => obj.dataKey === newComp.dataKey);
        if (remarkPosition !== -1) {
            let newNote = remark.details.notes[remarkPosition];
            let updatedNote = JSON.parse(JSON.stringify(note.details.notes));
            updatedNote.push(newNote);
            newComp.hasRemark = true;
            setNote('details', 'notes', updatedNote);
        }
    }
    if (tmp_type < 3) {
        let comp_array = []
        newComp.components[0].forEach((element, index) =>
            comp_array.push(createComponent(element.dataKey, nestedPosition, index, sidebarPosition, newComp.components[0][index], JSON.parse(JSON.stringify(newComp.index)), null))
        )
        newComp.components[0] = JSON.parse(JSON.stringify(comp_array));
    }
    return newComp;
}

export const insertSidebarArray = (dataKey: string, answer: any, beforeAnswer: any, sidebarPosition: number) => {
    const refPosition = referenceIndexLookup(dataKey);
    let defaultRef = JSON.parse(JSON.stringify(reference.details[refPosition]));

    let components = []
    defaultRef.components[0].forEach((element, index) => {
        let newComp = createComponent(defaultRef.components[0][index].dataKey, (Number(answer.value)), Number(index), sidebarPosition, defaultRef.components[0][index], [], answer.label);
        components.push(newComp);
    })

    let startPosition = 0;
    let updatedRef = JSON.parse(JSON.stringify(reference.details));
    let newIndexLength = components[0].index.length;
    for (let looping = newIndexLength; looping > 1; looping--) {
        let loopingState = true;
        let myIndex = JSON.parse(JSON.stringify(components[0].index))
        myIndex.length = looping;
        let refLength = reference.details.length;
        for (let y = refLength - 1; y >= 0; y--) {
            let refIndexToBeFound = JSON.parse(JSON.stringify(reference.details[y].index));
            refIndexToBeFound.length = looping;
            if (JSON.stringify(refIndexToBeFound) === JSON.stringify(myIndex)) {
                startPosition = y + 1;
                loopingState = false;
                break;
            }
        }
        if (!loopingState) break;
    }
    let history = []
    components.forEach(el => {
        if (!(el.dataKey in referenceMap())) {
            updatedRef.splice(startPosition, 0, el);
            history.push({ 'pos': startPosition, 'data': JSON.parse(JSON.stringify(el.dataKey)) })
            startPosition += 1
        }
    })
    addHistory('insert_ref_detail', null, refPosition, null, history)
    batch(() => {
        loadReferenceMap(updatedRef)
        setReference('details', updatedRef);
    })

    components.forEach(newComp => {
        let initial = 0;
        let value = []
        value = (newComp.answer) ? newComp.answer : value;

        if (Number(newComp.type) === 4) {
            const getRowIndex = (positionOffset: number) => {
                let editedDataKey = newComp.dataKey.split('@');
                let splitDataKey = editedDataKey[0].split('#');
                let splLength = splitDataKey.length;
                let reducer = positionOffset + 1;
                return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength - reducer]);
            }
            const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
            initial = 1
            try {
                let value_local = eval(newComp.expression)
                value = value_local
            } catch (e) {
                value = undefined
                toastInfo(locale.details.language[0].errorExpression + newComp.dataKey, 3000, "", "bg-pink-600/80");
            }
        } else {
            let answerIndex = response.details.answers.findIndex(obj => obj.dataKey === newComp.dataKey);
            value = (answerIndex !== -1 && response.details.answers[answerIndex] !== undefined) ? response.details.answers[answerIndex].answer : value;

            if (answerIndex === -1) {
                initial = 1;
                const presetIndex = preset.details.predata.findIndex(obj => obj.dataKey === newComp.dataKey);
                if (presetIndex !== -1 && preset.details.predata[presetIndex] !== undefined && ((getConfig.initialMode == 2) || (getConfig.initialMode == 1 && newComp.presetMaster !== undefined && (newComp.presetMaster)))) {
                    value = preset.details.predata[presetIndex].answer
                    initial = 0
                } else {
                    initial = 1
                }
            }
        }

        saveAnswer(newComp.dataKey, 'answer', value, sidebarPosition, null, initial);
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
        enableCondition: (defaultRef.enableCondition === undefined) ? undefined : defaultRef.enableCondition,
        componentEnable: defaultRef.componentEnable !== undefined ? defaultRef.componentEnable : []
    }
    let updatedSidebar = JSON.parse(JSON.stringify(sidebar.details));
    if (sidebar.details.findIndex(obj => obj.dataKey === newSide.dataKey) === -1) {
        let newSideLength = newSide.index.length
        let y_tmp = 0
        for (let looping = newSideLength; looping > 1; looping--) {
            let loopingState = true;
            let myIndex = JSON.parse(JSON.stringify(newSide.index))
            myIndex.length = looping;
            let sideLength = sidebar.details.length
            if (y_tmp == 0) {
                for (let y = sideLength - 1; y >= sidebarPosition; y--) {
                    if (sidebar.details[y] !== undefined) {
                        let sidebarIndexToBeFound = JSON.parse(JSON.stringify(sidebar.details[y].index));
                        sidebarIndexToBeFound.length = looping;
                        if (JSON.stringify(sidebarIndexToBeFound) === JSON.stringify(myIndex)) {
                            let indexMe = Number(newSide.index[looping]);
                            let indexFind = (sidebar.details[y].index[looping] == undefined) ? 0 : Number(sidebar.details[y].index[looping]);
                            if (looping == newSideLength - 1 || indexMe >= indexFind) {
                                updatedSidebar.splice(y + 1, 0, newSide);
                                loopingState = false;
                                break;
                            } else if (indexMe < indexFind) {
                                y_tmp = y;
                            }
                        }
                    }
                }
                if (!loopingState) break;
            } else {
                updatedSidebar.splice(y_tmp, 0, newSide)
                break;
            }
        }
    }
    addHistory('update_sidebar', null, null, null, JSON.parse(JSON.stringify(sidebar.details)))
    setSidebar('details', updatedSidebar);
}

export const deleteSidebarArray = (dataKey: string, answer: any, beforeAnswer: any, sidebarPosition: number) => {
    const refPosition = referenceIndexLookup(dataKey);
    let updatedRef = JSON.parse(JSON.stringify(reference.details));
    let updatedSidebar = JSON.parse(JSON.stringify(sidebar.details));

    let componentForeignIndexRef = JSON.parse(JSON.stringify(reference.details[refPosition].index));
    let newComponentForeignIndexRef = [...componentForeignIndexRef, Number(beforeAnswer.value)];
    let history = []
    let refLength = reference.details.length
    for (let j = refLength - 1; j > refPosition; j--) {
        let tmpChildIndex = JSON.parse(JSON.stringify(reference.details[j].index));
        tmpChildIndex.length = newComponentForeignIndexRef.length;
        if (JSON.stringify(tmpChildIndex) === JSON.stringify(newComponentForeignIndexRef)) {
            updatedRef.splice(j, 1);
            history.push({ 'pos': j, 'data': JSON.parse(JSON.stringify(reference.details[j])) })
        }
    }
    let sideLength = sidebar.details.length;
    for (let x = sideLength - 1; x > sidebarPosition; x--) {
        let tmpSidebarIndex = JSON.parse(JSON.stringify(sidebar.details[x].index));
        tmpSidebarIndex.length = newComponentForeignIndexRef.length;
        if (JSON.stringify(tmpSidebarIndex) === JSON.stringify(newComponentForeignIndexRef)) {
            updatedSidebar.splice(x, 1);
        }
    }
    addHistory('delete_ref_detail', null, refPosition, null, history)
    batch(() => {
        loadReferenceMap(updatedRef)
        setReference('details', updatedRef);
    })
    addHistory('update_sidebar', null, null, null, JSON.parse(JSON.stringify(sidebar.details)))
    setSidebar('details', updatedSidebar);
}

export const changeSidebarArray = (dataKey: string, answer: any, beforeAnswer: any, sidebarPosition: number) => {
    const refPosition = referenceIndexLookup(dataKey);
    let now = [];
    let nestedPositionNow = -1;

    let answerLength = answer.length;
    let beforeAnswerLength = beforeAnswer.length;
    answer.forEach((element, index) => {
        if (beforeAnswer.findIndex(obj => Number(obj.value) === Number(answer[index].value)) === -1) {
            now.push(answer[index]);
            nestedPositionNow = Number(index);
        }
    });
    let changedValue = -1;
    if (nestedPositionNow == -1) {//different label in sidebar
        for (let i = 0; i < answerLength; i++) {
            for (let j = 0; j < beforeAnswerLength; j++) {
                if (answer[i].value === beforeAnswer[j].value) {
                    if (answer[i].label !== beforeAnswer[j].label) {
                        changedValue = Number(answer[i].value);
                        nestedPositionNow = i;
                        break;
                    }
                }
            }
            if (changedValue !== -1) {
                break;
            }
        }
        if (nestedPositionNow !== -1) {
            let componentForeignIndexRef = JSON.parse(JSON.stringify(reference.details[refPosition].index));
            let newComponentForeignIndexRef = componentForeignIndexRef.concat(Number(answer[nestedPositionNow].value));
            let sidebarPosition = sidebar.details.findIndex(obj => JSON.stringify(obj.index) === JSON.stringify(newComponentForeignIndexRef));
            let updatedSidebarDescription = answer[nestedPositionNow].label;
            let oldDesc = sidebar.details[sidebarPosition].description;

            let newSidebarComp = JSON.parse(JSON.stringify(sidebar.details[sidebarPosition]));
            let editedComp = [];
            newSidebarComp.components[0].forEach((element, index) => {
                let editedLabel = element.label.replace(oldDesc, updatedSidebarDescription);
                element.label = editedLabel;
                editedComp.push(element);
            })

            newSidebarComp.description = updatedSidebarDescription;
            newSidebarComp.components[0] = editedComp;
            addHistory('update_sidebar', null, null, null, JSON.parse(JSON.stringify(sidebar.details)))
            setSidebar('details', sidebarPosition, newSidebarComp);
        }
    } else {
        let valueToAdd = JSON.parse(JSON.stringify(answer))
        let beforeValueToDel = JSON.parse(JSON.stringify(beforeAnswer))
        for (let i = 0; i < answerLength; i++) {
            let cekBefore = beforeValueToDel.findIndex(obj => Number(obj.value) === Number(answer[i].value))
            if (cekBefore !== -1) beforeValueToDel.splice(cekBefore, 1)
            let cekValue = valueToAdd.findIndex(obj => Number(obj.value) === Number(beforeAnswer[i].value))
            if (cekValue !== -1) valueToAdd.splice(cekValue, 1)
        }
        insertSidebarArray(dataKey, valueToAdd[0], [], sidebarPosition);
        deleteSidebarArray(dataKey, [], beforeValueToDel[0], sidebarPosition);
    }
}

export const insertSidebarNumber = (dataKey: string, answer: any, beforeAnswer: any, sidebarPosition: number) => {
    const refPosition = referenceIndexLookup(dataKey);
    let defaultRef = JSON.parse(JSON.stringify(reference.details[refPosition]));
    let components = []
    let now = (Number(beforeAnswer) + 1);
    for (let c in defaultRef.components[0]) {
        let newComp = createComponent(defaultRef.components[0][c].dataKey, now, Number(c), sidebarPosition, defaultRef.components[0][c], [], now.toString());
        components.push(newComp);
    }

    if (components.length > 0) {
        let startPosition = 0;
        let updatedRef = JSON.parse(JSON.stringify(reference.details));
        let newIndexLength = components[0].index.length;
        for (let looping = newIndexLength; looping > 1; looping--) {
            let loopingState = true;
            let myIndex = JSON.parse(JSON.stringify(components[0].index))
            myIndex.length = looping;
            let refLength = reference.details.length;
            for (let y = refLength - 1; y >= 0; y--) {
                let refIndexToBeFound = JSON.parse(JSON.stringify(reference.details[y].index));
                refIndexToBeFound.length = looping;
                if (JSON.stringify(refIndexToBeFound) === JSON.stringify(myIndex)) {
                    startPosition = y + 1;
                    loopingState = false;
                    break;
                }
            }
            if (!loopingState) break;
        }
        let history = []
        components.forEach(el => {
            if (!(el.dataKey in referenceMap())) {
                updatedRef.splice(startPosition, 0, el);
                history.push({ 'pos': startPosition, 'data': JSON.parse(JSON.stringify(el.dataKey)) })
                startPosition += 1
            }
        })
        addHistory('insert_ref_detail', null, refPosition, null, history)
        batch(() => {
            loadReferenceMap(updatedRef)
            setReference('details', updatedRef);
        })
        components.forEach(newComp => {
            let initial = 0;
            let value = []
            value = (newComp.answer) ? newComp.answer : value;

            if (Number(newComp.type) === 4) {
                const getRowIndex = (positionOffset: number) => {
                    let editedDataKey = newComp.dataKey.split('@');
                    let splitDataKey = editedDataKey[0].split('#');
                    let splLength = splitDataKey.length;
                    let reducer = positionOffset + 1;
                    return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength - reducer]);
                }
                const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
                initial = 1
                try {
                    let value_local = eval(newComp.expression)
                    value = value_local
                } catch (e) {
                    value = undefined
                    toastInfo(locale.details.language[0].errorExpression + newComp.dataKey, 3000, "", "bg-pink-600/80");
                }
            } else {
                let answerIndex = response.details.answers.findIndex(obj => obj.dataKey === newComp.dataKey);
                value = (answerIndex !== -1 && response.details.answers[answerIndex] !== undefined) ? response.details.answers[answerIndex].answer : value;

                if (answerIndex === -1) {
                    initial = 1
                    const presetIndex = preset.details.predata.findIndex(obj => obj.dataKey === newComp.dataKey);
                    if (presetIndex !== -1 && preset.details.predata[presetIndex] !== undefined && ((getConfig.initialMode == 2) || (getConfig.initialMode == 1 && newComp.presetMaster !== undefined && (newComp.presetMaster)))) {
                        value = preset.details.predata[presetIndex].answer
                        initial = 0
                    } else {
                        initial = 1
                    }
                }
            }
            saveAnswer(newComp.dataKey, 'answer', value, sidebarPosition, null, initial);
        })

        let newSide = {
            dataKey: dataKey + '#' + now,
            label: defaultRef.label,
            description: '<i>___________ # ' + now + '</i>',
            level: defaultRef.level,
            index: [...defaultRef.index, now],
            components: [components],
            sourceQuestion: defaultRef.sourceQuestion !== undefined ? defaultRef.sourceQuestion + '#' + (Number(beforeAnswer) + 1) : '',
            enable: defaultRef.enable !== undefined ? defaultRef.enable : true,
            enableCondition: (defaultRef.enableCondition === undefined) ? undefined : defaultRef.enableCondition,
            componentEnable: defaultRef.componentEnable !== undefined ? defaultRef.componentEnable : []
        }
        let updatedSidebar = JSON.parse(JSON.stringify(sidebar.details));
        if (sidebar.details.findIndex(obj => obj.dataKey === newSide.dataKey) === -1) {
            let newSideLength = newSide.index.length
            let y_tmp = 0
            for (let looping = newSideLength; looping > 1; looping--) {
                let loopingState = true;
                let myIndex = JSON.parse(JSON.stringify(newSide.index))
                myIndex.length = looping;
                let sideLength = sidebar.details.length
                if (y_tmp == 0) {
                    for (let y = sideLength - 1; y >= sidebarPosition; y--) {
                        let sidebarIndexToBeFound = JSON.parse(JSON.stringify(sidebar.details[y].index));
                        sidebarIndexToBeFound.length = looping;
                        if (JSON.stringify(sidebarIndexToBeFound) === JSON.stringify(myIndex)) {
                            let indexMe = Number(newSide.index[looping]);
                            let indexFind = (sidebar.details[y].index[looping] == undefined) ? 0 : Number(sidebar.details[y].index[looping]);
                            if (looping == newSideLength - 1 || indexMe >= indexFind) {
                                updatedSidebar.splice(y + 1, 0, newSide);
                                loopingState = false;
                                break;
                            } else if (indexMe < indexFind) {
                                y_tmp = y;
                            }
                        }
                    }
                    if (!loopingState) break;
                } else {
                    updatedSidebar.splice(y_tmp, 0, newSide)
                    break;
                }
            }
        }
        addHistory('update_sidebar', null, null, null, JSON.parse(JSON.stringify(sidebar.details)))
        setSidebar('details', updatedSidebar);
    }
    if (now < answer) insertSidebarNumber(dataKey, answer, now, sidebarPosition);
}

export const deleteSidebarNumber = (dataKey: string, answer: any, beforeAnswer: any, sidebarPosition: number) => {
    const refPosition = referenceIndexLookup(dataKey);
    let updatedRef = JSON.parse(JSON.stringify(reference.details));
    let updatedSidebar = JSON.parse(JSON.stringify(sidebar.details));

    let componentForeignIndexRef = JSON.parse(JSON.stringify(reference.details[refPosition].index));
    let newComponentForeignIndexRef = [...componentForeignIndexRef, Number(beforeAnswer)];
    let history = []
    let refLength = reference.details.length;
    for (let j = refLength - 1; j > refPosition; j--) {
        let tmpChildIndex = JSON.parse(JSON.stringify(reference.details[j].index));
        tmpChildIndex.length = newComponentForeignIndexRef.length;
        if (JSON.stringify(tmpChildIndex) === JSON.stringify(newComponentForeignIndexRef)) {
            updatedRef.splice(j, 1);
            history.push({ 'pos': j, 'data': JSON.parse(JSON.stringify(reference.details[j])) })
        }
    }
    let sideLength = sidebar.details.length
    for (let x = sideLength - 1; x > sidebarPosition; x--) {
        let tmpSidebarIndex = JSON.parse(JSON.stringify(sidebar.details[x].index));
        tmpSidebarIndex.length = newComponentForeignIndexRef.length;
        if (JSON.stringify(tmpSidebarIndex) === JSON.stringify(newComponentForeignIndexRef)) {
            updatedSidebar.splice(x, 1);
        }
    }
    addHistory('delete_ref_detail', null, refPosition, null, history)
    setReference('details', updatedRef);
    addHistory('update_sidebar', null, null, null, JSON.parse(JSON.stringify(sidebar.details)))
    setSidebar('details', updatedSidebar);
    let now = beforeAnswer - 1;

    if (now > answer) {
        deleteSidebarNumber(dataKey, answer, now, sidebarPosition);
    } else {
        loadReferenceMap()
    }
}

export const runVariableComponent = (dataKey: string, activeComponentPosition: number, initial: number) => {
    const getRowIndex = (positionOffset: number) => {
        let editedDataKey = dataKey.split('@');
        let splitDataKey = editedDataKey[0].split('#');
        let splLength = splitDataKey.length;
        let reducer = positionOffset + 1;
        return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength - reducer]);
    }
    const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
    const refPosition = referenceIndexLookup(dataKey)
    if (refPosition !== -1) {
        let updatedRef = JSON.parse(JSON.stringify(reference.details[refPosition]));
        try {
            let answerVariable = eval(updatedRef.expression);
            let init = (initial == 1) ? 1 : (answerVariable == undefined || (answerVariable != undefined && answerVariable.length == 0)) ? 1 : 0
            saveAnswer(dataKey, 'answer', answerVariable, activeComponentPosition, null, init);
        } catch (e) {
            console.log(e, dataKey)
            toastInfo(locale.details.language[0].errorExpression + dataKey, 3000, "", "bg-pink-600/80");
            saveAnswer(dataKey, 'answer', undefined, activeComponentPosition, null, 1);
        }

    }
}

export const runEnabling = (dataKey: string, activeComponentPosition: number, prop: any | null, enableCondition: string) => {
    const getProp = (config: string) => {
        switch (config) {
            case 'clientMode': {
                return prop.clientMode;
            }
            case 'baseUrl': {
                return prop.baseUrl;
            }
        }
    }

    const eval_enable = (eval_text, dataKey) => {
        try {
            return eval(eval_text)
        } catch (e) {
            console.log(e, dataKey, eval_text)
            toastInfo(locale.details.language[0].errorEnableExpression + dataKey, 3000, "", "bg-pink-600/80");
            return default_eval_enable
        }
    }

    const getRowIndex = (positionOffset: number) => {
        let editedDataKey = dataKey.split('@');
        let splitDataKey = editedDataKey[0].split('#');
        let splLength = splitDataKey.length;
        let reducer = positionOffset + 1;
        return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength - reducer]);
    }
    const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));

    let enable = eval_enable(enableCondition, dataKey);
    saveAnswer(dataKey, 'enable', enable, activeComponentPosition, null, 0);
}

export const runValidation = (dataKey: string, updatedRef: any, activeComponentPosition: number, clientMode?: ClientMode) => {
    const getRowIndex = (positionOffset: number) => {
        let editedDataKey = dataKey.split('@');
        let splitDataKey = editedDataKey[0].split('#');
        let splLength = splitDataKey.length;
        let reducer = positionOffset + 1;
        return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength - reducer]);
    }
    const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
    updatedRef.validationMessage = []
    updatedRef.validationState = 0;
    if (!updatedRef.hasRemark) {
        // for (let i in updatedRef.validations) {
        updatedRef.validations?.forEach((el, i) => {
            let result = default_eval_validation;
            try {
                result = eval(el.test)
            } catch (e) {
                console.log(e, updatedRef.dataKey, el.test)
                toastInfo(locale.details.language[0].errorValidationExpression + updatedRef.dataKey, 3000, "", "bg-pink-600/80");
            }
            if (result) {
                updatedRef.validationMessage.push(el.message);
                updatedRef.validationState = (updatedRef.validationState < el.type) ? el.type : updatedRef.validationState;
            }
            // }
        })

        if (updatedRef.urlValidation && (updatedRef.type == 24 || updatedRef.type == 25 || updatedRef.type == 28 || updatedRef.type == 30 || updatedRef.type == 31)) {
            let resultTest = false
            let fetchStatus
            let url = `${updatedRef.urlValidation}`
            let onlineValidation = async (url) =>
            (await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer: updatedRef.answer })
            }).catch((error: any) => {
                let temp = {
                    result: false
                }
                fetchStatus = false;
                resultTest = temp.result
                if (!resultTest || !fetchStatus) {
                    let validationMessage = locale.details.language[0].validationApi
                    updatedRef.validationMessage.push(validationMessage);
                    updatedRef.validationState = 2;
                    saveAnswer(dataKey, 'validate', updatedRef, activeComponentPosition, null, 0);
                }
            }).then((res: any) => {
                if (res.status === 200) {
                    let temp = res.json();
                    fetchStatus = true
                    return temp;
                } else {
                    let temp = {
                        result: false
                    }
                    fetchStatus = false;
                    return temp
                }
            }).then((res: any) => {
                resultTest = res.result
                if (!resultTest || !fetchStatus) {
                    let validationMessage = locale.details.language[0].validationApi
                    if (res.message && (res.message != '' || res.message != undefined)) {
                        validationMessage = res.message
                    }
                    updatedRef.validationMessage.push(validationMessage);
                    updatedRef.validationState = 2;
                    saveAnswer(dataKey, 'validate', updatedRef, activeComponentPosition, null, 0);
                }
            }));
            onlineValidation(url);
        }

        if (updatedRef.lengthInput !== undefined && updatedRef.lengthInput.length > 0 && updatedRef.answer !== undefined && typeof updatedRef.answer !== 'object') {
            if (updatedRef.lengthInput[0].maxlength !== undefined && updatedRef.answer.length > updatedRef.lengthInput[0].maxlength) {
                updatedRef.validationMessage.push(locale.details.language[0].validationMaxLength + " " + updatedRef.lengthInput[0].maxlength);
                updatedRef.validationState = 2;
            }
            if (updatedRef.lengthInput[0].minlength !== undefined && updatedRef.answer.length < updatedRef.lengthInput[0].minlength) {
                updatedRef.validationMessage.push(locale.details.language[0].validationMinLength + " " + updatedRef.lengthInput[0].minlength);
                updatedRef.validationState = 2;
            }
        }
        if (updatedRef.rangeInput !== undefined && updatedRef.rangeInput.length > 0 && updatedRef.answer !== undefined && typeof updatedRef.answer !== 'object') {
            if (updatedRef.rangeInput[0].max !== undefined && Number(updatedRef.answer) > updatedRef.rangeInput[0].max) {
                updatedRef.validationMessage.push(locale.details.language[0].validationMax + " " + updatedRef.rangeInput[0].max);
                updatedRef.validationState = 2;
            }
            if (updatedRef.rangeInput[0].min !== undefined && Number(updatedRef.answer) < updatedRef.rangeInput[0].min) {
                updatedRef.validationMessage.push(locale.details.language[0].validationMin + " " + updatedRef.rangeInput[0].min);
                updatedRef.validationState = 2;
            }
        }
        if (updatedRef.type == 31 && updatedRef.answer !== undefined && typeof updatedRef.answer !== 'object') {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(updatedRef.answer)) {
                updatedRef.validationMessage.push(locale.details.language[0].validationEmail);
                updatedRef.validationState = 2;
            }
        }

        /**
         * Handle PAPI validation.
         */
        if (clientMode == ClientMode.PAPI && updatedRef.answer !== undefined) {
            const val = updatedRef.answer

            /** Validate radio input */
            if (updatedRef.type == ControlType.RadioInput) {
                const allowedVals = updatedRef.options?.map(opt => opt.value)
                if (allowedVals !== undefined) {
                    if (val[0] && !allowedVals.includes(val[0].value)) {
                        const validationMessage = templating(locale.details.language[0].validationInclude, { values: allowedVals.join(",") })
                        updatedRef.validationMessage.push(validationMessage)
                        updatedRef.validationState = 2
                    }
                }
            }

            /** Validate date input */
            if (updatedRef.type == ControlType.DateInput) {
                if (!validateDateString(updatedRef.answer)) {
                    updatedRef.validationMessage.push(locale.details.language[0].validationDate)
                    updatedRef.validationState = 2
                } else {
                    const date = new Date(updatedRef.answer)
                    if (updatedRef.rangeInput[0].max !== undefined) {
                        const maxDate = updatedRef.rangeInput[0].max === 'today' ? new Date() : new Date(updatedRef.rangeInput[0].max)
                        if (date.getTime() > maxDate.getTime()) {
                            updatedRef.validationMessage.push(locale.details.language[0].validationMax + " " + dayjs(maxDate).format('DD/MM/YYYY'));
                            updatedRef.validationState = 2
                        }
                    }
                    if (updatedRef.rangeInput[0].min !== undefined) {
                        const minDate = updatedRef.rangeInput[0].min === 'today' ? new Date() : new Date(updatedRef.rangeInput[0].min)
                        if (date.getTime() < minDate.getTime()) {
                            updatedRef.validationMessage.push(locale.details.language[0].validationMin + " " + dayjs(minDate).format('DD/MM/YYYY'));
                            updatedRef.validationState = 2
                        }
                    }
                }
            }
        }
    }

    saveAnswer(dataKey, 'validate', updatedRef, activeComponentPosition, null, 0);
}

export const setEnableFalse = () => {
    const indexEnableFalse = []
    setReferenceEnableFalse([]);
    sidebar.details.forEach((element) => {
        if (!element.enable) {
            let idx = JSON.parse(JSON.stringify(element.index))
            idx.length = idx.length;
            indexEnableFalse.push({
                parentIndex: idx,
            });
        }
    })
    setReferenceEnableFalse(JSON.parse(JSON.stringify(indexEnableFalse)));
}

export const saveAnswer = (dataKey: string, attributeParam: any, answer: any, activeComponentPosition: number, prop: any | null, initial: number) => {
    const eval_enable = (eval_text, dataKey) => {
        try {
            return eval(eval_text)
        } catch (e) {
            console.log(e)
            toastInfo(locale.details.language[0].errorEnableExpression + dataKey, 3000, "", "bg-pink-600/80");
            return default_eval_enable
        }
    }

    let refPosition = referenceIndexLookup(dataKey)

    if (refPosition > -1 && (attributeParam === 'answer' || attributeParam === 'enable')) {
        let beforeAnswer = (typeof answer === 'number' || typeof answer === 'string') ? 0 : [];
        beforeAnswer = (reference.details[refPosition]?.answer !== undefined && reference.details[refPosition].answer !== '') ? reference.details[refPosition].answer : beforeAnswer;
        addHistory('saveAnswer', dataKey, refPosition, attributeParam, reference.details[refPosition][attributeParam])
        setReference('details', refPosition, attributeParam, answer);
        //validate for its own dataKey 
        if (referenceHistoryEnable() && (reference.details[refPosition].validations !== undefined || reference.details[refPosition].rangeInput !== undefined || reference.details[refPosition].lengthInput !== undefined) && initial == 0) runValidation(dataKey, JSON.parse(JSON.stringify(reference.details[refPosition])), activeComponentPosition, prop?.clientMode);

        //do nothing if no changes, thanks to Budi's idea on pull request #5
        if (attributeParam === 'answer') {
            if (JSON.stringify(beforeAnswer) === JSON.stringify(answer)) {
                return
            }
        }
        if (attributeParam === 'enable') {
            if (reference.details[refPosition]['enable'] === answer) {
                return
            }
        }

        //enabling ~ run when answer
        if (attributeParam === 'answer') {
            const hasSideCompEnable = JSON.parse(JSON.stringify(sidebar.details.filter(obj => {
                if (obj.componentEnable !== undefined) {
                    const cekInsideIndex = obj.componentEnable.findIndex(objChild => {
                        let newDataKey = '';
                        let tmpDataKey = objChild.split('@');
                        let splitDataKey = tmpDataKey[0].split('#');
                        let splLength = splitDataKey.length;
                        switch (tmpDataKey[1]) {
                            case '$ROW$': {
                                newDataKey = tmpDataKey[0];
                                break;
                            }
                            case '$ROW1$': {
                                if (splLength > 2) splitDataKey.length = splLength - 1;
                                newDataKey = splitDataKey.join('#');
                                break;
                            }
                            case '$ROW2$': {
                                if (splLength > 3) splitDataKey.length = splLength - 2;
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
            if (hasSideCompEnable.length > 0) {//at least there is minimal 1 enable in this datakey
                hasSideCompEnable.forEach(sidebarEnable => {
                    let sidePosition = sidebar.details.findIndex(objSide => objSide.dataKey === sidebarEnable.dataKey);
                    let enableSideBefore = sidebar.details[sidePosition]['enable'];
                    let enableSide = eval_enable(sidebarEnable.enableCondition, sidebarEnable.dataKey);
                    addHistory('update_sidebar', null, null, null, JSON.parse(JSON.stringify(sidebar.details)))
                    setSidebar('details', sidePosition, 'enable', enableSide);
                    let updatedRef = JSON.parse(JSON.stringify(reference.details));
                    let tmpVarComp = []
                    let tmpIndex = []
                    if (enableSide !== enableSideBefore) {
                        sidebarEnable.components[0].forEach((element, index) => {
                            // let refPos = updatedRef.findIndex(objRef => objRef.dataKey === element.dataKey);
                            let refPos = referenceIndexLookup(element.dataKey)
                            if (refPos !== -1) {
                                if (!enableSide) {
                                    setReference('details', refPos, 'enable', enableSide);
                                } else {
                                    if (Number(updatedRef[refPos].type) === 4) {
                                        tmpVarComp.push(updatedRef[refPos])
                                        tmpIndex.push(index)
                                    }
                                    let newEnab = true;
                                    if (updatedRef[refPos].enableCondition === undefined || updatedRef[refPos].enableCondition === '') {
                                        newEnab = true;
                                    } else {
                                        newEnab = eval_enable(updatedRef[refPos].enableCondition, updatedRef[refPos].dataKey)
                                    }
                                    setReference('details', refPos, 'enable', newEnab);
                                }
                            }
                        });
                        if (tmpVarComp.length > 0) {
                            const getRowIndex = (positionOffset: number) => {
                                let editedDataKey = dataKey.split('@');
                                let splitDataKey = editedDataKey[0].split('#');
                                let splLength = splitDataKey.length;
                                let reducer = positionOffset + 1;
                                return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength - reducer]);
                            }
                            const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
                            tmpVarComp.forEach((t, i) => {
                                try {
                                    let evVal = eval(t.expression);
                                    saveAnswer(t.dataKey, 'answer', evVal, tmpIndex[i], null, 0);
                                } catch (e) {
                                    toastInfo(locale.details.language[0].errorExpression + t.dataKey, 3000, "", "bg-pink-600/80");
                                    saveAnswer(e.dataKey, 'answer', undefined, tmpIndex[i], null, 1);
                                }
                            })
                        }
                    }
                })
            }
            const hasComponentEnable = get_CompEnable(dataKey)
            if (hasComponentEnable.length > 0) {//this datakey at least appear in minimum 1 enable
                hasComponentEnable.forEach(elementEnableDatakey => {
                    let element_pos = referenceIndexLookup(elementEnableDatakey)
                    if (element_pos !== -1) {
                        let elementEnable = reference.details[element_pos]
                        runEnabling(elementEnable.dataKey, activeComponentPosition, prop, elementEnable.enableCondition);
                    }
                })
            }
        }

        if (reference.details[refPosition].enable) {
            //validating ~ run weel when answer or enable
            if (initial == 0) {
                // const hasComponentValidation = JSON.parse(JSON.stringify(reference.details.filter(obj => {
                //     let editedDataKey = obj.dataKey.split('@');
                //     let newEdited = editedDataKey[0].split('#');
                //     if ((obj.enable) && obj.componentValidation !== undefined) {
                //         if (obj.level < 2 || obj.level > 1 && newEdited[1] !== undefined) {
                //             const cekInsideIndex = obj.componentValidation.findIndex(objChild => {
                //                 let newKey = dataKey.split('@');//reduce or split @
                //                 let newNewKey = newKey[0].split('#');//remove the row
                //                 return (objChild === newNewKey[0]) ? true : false;
                //             });
                //             return (cekInsideIndex == -1) ? false : true;
                //         }
                //     }
                // })));
                const hasComponentValidation = get_CompValid(dataKey)
                if (hasComponentValidation.length > 0) {//at least this dataKey appears in minimum 1 validation
                    hasComponentValidation.forEach(elementVal => {
                        let componentIndex = referenceIndexLookup(elementVal)
                        if (reference.details[componentIndex].enable)
                            runValidation(elementVal, JSON.parse(JSON.stringify(reference.details[componentIndex])), activeComponentPosition, prop?.clientMode);
                        // runValidation(elementVal.dataKey, JSON.parse(JSON.stringify(elementVal)), activeComponentPosition);
                    });
                } else if (prop?.clientMode === ClientMode.PAPI && OPTION_INPUT_CONTROL.includes(reference.details[refPosition].type)) {
                    runValidation(dataKey, JSON.parse(JSON.stringify(reference.details[refPosition])), activeComponentPosition, prop?.clientMode)
                }
            }

            //cek opt ~ run well on answer or enable
            const hasSourceOption = JSON.parse(JSON.stringify(reference.details.filter(obj => {
                if ((obj.enable) && obj.sourceOption !== undefined) {
                    let editedSourceOption = obj.sourceOption.split('@');
                    return (dataKey == editedSourceOption[0]) ? true : false;
                }
            })));

            if (hasSourceOption.length > 0) {//at least dataKey appear in minimal 1 sourceOption
                hasSourceOption.forEach(elementSourceOption => {
                    if (elementSourceOption.answer) {
                        let x = []
                        elementSourceOption.answer.forEach(val => {
                            answer.forEach(op => {
                                if (val.value == op.value) {
                                    x.push(op);
                                }
                            })
                        })
                        saveAnswer(elementSourceOption.dataKey, 'answer', x, activeComponentPosition, null, 0);
                    }
                });
            }

            //variabel ~ executed when enable = TRUE
            const hasComponentVar = JSON.parse(JSON.stringify(reference.details.filter(obj => {
                if (obj.componentVar !== undefined) {
                    const cekInsideIndex = obj.componentVar.findIndex(objChild => {
                        let newKey = dataKey.split('@');//mereduce @
                        let newNewKey = newKey[0].split('#');//menghilangkan row nya
                        return (objChild === newNewKey[0]) ? true : false;
                    });
                    return (cekInsideIndex == -1) ? false : true;
                }
            })));

            if (hasComponentVar.length > 0) {//at least dataKey appeasr in minimum 1 variable
                hasComponentVar.forEach(elementVar => {
                    runVariableComponent(elementVar.dataKey, 0, initial);
                });
            }

            const hasComponentUsing = JSON.parse(JSON.stringify(reference.details.filter(obj => (obj.type === 2 && obj.sourceQuestion == dataKey))));
            if (hasComponentUsing.length > 0) {//this dataKey is used as a source in Nested at minimum 1 component
                if (reference.details[refPosition].answer == undefined && reference.details[refPosition].type === 4) beforeAnswer = [];
                if (typeof answer !== 'boolean' && !(answer == undefined && JSON.stringify(beforeAnswer) == '[]')) {
                    console.time('Nested 🚀');
                    hasComponentUsing.forEach(element => {
                        if (typeof answer === 'number' || typeof answer === 'string') {
                            beforeAnswer = (beforeAnswer === undefined) ? 0 : beforeAnswer;
                            if (Number(answer) > Number(beforeAnswer)) {
                                insertSidebarNumber(element.dataKey, answer, beforeAnswer, activeComponentPosition)
                            } else if (Number(answer) < Number(beforeAnswer)) {
                                deleteSidebarNumber(element.dataKey, answer, beforeAnswer, activeComponentPosition)
                            };
                        } else if (typeof answer === 'object') {
                            beforeAnswer = (beforeAnswer === undefined) ? [] : beforeAnswer;
                            answer = JSON.parse(JSON.stringify(answer));
                            beforeAnswer = JSON.parse(JSON.stringify(beforeAnswer));

                            if (answer.length > 0) {
                                let tmp_index = answer.findIndex(obj => Number(obj.value) === 0);
                                if (tmp_index !== -1) {
                                    let tmp_label = answer[tmp_index].label.split('#');
                                    if (tmp_label[1]) answer.splice(tmp_index, 1);
                                }
                            }
                            if (beforeAnswer.length > 0) {
                                let tmp_index = beforeAnswer.findIndex(obj => Number(obj.value) === 0);
                                if (tmp_index !== -1) {
                                    let tmp_label = beforeAnswer[tmp_index].label.split('#');
                                    if (tmp_label[1]) beforeAnswer.splice(tmp_index, 1);
                                }
                            }
                            let answerLength = answer.length;
                            let beforeAnswerLength = beforeAnswer.length;
                            if (answerLength > beforeAnswerLength) {
                                answer.forEach(componentAnswer => {
                                    let checked = element.dataKey + '#' + Number(componentAnswer.value);
                                    if (sidebar.details.findIndex(obj => obj.dataKey === checked) === -1) {
                                        insertSidebarArray(element.dataKey, componentAnswer, [], activeComponentPosition);
                                    }
                                });
                            } else if (answerLength < beforeAnswerLength) {
                                if (answer.length > 0) {
                                    beforeAnswer.forEach(component => {
                                        if (answer.findIndex(obj => Number(obj.value) === Number(component.value)) === -1) {
                                            deleteSidebarArray(element.dataKey, [], component, activeComponentPosition);
                                        }
                                    })
                                } else {
                                    deleteSidebarArray(element.dataKey, [], beforeAnswer[0], activeComponentPosition);
                                }
                            } else if (answerLength === beforeAnswerLength) {
                                answerLength > 0 && changeSidebarArray(element.dataKey, answer, beforeAnswer, activeComponentPosition);
                            }
                        }
                    });
                    console.timeEnd('Nested 🚀');
                }
            }
        }

        setEnableFalse();
    } else if (attributeParam === 'validate') {
        let item_refff = JSON.parse(JSON.stringify(reference.details[refPosition]))
        addHistory('saveAnswer', dataKey, refPosition, attributeParam
            , { 'validationState': item_refff.validationState, 'validationMessage': item_refff.validationMessage })
        setReference('details', refPosition, answer);
    }
}

export function referenceIndexLookup(datakey, index_lookup = 0) {
    try {
        if (datakey in referenceMap()) {
            try {
                if (reference.details[referenceMap()[datakey][0][0]].dataKey === datakey) {
                    if (index_lookup == 0) {
                        return referenceMap()[datakey][0][0];
                    } else {
                        return referenceMap()[datakey][1];
                    }
                } else {
                    loadReferenceMap()
                    if (datakey in referenceMap()) {
                        if (index_lookup == 0) {
                            return referenceMap()[datakey][0][0];
                        } else {
                            return referenceMap()[datakey][1];
                        }
                    } else {
                        return -1
                    }
                }
            } catch (e) {
                loadReferenceMap()
                if (datakey in referenceMap()) {
                    if (index_lookup == 0) {
                        return referenceMap()[datakey][0][0];
                    } else {
                        return referenceMap()[datakey][1];
                    }
                } else {
                    return -1
                }
            }
        } else {
            return -1
        }
    } catch (ex) {
        return -1
    }
}

// laad_reference_map, and add map for dependency for validasion, enable, componentVar, sourceOption and sourceQuestion
export function initReferenceMap(reference_local = null) {
    let compEnableMap_local = new Object()
    let compValidMap_local = new Object()
    let compSourceOption_local = new Object()
    let compVar_local = new Object()
    let compSourceQuestion_local = new Object()

    const loopTemplate = (element) => {
        let el_len = element.length
        for (let i = 0; i < el_len; i++) {
            let obj = element[i]
            if (obj.componentEnable !== undefined) {
                obj.componentEnable.forEach(item => {
                    let itemKeyBased = item.split('@')[0].split('#')[0];
                    if (!(itemKeyBased in compEnableMap_local)) {
                        compEnableMap_local[itemKeyBased] = new Object()
                    }
                    if (!(item in compEnableMap_local[itemKeyBased])) {
                        compEnableMap_local[itemKeyBased][item] = []
                    }
                    if (!compEnableMap_local[itemKeyBased][item].includes(obj.dataKey)) {
                        compEnableMap_local[itemKeyBased][item].push(obj.dataKey)
                    }
                })
            }
            if (obj.sourceOption !== undefined) {
                if (!(obj.sourceOption.split('@')[0] in compSourceOption_local)) {
                    compSourceOption_local[obj.sourceOption.split('@')[0]] = []
                }
                if (!compSourceOption_local[obj.sourceOption.split('@')[0]].includes(obj.dataKey)) {
                    compSourceOption_local[obj.sourceOption.split('@')[0]].push(obj.dataKey)
                }
            }
            if (obj.componentVar !== undefined && obj.type === 4) {
                obj.componentVar.forEach(item => {
                    if (!(item in compVar_local)) {
                        compVar_local[item] = []
                    }
                    if (!compVar_local[item].includes(obj.dataKey)) {
                        compVar_local[item].push(obj.dataKey)
                    }
                })
            }
            if (obj.sourceQuestion !== undefined && obj.type === 2) {
                if (!(obj.sourceQuestion in compSourceQuestion_local)) {
                    compSourceQuestion_local[obj.sourceQuestion] = []
                }
                if (!compSourceQuestion_local[obj.sourceQuestion].includes(obj.dataKey)) {
                    compSourceQuestion_local[obj.sourceQuestion].push(obj.dataKey)
                }
            }
            element[i].components && element[i].components.forEach((element, index) => loopTemplate(element))
        }
    }
    template.details.components.forEach((element, index) => loopTemplate(element));

    for (let index = 0; index < validation.details.testFunctions.length; index++) {
        let obj = validation.details.testFunctions[index]
        if (obj.componentValidation !== undefined) {
            obj.componentValidation.forEach(item => {
                if (!(item in compValidMap_local)) {
                    compValidMap_local[item] = []
                }
                compValidMap_local[item].push(obj.dataKey)
            })
        }
    }
    setCompEnableMap(compEnableMap_local)
    setCompValidMap(compValidMap_local)
    setCompSourceOptionMap(compSourceOption_local)
    setCompVarMap(compVar_local)
    setCompSourceQuestionMap(compSourceQuestion_local)

    // console.log(compEnableMap())
    // console.log(compValidMap())
    // console.log(compSourceOptionMap())
    // console.log(compVarMap())
    // console.log(compSourceQuestionMap())

    if (reference_local === null) {
        reference_local = JSON.parse(JSON.stringify(reference.details))
    }
    loadReferenceMap(reference_local)
}

//make referenceMap, referenceMap is index, etc of component by datakey save as dictionary
export function loadReferenceMap(reference_local = null) {
    // console.time('loadReferenceMap');
    if (reference_local === null) {
        reference_local = JSON.parse(JSON.stringify(reference.details))
    }
    let reference_map_local = new Object()
    for (let index__ = 0; index__ < reference_local.length; index__++) {
        let fullDataKey = reference_local[index__].dataKey
        if (!(fullDataKey in reference_map_local)) {
            reference_map_local[fullDataKey] = [[], []]
        }
        reference_map_local[fullDataKey][0].push(index__)
        reference_map_local[fullDataKey][1].push(fullDataKey)

        let splitDataKey = fullDataKey.split('#');
        if (splitDataKey.length > 1) {
            if (!(splitDataKey[0] in reference_map_local)) {
                reference_map_local[splitDataKey[0]] = [[], []]
            }
            reference_map_local[splitDataKey[0]][1].push(fullDataKey)
        }
    }
    setReferenceMap(reference_map_local)
    // console.timeEnd('loadReferenceMap');
}

export function get_CompEnable(dataKey) {
    let itemKeyBased = dataKey.split('@')[0].split('#')[0];
    let returnDataKey = []
    if (itemKeyBased in compEnableMap()) {
        for (let key_comp in (compEnableMap()[itemKeyBased])) {
            compEnableMap()[itemKeyBased][key_comp].forEach(element_item => {
                let list_key = referenceIndexLookup(element_item, 1)
                if (list_key !== -1 && list_key) {
                    list_key.forEach(objChild => {
                        let newDataKey = '';
                        let tmpDataKey = key_comp.split('@');
                        let splitDataKey = objChild.split('@')[0].split('#');
                        let splLength = splitDataKey.length;
                        if (splLength > 0) {
                            splitDataKey[0] = itemKeyBased
                        }
                        switch (tmpDataKey[1]) {
                            case '$ROW$': {
                                newDataKey = splitDataKey.join('#');
                                break;
                            }
                            case '$ROW1$': {
                                if (splLength > 2) splitDataKey.length = splLength - 1;
                                newDataKey = splitDataKey.join('#');
                                break;
                            }
                            case '$ROW2$': {
                                if (splLength > 3) splitDataKey.length = splLength - 2;
                                newDataKey = splitDataKey.join('#');
                                break;
                            }
                            default: {
                                newDataKey = key_comp;
                                break;
                            }
                        }
                        if (newDataKey === dataKey) {
                            returnDataKey.push(objChild)
                        }
                    });
                }
            });
        }
    }
    return returnDataKey
}

export function get_CompValid(dataKey) {
    let itemKeyBased = dataKey.split('@')[0].split('#')[0];
    let returnDataKey = []
    if (itemKeyBased in compValidMap()) {
        if (compValidMap()[itemKeyBased].length > 0) {
            compValidMap()[itemKeyBased].forEach(item => {
                let list_key = referenceIndexLookup(item, 1)
                if (list_key !== -1 && list_key) {
                    returnDataKey = returnDataKey.concat(list_key)
                }
            });
        }
    }
    return returnDataKey
}

export function get_CompVar(dataKey) {
    let itemKeyBased = dataKey.split('@')[0].split('#')[0];
    let returnDataKey = []
    if (itemKeyBased in compVarMap()) {
        if (compVarMap()[itemKeyBased].length > 0) {
            compVarMap()[itemKeyBased].forEach(item => {
                let list_key = referenceIndexLookup(item, 1)
                if (list_key !== -1 && list_key) {
                    returnDataKey = returnDataKey.concat(list_key)
                }
            });
        }
    }
    return returnDataKey
}

export function addHistory(type, datakey, position, attributeParam, data) {
    if (!referenceHistoryEnable()) {
        return
    }
    if (type === "update_sidebar") {
        if (sidebarHistory().length === 0) {
            setSidebarHistory(data)
        }
    } else {
        setReferenceHistory([...referenceHistory(), { 'type': type, 'datakey': datakey, 'position': position, 'attributeParam': attributeParam, 'data': data }]);
    }
}

export function reloadDataFromHistory() {
    let detail_local = JSON.parse(JSON.stringify(reference.details))
    for (let index_history = referenceHistory().length - 1; index_history >= 0; index_history--) {
        let type = referenceHistory()[index_history]['type']
        let datakey = referenceHistory()[index_history]['datakey']
        let position = referenceHistory()[index_history]['position']
        let attributeParam = referenceHistory()[index_history]['attributeParam']
        let data = referenceHistory()[index_history]['data']

        if (type === "insert_ref_detail") {
            for (let index_local = data.length - 1; index_local >= 0; index_local--) {
                let item_post = data[index_local]['pos']
                if (detail_local[data[index_local]['pos']].dataKey !== data[index_local]['data']) {
                    let refPostion = detail_local.findIndex((element) => {
                        element.dataKey === data[index_local]['data']
                    })
                    item_post = refPostion
                }
                if (item_post !== -1) {
                    detail_local.splice(item_post, 1)
                }
            }
        } else if (type === "delete_ref_detail") {
            for (let index_local = data.length - 1; index_local >= 0; index_local--) {
                let item_post = data[index_local]['pos']
                detail_local.splice(item_post, 0, JSON.parse(JSON.stringify(data[index_local]['data'])))
            }
        } else if (type === 'saveAnswer') {
            if (detail_local[position].dataKey !== datakey) {
                let refPostion = detail_local.findIndex((element) => {
                    element.dataKey === datakey
                })
                position = refPostion
            }
            if (position !== -1) {
                if (attributeParam === 'answer') {
                    detail_local[position][attributeParam] = data
                } else if (attributeParam === 'enable') {
                    detail_local[position][attributeParam] = data
                } else if (attributeParam === 'validate') {
                    detail_local[position]['validationState'] = data['validationState']
                    detail_local[position]['validationMessage'] = JSON.parse(JSON.stringify(data['validationMessage']))
                }
            }
        }
    }
    loadReferenceMap(detail_local)
    setReference('details', detail_local)
    if (sidebarHistory().length > 0) {
        setSidebar('details', JSON.parse(JSON.stringify(sidebarHistory())));
    }
}

export const toastInfo = (text: string, duration: number, position: string, bgColor: string) => {
    Toastify({
        text: (text == '') ? locale.details.language[0].componentDeleted : text,
        duration: (duration >= 0) ? duration : 500,
        gravity: "top",
        position: (position == '') ? "right" : position,
        stopOnFocus: true,
        className: (bgColor == '') ? "bg-blue-600/80" : bgColor,
        style: {
            background: "rgba(8, 145, 178, 0.7)",
            width: "400px"
        }
    }).showToast();
}

/**
 * Handle additional PAPI input validation
 */
export const focusFirstInput = () => {
    const elem = document.querySelector("input:not(.hidden-input):not(:disabled),textarea:not(.hidden-input):not(:disabled)") as HTMLElement
    elem?.focus()
}

export const refocusLastSelector = () => {
    if (input.currentDataKey !== "") {
        const lastElement = document.querySelector(`[name="${input.currentDataKey}"]`) as HTMLElement
        if (lastElement) {
            lastElement?.focus()
        } else {
            focusFirstInput()
        }
    }
}

export const scrollCenterInput = (elem: HTMLElement, container?: HTMLElement) => {
    if (container == null) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            container = document.querySelector(".mobile-component-div");
        } else {
            container = document.querySelector(".component-div");
        }
    }

    let center = container.clientHeight / 2
    let top = elem.offsetTop

    let middle = container.clientWidth / 2
    let left = elem.offsetLeft

    if (left > middle || top > center) {
        container.scrollTo({ top: top - center, left: left - middle, behavior: "smooth" });
    }
}

export const joinWords = (words: any[], delimiter: String, conjunction: String = "and") => {
    const last = words.pop();
    return `${words.join(delimiter + ' ')} ${conjunction} ${last}`;
}

export const cleanLabel = (label: String) => {
    if (label.includes("-")) {
        var splitchar = "-"
    } else if (label.includes(".")) {
        var splitchar = "."
    }

    if (splitchar) {
        const splitted = label.split(splitchar)
        splitted.shift()
        return splitted.join(splitchar).trim()
    }

    return label
}

export const validateDateString = (date: string): Boolean => {
    const dateObject = new Date(date) as any
    const isValidDate =
        dateObject.toString() != "Invalid Date"
        && !isNaN(dateObject)
        && dateObject.toISOString().split("T")[0] === date
    return isValidDate
}

export const templating = (template: string, data: any) => {
    return template.replace(
        /\$(\w*)/g,
        function (m, key) {
            return data.hasOwnProperty(key) ? data[key] : "";
        }
    );
}