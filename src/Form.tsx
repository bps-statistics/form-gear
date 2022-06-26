import { createSignal, createEffect, Component, For, Show, Switch, Match } from "solid-js";
import { useForm } from "./FormProvider";
import FormComponent from './FormComponent';
import { gearVersion, templateVersion, validationVersion } from "./FormGear"

import { template, setTemplate, Questionnaire } from './stores/TemplateStore';
import { preset, setPreset, Preset } from './stores/PresetStore';
import { response, setResponse, Response } from './stores/ResponseStore';
import { validation, setValidation, Validation } from './stores/ValidationStore';
import { reference, setReference } from './stores/ReferenceStore';
import { sidebar, setSidebar } from './stores/SidebarStore';
import { remark, setRemark, Remark } from './stores/RemarkStore';
import { note, setNote } from './stores/NoteStore';
import { principal, setPrincipal } from './stores/PrincipalStore';
import { locale, setLocale } from './stores/LocaleStore';
import { summary, setSummary } from './stores/SummaryStore';

import { saveAnswer } from "./GlobalFunction";
import { toastInfo } from "./FormInput";

import dayjs from 'dayjs';
import utc from  'dayjs/plugin/utc';
import timezone from  'dayjs/plugin/timezone';



export const getConfig = () => {
  const [formProps] = useForm();
  return formProps.formConfig
}

export const getProp = (config: string) => {
  const [formProps] = useForm();

  switch (config) {
    case 'clientMode': {
      return formProps.formConfig.clientMode;
    }
    case 'baseUrl': {
      return formProps.formConfig.baseUrl;
    }
  }
}

const Form: Component<{
  timeStart: any
  runAll: number
  tmpEnableComp: [] | any
  tmpVarComp: [] | any
  template: Questionnaire | any
  preset: Preset | any
  response: Response | any
  validation: Validation | any
  remark: Remark | any
  uploadHandler: any
  GpsHandler: any
  offlineSearch: any
  onlineSearch: any
  mobileExit: any
  setResponseMobile: any
  setSubmitMobile: any
  openMap: any
}> = props => {
  const getValue = (dataKey: string) => {
    const componentIndex = reference.details.findIndex(obj => obj.dataKey === dataKey);
    let answer = '';
    if (componentIndex !== -1 && (reference.details[componentIndex].answer) && (reference.details[componentIndex].enable)) answer = reference.details[componentIndex].answer;
    return answer;
  }
  const [renderGear, setRenderGear] = createSignal('FormGear-'+gearVersion+' 🚀:');

  const [prop, setProp] = createSignal(getProp(''));
  const [config, setConfig] = createSignal(getConfig());
  const [form, { setActiveComponent }] = useForm();

  const [showSubmit, setShowSubmit] = createSignal(false)
  const [captcha, setCaptcha] = createSignal('')
  const [tmpCaptcha, setTmpCaptcha] = createSignal('')
  const [docState, setDocState] = createSignal('E')

  const [showError, setShowError] = createSignal(false)
  const [showRemark, setShowRemark] = createSignal(false)
  const [showBlank, setShowBlank] = createSignal(false)


  const [listError, setListError] = createSignal([])
  const [listErrorPage, setListErrorPage] = createSignal([])
  const [currentErrorPage, setCurrentErrorPage] = createSignal(1)
  const [maxErrorPage, setMaxErrorPage] = createSignal(1)

  const [listWarning, setListWarning] = createSignal([])
  const [listWarningPage, setListWarningPage] = createSignal([])
  const [currentWarningPage, setCurrentWarningPage] = createSignal(1)
  const [maxWarningPage, setMaxWarningPage] = createSignal(1)

  const [listBlank, setListBlank] = createSignal([])
  const [listBlankPage, setListBlankPage] = createSignal([])
  const [currentBlankPage, setCurrentBlankPage] = createSignal(1)
  const [maxBlankPage, setMaxBlankPage] = createSignal(1)

  const [listRemark, setListRemark] = createSignal([])
  const [listRemarkPage, setListRemarkPage] = createSignal([])
  const [currentRemarkPage, setCurrentRemarkPage] = createSignal(1)
  const [maxRemarkPage, setMaxRemarkPage] = createSignal(1)

  if (props.template.details.language !== undefined && props.template.details.language.length > 0) {
    const keys = Object.keys(locale.details.language[0]);
    const updatedLocale = JSON.parse(JSON.stringify(locale.details.language[0]));
    keys.forEach(k => {
      if (props.template.details.language[0].hasOwnProperty(k)) {
        updatedLocale[k] = props.template.details.language[0][k]
      }
    })
    setLocale('details', 'language', [updatedLocale])
  }
  const [components, setComponents] = createSignal([]);

  const getComponents = (dataKey: string) => {
    const componentIndex = sidebar.details.findIndex(obj => obj.dataKey === dataKey);
    const components = sidebar.details[componentIndex] !== undefined ? sidebar.details[componentIndex].components[0] : '';
    return components;
  }
  setActiveComponent({
    dataKey: sidebar.details[0].dataKey,
    label: sidebar.details[0].label,
    index: JSON.parse(JSON.stringify(sidebar.details[0].index)),
    position: 0
  });
  setComponents(getComponents(sidebar.details[0].dataKey));

  if (props.runAll == 0) {
    // console.time('tmpVarComp ')
    props.tmpVarComp.forEach((element, index) => {
      let sidePosition = sidebar.details.findIndex((obj, index) => {
        const cekInsideIndex = obj.components[0].findIndex((objChild, index) => {
          objChild.dataKey === element.dataKey;
          return index;
        });
        return (cekInsideIndex == -1) ? 0 : index;
      });

      const getRowIndex = (positionOffset: number) => {
        let editedDataKey = element.dataKey.split('@');
        let splitDataKey = editedDataKey[0].split('#');
        let splLength = splitDataKey.length;
        let reducer = positionOffset + 1;
        return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength - reducer]);
      }
      const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));

      let answer = eval(element.expression);
      saveAnswer(element.dataKey, 'answer', answer, sidePosition, { 'clientMode': getProp('clientMode'), 'baseUrl': getProp('baseUrl') });
    })
    // console.timeEnd('tmpVarComp ')

    // console.time('response ');
    props.preset.details.predata.forEach((element, index) => {
      let refPosition = reference.details.findIndex(obj => obj.dataKey === element.dataKey);
      let run = 0;
      if (refPosition !== -1) {
        if ((config().initialMode == 1 && reference.details[refPosition].presetMaster !== undefined && (reference.details[refPosition].presetMaster)) || (config().initialMode == 2)) {
          let sidePosition = sidebar.details.findIndex(obj => {
            const cekInsideIndex = obj.components[0].findIndex(objChild => objChild.dataKey === element.dataKey);
            return (cekInsideIndex == -1) ? 0 : index;
          });
          let answer = (typeof element.answer === 'object') ? JSON.parse(JSON.stringify(element.answer)) : element.answer;
          saveAnswer(element.dataKey, 'answer', answer, sidePosition, { 'clientMode': getProp('clientMode'), 'baseUrl': getProp('baseUrl') });
        }
      }
    })

    props.response.details.answers.forEach((element, index) => {
      let refPosition = reference.details.findIndex(obj => obj.dataKey === element.dataKey);
      if (refPosition !== -1) {
        let sidePosition = sidebar.details.findIndex(obj => {
          const cekInsideIndex = obj.components[0].findIndex(objChild => objChild.dataKey === element.dataKey);
          return (cekInsideIndex == -1) ? 0 : index;
        });
        let answer = (typeof element.answer === 'object') ? JSON.parse(JSON.stringify(element.answer)) : element.answer;
        saveAnswer(element.dataKey, 'answer', answer, sidePosition, { 'clientMode': getProp('clientMode'), 'baseUrl': getProp('baseUrl') });
      }
    })

    // console.time('tmpEnableComp ')
    props.tmpEnableComp.forEach((element, index) => {
      let sidePosition = sidebar.details.findIndex((obj, index) => {
        const cekInsideIndex = obj.components[0].findIndex((objChild, index) => {
          objChild.dataKey === element.dataKey;
          return index;
        });
        return (cekInsideIndex == -1) ? 0 : index;
      });

      const getRowIndex = (positionOffset: number) => {
        let editedDataKey = element.dataKey.split('@');
        let splitDataKey = editedDataKey[0].split('#');
        let splLength = splitDataKey.length;
        let reducer = positionOffset + 1;
        return ((splLength - reducer) < 1) ? Number(splitDataKey[1]) : Number(splitDataKey[splLength - reducer]);
      }
      const [rowIndex, setRowIndex] = createSignal(getRowIndex(0));
      let evEnable = eval(element.enableCondition);
      let enable = (evEnable === undefined) ? false : evEnable;
      saveAnswer(element.dataKey, 'enable', enable, sidePosition, { 'clientMode': getProp('clientMode'), 'baseUrl': getProp('baseUrl') });
    })
    // console.timeEnd('tmpEnableComp ')
  } else {
    // let hasRemarkComp = reference.details.filter(obj => obj.hasRemark == true);
    reference.details.forEach(e => {
      let remarkPosition = remark.details.notes.findIndex(obj => obj.dataKey === e.dataKey);
      if (remarkPosition !== -1) {
        let newNote = remark.details.notes[remarkPosition];
        let updatedNote = JSON.parse(JSON.stringify(note.details.notes));
        updatedNote.push(newNote);
        setNote('details', 'notes', updatedNote);
      }
    })
    setRenderGear('FormGear-'+gearVersion+' ♻️:')
  }
  // console.timeEnd('response ');
  // console.timeEnd('');

  const [onMobile, setOnMobile] = createSignal(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  const checkOnMobile = () => {
    window.innerWidth < 720 ? setOnMobile(true) : setOnMobile(false)
  }

  createEffect(() => {
    setComponents(getComponents(form.activeComponent.dataKey));
    setSummary({
      answer: reference.details.filter((element) => {
        return (element.type > 4)
          && (element.enable)
          && (element.answer !== undefined)
          && (element.answer !== '')
          && (element.answer !== null)
      }).length,
      blank: reference.details.filter((element) => {
        return (element.type > 4)
          && (element.enable)
          && ((element.answer === undefined || element.answer === '')
            || ((element.type == 21) && element.answer.length == 1)
            || ((element.type == 22) && element.answer.length == 1)
          )
          && !(JSON.parse(JSON.stringify(element.index[element.index.length - 2])) == 0
            && element.level > 1)
      }).length,
      error: reference.details.filter((element) => {
        return (element.type > 4 && (element.enable) && element.validationState == 2)
      }).length,
      remark: note.details.notes.length
    });
    const [formProps] = useForm();

    if (formProps.formConfig.clientMode != 2) {
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

  const setData = () => {
    const dataForm = [];
    const dataPrincipal = [];
    const indexEnableFalse = [];
    const indexEnableFalse_ = [];

    reference.details.forEach((element) => {
      if( (element.type !== 3) && !(element.enable) ) {        
        let parentIndex = element.level == 0 ? element.index : element.level > 1 ? element.index.slice(0, -1) : element.index.slice(0, -2)
        indexEnableFalse.push({
          parentIndex: parentIndex,
        })
        indexEnableFalse_.push({
          dataKey: element.dataKey,
          index: element.index,
          type: element.type,
          level: element.level,
          parentIndex: parentIndex,
        })
      };
    })

    const indexEnableFalse_unique = indexEnableFalse.filter((object,index) => index === indexEnableFalse.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object))); 
    console.log('false', indexEnableFalse_, indexEnableFalse_unique)

    reference.details.forEach((element) => {
      if (
        (element.type > 3)
        && (element.enable)
        && (element.answer !== undefined)
        && (element.answer !== '')
        && (element.answer !== null)
      ) {
        let parentIndex = element.level == 0 ? element.index : element.level > 1 ? element.index.slice(0, -1) : element.index.slice(0, -2)
        let enableFalse = indexEnableFalse_unique.findIndex(obj => obj.parentIndex.toString() === parentIndex.toString());
        if (enableFalse == -1){
          dataForm.push({
            dataKey: element.dataKey,
            answer: element.answer
          })
          if (element.principal !== undefined) {
            dataPrincipal.push({
              dataKey: element.dataKey,
              answer: element.answer,
              principal: element.principal,
              columnName: element.columnName
            })
          }
        }
      }
    })

    //setResponse
    setResponse('details', 'answers', dataForm)
    setResponse('details', 'templateDataKey', template.details.dataKey)
    setResponse('details', 'gearVersion', gearVersion)
    setResponse('details', 'templateVersion', templateVersion)
    setResponse('details', 'validationVersion', validationVersion)
    setResponse('details', 'docState', docState());
    setResponse('details', 'summary', JSON.parse(JSON.stringify(summary)));

    let now = dayjs().format('YYYY-MM-DD HH:mm:ss');    
    var dt = new Date();
    var s = dt.getTimezoneOffset();
    var timeToGet = Number((s/60)*-1);
    dayjs.extend(timezone);
    dayjs.extend(utc);
    let tz = dayjs.tz.guess();

    (response.details.createdBy === undefined || (response.details.createdBy !== undefined && response.details.createdBy === '')) ?
      setResponse('details', 'createdBy', form.formConfig.username) :
      setResponse('details', 'updatedBy', form.formConfig.username);
    // (response.details.createdAt === undefined || (response.details.createdAt !== undefined && response.details.createdAt === '')) ?
    //   setResponse('details', 'createdAt', now) :
    //   setResponse('details', 'updatedAt', now);

    if(response.details.createdAt === undefined || (response.details.createdAt !== undefined && response.details.createdAt === '')){
      setResponse('details', 'createdAt', now) ;
      setResponse('details', 'createdAtTimezone', tz.toString()) 
      setResponse('details', 'createdAtGMT', timeToGet);
    } else {
      if(response.details.createdAtTimezone === undefined || (response.details.createdAtTimezone !== undefined && response.details.createdAtTimezone === '')){
        setResponse('details', 'createdAtTimezone', tz.toString()) 
        setResponse('details', 'createdAtGMT', timeToGet);
      }
      setResponse('details', 'updatedAt', now);
      setResponse('details', 'updatedAtTimezone', tz.toString()) 
      setResponse('details', 'updatedAtGMT', timeToGet);
    }

    //setPrincipal
    setPrincipal('details', 'principals', dataPrincipal)
    setPrincipal('details', 'templateDataKey', template.details.dataKey)
    setPrincipal('details', 'gearVersion', gearVersion)
    setPrincipal('details', 'templateVersion', templateVersion)
    setPrincipal('details', 'validationVersion', validationVersion);
    (principal.details.createdBy === undefined || (principal.details.createdBy !== undefined && principal.details.createdBy === '')) ?
      setPrincipal('details', 'createdBy', form.formConfig.username) :
      setPrincipal('details', 'updatedBy', form.formConfig.username);
    // (principal.details.createdAt === undefined || (principal.details.createdAt !== undefined && principal.details.createdAt === '')) ?
    //   setPrincipal('details', 'createdAt', now) :
    //   setPrincipal('details', 'updatedAt', now);

    if(principal.details.createdAt === undefined || (principal.details.createdAt !== undefined && principal.details.createdAt === '')){
      setPrincipal('details', 'createdAt', now) ;
      setPrincipal('details', 'createdAtTimezone', tz.toString()) 
      setPrincipal('details', 'createdAtGMT', timeToGet);
    } else {
      if(principal.details.createdAtTimezone === undefined || (principal.details.createdAtTimezone !== undefined && principal.details.createdAtTimezone === '')){
        setPrincipal('details', 'createdAtTimezone', tz.toString()) 
        setPrincipal('details', 'createdAtGMT', timeToGet);
      }
      setPrincipal('details', 'updatedAt', now);
      setPrincipal('details', 'updatedAtTimezone', tz.toString()) 
      setPrincipal('details', 'updatedAtGMT', timeToGet);
    }

    //setRemark
    setRemark('details', 'notes', JSON.parse(JSON.stringify(note.details.notes)));
    setRemark('details', 'templateDataKey', template.details.dataKey)
    setRemark('details', 'gearVersion', gearVersion);
    setRemark('details', 'templateVersion', templateVersion);
    setRemark('details', 'validationVersion', validationVersion);
    (remark.details.createdBy === undefined || (remark.details.createdBy !== undefined && remark.details.createdBy === '')) ?
      setRemark('details', 'createdBy', form.formConfig.username) :
      setRemark('details', 'updatedBy', form.formConfig.username);
    // (remark.details.createdAt === undefined || (remark.details.createdAt !== undefined && remark.details.createdAt === '')) ?
    //   setRemark('details', 'createdAt', now) :
    //   setRemark('details', 'updatedAt', now);

    if(remark.details.createdAt === undefined || (remark.details.createdAt !== undefined && remark.details.createdAt === '')){
      setRemark('details', 'createdAt', now) ;
      setRemark('details', 'createdAtTimezone', tz.toString()) 
      setRemark('details', 'createdAtGMT', timeToGet);
    } else {
      if(remark.details.createdAtTimezone === undefined || (remark.details.createdAtTimezone !== undefined && remark.details.createdAtTimezone === '')){
        setRemark('details', 'createdAtTimezone', tz.toString()) 
        setRemark('details', 'createdAtGMT', timeToGet);
      }
      setRemark('details', 'updatedAt', now);
      setRemark('details', 'updatedAtTimezone', tz.toString()) 
      setRemark('details', 'updatedAtGMT', timeToGet);
    }

    //setReference
    setReference('sidebar', sidebar.details)
  }

  const writeResponse = () => {
    setData();
    props.setResponseMobile(response.details, remark.details, principal.details, reference);
  }

  props.mobileExit(writeResponse)

  const writeSubmitResponse = () => {
    setData();
    props.setSubmitMobile(response.details, remark.details, principal.details, reference);
  }

  const previousPage = (event: MouseEvent) => {
    writeResponse();
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || form.formConfig.clientMode === 2) {
      var component = document.querySelector(".mobile-component-div");
    } else {
      var component = document.querySelector(".component-div");
    }
    const sidebarPrev = sidebar.details.filter((obj, i) => (obj.enable) && (i < form.activeComponent.position));
    let sidebarPrevLength = sidebarPrev.length;

    const sidebarPrevIndex = sidebar.details.findIndex(obj => obj.dataKey === sidebarPrev[sidebarPrevLength - 1].dataKey);
    setActiveComponent({
      dataKey: sidebarPrev[sidebarPrevLength - 1].dataKey,
      label: sidebarPrev[sidebarPrevLength - 1].label,
      index: JSON.parse(JSON.stringify(sidebarPrev[sidebarPrevLength - 1].index)),
      position: sidebarPrevIndex
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    component.scrollTo({ top: 0, behavior: "smooth" });
  }

  const nextPage = (event: MouseEvent) => {
    writeResponse();
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || form.formConfig.clientMode === 2) {
      var component = document.querySelector(".mobile-component-div");
    } else {
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
    if (component.scrollTop > 100) {
      setShowScrollWeb(true)
    } else if (component.scrollTop <= 100) {
      setShowScrollWeb(false)
    }
  }

  const [showScrollMobile, setShowScrollMobile] = createSignal(false)
  const checkScrollTopMobile = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      var component = document.querySelector(".mobile-component-div");
      if (component.scrollTop > 100) {
        setShowScrollMobile(true)
      } else if (component.scrollTop <= 100) {
        setShowScrollMobile(false)
      }
    }
  }

  const scrollToTop = (event: MouseEvent) => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      var component = document.querySelector(".mobile-component-div");
    } else {
      var component = document.querySelector(".component-div");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    component.scrollTo({ top: 0, behavior: "smooth" });
  }

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
    setCaptcha(captchaStr.join(""));
    // activeCaptcha.innerHTML = `${theCaptcha}`;
  }

  const showListError = (event: MouseEvent) => {
    let filteredError = [];
    let filteredWarning = [];

    reference.details.forEach((element, i) => {
      // let sidebarIndex = element.index.splice(-1)
      if (element.type > 4 && (element.enable) && element.validationState == 2) {
        let sidebarIndex = element.level > 1 ? element.index.slice(0, -1) : element.index.slice(0, -2)
        filteredError.push({ label: element.label, message: element.validationMessage, sideIndex: sidebarIndex, dataKey: element.dataKey })
      }
      if (element.type > 4 && (element.enable) && element.validationState == 1) {
        let sidebarIndex = element.level > 1 ? element.index.slice(0, -1) : element.index.slice(0, -2)
        filteredWarning.push({ label: element.label, message: element.validationMessage, sideIndex: sidebarIndex, dataKey: element.dataKey })
      }
    });

    setListError(JSON.parse(JSON.stringify(filteredError)))
    setListWarning(JSON.parse(JSON.stringify(filteredWarning)))

    showListPage(listError().length, 3, 1, listError(), 2)
    showListPage(listWarning().length, 3, 1, listWarning(), 1)

    setShowError(true);
  }

  const showListRemark = (event: MouseEvent) => {
    let remarkCollection = [];

    note.details.notes.forEach(el => {
      let lookup = reference.details.find(obj => obj.dataKey == el.dataKey)
      let sidebarIndex = lookup.level > 1 ? lookup.index.slice(0, -1) : lookup.index.slice(0, -2)
      remarkCollection.push({ label: lookup.label, sideIndex: sidebarIndex, dataKey: lookup.dataKey })
    });

    setListRemark(JSON.parse(JSON.stringify(remarkCollection)))

    showListPage(listRemark().length, 3, 1, listRemark(), 4)

    setShowRemark(true);
  }

  const showListBlank = (event: MouseEvent) => {
    let blankCollection = [];

    reference.details.forEach((element, i) => {
      // let sidebarIndex = element.index.splice(-1)
      if ((element.type > 4) && (element.enable) && ((element.answer === undefined || element.answer === '')
        || ((element.type == 21) && element.answer.length == 1) || ((element.type == 22) && element.answer.length == 1))
        && !(JSON.parse(JSON.stringify(element.index[element.index.length - 2])) == 0 && element.level > 1)) {

        let sidebarIndex = element.level > 1 ? element.index.slice(0, -1) : element.index.slice(0, -2)
        blankCollection.push({ label: element.label, sideIndex: sidebarIndex, dataKey: element.dataKey })
      }
    });

    setListBlank(JSON.parse(JSON.stringify(blankCollection)))

    showListPage(listBlank().length, 3, 1, listBlank(), 3)

    setShowBlank(true);
  }

  const showListPage = (total, shown, current, list, listType) => {
    let maxPages = Math.ceil(total / shown)
    let minSlicePages = shown * current - shown
    let maxSlicePages = shown * current

    let listPage = list.slice(minSlicePages, maxSlicePages)

    if (listType == 2) {
      setCurrentErrorPage(current)
      setMaxErrorPage(maxPages)
      setListErrorPage(JSON.parse(JSON.stringify(listPage)))
    } else if (listType == 1) {
      setCurrentWarningPage(current)
      setMaxWarningPage(maxPages)
      setListWarningPage(JSON.parse(JSON.stringify(listPage)))
    } else if (listType == 3) {
      setCurrentBlankPage(current)
      setMaxBlankPage(maxPages)
      setListBlankPage(JSON.parse(JSON.stringify(listPage)))
    } else if (listType == 4) {
      setCurrentRemarkPage(current)
      setMaxRemarkPage(maxPages)
      setListRemarkPage(JSON.parse(JSON.stringify(listPage)))
    }
  }

  const lookInto = (e: MouseEvent, sidebarIndex, dataKey) => {
    const sidebarIntoIndex = sidebar.details.findIndex(obj => obj.index.toString() === sidebarIndex.toString());
    let sidebarInto = sidebar.details[sidebarIntoIndex]
    setShowError(false);
    setShowRemark(false);
    setShowBlank(false);
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && sidebarCollapse(e);
    setActiveComponent({ dataKey: sidebarInto.dataKey, label: sidebarInto.label, index: JSON.parse(JSON.stringify(sidebarInto.index)), position: sidebarIntoIndex });
    var component = document.getElementById(dataKey + "___scrollView");
    component.scrollIntoView({ behavior: "smooth" });
  }

  const confirmSubmit = (event: MouseEvent) => {
    createCaptcha();
    checkDocState();
    if (docState() === 'E') {
      toastInfo(locale.details.language[0].submitInvalid, 3000, "", "bg-pink-600/80");
    } else {
      reference.details.forEach((obj, ind) => {
        let updatedRef = JSON.parse(JSON.stringify(obj));
        let run = 0

        // let notePosition = note.details.notes.findIndex(elNote => elNote.dataKey === obj.dataKey);

        if ((updatedRef.enable) && updatedRef.required !== undefined && (updatedRef.required)) {
          let editedDataKey = updatedRef.dataKey.split('@');
          let newEdited = editedDataKey[0].split('#');
          if (updatedRef.level < 2 || updatedRef.level > 1 && newEdited[1] !== undefined) {
            let typeAnswer = typeof updatedRef.answer
            if (updatedRef.answer === undefined ||
              (updatedRef.answer !== undefined && typeAnswer === 'string' && updatedRef.answer === '') ||
              (updatedRef.answer !== undefined && typeAnswer === 'number' && updatedRef.answer == 0) ||
              (updatedRef.answer !== undefined && typeAnswer === 'object' && Number(updatedRef.type) == 21 && updatedRef.answer.length < 2) ||
              (updatedRef.answer !== undefined && typeAnswer === 'object' && Number(updatedRef.type) == 22 && updatedRef.answer.length < 2) ||
              (updatedRef.answer !== undefined && typeAnswer === 'object' && updatedRef.type > 22 && updatedRef.answer.length == 0) ||
              typeAnswer === 'object' && !isNaN(updatedRef.answer) ||
              typeAnswer === 'number' && isNaN(updatedRef.answer) ||
              JSON.stringify(updatedRef.answer) === '[]') {
              updatedRef.validationMessage.push(locale.details.language[0].validationRequired);
              updatedRef.validationState = 2;
            }
            setReference('details', ind, updatedRef);
          }
        }
      });

      if (summary.error === 0) {
        if (docState() === 'W') {
          toastInfo(locale.details.language[0].submitWarning, 3000, "", "bg-orange-600/80");
          setShowSubmit(true);
        } else {
          setShowSubmit(true);
        }
      } else {
        toastInfo(locale.details.language[0].submitEmpty, 3000, "", "bg-pink-600/80");
      }
    }
  }

  const submitData = (event: MouseEvent) => {
    if (tmpCaptcha().length !== 0 && (tmpCaptcha() === captcha())) {
      writeSubmitResponse();
      setShowSubmit(false)
      toastInfo(locale.details.language[0].verificationSubmitted, 3000, "", "bg-teal-600/80");
    } else {
      toastInfo(locale.details.language[0].verificationInvalid, 3000, "", "bg-pink-600/80");
    }
  }

  let timeEnd = new Date();
  let timeDiff = timeEnd.getTime() - props.timeStart.getTime();

  return (
    <div class="bg-gray-200 min-h-screen dark:bg-[#181f30] ">

      <Show when={showSubmit()}>
        <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                        onChange={(e) => { setTmpCaptcha(e.currentTarget.value) }}
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

      <Show when={showRemark()}>
        <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">

              <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
                  <div class="sm:flex sm:items-start mt-6">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full text-yellow-400 bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 class="text-lg leading-6 font-medium text-gray-900" id="titleModalError">List Remark</h3>
                      <div class="relative overflow-auto">
                        <div class="shadow-sm overflow-auto my-6">
                          <table class="border-collapse table-fixed w-full text-sm">
                            <thead class="text-sm font-semibold text-gray-600 bg-gray-50">
                              <tr>
                                <th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th>
                                <th class="p-2 whitespace-nowrap font-semibold text-left w-5/12">Field</th>
                                <th class="p-2 whitespace-nowrap font-semibold text-left w-1/12"></th>
                              </tr>
                            </thead>
                            <tbody class="text-sm divide-y divide-gray-100 ">
                              <For each={listRemarkPage()}>
                                {(item, index) => (
                                  <tr class="text-gray-600">
                                    <td class="border-b border-slate-100 p-2 align-top">
                                      <div class="text-left text-sm font-light">&nbsp;&nbsp;{Number(index()) + 1 + (currentRemarkPage() * 3 - 3)}</div>
                                    </td>
                                    <td class="border-b border-slate-100 p-2 align-top">
                                      <div class="text-left text-sm font-light" innerHTML={item['label']} />
                                    </td>
                                    <td class="border-b border-slate-100 align-top p-2">
                                      <button class="bg-transparent text-gray-500 rounded-full focus:outline-none h-5 w-5 hover:bg-gray-400 hover:text-white flex justify-center items-center"
                                        onClick={(e) => { lookInto(e, item.sideIndex, item.dataKey) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" stroke-width="2">
                                          <path fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clip-rule="evenodd" />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                )}
                              </For>
                            </tbody>
                          </table>
                        </div>
                        <div class="flex justify-start items-center text-center font-light px-3 pb-3">
                          <button type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                                    font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={e => showListPage(listRemark().length, 3, currentRemarkPage() - 1, listRemark(), 4)}
                            disabled={(currentRemarkPage() == 1) ? true : false}
                          >Prev</button>

                          <div class="text-center px-4 text-xs">{currentRemarkPage}</div>

                          <button type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                                    font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={e => showListPage(listRemark().length, 3, currentRemarkPage() + 1, listRemark(), 4)}
                            disabled={(currentRemarkPage() == maxRemarkPage()) ? true : false}
                          >Next</button>
                        </div>
                      </div>

                    </div>
                  </div>
              </div>

              <div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                          font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={e => setShowRemark(false)}>Close</button>
              </div>

            </div>
          </div>
        </div>
      </Show>

      <Show when={showBlank()}>
        <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">

              <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
                  <div class="sm:flex sm:items-start mt-6">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 sm:mx-0 sm:h-10 sm:w-10 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 class="text-lg leading-6 font-medium text-gray-900" id="titleModalError">List Blank</h3>
                      <div class="relative overflow-auto">
                        <div class="shadow-sm overflow-auto my-6">
                          <table class="border-collapse table-fixed w-full text-sm">
                            <thead class="text-sm font-semibold text-gray-600 bg-gray-50">
                              <tr>
                                <th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th>
                                <th class="p-2 whitespace-nowrap font-semibold text-left w-5/12">Field</th>
                                <th class="p-2 whitespace-nowrap font-semibold text-left w-1/12"></th>
                              </tr>
                            </thead>
                            <tbody class="text-sm divide-y divide-gray-100 ">
                              <For each={listBlankPage()}>
                                {(item, index) => (
                                  <tr class="text-gray-600">
                                    <td class="border-b border-slate-100 p-2 align-top">
                                      <div class="text-left text-sm font-light">&nbsp;&nbsp;{Number(index()) + 1 + (currentBlankPage() * 3 - 3)}</div>
                                    </td>
                                    <td class="border-b border-slate-100 p-2 align-top">
                                      <div class="text-left text-sm font-light" innerHTML={item['label']} />
                                    </td>
                                    <td class="border-b border-slate-100 align-top p-2">
                                      <button class="bg-transparent text-gray-500 rounded-full focus:outline-none h-5 w-5 hover:bg-gray-400 hover:text-white flex justify-center items-center"
                                        onClick={(e) => { lookInto(e, item.sideIndex, item.dataKey) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" stroke-width="2">
                                          <path fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clip-rule="evenodd" />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                )}
                              </For>
                            </tbody>
                          </table>
                        </div>
                        <div class="flex justify-start items-center text-center font-light px-3 pb-3">
                          <button type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                                    font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={e => showListPage(listBlank().length, 3, currentBlankPage() - 1, listBlank(), 3)}
                            disabled={(currentBlankPage() == 1) ? true : false}
                          >Prev</button>

                          <div class="text-center px-4 text-xs">{currentBlankPage}</div>

                          <button type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                                    font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={e => showListPage(listBlank().length, 3, currentBlankPage() + 1, listBlank(), 3)}
                            disabled={(currentBlankPage() == maxBlankPage()) ? true : false}
                          >Next</button>
                        </div>
                      </div>

                    </div>
                  </div>
              </div>

              <div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                          font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={e => setShowBlank(false)}>Close</button>
              </div>

            </div>
          </div>
        </div>
      </Show>

      <Show when={showError()}>
        <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">

              <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="titleModalError">List Error</h3>
                    <div class="relative overflow-auto">
                      <div class="shadow-sm overflow-auto my-6">
                        <table class="border-collapse table-fixed w-full text-sm">
                          <thead class="text-sm font-semibold text-gray-600 bg-gray-50">
                            <tr>
                              <th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th>
                              <th class="p-2 whitespace-nowrap font-semibold text-left w-4/12">Field</th>
                              <th class="p-2 whitespace-nowrap font-semibold text-left w-5/12">Error Messages</th>
                              <th class="p-2 whitespace-nowrap font-semibold text-left w-2/12"></th>
                            </tr>
                          </thead>
                          <tbody class="text-sm divide-y divide-gray-100 ">
                            <For each={listErrorPage()}>
                              {(item, index) => (
                                <tr class="text-gray-600">
                                  <td class="border-b border-slate-100 p-2 align-top">
                                    <div class="text-left text-sm font-light">&nbsp;&nbsp;{Number(index()) + 1 + (currentErrorPage() * 3 - 3)}</div>
                                  </td>
                                  <td class="border-b border-slate-100 p-2 align-top">
                                    <div class="text-left text-sm font-light" innerHTML={item['label']} />
                                  </td>
                                  <td class="border-b border-slate-100 align-top pb-2">
                                    <For each={item['message']}>
                                      {(item_msg, index_msg) => (
                                        <div class="grid grid-cols-12 text-sm font-light mt-1">
                                          <div class="col-span-1 flex justify-center items-start">-</div>
                                          {/* @ts-ignore */}
                                          <div class="col-span-11 text-justify mr-1">{item_msg}</div>
                                        </div>
                                      )}
                                    </For>
                                  </td>
                                  <td class="border-b border-slate-100 align-top p-2">
                                    <button class="bg-transparent text-gray-500 rounded-full focus:outline-none h-5 w-5 hover:bg-gray-400 hover:text-white flex justify-center items-center"
                                      onClick={(e) => { lookInto(e, item.sideIndex, item.dataKey) }}>
                                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" stroke-width="2">
                                        <path fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clip-rule="evenodd" />
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              )}
                            </For>
                          </tbody>
                        </table>
                      </div>
                      <div class="flex justify-start items-center text-center font-light px-3 pb-3">
                        <button type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                                  font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={e => showListPage(listError().length, 3, currentErrorPage() - 1, listError(), 2)}
                          disabled={(currentErrorPage() == 1) ? true : false}
                        >Prev</button>

                        <div class="text-center px-4 text-xs">{currentErrorPage}</div>

                        <button type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                                  font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={e => showListPage(listError().length, 3, currentErrorPage() + 1, listError(), 2)}
                          disabled={(currentErrorPage() == maxErrorPage()) ? true : false}
                        >Next</button>
                      </div>
                    </div>

                  </div>
                </div>

                <Show when={listWarning().length > 0}>
                  <div class="sm:flex sm:items-start mt-6">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-200 sm:mx-0 sm:h-10 sm:w-10 text-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 class="text-lg leading-6 font-medium text-gray-900" id="titleModalError">List Warning</h3>
                      <div class="relative overflow-auto">
                        <div class="shadow-sm overflow-auto my-6">
                          <table class="border-collapse table-fixed w-full text-sm">
                            <thead class="text-sm font-semibold text-gray-600 bg-gray-50">
                              <tr>
                                <th class="p-2 whitespace-nowrap font-semibold text-left w-1/12">No</th>
                                <th class="p-2 whitespace-nowrap font-semibold text-left w-4/12">Field</th>
                                <th class="p-2 whitespace-nowrap font-semibold text-left w-5/12">Warning Messages</th>
                                <th class="p-2 whitespace-nowrap font-semibold text-left w-2/12"></th>
                              </tr>
                            </thead>
                            <tbody class="text-sm divide-y divide-gray-100 ">
                              <For each={listWarningPage()}>
                                {(item, index) => (
                                  <tr class="text-gray-600">
                                    <td class="border-b border-slate-100 p-2 align-top">
                                      <div class="text-left text-sm font-light">&nbsp;&nbsp;{Number(index()) + 1 + (currentWarningPage() * 3 - 3)}</div>
                                    </td>
                                    <td class="border-b border-slate-100 p-2 align-top">
                                      <div class="text-left text-sm font-light" innerHTML={item['label']} />
                                    </td>
                                    <td class="border-b border-slate-100 align-top pb-2">
                                      <For each={item['message']}>
                                        {(item_msg, index_msg) => (
                                          <div class="grid grid-cols-12 text-sm font-light mt-1">
                                            <div class="col-span-1 flex justify-center items-start">-</div>
                                            {/* @ts-ignore */}
                                            <div class="col-span-11 text-justify mr-1">{item_msg}</div>
                                          </div>
                                        )}
                                      </For>
                                    </td>
                                    <td class="border-b border-slate-100 align-top p-2">
                                      <button class="bg-transparent text-gray-500 rounded-full focus:outline-none h-5 w-5 hover:bg-gray-400 hover:text-white flex justify-center items-center"
                                        onClick={(e) => { lookInto(e, item.sideIndex, item.dataKey) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" stroke-width="2">
                                          <path fill-rule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clip-rule="evenodd" />
                                        </svg>
                                      </button>
                                    </td>
                                  </tr>
                                )}
                              </For>
                            </tbody>
                          </table>
                        </div>
                        <div class="flex justify-start items-center text-center font-light px-3 pb-3">
                          <button type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                                    font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={e => showListPage(listWarning().length, 3, currentWarningPage() - 1, listWarning(), 1)}
                            disabled={(currentWarningPage() == 1) ? true : false}
                          >Prev</button>

                          <div class="text-center px-4 text-xs">{currentWarningPage}</div>

                          <button type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                                    font-light text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={e => showListPage(listWarning().length, 3, currentWarningPage() + 1, listWarning(), 1)}
                            disabled={(currentWarningPage() == maxWarningPage()) ? true : false}
                          >Next</button>
                        </div>
                      </div>

                    </div>
                  </div>
                </Show>
              </div>

              <div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                          font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={e => setShowError(false)}>Close</button>
              </div>

            </div>
          </div>
        </div>
      </Show>

      <div class="md:max-w-6xl mx-auto md:px-8 md:py-8">
        <div class="bg-gray-50 dark:bg-gray-900  dark:text-white text-gray-600 h-screen flex overflow-hidden text-sm font-montserrat rounded-lg shadow-xl dark:shadow-gray-800">
          <div class="mobile-component-div flex-grow overflow-y-auto h-full flex flex-col bg-white dark:bg-gray-900 z-0" onScroll={checkScrollTopMobile}>

            <div class="relative min-h-screen md:flex   ">
              {/* <div class="absolute pt-1 z-20 h-8 w-36 left-0 -ml-8 top-5 bg-teal-600/70 -rotate-45 text-white font-semibold text-center"  >&#946;eta 🤖</div> */}

              <div class="bg-gray-50 dark:bg-gray-900 w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto p-5 space-y-4
                sidebar-span absolute inset-y-0 left-0 transform -translate-x-full transition-transform duration-500 ease-in-out md:relative md:translate-x-0 z-10">
                <div class=" text-gray-400 tracking-wider flex justify-between ">
                  <div class="text-lg block p-4 text-gray-600 dark:text-white font-bold sm:text-xl" innerHTML={props.template.details.acronym
                    + '<div class="text-xs font-light text-gray-600 ">🚀'+gearVersion+' 📋' + templateVersion + ' ✔️' + validationVersion + ' </div>  '} />

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
                              <a class="block py-2 px-4 rounded font-medium space-x-2 
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
                                  setActiveComponent({ dataKey: item_0.dataKey, label: item_0.label, index: JSON.parse(JSON.stringify(item_0.index)), position: index() });
                                }}
                              >
                                {item_0.label}
                                <div class="font-light text-xs"><div innerHTML={item_0.description} /></div>
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
                                        <a class="block py-2 px-4 rounded font-medium space-x-2 
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
                                            setActiveComponent({ dataKey: item_1.dataKey, label: item_1.label, index: JSON.parse(JSON.stringify(item_1.index)), position: index() });
                                          }}
                                        >
                                          {item_1.label}
                                          <div class="font-light text-xs"><div innerHTML={item_1.description} /></div>
                                        </a>

                                        <For each={sidebar.details}>
                                          {(item_2, index) => (
                                            <Show when={item_2.level == 2
                                              && item_0.index[1] == item_1.index[1]
                                              && item_1.index[1] == item_2.index[1]
                                              && item_1.index[3] == item_2.index[3]
                                              && item_1.index[4] == item_2.index[4]
                                              && item_2.enable}>
                                              <ul class="border-l border-gray-300 dark:border-slate-500 ml-4  "
                                                classList={{
                                                  'show': item_0.index[1] === form.activeComponent.index[1]
                                                }}
                                              >
                                                <li>
                                                  <a class="block py-2 px-4 rounded font-medium space-x-2 
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
                                                      setActiveComponent({ dataKey: item_2.dataKey, label: item_2.label, index: JSON.parse(JSON.stringify(item_2.index)), position: index() });
                                                    }}
                                                  >
                                                    {item_2.label}
                                                    <div class="font-light text-xs"><div innerHTML={item_2.description} /></div>
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
                                                            <a class="block py-2 px-4 rounded font-medium space-x-2 
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
                                                                setActiveComponent({ dataKey: item_3.dataKey, label: item_3.label, index: JSON.parse(JSON.stringify(item_3.index)), position: index() });
                                                              }}
                                                            >
                                                              {item_3.label}
                                                              <div class="font-light text-xs"><div innerHTML={item_3.description} /></div>
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

                </div>

                <div class="flex items-center space-x-3 sm:mt-7 mt-4">
                </div>

                <div class="relative h-2/6">
                  <div class="bg-white p-3 w-full flex flex-col  space-y-4 rounded-md dark:bg-gray-800 shadow absolute bottom-0 left-0">
                    <div class="max-w-5xl grid grid-cols-2 gap-2">
                      <div class="h-20 text-5xl text-center sm:flex flex-col flex-coltext-white font-medium xs:h-auto xs:square xl:border-b ">
                        {summary.answer}
                        <div class="font-light text-xs">{locale.details.language[0].summaryAnswer}</div>
                      </div>
                      <div class="h-20 text-5xl text-center sm:flex flex-col flex-coltext-white font-medium xs:h-auto xs:square xl:border-b " onClick={showListBlank}>
                        {summary.blank}
                        <div class="font-light text-xs">{locale.details.language[0].summaryBlank}</div>
                      </div>                      
                      <Switch>
                        <Match when={(summary.error == 0)}>                          
                          <div class="h-20 text-5xl text-center sm:flex flex-col flex-coltext-white font-medium xs:h-auto xs:square xl:border-b " onClick={confirmSubmit}>
                            {summary.error}
                            <div class="font-light text-xs">{locale.details.language[0].summaryError}</div>
                          </div>
                        </Match>
                        <Match when={(summary.error > 0)}>
                          <div class="h-20 text-5xl text-center sm:flex flex-col flex-coltext-white font-medium xs:h-auto xs:square xl:border-b " onClick={showListError}>
                            {summary.error}
                            <div class="font-light text-xs">{locale.details.language[0].summaryError}</div>
                          </div>
                        </Match>
                      </Switch>
                      <div class="h-20 text-5xl text-center sm:flex flex-col flex-coltext-white font-medium xs:h-auto xs:square xl:border-b " onClick={showListRemark}>
                        {summary.remark}
                        <div class="font-light text-xs">{locale.details.language[0].summaryRemark}</div>
                      </div>
                    </div>
                    <div>
                      <Switch>
                        <Match when={(summary.error == 0 && config().formMode == 1)}>
                          <button class="bg-teal-300 hover:bg-teal-200 text-teal-100 p-3 w-full rounded-md shadow font-medium" onClick={confirmSubmit}>Submit</button>
                        </Match>
                        <Match when={(summary.error > 0 && config().formMode < 3)}>
                          <button class="bg-red-500 hover:bg-red-400 text-teal-100 p-3 w-full rounded-md shadow font-medium" onClick={showListError}>List Error</button>
                        </Match>
                      </Switch>
                    </div>
                  </div>
                </div>

              </div>

              <div class="component-div flex-grow bg-white dark:bg-gray-900 overflow-y-auto transition duration-500 ease-in-out z-10" onScroll={checkScrollTopWeb}>

                <div class="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 xl:sticky top-0 z-10">
                  <div class="flex w-full items-center">
                    <div class="ml-3 w-4/6 md:text-2xl md:text-left font-medium text-left text-base text-gray-900 dark:text-white mt-1">
                      <div innerHTML={props.template.details.title} />
                      <div class="text-sm font-light md:text-lg text-gray-600 dark:text-gray-400" innerHTML={props.template.details.description}
                        classList={{
                          'flex': onMobile() === false,
                          'hidden': onMobile() === true,
                        }}
                      />
                      <div class="text-xs font-light text-gray-600 "> {renderGear} &#177; {timeDiff} ms</div>
                    </div>
                    <div class="ml-auto w-1/6 sm:flex items-center p-2 ">
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
                    <div class="ml-auto w-1/6 sm:flex md:hidden items-center">
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
                  onMobile={onMobile()}
                  components={components()}
                  dataKey={form.activeComponent.dataKey}
                  index={[0]}
                  config={getConfig()}
                  uploadHandler={props.uploadHandler}
                  GpsHandler={props.GpsHandler}
                  offlineSearch={props.offlineSearch}
                  onlineSearch={props.onlineSearch}
                  openMap={props.openMap}
                  setResponseMobile={props.setResponseMobile}
                />

                <div class="grid grid-cols-6 sticky w-full justify-end bottom-12 mt-10"
                  classList={{
                    'flex': onMobile() === false,
                    'hidden': onMobile() === true,
                  }}>
                  <div class=" flex justify-center items-center space-x-10 mx-10 col-start-2 col-end-6 py-2 rounded-full bg-gray-200/80 dark:bg-gray-800/90">
                    <button class="bg-blue-700  text-white p-2 rounded-full  focus:outline-none items-center h-10 w-10 hover:bg-blue-600 group inline-flex justify-center text-xs"
                      classList={{
                        'hidden': sidebar.details.filter((obj, i) => (obj.enable) && (i < form.activeComponent.position)).length === 0,
                        'visible': sidebar.details.filter((obj, i) => (obj.enable) && (i < form.activeComponent.position)).length > 0
                      }}
                      onClick={previousPage}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    <div class="flex justify-center items-center text-center">{form.activeComponent.label}</div>
                    <Switch>
                      <Match when={sidebar.details.filter((obj, i) => (obj.enable) && (i > form.activeComponent.position)).length === 0 && summary.error > 0}>
                        <button class="bg-red-200 text-red-500 sm:h-10 sm:w-10 rounded-full focus:outline-none h-5 w-5 flex justify-center items-center"
                          onClick={showListError}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </Match>
                      <Match when={sidebar.details.filter((obj, i) => (obj.enable) && (i > form.activeComponent.position)).length === 0 && summary.error == 0 && config().formMode == 1}>
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
                            'visible': sidebar.details.filter((obj, i) => (obj.enable) && (i > form.activeComponent.position)).length > 0,
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

                  <div class="  justify-end items-center pr-8 transition"
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

              <div class="grid grid-cols-6 sticky w-full justify-end bottom-6 mt-10"
                classList={{
                  'flex': onMobile() === true,
                  'hidden': onMobile() === false,
                }}>
                <div class=" flex justify-center items-center space-x-4  col-start-1 col-end-5 ml-4 mr-4 py-2 rounded-full bg-gray-200/80 dark:bg-gray-800/90">
                  <button class="bg-blue-700  text-white p-2 rounded-full focus:outline-none items-center h-8 w-8 hover:bg-blue-600 group inline-flex justify-center text-xs"
                    classList={{
                      'hidden': sidebar.details.filter((obj, i) => (obj.enable) && (i < form.activeComponent.position)).length === 0,
                      'visible': sidebar.details.filter((obj, i) => (obj.enable) && (i < form.activeComponent.position)).length > 0
                    }}
                    onClick={previousPage}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <div class="flex justify-center items-center text-center text-xs">{form.activeComponent.label}</div>
                  <Switch>
                    <Match when={sidebar.details.filter((obj, i) => (obj.enable) && (i > form.activeComponent.position)).length === 0 && summary.error > 0}>
                      <button class="bg-red-200 text-red-500 rounded-full focus:outline-none h-8 w-8 flex justify-center items-center"
                        onClick={showListError}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </Match>
                    <Match when={sidebar.details.filter((obj, i) => (obj.enable) && (i > form.activeComponent.position)).length === 0 && summary.error == 0 && config().formMode == 1}>
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
                <div class=" justify-end items-center pr-2 transition"
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
                <div class="flex justify-end items-center col-start-6 pr-5 transition">
                  <Show when={(config().formMode < 3)}>
                    <button class=" bg-teal-500 text-white p-2 rounded-full focus:outline-none items-center h-10 w-10 hover:bg-teal-400"
                      onClick={writeResponse}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </Show>
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
