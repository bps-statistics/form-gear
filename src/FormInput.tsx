import { useForm } from "./FormProvider";
import { CONTROL_MAP, FormComponentBase } from "./FormType";
import { Switch, For, Match, createSignal, createMemo, Show } from 'solid-js'
import { gearVersion, templateVersion, validationVersion } from "./FormGear"

import { reference, setReference} from './stores/ReferenceStore';
import { sidebar, setSidebar} from './stores/SidebarStore';
import { response, setResponse} from './stores/ResponseStore';
import { summary } from './stores/SummaryStore';
import { validation, setValidation, Validation } from './stores/ValidationStore';
import { remark, setRemark} from './stores/RemarkStore';
import { note, setNote} from './stores/NoteStore';
import { principal, setPrincipal} from './stores/PrincipalStore';
import { template, setTemplate, Questionnaire } from './stores/TemplateStore';
import { locale, setLocale} from './stores/LocaleStore';
import { useLoaderDispatch } from "./loader/FormLoaderProvider";
import { referenceEnableFalse, setReferenceEnableFalse } from './stores/ReferenceStore';
import { media, setMedia } from "./stores/MediaStore";

import dayjs from 'dayjs';
import Toastify from 'toastify-js'

import { getValue, saveAnswer, reloadDataFromHistory} from './GlobalFunction'

import { setReferenceHistory} from './stores/ReferenceStore';
import { setSidebarHistory} from './stores/ReferenceStore';

export const getEnable = (dataKey: string) => {
  const componentIndex = reference.details.findIndex(obj => obj.dataKey === dataKey);
  let enable = true;
  if(componentIndex !== -1){
    enable = reference.details[componentIndex].enable;
  }
  
  return enable;
}
export const toastInfo = (text:string, duration:number, position:string, bgColor:string) => {
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

const FormInput: FormComponentBase = props => {
  const [form, { setActiveComponent }] = useForm();
  const { setLoader, removeLoader } = useLoaderDispatch();

  const [flagRemark, setFlagRemark] = createSignal(''); //dataKey Remark
  const [comments, setComments] = createSignal([]); //temp Comments
  const [tmpComment, setTmpComment] = createSignal(''); //temp Comment
  const [docState, setDocState] = createSignal('E');
  
  const [loading, setLoading] = createSignal(false); //temp Comment

  const setData = () => {
    const dataForm = [];
    const dataMedia = [];
    const dataPrincipal = [];

    reference.details.forEach((element) => {
      if(
        (element.type > 3)
        && ( element.enable ) 
        && ( element.answer !== undefined)
        && ( element.answer !== '') 
        && ( element.answer !== null)
      ) {
        let enableFalse = referenceEnableFalse().findIndex(obj => obj.parentIndex.toString() === element.index.slice(0, -2).toString());
        if (enableFalse == -1){      
          (element.type == 32 || element.type == 36) && dataMedia.push({ dataKey: element.dataKey, name: element.name, answer: element.answer });
          
          dataForm.push({ dataKey: element.dataKey, name: element.name, answer: element.answer })

          if (element.principal !== undefined) {
            dataPrincipal.push({
              dataKey: element.dataKey,
              name: element.name,
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
    (response.details.createdBy === undefined || (response.details.createdBy !== undefined && response.details.createdBy === '')) ?
      setResponse('details', 'createdBy', props.config.username) :
      setResponse('details', 'updatedBy', props.config.username);
    (response.details.createdAt === undefined || (response.details.createdAt !== undefined && response.details.createdAt === '')) ?
      setResponse('details', 'createdAt', now) :
      setResponse('details', 'updatedAt', now);

    //setPrincipal
    setPrincipal('details', 'principals', dataPrincipal)
    setPrincipal('details', 'templateDataKey', template.details.dataKey)
    setPrincipal('details', 'gearVersion', gearVersion)
    setPrincipal('details', 'templateVersion', templateVersion)
    setPrincipal('details', 'validationVersion', validationVersion);
    (principal.details.createdBy === undefined || (principal.details.createdBy !== undefined && principal.details.createdBy === '')) ?
      setPrincipal('details', 'createdBy', props.config.username) :
      setPrincipal('details', 'updatedBy', props.config.username);
    (principal.details.createdAt === undefined || (principal.details.createdAt !== undefined && principal.details.createdAt === '')) ?
      setPrincipal('details', 'createdAt', now) :
      setPrincipal('details', 'updatedAt', now);

    //setRemark
    setRemark('details', 'notes', JSON.parse(JSON.stringify(note.details.notes)));
    setRemark('details', 'templateDataKey', template.details.dataKey)
    setRemark('details', 'gearVersion', gearVersion);
    setRemark('details', 'templateVersion', templateVersion);
    setRemark('details', 'validationVersion', validationVersion);
    (remark.details.createdBy === undefined || (remark.details.createdBy !== undefined && remark.details.createdBy === '')) ?
      setRemark('details', 'createdBy', props.config.username) :
      setRemark('details', 'updatedBy', props.config.username);
    (remark.details.createdAt === undefined || (remark.details.createdAt !== undefined && remark.details.createdAt === '')) ?
      setRemark('details', 'createdAt', now) :
      setRemark('details', 'updatedAt', now);

    //setReference
    setReference('sidebar', sidebar.details)
  }



  const onUserClick = (dataKey: string) => {
    setData();
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      var component = document.querySelector(".mobile-component-div");
    }else{
      var component = document.querySelector(".component-div");
    }     
    const position = sidebar.details.findIndex(obj => obj.dataKey === dataKey);
    setActiveComponent({dataKey: dataKey, label: sidebar.details[position].label, index: JSON.parse(JSON.stringify(sidebar.details[position].index)), position:position});
    window.scrollTo({ top: 0, behavior: "smooth" });
    component.scrollTo({ top: 0, behavior: "smooth" });
  }
  
  const onValueChange = (value: any) => {
    setLoader({});
    setTimeout(() => {
      try{
        setReferenceHistory([])
        setSidebarHistory([])
        saveAnswer(props.component.dataKey, 'answer', value, form.activeComponent.position, {'clientMode': props.config.clientMode,'baseUrl': props.config.baseUrl}, 0)
      }catch(e){
        console.log(e)
        toastInfo(locale.details.language[0].errorSaving + props.component.dataKey, 3000, "", "bg-pink-600/80");
        reloadDataFromHistory()
      }finally{
        setReferenceHistory([])
        setSidebarHistory([])
      }
    }, 50);
  }

  const cn = [' border border-solid border-gray-300 ',' border-orange-500 border-4 ',' border-pink-600 border-4 ']

  let handleValidation = createMemo(() => {
    const componentIndex = reference.details.findIndex(obj => obj.dataKey === props.component.dataKey);
    return (reference.details[componentIndex]) ? reference.details[componentIndex].validationState : 0;    
  })
    
  const getValidationMessage = (dataKey: string) => {
    const componentIndex = reference.details.findIndex(obj => obj.dataKey === props.component.dataKey);
    return (reference.details[componentIndex]) ? reference.details[componentIndex].validationMessage : [];
  }

  const saveRemark = () => {
    if(tmpComment().length !== 0){
      let commentRemark = []
      commentRemark.push({
        sender: props.config.username, 
        datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'), 
        comment: tmpComment()
      })

      let updatedNote = JSON.parse(JSON.stringify(note.details.notes))
      if(updatedNote.length == 0){
        updatedNote = [ ...updatedNote, {"dataKey":flagRemark(),"comments":commentRemark} ];
      } else {
        let noteIndex = updatedNote.findIndex((item) => item.dataKey == flagRemark())
        if(noteIndex == -1){
          updatedNote = [ ...updatedNote, {"dataKey":flagRemark(),"comments":commentRemark} ];
        } else {
          updatedNote[noteIndex].comments.push(commentRemark[0]) 
        }
      }
      let refPosition = reference.details.findIndex(obj => obj.dataKey === flagRemark());
      setReference('details',refPosition,'hasRemark',true);
      setReference('details',refPosition,'validationState',0);
      setReference('details',refPosition,'validationMessage',[]);
      setNote('details','notes', updatedNote);
      
      setTmpComment('');
      setFlagRemark('');

      toastInfo(locale.details.language[0].remarkAdded, 500, "",  "bg-teal-600/80");
      
      setData();
      props.setResponseMobile( response.details, remark.details, principal.details, reference );
    }else{
      toastInfo(locale.details.language[0].remarkEmpty, 500, "", "bg-red-700/80");
    }
  }

  const openRemark = (dataKey:string) => {
    modalRemark(dataKey);
  }

  const modalRemark = (dataKey: string) => {
    if(flagRemark() === ''){
      setFlagRemark(dataKey);

      let updatedNote = JSON.parse(JSON.stringify(note.details.notes))
      let noteIndex = updatedNote.findIndex((item) => item.dataKey == dataKey)
      setComments(updatedNote[noteIndex] !== undefined ? updatedNote[noteIndex].comments : [])
    } else {
      setFlagRemark(dataKey);
    }
  }
  
  const getComments = (dataKey: string) => {
    let updatedNote = JSON.parse(JSON.stringify(note.details.notes))
    let noteIndex = updatedNote.findIndex((item) => item.dataKey == dataKey)
    return updatedNote[noteIndex] !== undefined ? updatedNote[noteIndex].comments.length : 0
  }

  return (
    <div>
      
      <Show when={(loading())}>
        <div class="modal-loading fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0">

            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>						
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="relative inline-block overflow-hidden  transform transition-all items-center">
              <svg class="animate-spin h-16 w-16 text-zinc-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>

          </div>
        </div>
      </Show>

      <Show when={(flagRemark() !== '') }>
				<div class="modal-remark fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
					<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
						
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">

              <div class="bg-gray-50 p-8 space-y-5"
                classList={{
                  'hidden': comments().length == 0
                }}>
                <For each={comments()}>
                    {(item, index) => (
                      <div class="bg-white p-4 grid grid-cols-8 rounded-lg">
                        <div class="text-xs font-normal text-gray-400 col-span-5">{item.sender}</div>
                        <div class="text-xs font-light text-indigo-700 col-span-3 text-right italic">{item.datetime}</div>
                        <div class="text-xs text-gray-700 py-2 -mb-2 col-span-12 text-justify">{item.comment}</div>
                      </div>
                    )}
                  </For>
              </div>
              
              <Show when={(props.config.formMode < 3)}>
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="grid grid-cols-8">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full text-yellow-400 bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                      <div class="mt-1 text-left col-span-7 ">
                            <textarea rows={2}
                                class="w-full rounded font-light px-4 py-2.5 text-sm text-gray-700 border 
                                  border-solid border-gray-300 bg-white bg-clip-padding transition ease-in-out m-0 
                                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                placeholder="" 
                                onChange={(e) => { setTmpComment(e.currentTarget.value) } }
                            />
                      </div>
                  </div>
                </div>
                <div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" 
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white 
                        hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" 
                        onClick={e => saveRemark()}>&nbsp;&nbsp;Save&nbsp;&nbsp;</button>
                  <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                          font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" 
                        onClick={e => modalRemark('')}>Cancel</button>
                </div>
              </Show>
              <Show when={(props.config.formMode == 3)}>
                <div class="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base 
                          font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" 
                        onClick={e => modalRemark('')}>Close</button>
                </div>
              </Show>

						</div>
					</div>
				</div>
			</Show>

      <div id={props.component.dataKey + '___scrollView'} />

      <Switch>
        <For each={Array.from(CONTROL_MAP.keys())}>
          {type =>
            <Match when={props.component.type === type && getEnable(props.component.dataKey)}
              children={
                CONTROL_MAP.get(type)({
                  onMobile: props.onMobile,
                  component: props.component,
                  index: props.index,
                  onValueChange,
                  onUserClick,
                  value: getValue(props.component.dataKey),
                  config: props.config,
                  classValidation: handleValidation(),
                  comments: getComments(props.component.dataKey),
                  MobileUploadHandler: props.MobileUploadHandler,
                  validationMessage: getValidationMessage(props.component.dataKey),
                  openRemark: openRemark,
                  MobileGpsHandler: props.MobileGpsHandler,
                  MobileOfflineSearch: props.MobileOfflineSearch,
                  MobileOnlineSearch: props.MobileOnlineSearch,
                  MobileOpenMap: props.MobileOpenMap
                })
              }
            />
          }
        </For>
      </Switch>
    </div>
  )
}

export default FormInput