import { createSignal, createEffect, Component, For, Show, Switch, Match } from "solid-js";
import { useForm } from "./FormProvider";
import FormComponent from './FormComponent';

import { template, setTemplate, Questionnaire } from './stores/TemplateStore';
import { preset, setPreset, Preset } from './stores/PresetStore';
import { response, setResponse, Response } from './stores/ResponseStore';
import { validation, setValidation, Validation } from './stores/ValidationStore';
import { summary, setSummary } from './stores/SummaryStore';
import { reference, setReference } from './stores/ReferenceStore';
import { nested, setNested } from './stores/NestedStore';
import { sidebar, setSidebar } from './stores/SidebarStore';
import { remark, setRemark, Remark} from './stores/RemarkStore';
import { note, setNote} from './stores/NoteStore';

import { saveAnswer } from "./GlobalFunction";
import { toastInfo } from "./FormInput";

import dayjs from 'dayjs';

export const getConfig = () => {
  const [formProps] = useForm();
  return formProps.formConfig
}

export const getProp = (config: string) => {
  const [formProps] = useForm();

  switch(config) {
    case 'clientMode': {
      return formProps.formConfig.clientMode;
    }
    case 'baseUrl': {
      return formProps.formConfig.baseUrl;
    }
  }
}

const Form: Component<{
    template: Questionnaire | any
    preset: Preset | any
    response: Response | any
    validation: Validation | any
    remark: Remark | any
    uploadHandler : any
    GpsHandler : any
    onlineSearch : any
    setResponseMobile : any
    setSubmitMobile : any
    openMap : any
  }> = props => {
    const getValue = (dataKey: string) => {
      const componentIndex = referenceList.findIndex(obj => obj.dataKey === dataKey);
      let answer = '';
      if(componentIndex !== -1 && (referenceList[componentIndex].answer) && (referenceList[componentIndex].enable)) answer = referenceList[componentIndex].answer;
      return answer;
    }
    const [prop, setProp] = createSignal(getProp(''));
    const [config, setConfig] = createSignal(getConfig());
    
    let timeStart = new Date();
    
    // const generateComponentString = (index) => {
    //   // let comp_str = `template.details`;      
    //   // for (var i = 0; i < index.length; i += 2) {
    //   //   comp_str += `.components[${index[i]}][${index[i+1]}]`
    //   // }
    //   let comp_str = ``;      
    //   for (var i = 0; i < index.length; i += 2) {
    //     comp_str += ` 'components', [${index[i]},${index[i+1]}],`
    //   }
    //   comp_str = comp_str.slice(0, -1)
    //   return comp_str;
    // }

    const tmpVarComp = [];
    const referenceList = [];
    const sidebarList = [];
    
    // console.time('loopTemplate ');

    // const [nestComp, setNestComp] = createSignal([]);
    const nestComp = [];
    const loopValidation = (element, index, parent, level) => {
      let el_len = element.length
      for (let i = 0; i < el_len; i++) {

        let el_type = element[i].type
        if(el_type == 2){
          // nestComp.push(element[i])
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
              sourceSelect : e.sourceSelect,
              components : e.components,
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
              componentValidation: compVal
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

        element[i].components && element[i].components.forEach((element, index) => loopValidation(element, index, parent.concat(i,0), level+1))
      }
    }
    props.template.details.components.forEach((element, index) => loopValidation(element, index, [0], 0));
    // setNestComp(tmpNestComp)
    setNested('details',nestComp)

    const loopTemplate = (element, index, parent, level, sideEnable) => {
      // console.log(element, index, parent, level);
        let el_len = element.length
        for (let i = 0; i < el_len; i++) {
          let answer = element[i].answer;
          
          // const presetIndex = props.preset.details.predata.findIndex(obj => obj.dataKey === element[i].dataKey);
          // answer = (presetIndex !== -1 && props.preset.details.predata[presetIndex] !== undefined ) ? props.preset.details.predata[presetIndex].answer :
          //   (element[i].answer !== '') ? element[i].answer : answer;
          
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
          
          // const comp_str = generateComponentString([...parent,i]);
          if(el_type == 1 || (el_type == 2 && components.length > 1)){
              sideEnable = (element[i].enableCondition === undefined) ? true : eval(element[i].enableCondition);
              sidebarList.push({
                  dataKey: element[i].dataKey,
                  label: element[i].label,
                  description: element[i].description,
                  level: level,
                  index: parent.concat(i),
                  components: components,
                  sourceQuestion: element[i].sourceQuestion !== undefined ? element[i].sourceQuestion : '',
                  enable: (sideEnable === undefined) ? false : sideEnable,
                  enableCondition: element[i].enableCondition !== undefined ? element[i].enableCondition : '',
                  componentEnable: element[i].componentEnable !== undefined ? element[i].componentEnable : []
              })
          }

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

          referenceList.push({         
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
              enable: (sideEnable === false || sideEnable === undefined) ? false : (element[i].enableCondition === undefined) ? true : eval(element[i].enableCondition),
              enableCondition: element[i].enableCondition !== undefined ? element[i].enableCondition : '',
              componentEnable: element[i].componentEnable !== undefined ? element[i].componentEnable : [],
              enableRemark: element[i].enableRemark !== undefined ? element[i].enableRemark : true,
              client: element[i].client !== undefined ? element[i].client : undefined,
              titleModalDelete: element[i].titleModalDelete !== undefined ? element[i].titleModalDelete : undefined,
              contentModalDelete: element[i].contentModalDelete !== undefined ? element[i].contentModalDelete : undefined,
              validationState: element[i].validationState !== undefined ? element[i].validationState : 0,
              validationMessage: element[i].validationMessage !== undefined ? element[i].validationMessage : [],
              validations: vals,
              componentValidation: compVal,
              hasRemark: hasRemark
          })

          element[i].components && element[i].components.forEach((element, index) => loopTemplate(element,index, parent.concat(i,0), level+1, sideEnable))
        }
    }
    props.template.details.components.forEach((element, index) => loopTemplate(element, index, [0], 0, ''));

    setReference('details', referenceList);
    setSidebar('details', sidebarList);
    
    // console.timeEnd('loopTemplate ');
    // console.log(sidebar);
    // console.time('tmpVarComp ');
    tmpVarComp.forEach((element, index) => {//belum jalan, malah looping forever
      let sidePosition = sidebar.details.findIndex((obj, index) => {
        const cekInsideIndex = obj.components[0].findIndex((objChild, index) => {
          objChild.dataKey === element.dataKey;
          return index;
        });
        return (cekInsideIndex == -1) ? 0: index;
        
      });

      const getRowIndex = (positionOffset:number) => {
        let editedDataKey = element.dataKey.split('@');
        let splitDataKey = editedDataKey[0].split('#');
        let splLength = splitDataKey.length;
        let reducer = positionOffset+1;
        return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength-reducer]);
      }

      const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
      
      let answer = eval(element.expression);
      saveAnswer(element.dataKey, 'answer', answer, sidePosition, {'clientMode': getProp('clientMode'),'baseUrl': getProp('baseUrl')});
    })
    // console.timeEnd('tmpVarComp ')

    // console.time('response ');
    props.preset.details.predata.forEach((element, index) => {
      let refPosition = reference.details.findIndex(obj => obj.dataKey === element.dataKey);
      if(refPosition !== -1){
        let sidePosition = sidebar.details.findIndex(obj => {
          const cekInsideIndex = obj.components[0].findIndex(objChild => objChild.dataKey === element.dataKey);
          return (cekInsideIndex == -1) ? 0: index;
        });
        let answer = (typeof element.answer === 'object') ? JSON.parse(JSON.stringify(element.answer)) : element.answer;
        saveAnswer(element.dataKey, 'answer', answer, sidePosition, {'clientMode': getProp('clientMode'),'baseUrl': getProp('baseUrl')});
      }
    })

    props.response.details.answers.forEach((element, index) => {
      let refPosition = reference.details.findIndex(obj => obj.dataKey === element.dataKey);
      if(refPosition !== -1){
        let sidePosition = sidebar.details.findIndex(obj => {
          const cekInsideIndex = obj.components[0].findIndex(objChild => objChild.dataKey === element.dataKey);
          return (cekInsideIndex == -1) ? 0: index;
        });
        let answer = (typeof element.answer === 'object') ? JSON.parse(JSON.stringify(element.answer)) : element.answer;
        saveAnswer(element.dataKey, 'answer', answer, sidePosition, {'clientMode': getProp('clientMode'),'baseUrl': getProp('baseUrl')});
      }
    })
    
    // console.timeEnd('response ');
    // console.log('note', note);
    // console.log('res',response);
    // console.log('ref', reference);
    // console.timeEnd('');

    const [form, { setActiveComponent }] = useForm();
    
    setActiveComponent({
      dataKey: sidebar.details[0].dataKey, 
      label: sidebar.details[0].label, 
      index: JSON.parse(JSON.stringify(sidebar.details[0].index)), 
      position: 0
    });

    const getComponents = (dataKey: string) => {
      const componentIndex = sidebar.details.findIndex(obj => obj.dataKey === dataKey);
      const components = sidebar.details[componentIndex] !== undefined ? sidebar.details[componentIndex].components[0] : '';
      return components;
    }
    const [components , setComponents] = createSignal(getComponents(sidebar.details[0].dataKey));
    
    const [onMobile , setOnMobile] = createSignal(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    const checkOnMobile = () => {
      window.innerWidth < 720 ? setOnMobile(true) : setOnMobile(false)  
    }

    createEffect(() => {
      setComponents(getComponents(form.activeComponent.dataKey));    
      setSummary({
        answer: reference.details.filter( (element) => { 
                                      return ( element.type > 4 ) 
                                          && ( element.enable ) 
                                          && ( element.answer !== undefined)
                                          && ( element.answer !== '') 
                                          && ( element.answer !== null)
                                    }).length,
        blank: reference.details.filter( (element) => { 
                                      return ( element.type > 4 ) 
                                          && ( element.enable ) 
                                          && ( ( element.answer === undefined || element.answer === '')
                                                || ( (element.type == 21) && element.answer.length == 1 ) 
                                                || ( (element.type == 22) && element.answer.length == 1 ) 
                                              )
                                          && !( JSON.parse(JSON.stringify(element.index[element.index.length - 2])) == 0 
                                          && element.level > 1 )
                                    }).length,
        error: reference.details.filter( (element) => { 
                                      return ( element.type > 4 ) 
                                          && ( element.enable ) 
                                          && ( element.validationState == 2 )
                                    }).length,
        remark: note.details.notes.length
      });
      const [formProps] = useForm();

      if(formProps.formConfig.clientMode != 2){
        window.addEventListener('resize', checkOnMobile);
      }
      document.getElementById("FormGear-loader").classList.add('hidden')
    })
    
    const toggleSwitch = (event: MouseEvent) => {
        document.documentElement.classList.toggle('dark');
      
        var button = document.querySelector(".button-switch");
        var outerSpan = document.querySelector(".outer-span");
        var lightSwitch = document.querySelector(".light-switch");
        var darkSwitch = document.querySelector(".dark-switch");
      
        outerSpan.classList.toggle("translate-x-5");
        button.classList.toggle("bg-gray-800");
        lightSwitch.classList.toggle("opacity-100");
        darkSwitch.classList.toggle("opacity-100");
    }
    
    const sidebarCollapse = (event: MouseEvent) => {
        var sidebar = document.querySelector(".sidebar-span");
        sidebar.classList.toggle("-translate-x-full");
    }
    
    const writeResponse = () => {
      const dataForm = [];
      reference.details.forEach((element) => {
        if(
          (element.type > 3)
          && ( element.enable ) 
          && ( element.answer !== undefined)
          && ( element.answer !== '') 
          && ( element.answer !== null)
        ) {
          dataForm.push({
            dataKey: element.dataKey,
            answer: element.answer
          })
        }

        setResponse('details', 'answers', dataForm)
        setResponse('details','templateVersion', template.details.version);
        setResponse('details','validationVersion', template.details.version);
        setResponse('details','docState', docState());
        let now = dayjs().format('YYYY-MM-DD HH:mm:ss');
        (response.details.createdAt === '') ? setResponse('details','createdAt', now) : setResponse('details','createdAt', '');
        setResponse('details','createdBy', now);
        setResponse('details','createdBy', form.formConfig.username);
        (response.details.createdBy === '') ? setResponse('details','editedBy', form.formConfig.username): setResponse('details','editedBy', '');
        let copiedNote = JSON.parse(JSON.stringify(note.details.notes));
        setRemark('details','notes',copiedNote);
      })

      props.setResponseMobile(response.details, remark.details);
      // console.log(response);
      // console.log(remark);
    }

    const writeSubmitResponse = () => {
      const dataForm = [];
      reference.details.forEach((element) => {
        if(
          (element.type > 3)
          && ( element.enable ) 
          && ( element.answer !== undefined)
          && ( element.answer !== '') 
          && ( element.answer !== null)
        ) {
          dataForm.push({
            dataKey: element.dataKey,
            answer: element.answer
          })
        }

        setResponse('details', 'answers', dataForm)
        setResponse('details','templateVersion', template.details.version);
        setResponse('details','validationVersion', template.details.version);
        setResponse('details','docState', docState());
        let now = dayjs().format('YYYY-MM-DD HH:mm:ss');
        (response.details.createdAt === '') ? setResponse('details','createdAt', now) : setResponse('details','createdAt', '');
        setResponse('details','createdBy', now);
        setResponse('details','createdBy', form.formConfig.username);
        (response.details.createdBy === '') ? setResponse('details','editedBy', form.formConfig.username): setResponse('details','editedBy', '');
        let copiedNote = JSON.parse(JSON.stringify(note.details.notes));
        setRemark('details','notes',copiedNote);
      })

      props.setSubmitMobile(response.details, remark.details);
      // console.log(response);
      // console.log(remark);
    }


    const previousPage = (event: MouseEvent) => {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && form.formConfig.clientMode === 2) {   
        writeResponse();
        var component = document.querySelector(".mobile-component-div");
      }else{
        var component = document.querySelector(".component-div");
      }     
      const sidebarPrev = sidebar.details.filter((obj, i) => (obj.enable) && (i < form.activeComponent.position));
      let sidebarPrevLength = sidebarPrev.length;
      
      const sidebarPrevIndex = sidebar.details.findIndex(obj => obj.dataKey === sidebarPrev[sidebarPrevLength-1].dataKey);
      setActiveComponent({
        dataKey: sidebarPrev[sidebarPrevLength-1].dataKey,
        label: sidebarPrev[sidebarPrevLength-1].label, 
        index: JSON.parse(JSON.stringify(sidebarPrev[sidebarPrevLength-1].index)), 
        position: sidebarPrevIndex
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      component.scrollTo({ top: 0, behavior: "smooth" });   
    }    

    const nextPage = (event: MouseEvent) => {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && form.formConfig.clientMode === 2 ) {   
        writeResponse();
        var component = document.querySelector(".mobile-component-div");
      }else{
        var component = document.querySelector(".component-div");
      }

      const sidebarNext = sidebar.details.filter((obj, i) => (obj.enable) && (i > form.activeComponent.position));
      const sidebarNextIndex = sidebar.details.findIndex(obj => obj.dataKey === sidebarNext[0].dataKey);
      
      setActiveComponent({
        dataKey: sidebarNext[0].dataKey,
        label: sidebarNext[0].label, 
        index: JSON.parse(JSON.stringify(sidebarNext[0].index)), 
        position: sidebarNextIndex
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      component.scrollTo({ top: 0, behavior: "smooth" });   
    }      
    
    const [showScrollWeb, setShowScrollWeb] = createSignal(false)
    const checkScrollTopWeb = () => {
      var component = document.querySelector(".component-div");
      if (component.scrollTop > 100){
        setShowScrollWeb(true)
      } else if (component.scrollTop <= 100){
        setShowScrollWeb(false)
      }
    }
    
    const [showScrollMobile, setShowScrollMobile] = createSignal(false)
    const checkScrollTopMobile = () => {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {          
          var component = document.querySelector(".mobile-component-div");
        if (component.scrollTop > 100){
          setShowScrollMobile(true)
        } else if (component.scrollTop <= 100){
          setShowScrollMobile(false)
        }
      }
    }

    const scrollToTop = (event: MouseEvent) => {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {          
          var component = document.querySelector(".mobile-component-div");
      }else{
          var component = document.querySelector(".component-div");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      component.scrollTo({ top: 0, behavior: "smooth" });
    }
    
    let timeEnd = new Date();
    let timeDiff =  timeEnd.getTime() - timeStart.getTime();

    const [showSubmit, setShowSubmit] = createSignal(false)
    const [captcha, setCaptcha] = createSignal('')    
    const [tmpCaptcha, setTmpCaptcha] = createSignal('')    
    const [docState, setDocState] = createSignal('E');

    function checkDocState() {
      (summary.error > 0) ? setDocState('E') : (reference.details.filter(element => Number(element.validationState) === 1).length > 0) ? setDocState('W') : setDocState('C');
    }

    function createCaptcha() {
      let captchaStr = []
      // const activeCaptcha = document.getElementById("captcha");
      for (let q = 0; q < 6; q++) {
        if (q % 2 == 0) {
          // captchaStr[q] = String.fromCharCode(Math.floor(Math.random() * 26 + 65));
          captchaStr[q] = Math.floor(Math.random() * 10 + 0);
        } else {
          captchaStr[q] = Math.floor(Math.random() * 10 + 0);
        }
      }
      // console.log(captchaStr);
      setCaptcha(captchaStr.join(""));
      // activeCaptcha.innerHTML = `${theCaptcha}`;
    }

    const confirmSubmit = (event: MouseEvent) => {
      createCaptcha();
      checkDocState();
      if(docState() === 'E') {
        toastInfo("Please make sure your submission is valid", 3000, "", "bg-pink-600/80");
      } else {
        if(summary.blank === 0){
          if(docState() === 'W') {
            toastInfo("The submission you are about to submit still contains a warning", 3000, "", "bg-orange-600/80");
            setShowSubmit(true);
          } else {
            setShowSubmit(true);
          }
        } else {
          toastInfo("Please make sure your submission is fully filled", 3000, "", "bg-pink-600/80");
        }
      }
      
    }
    
    const submitData = (event: MouseEvent) => {
      if(tmpCaptcha().length !== 0 && (tmpCaptcha() === captcha())){
        writeSubmitResponse();
        setShowSubmit(false)
        toastInfo("The data is now being submited. Thank you!", 3000, "", "bg-teal-600/80");
      }else{
        toastInfo("Please provide verification correctly!", 3000, "", "bg-pink-600/80");
      }
    }

    return (
      <div class="bg-gray-200 min-h-screen dark:bg-[#181f30] ">
        
        <Show when={ showSubmit() }>
          <div class="modal-remark fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
              
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-teal-200 sm:mx-0 sm:h-10 sm:w-10 text-teal-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="titleModalDelete">Confirmation submission</h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500" id="contentModalDelete">Thank you for completing the survey. Please provide this final verification to complete the submission!</p>
                    </div>

                    <div class="mt-4 flex space-y-2 space-x-2 items-center justify-center md:items-end md:justify-start">
                      <span class="rounded-lg text-3xl italic font-mono cursor-not-allowed text-slate-600 p-2 bg-gradient-to-r from-teal-500 to-teal-50 text-justify 
                                  line-through pointer-events-none select-none ">{captcha()}</span>                      
                      <button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-5 w-5 flex justify-center items-center" onClick={createCaptcha}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                    
                    <div class="mt-4 flex space-y-2 space-x-2 items-center justify-center">
                      <input type="number"
                            class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 border 
                              border-solid border-gray-300 bg-white bg-clip-padding transition ease-in-out m-0 
                              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            placeholder="" 
                            onChange={(e) => { setTmpCaptcha(e.currentTarget.value) } }
                        />
                    </div>

                  </div>
                  </div>
                </div>
                
                <div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" 
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white 
                        hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" 
                        onClick={e => submitData(e)}>Submit</button>
                  <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                          font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" 
                        onClick={e => setShowSubmit(false)}>Cancel</button>
                </div>

              </div>
            </div>
          </div>
        </Show>
        

        <div class="md:max-w-6xl mx-auto md:px-8 md:py-8">
          <div class="bg-gray-50 dark:bg-gray-900  dark:text-white text-gray-600 h-screen flex overflow-hidden text-sm font-montserrat rounded-lg shadow-xl dark:shadow-gray-800">
            <div class="mobile-component-div flex-grow overflow-y-auto h-full flex flex-col bg-white dark:bg-gray-900 z-0" onScroll={checkScrollTopMobile}>
              
              <div class="relative min-h-screen md:flex   ">
                <div class="absolute pt-1 z-20 h-8 w-36 left-0 -ml-8 top-5 bg-sky-400/70 -rotate-45 text-white font-semibold text-center"  >&#946;eta</div>

                <div class="bg-gray-50 dark:bg-gray-900 w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto p-5 space-y-4
                sidebar-span absolute inset-y-0 left-0 transform -translate-x-full transition-transform duration-500 ease-in-out md:relative md:translate-x-0 z-10">
                  <div class=" text-gray-400 tracking-wider flex justify-between "> 
                    <div class="text-lg block p-4 text-gray-600 dark:text-white font-bold sm:text-xl" innerHTML={ props.template.details.acronym } />      
                    
                    <button type="button" 
                      class="md:hidden p-2 mobile-menu-button " onClick={sidebarCollapse}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>  
                  </div>
                  
                  <div class="overflow-y-auto h-3/6">    
                    
                    <nav class="transition-color duration-500">
                        <For each={sidebar.details}>
                          {(item_0, index) => (
                            <Show when={item_0.level == 0 && item_0.enable}>
                            <ul class="formgear-sidebar transition-transform duration-1000">     
                              <li>
                                <a  class="block py-2 px-4 rounded font-medium space-x-2 
                                        hover:bg-blue-700 hover:text-white" 
                                    classList={{
                                      'bg-blue-800 text-white': item_0.dataKey === form.activeComponent.dataKey
                                    }}
                                    href="javascript:void(0);" 
                                    onClick={(e) => {
                                      var component = document.querySelector(".component-div");
                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                      component.scrollTo({ top: 0, behavior: "smooth" }); 
                                      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && sidebarCollapse(e); 
                                      form.formConfig.clientMode === 2 && writeResponse();
                                      setActiveComponent({dataKey: item_0.dataKey, label: item_0.label, index: JSON.parse(JSON.stringify(item_0.index)), position: index()});
                                    }}
                                >
                                  {item_0.label}
                                  <div class="font-light text-xs"><div innerHTML={item_0.description}/></div>
                                </a>

                                <For each={sidebar.details}>
                                  {(item_1, index) => (
                                    <Show when={item_1.level == 1 
                                                && item_0.index[1] == item_1.index[1] && item_1.enable}>
                                      <ul class="border-l border-gray-300 dark:border-slate-500 ml-4"
                                          classList={{
                                            'show': item_0.index[1] === form.activeComponent.index[1]
                                          }}
                                          >     
                                      <li>
                                        <a  class="block py-2 px-4 rounded font-medium space-x-2 
                                                hover:bg-blue-700 hover:text-white" 
                                            classList={{
                                              'bg-blue-800 text-white': item_1.dataKey === form.activeComponent.dataKey
                                            }}
                                            href="javascript:void(0);" 
                                            onClick={(e) => {
                                              var component = document.querySelector(".component-div");
                                              window.scrollTo({ top: 0, behavior: "smooth" });
                                              component.scrollTo({ top: 0, behavior: "smooth" });
                                              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && sidebarCollapse(e); 
                                              form.formConfig.clientMode === 2 && writeResponse();
                                              setActiveComponent({dataKey: item_1.dataKey, label: item_1.label, index: JSON.parse(JSON.stringify(item_1.index)), position: index()});
                                            }}
                                        >
                                          {item_1.label}
                                          <div class="font-light text-xs"><div innerHTML={item_1.description}/></div>
                                        </a>

                                        <For each={sidebar.details}>
                                          {(item_2, index) => (
                                            <Show when={item_2.level == 2 
                                                        && item_0.index[1] == item_1.index[1] 
                                                        && item_1.index[1] == item_2.index[1] 
                                                        && item_1.index[3] == item_2.index[3] 
                                                        && item_1.index[4] == item_2.index[4]
                                                        && item_2.enable }>
                                              <ul class="border-l border-gray-300 dark:border-slate-500 ml-4  "
                                                  classList={{
                                                    'show': item_0.index[1] === form.activeComponent.index[1]
                                                  }}
                                                  >     
                                              <li>
                                                <a  class="block py-2 px-4 rounded font-medium space-x-2 
                                                        hover:bg-blue-700 hover:text-white" 
                                                    classList={{
                                                      'bg-blue-800 text-white': item_2.dataKey === form.activeComponent.dataKey
                                                    }}
                                                    href="javascript:void(0);" 
                                                    onClick={(e) => {
                                                      var component = document.querySelector(".component-div");
                                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                                      component.scrollTo({ top: 0, behavior: "smooth" });
                                                      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && sidebarCollapse(e); 
                                                      form.formConfig.clientMode === 2 && writeResponse();
                                                      setActiveComponent({dataKey: item_2.dataKey, label: item_2.label, index: JSON.parse(JSON.stringify(item_2.index)), position: index()});
                                                    }}
                                                >
                                                  {item_2.label}
                                                  <div class="font-light text-xs"><div innerHTML={item_2.description}/></div>
                                                </a>

                                                <For each={sidebar.details}>
                                                  {(item_3, index) => (
                                                    <Show when={item_3.level == 3 
                                                                && item_0.index[1] == item_1.index[1] 
                                                                && item_1.index[1] == item_2.index[1] 
                                                                && item_1.index[3] == item_2.index[3] 
                                                                && item_2.index[5] == item_3.index[5] 
                                                                && item_2.index[6] == item_3.index[6]
                                                                && item_3.enable}>
                                                      <ul class="border-l border-gray-300 dark:border-slate-500 ml-4"
                                                          classList={{
                                                            'show': item_0.index[1] === form.activeComponent.index[1]
                                                          }}
                                                          >
                                                      <li>
                                                        <a  class="block py-2 px-4 rounded font-medium space-x-2 
                                                                hover:bg-blue-700 hover:text-white" 
                                                            classList={{
                                                              'bg-blue-800 text-white': item_3.dataKey === form.activeComponent.dataKey
                                                            }}
                                                            href="javascript:void(0);" 
                                                            onClick={(e) => {
                                                              var component = document.querySelector(".component-div");
                                                              window.scrollTo({ top: 0, behavior: "smooth" });
                                                              component.scrollTo({ top: 0, behavior: "smooth" });
                                                              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && sidebarCollapse(e); 
                                                              form.formConfig.clientMode === 2 && writeResponse();
                                                              setActiveComponent({dataKey: item_3.dataKey, label: item_3.label, index: JSON.parse(JSON.stringify(item_3.index)), position: index()});
                                                            }}
                                                        >
                                                          {item_3.label}
                                                          <div class="font-light text-xs"><div innerHTML={item_3.description}/></div>
                                                        </a>
                                                        </li>
                                                      </ul>
                                                    </Show>
                                                  )}
                                                </For>

                                                </li>
                                              </ul>
                                            </Show>
                                          )}
                                        </For>

                                        </li>
                                      </ul>
                                    </Show>
                                  )}
                                </For>

                              </li>
                            </ul>
                            </Show>
                          )}
                        </For>
                    </nav>
                    
                    {/* <nav class="space-y-1">
                      <For each={sidebar.details}>
                        {(item, index) => (
                          <a href="javascript:void(0);" onClick={() => {
                            setActiveComponent({name: item.dataKey, index: JSON.parse(JSON.stringify(item.index)), position: index()});
                          }}
                            classList={{
                                'bg-blue-800 text-white': item.dataKey === form.activeComponent.name, 
                                'indent-3 ': item.level === 1,
                                'indent-6': item.level === 2,
                                'indent-9': item.level === 3,
                                'indent-12': item.level === 4,
                              }}
                            class="flex flex-col flex-coltext-white font-medium space-x-2 py-2.5 px-4 
                                hover:bg-blue-700 rounded hover:text-white transition duration-200">
                            {item.label}
                            <div class="font-light text-xs">{item.description}</div>
                          </a>
                        )}
                      </For>
                    </nav> */}

                  </div>

                  <div class="flex items-center space-x-3 sm:mt-7 mt-4">
                  </div>

                  <div class="relative h-2/6">
                    <div class="bg-white p-3 w-full flex flex-col  space-y-4 rounded-md dark:bg-gray-800 shadow absolute bottom-0 left-0">
                      <div class="max-w-5xl grid grid-cols-2 gap-2">
                        <div class="h-20 text-5xl text-center sm:flex flex-col flex-coltext-white font-medium xs:h-auto xs:square xl:border-b ">
                            {summary.answer}
                            <div class="font-light text-xs">Answer</div>
                        </div>
                        <div class="h-20 text-5xl text-center sm:flex flex-col flex-coltext-white font-medium xs:h-auto xs:square xl:border-b ">
                            {summary.blank}
                            <div class="font-light text-xs">Blank</div>
                        </div>
                        <div class="h-20 text-5xl text-center sm:flex flex-col flex-coltext-white font-medium xs:h-auto xs:square xl:border-b ">
                            {summary.error}
                            <div class="font-light text-xs">Error</div>
                        </div>
                        <div class="h-20 text-5xl text-center sm:flex flex-col flex-coltext-white font-medium xs:h-auto xs:square xl:border-b ">
                            {summary.remark}
                            <div class="font-light text-xs">Remark</div>
                        </div>
                      </div>
                      <div>                  
                        <button class="bg-teal-300 hover:bg-teal-200 text-teal-100 p-3 w-full rounded-md shadow font-medium" onClick={confirmSubmit}>
                            Submit
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                <div class="component-div flex-grow bg-white dark:bg-gray-900 overflow-y-auto transition duration-500 ease-in-out z-10" onScroll={checkScrollTopWeb}>
                
                  <div class="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 xl:sticky top-0 z-10">
                    <div class="flex w-full items-center">
                      <div class="ml-3 md:text-2xl md:text-left font-medium text-left text-base text-gray-900 dark:text-white mt-1">
                        <div innerHTML={ props.template.details.title } />
                        <div class="text-sm font-light md:text-lg text-gray-600 dark:text-gray-400" innerHTML={ props.template.details.description }
                            classList={{                              
                              'flex': onMobile() === false,
                              'hidden': onMobile() === true,
                            }}
                          />
                        <div class="text-xs font-extralight text-gray-400 ">FormGear renders in : &#177; {timeDiff+20} ms</div>
                      </div>
                      <div class="ml-auto sm:flex items-center p-2 ">
                        <button onClick={toggleSwitch} type="button" 
                          class="button-switch relative inline-flex flex-shrink-0 bg-gray-200 dark:bg-gray-700 h-6 w-11 border-2 border-transparent rounded-full cusrsor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">

                          <span class="outer-span relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 pointer-events-none">

                            <span class="light-switch absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-100 dark:opacity-0 ease-out duration-100">
                              <svg class="bg-white h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
                              </svg>
                            </span>

                            <span class="dark-switch absolute inset-0 h-full w-full flex items-center justify-center transition-opacity opacity-0 dark:opacity-100 ease-in duration-200">
                              <svg class="bg-white h-3 w-3 text-indigo-600" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2256 2.00253C9.59172 1.94346 6.93894 2.9189 4.92893 4.92891C1.02369 8.83415 1.02369 15.1658 4.92893 19.071C8.83418 22.9763 15.1658 22.9763 19.0711 19.071C21.0811 17.061 22.0565 14.4082 21.9975 11.7743C21.9796 10.9772 21.8669 10.1818 21.6595 9.40643C21.0933 9.9488 20.5078 10.4276 19.9163 10.8425C18.5649 11.7906 17.1826 12.4053 15.9301 12.6837C14.0241 13.1072 12.7156 12.7156 12 12C11.2844 11.2844 10.8928 9.97588 11.3163 8.0699C11.5947 6.81738 12.2094 5.43511 13.1575 4.08368C13.5724 3.49221 14.0512 2.90664 14.5935 2.34046C13.8182 2.13305 13.0228 2.02041 12.2256 2.00253ZM17.6569 17.6568C18.9081 16.4056 19.6582 14.8431 19.9072 13.2186C16.3611 15.2643 12.638 15.4664 10.5858 13.4142C8.53361 11.362 8.73568 7.63895 10.7814 4.09281C9.1569 4.34184 7.59434 5.09193 6.34315 6.34313C3.21895 9.46732 3.21895 14.5326 6.34315 17.6568C9.46734 20.781 14.5327 20.781 17.6569 17.6568Z" fill="currentColor" />
                              </svg>
                            </span>

                          </span>
                        </button>
                      </div>
                      <div class="ml-auto sm:flex md:hidden items-center">
                        <button type="button" 
                          class="p-4 mobile-menu-button focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-800" onClick={sidebarCollapse}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3 sm:mt-7 mt-4">
                    </div>
                  </div>

                  <FormComponent 
                    onMobile = { onMobile() }
                    components = { components() } 
                    dataKey = { form.activeComponent.dataKey } 
                    index = { [0] } 
                    config = { getConfig() } 
                    uploadHandler = { props.uploadHandler }
                    GpsHandler = { props.GpsHandler }
                    onlineSearch = { props.onlineSearch }
                    openMap = { props.openMap }
                    />

                  <div  class="grid grid-cols-6 sticky w-full justify-end bottom-12 mt-10"
                      classList={{
                        'flex': onMobile() === false,
                        'hidden': onMobile() === true,
                      }}>
                    <div class=" flex justify-center items-center space-x-10 mx-10 col-start-2 col-end-6 py-2 rounded-full bg-gray-200/80 dark:bg-gray-800/90">
                      <button class="bg-blue-700  text-white p-2 rounded-full  focus:outline-none items-center h-10 w-10 hover:bg-blue-600 group inline-flex justify-center text-xs" 
                          classList={{
                            'hidden' : sidebar.details.filter((obj, i) => (obj.enable) && (i < form.activeComponent.position)).length === 0,
                            'visible' : sidebar.details.filter((obj, i) => (obj.enable) && (i < form.activeComponent.position)).length > 0
                          }}
                          onClick={previousPage}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>  
                      </button>
                      <div class="flex justify-center items-center text-center">{form.activeComponent.label}</div>
                      <Switch>
                        <Match when={sidebar.details.filter((obj, i) => (obj.enable) && (i > form.activeComponent.position)).length === 0}>
                          <button class="bg-teal-200 text-teal-500 sm:h-10 sm:w-10 rounded-full focus:outline-none h-5 w-5 flex justify-center items-center"
                            onClick={confirmSubmit}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </button>
                        </Match>
                        <Match when={sidebar.details.filter((obj, i) => (obj.enable) && (i > form.activeComponent.position)).length > 0}>
                          <button class="bg-blue-700 text-white p-2 rounded-full focus:outline-none items-center h-10 w-10 hover:bg-blue-600 group inline-flex justify-center text-xs" 
                              classList={{
                                'visible' : sidebar.details.filter((obj, i) => (obj.enable) && (i > form.activeComponent.position)).length > 0,
                              }}
                              onClick={nextPage}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                          </button>
                        </Match>
                      </Switch>
                      
                    </div>
                    
                    <div  class="  justify-end items-center pr-8 transition"
                        classList={{
                          'flex': showScrollWeb() === true,
                          'hidden': showScrollWeb() === false,
                        }}>
                      <button class="scrolltotop-div bg-yellow-400 text-white p-2 rounded-full focus:outline-none items-center h-12 w-12 hover:bg-yellow-300" onClick={scrollToTop}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>

                  </div>

                  {/* <div class="space-y-3 sm:p-7 p-3 ">
                    <div class="p-3 overflow-y-auto h-60 bg-white dark:bg-gray-800">
                      <pre>debug: {JSON.stringify(form, undefined, 2)}</pre>
                    </div>
                  </div> */}

                </div>
                
                

                <div  class="grid grid-cols-6 sticky w-full justify-end bottom-6 mt-10"
                        classList={{
                          'flex': onMobile() === true,
                          'hidden': onMobile() === false,
                        }}>
                  <div class=" flex justify-center items-center space-x-4  col-start-1 col-end-5 ml-4 mr-4 py-2 rounded-full bg-gray-200/80 dark:bg-gray-800/90">
                    <button class="bg-blue-700  text-white p-2 rounded-full focus:outline-none items-center h-8 w-8 hover:bg-blue-600 group inline-flex justify-center text-xs" 
                      classList={{
                        'hidden' : sidebar.details.filter((obj, i) => (obj.enable) && (i < form.activeComponent.position)).length === 0,
                        'visible' : sidebar.details.filter((obj, i) => (obj.enable) && (i < form.activeComponent.position)).length > 0
                      }}
                      onClick={previousPage}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>  
                    </button>
                    <div class="flex justify-center items-center text-center text-xs">{form.activeComponent.label}</div>
                    <Switch>
                      <Match when={sidebar.details.filter((obj, i) => (obj.enable) && (i > form.activeComponent.position)).length === 0}>
                        <button class="bg-teal-200 text-teal-500 h-8 w-8 rounded-full focus:outline-none flex justify-center items-center"
                          onClick={confirmSubmit}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </Match>        
                      <Match when={sidebar.details.filter((obj, i) => (obj.enable) && (i > form.activeComponent.position)).length > 0}>
                        <button class="bg-blue-700 text-white p-2 rounded-full focus:outline-none items-center h-8 w-8 hover:bg-blue-600 group inline-flex justify-center text-xs" 
                            onClick={nextPage}>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </Match>
                    </Switch>
                  </div>
                  <div  class=" justify-end items-center pr-2 transition"
                        classList={{
                          'flex': showScrollMobile() === true,
                          'hidden': showScrollMobile() === false,
                        }}>
                    <button class="scrolltotop-div bg-yellow-400 text-white p-2 rounded-full focus:outline-none items-center h-10 w-10 hover:bg-yellow-300"  
                    onClick={scrollToTop}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div  class="flex justify-end items-center col-start-6 pr-5 transition">
                    <button class="scrolltotop-div bg-teal-500 text-white p-2 rounded-full focus:outline-none items-center h-10 w-10 hover:bg-teal-400"  
                      onClick={writeResponse}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>                
                
              </div>

            </div>
          </div>
        </div>
      </div>
    );
}

export default Form;
