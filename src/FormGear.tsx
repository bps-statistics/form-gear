import { render } from "solid-js/web";

import "./index.css";
import Form from "./Form";
import { FormProvider } from "./FormProvider";

import Loader from "./loader/Loader"
import FormLoaderProvider from "./loader/FormLoaderProvider"

import { template, setTemplate, Questionnaire } from './stores/TemplateStore';
import { preset, setPreset, Preset } from './stores/PresetStore';
import { response, setResponse, Response } from './stores/ResponseStore';
import { validation, setValidation, Validation } from './stores/ValidationStore';
import { remark, setRemark, Remark } from './stores/RemarkStore';
import { note, setNote } from './stores/NoteStore';

import { reference, setReference } from './stores/ReferenceStore';
import { referenceMap, setReferenceMap} from './stores/ReferenceStore';
import { nested, setNested } from './stores/NestedStore';
import { sidebar, setSidebar } from './stores/SidebarStore';

import { createSignal } from "solid-js";

import { load_reference_map } from "./GlobalFunction";

import semverCompare from "semver-compare";
import { toastInfo } from "./FormInput";

export function FormGear(referenceFetch, templateFetch, presetFetch, responseFetch, validationFetch, remarkFetch, config, uploadHandler, GpsHandler, offlineSearch, onlineSearch, mobileExit, setResponseMobile, setSubmitMobile, openMap) {

  console.log('form-gear@0.1.2');
  console.time('FormGear renders successfully in ');
  let timeStart = new Date();

  try{
    setTemplate({details: templateFetch});
    setPreset({details: presetFetch});
    setResponse({details: responseFetch});
    setValidation({details: validationFetch});
    setRemark({details: remarkFetch});

    const tmpVarComp = [];
    const tmpEnableComp = [];
    const flagArr = [];
    const refList = [];
    const sideList = [];
    const sidebarList = [];
    const referenceList = [];
    let len = template.details.components[0].length;

    const versionState = template.details.version == undefined ? 1 : semverCompare(
      template.details.version !== undefined ? template.details.version : '0.0.1', 
      response.details.templateVersion !== undefined ? response.details.templateVersion : '0.0.0'
    )
    const sidebarLen = reference !== undefined ? referenceFetch.sidebar.length : 0
    const referenceLen = reference !== undefined ? referenceFetch.details.length : 0

    // semverCompare(a,b) 
    // If the semver string a is greater than b, return 1. 
    // If the semver string b is greater than a, return -1. 
    // If a equals b, return 0;
    let runAll = 0;
    // versionState == 0 && referenceLen > 0 && sidebarLen >0
    if( versionState == 0 && referenceLen > 0 && sidebarLen >0 ){
      console.log('Reuse reference 🚀')
      setReference(referenceFetch)
      setSidebar('details',referenceFetch.sidebar)
      load_reference_map()
      runAll = 1;
      
      render(() => (
        <FormProvider config={config}>
          <FormLoaderProvider>
            <Form timeStart={timeStart} runAll={runAll} tmpEnableComp={tmpEnableComp} tmpVarComp={tmpVarComp} template={template} preset={preset} response={response} validation={validation} remark={remark} uploadHandler={uploadHandler} GpsHandler={GpsHandler} offlineSearch={offlineSearch} onlineSearch={onlineSearch} mobileExit={mobileExit} setResponseMobile={setResponseMobile} setSubmitMobile={setSubmitMobile} openMap={openMap}/>
            <Loader />
          </FormLoaderProvider>
        </FormProvider>
      ), document.getElementById("FormGear-root") as HTMLElement);
    }else{
      console.log('Build reference 🚀')
      
      const nestComp = [];
      const getValue = (dataKey: string) => {
        let answer = '';
        if(referenceList.length > 0){
          const componentIndex = referenceList.findIndex(obj => obj.dataKey === dataKey);
          if(componentIndex !== -1 && (referenceList[componentIndex].answer) && (referenceList[componentIndex].enable)) answer = referenceList[componentIndex].answer;
        }
        return answer;
      }
      
      const loopValidation = (element, index, parent, level, parent_key) => {
        let el_len = element.length

        for (let i = 0; i < el_len; i++) {
          let datekey_parent = (JSON.parse(JSON.stringify(parent_key)))
          datekey_parent.push(element[i].dataKey)

          let el_type = element[i].type
          if(el_type == 2){
            let nestMasterComp = []
            element[i].components[0].forEach( (e) => {
              let vals;
              let compVal;
              let valPosition = validation.details.testFunctions.findIndex(obj => obj.dataKey === e.dataKey);
              if(valPosition !== -1) {
                vals = validation.details.testFunctions[valPosition].validations;
                compVal = validation.details.testFunctions[valPosition].componentValidation;
              }
              let nestEachComp = []
              nestEachComp.push({                    
                dataKey : e.dataKey,
                label : e.label,
                hint : e.hint,
                description : e.description,
                type : e.type,
                answer : e.answer,
                index : e.index,
                level : e.level,
                options : e.options,
                typeOption : e.typeOption,
                sourceOption : e.sourceOption,
                sourceSelect : e.sourceSelect,
                components : e.components,
                rows : e.rows,
                cols : e.cols,
                sourceQuestion : e.sourceQuestion,
                currency : e.currency,
                source : e.source,
                urlPath : e.urlPath,
                parent : e.parent,
                separatorFormat : e.separatorFormat,
                isDecimal : e.isDecimal,
                maskingFormat : e.maskingFormat,
                expression : e.expression,
                componentVar : e.componentVar,
                render : e.render,
                renderType : e.renderType,
                enable : e.enable,
                enableCondition : e.enableCondition,
                componentEnable : e.componentEnable,
                enableRemark : e.enableRemark,
                client : e.client,
                titleModalDelete : e.titleModalDelete,
                contentModalDelete : e.contentModalDelete,
                validationState : e.validationState,
                validationMessage : e.validationMessage,
                validations: vals,
                componentValidation: compVal,
                rangeInput: e.rangeInput !== undefined ? e.rangeInput : undefined,
                lengthInput: e.lengthInput !== undefined ? e.lengthInput : undefined,
                principal: e.principal !== undefined ? e.principal : undefined,
                columnName: e.columnName !== undefined ? e.columnName : '',
                titleModalConfirmation : e.titleModalConfirmation,
                contentModalConfirmation : e.contentModalConfirmation,
                required: e.required,
                presetMaster: e.presetMaster !== undefined ? e.presetMaster : undefined,
                disableInput: e.disableInput !== undefined ? e.disableInput : undefined,
                disableInitial: e.disableInitial !== undefined ? e.disableInitial : undefined,
                parent_ref: datekey_parent,
              })
              nestMasterComp ? nestMasterComp.push(nestEachComp[0]) : nestMasterComp.splice(nestMasterComp.length, 0, nestEachComp[0])
            
            });
            nestComp.push({
              dataKey: element[i].dataKey,
              description: element[i].description,
              label: element[i].label,
              sourceQuestion: element[i].sourceQuestion,
              type: el_type,
              components: [nestMasterComp]
            })
          }


          element[i].components && element[i].components.forEach((element, index) => loopValidation(element, index, parent.concat(i,0), level+1, datekey_parent))
        }
      }
      template.details.components.forEach((element, index) => loopValidation(element, index, [0], 0, []));
      setNested('details',nestComp)
      
      const [components , setComponents] = createSignal([]);

      const buildReference = (element, index) => {
          for(let j=0; j < element.length; j++){
            refList[j] = [];
            sideList[j] = [];
            // let d = new Date();
            // console.log ('start',element[j].dataKey, d.getTime());
            flagArr[j] = 0;
            setTimeout( () => {
              const loopTemplate = (element, index, parent, level, sideEnable, parent_ref) => {
                let el_len = element.length
                for (let i = 0; i < el_len; i++) {
                  let answer = element[i].answer;
                  
                  let el_type = element[i].type
                  if((el_type == 21 || el_type == 22)){
                    answer = JSON.parse(JSON.stringify(answer));
                  } else if(el_type == 4){
                    (answer == undefined ) && tmpVarComp.push(JSON.parse(JSON.stringify(element[i]))) ;
                  }

                  let components
                  if(el_type == 2){
                    let nestPosition = nested.details.findIndex(obj => obj.dataKey === element[i].dataKey);
                    components = (nestPosition !== -1) ? nested.details[nestPosition].components : (element[i].components) ? element[i].components : undefined;
                  }else{
                    components = (element[i].components) ? element[i].components : undefined;
                  }

                  if(el_type == 1 || (el_type == 2 && components.length > 1)){
                      if(element[i].enableCondition !== undefined) {
                        tmpEnableComp.push(JSON.parse(JSON.stringify(element[i])));
                        sideEnable = false;
                      } else {
                        sideEnable = true;
                      }
                      
                      let sideListLen = sideList[j].length;
                      sideList[j][sideListLen] = {
                          dataKey: element[i].dataKey,
                          label: element[i].label,
                          description: element[i].description,
                          level: level,
                          index: parent.concat(i),
                          components: components,
                          sourceQuestion: element[i].sourceQuestion !== undefined ? element[i].sourceQuestion : '',
                          enable: sideEnable,
                          enableCondition: element[i].enableCondition !== undefined ? element[i].enableCondition : '',
                          componentEnable: element[i].componentEnable !== undefined ? element[i].componentEnable : []
                      }
                  }

                  if(el_type > 2 && element[i].enableCondition !== undefined && !sideEnable) tmpEnableComp.push(JSON.parse(JSON.stringify(element[i])));

                  let vals;
                  let compVal;
                  let valPosition = validation.details.testFunctions.findIndex(obj => obj.dataKey === element[i].dataKey);
                  if(valPosition !== -1) {
                    vals = validation.details.testFunctions[valPosition].validations;
                    compVal = validation.details.testFunctions[valPosition].componentValidation;
                  }

                  let hasRemark = false;
                  if ( element[i].enableRemark === undefined || (element[i].enableRemark !== undefined && element[i].enableRemark )){  
                    let remarkPosition = remark.details.notes.findIndex(obj => obj.dataKey === element[i].dataKey);
                    if(remarkPosition !== -1){
                      let newNote = remark.details.notes[remarkPosition];
                      let updatedNote = JSON.parse(JSON.stringify(note.details.notes));
                      updatedNote.push(newNote);
                      hasRemark = true;
                      setNote('details','notes',updatedNote);
                    }
                  }
                  
                  let refListLen = refList[j].length;
                  refList[j][refListLen] = {         
                      dataKey: element[i].dataKey,
                      label: element[i].label,
                      hint: (element[i].hint) ? element[i].hint : '',
                      description: element[i].description !== undefined ? element[i].description : undefined,
                      type: element[i].type,
                      answer: answer,
                      index: parent.concat(i),
                      level: level,
                      options: (element[i].options) ? element[i].options : undefined,
                      components: components,
                      sourceQuestion: element[i].sourceQuestion !== undefined ? element[i].sourceQuestion : undefined,
                      currency: element[i].currency !== undefined ? element[i].currency : undefined,
                      source: element[i].source !== undefined ? element[i].source : undefined,
                      urlPath: element[i].path !== undefined ? element[i].path : undefined,
                      parent: element[i].parent !== undefined ? element[i].parent : undefined,
                      separatorFormat: element[i].separatorFormat !== undefined ? element[i].separatorFormat : undefined,
                      isDecimal: element[i].isDecimal !== undefined ? element[i].isDecimal : undefined,
                      maskingFormat: element[i].maskingFormat !== undefined ? element[i].maskingFormat : undefined,
                      expression: (element[i].expression) ? element[i].expression : undefined,
                      componentVar: (element[i].componentVar) ? element[i].componentVar : undefined,
                      render: (element[i].render) ? element[i].render : undefined,
                      renderType: (element[i].renderType) ? element[i].renderType : undefined,
                      enable: true,
                      enableCondition: element[i].enableCondition !== undefined ? element[i].enableCondition : '',
                      componentEnable: element[i].componentEnable !== undefined ? element[i].componentEnable : [],
                      enableRemark: element[i].enableRemark !== undefined ? element[i].enableRemark : true,
                      client: element[i].client !== undefined ? element[i].client : undefined,
                      titleModalDelete: element[i].titleModalDelete !== undefined ? element[i].titleModalDelete : undefined,
                      sourceOption: element[i].sourceOption !== undefined ? element[i].sourceOption : undefined,
                      typeOption: element[i].typeOption !== undefined ? element[i].typeOption : undefined,
                      contentModalDelete: element[i].contentModalDelete !== undefined ? element[i].contentModalDelete : undefined,
                      validationState: element[i].validationState !== undefined ? element[i].validationState : 0,
                      validationMessage: element[i].validationMessage !== undefined ? element[i].validationMessage : [],
                      validations: vals,
                      componentValidation: compVal,
                      hasRemark: hasRemark,
                      rows: (element[i].rows !== undefined && element[i].rows[0] !== undefined) ? element[i].rows : undefined,
                      cols: (element[i].cols !== undefined && element[i].cols[0] !== undefined) ? element[i].cols : undefined,
                      rangeInput: (element[i].rangeInput !== undefined && element[i].rangeInput[0] !== undefined) ? element[i].rangeInput : undefined,
                      lengthInput: (element[i].lengthInput !== undefined && element[i].lengthInput[0] !== undefined) ? element[i].lengthInput : undefined,
                      principal: element[i].principal !== undefined ? element[i].principal : undefined,
                      columnName: element[i].columnName !== undefined ? element[i].columnName : '',
                      titleModalConfirmation: element[i].titleModalConfirmation !== undefined ? element[i].titleModalConfirmation : undefined,
                      contentModalConfirmation: element[i].contentModalConfirmation !== undefined ? element[i].contentModalConfirmation : undefined,
                      required: element[i].required !== undefined ? element[i].required : undefined,
                      presetMaster: element[i].presetMaster !== undefined ? element[i].presetMaster : undefined,
                      disableInput: element[i].disableInput !== undefined ? element[i].disableInput : undefined,
                      disableInitial: element[i].disableInitial !== undefined ? element[i].disableInitial : undefined,
                      parent_ref: parent_ref,
                  }
                  let datekey_parent = (JSON.parse(JSON.stringify(parent_ref)))
                  datekey_parent.push(refList[j][refListLen].dataKey)
                  element[i].components && element[i].components.forEach((element) => loopTemplate(element, refListLen, parent.concat(i,0), level+1, sideEnable, datekey_parent))
                }
              }
              
              let hasSideEnable  =false;
              if(element[j].enableCondition !== undefined){
                tmpEnableComp.push(JSON.parse(JSON.stringify(element[j])));
                hasSideEnable  =true;
              }
              
              sideList[j][0] = {
                  dataKey: element[j].dataKey,
                  label: element[j].label,
                  description: element[j].description,
                  level: 0,
                  index: [0, j],
                  components: element[j].components,
                  sourceQuestion: element[j].sourceQuestion !== undefined ? element[j].sourceQuestion : '',
                  enable: !hasSideEnable,
                  enableCondition: element[j].enableCondition !== undefined ? element[j].enableCondition : '',
                  componentEnable: element[j].componentEnable !== undefined ? element[j].componentEnable : []
              }

              // insert section
              refList[j][0] = {         
                dataKey: element[j].dataKey,
                label: element[j].label,
                hint: (element[j].hint) ? element[j].hint : '',
                description: element[j].description !== undefined ? element[j].description : undefined,
                type: element[j].type,
                index: [0, j],
                level: 0,
                options: (element[j].options) ? element[j].options : undefined,
                components: components,
                sourceQuestion: element[j].sourceQuestion !== undefined ? element[j].sourceQuestion : undefined,
                currency: element[j].currency !== undefined ? element[j].currency : undefined,
                source: element[j].source !== undefined ? element[j].source : undefined,
                urlPath: element[j].path !== undefined ? element[j].path : undefined,
                parent: element[j].parent !== undefined ? element[j].parent : undefined,
                separatorFormat: element[j].separatorFormat !== undefined ? element[j].separatorFormat : undefined,
                isDecimal: element[j].isDecimal !== undefined ? element[j].isDecimal : undefined,
                typeOption: element[j].typeOption !== undefined ? element[j].typeOption : undefined,
                sourceOption: element[j].sourceOption !== undefined ? element[j].sourceOption : undefined,
                maskingFormat: element[j].maskingFormat !== undefined ? element[j].maskingFormat : undefined,
                expression: (element[j].expression) ? element[j].expression : undefined,
                componentVar: (element[j].componentVar) ? element[j].componentVar : undefined,
                render: (element[j].render) ? element[j].render : undefined,
                renderType: (element[j].renderType) ? element[j].renderType : undefined,
                enable: true,
                enableCondition: element[j].enableCondition !== undefined ? element[j].enableCondition : '',
                componentEnable: element[j].componentEnable !== undefined ? element[j].componentEnable : [],
                enableRemark: element[j].enableRemark !== undefined ? element[j].enableRemark : true,
                client: element[j].client !== undefined ? element[j].client : undefined,
                titleModalDelete: element[j].titleModalDelete !== undefined ? element[j].titleModalDelete : undefined,
                contentModalDelete: element[j].contentModalDelete !== undefined ? element[j].contentModalDelete : undefined,
                validationState: element[j].validationState !== undefined ? element[j].validationState : 0,
                validationMessage: element[j].validationMessage !== undefined ? element[j].validationMessage : [],
                rows: (element[j].rows !== undefined && element[j].rows[0] !== undefined) ? element[j].rows : undefined,
                cols: (element[j].cols !== undefined && element[j].cols[0] !== undefined) ? element[j].cols : undefined,
                rangeInput: (element[j].rangeInput !== undefined && element[j].rangeInput[0] !== undefined) ? element[j].rangeInput : undefined,
                lengthInput: (element[j].lengthInput !== undefined && element[j].lengthInput[0] !== undefined) ? element[j].lengthInput : undefined,
                principal: element[j].principal !== undefined ? element[j].principal : undefined,
                columnName: element[j].columnName !== undefined ? element[j].columnName : '',
                titleModalConfirmation: element[j].titleModalConfirmation !== undefined ? element[j].titleModalConfirmation : undefined,
                contentModalConfirmation: element[j].contentModalConfirmation !== undefined ? element[j].contentModalConfirmation : undefined,
                required: element[j].required !== undefined ? element[j].required : undefined,
                parent_ref: [],
              }

              loopTemplate(element[j].components[0], 0, [0, j, 0], 1, hasSideEnable, [element[j].dataKey])
              
              // let e = new Date();
              // console.log ('end',element[j].dataKey, e.getTime());
              flagArr[j] = 1;
            },
            500)
          }
      }
      template.details.components.forEach((element,index) => buildReference(element, index)) 
      runAll = 0;
      let sum = 0;
      const t = setInterval(() => {
        sum = 0;
        for(let a = 0; a < len; a++){
          if(flagArr[a] = 1) sum++;
        }
        
        if(sum === len){
          clearInterval(t)
          for(let x=0; x < sideList.length; x++){
            for(let y=0; y < sideList[x].length; y++){
              sidebarList.push(sideList[x][y])
            }
          }
          for(let j = 0; j < refList.length; j++){
            for(let k = 0; k < refList[j].length; k++){
              referenceList.push(refList[j][k])
            }
          }
          
          load_reference_map(referenceList)
          setReference('details', referenceList)
          setSidebar('details', sidebarList)

          render(() => (
            <FormProvider config={config}>
              <FormLoaderProvider>
                <Form timeStart={timeStart} runAll={runAll} tmpEnableComp={tmpEnableComp} tmpVarComp={tmpVarComp} template={template} preset={preset} response={response} validation={validation} remark={remark} uploadHandler={uploadHandler} GpsHandler={GpsHandler} offlineSearch={offlineSearch} onlineSearch={onlineSearch} mobileExit={mobileExit} setResponseMobile={setResponseMobile} setSubmitMobile={setSubmitMobile} openMap={openMap}/>
                <Loader />
              </FormLoaderProvider>
            </FormProvider>
          ), document.getElementById("FormGear-root") as HTMLElement);
        } 
      },500)
    }
    console.timeEnd('FormGear renders successfully in ')
  } catch (e: unknown) {
    toastInfo("Failed to render the questionnaire", 30000, "", "bg-pink-600/80");
  };  
  
}
