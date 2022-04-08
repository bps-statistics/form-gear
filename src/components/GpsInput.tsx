import { createEffect, createSignal, Switch, Match, Show, For } from "solid-js";
import { FormComponentBase } from "../FormType";
import Toastify from 'toastify-js'

const GpsInput: FormComponentBase = props => {
  const [label, setLabel] = createSignal('');
  const [location, setLocation] = createSignal('');
  const [latLong, setLatlong] = createSignal({
    latitude: null,
    longitude: null
  })

  const config = props.config
  const [disableInput] = createSignal((config.formMode > 2 ) ? true : props.component.disableInput)

  createEffect(() => {
    setLabel(props.component.label)

    if (props.value[0]) {
      let coord = props.value[0].value
      let imgSrc = `https://maps.google.com/maps?q=${coord.latitude},${coord.longitude}` + `&output=embed`;
      // console.log('koordinat : ', coord)
      setLocation(imgSrc)
      setLatlong({
        latitude: coord.latitude,
        longitude: coord.longitude
      })
    }


  })

  // console.log('propsnya : ', props)

  let handleMobileGps = (event) => {
    let updatedAnswer = JSON.parse(JSON.stringify(props.value))
    updatedAnswer = [];
    let source

    if (event.coordinat) {
      source = `https://maps.google.com/maps?q=${event.coordinat.latitude},${event.coordinat.longitude}` + `&output=embed`;
      setLocation(source)
    }

    toastInfo("Location successfully acquired!")
    updatedAnswer.push({ value: { 'latitude': event.coordinat.latitude, 'longitude': event.coordinat.longitude }, label: source })

    props.onValueChange(updatedAnswer)
  }

  let clickMobileGps = () => {
    props.MobileGpsHandler(handleMobileGps)
  }

  let clickGps = () => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;

      if (pos.coords) {
        let updatedAnswer = JSON.parse(JSON.stringify(props.value))
        updatedAnswer = [];
        let source = `https://maps.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}` + `&output=embed`;
        setLocation(source)

        updatedAnswer.push({ value: { 'latitude': pos.coords.latitude, 'longitude': pos.coords.longitude }, label: source })
        toastInfo("Location successfully acquired!")

        props.onValueChange(updatedAnswer)

      }

      // console.log('Your current position is:');
      // console.log(`Latitude : ${crd.latitude}`);
      // console.log(`Longitude: ${crd.longitude}`);
      // console.log(`More or less ${crd.accuracy} meters.`);
    }

    function error(err) {
      // console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

  }

  const toastInfo = (text: string) => {
    Toastify({
      text: (text == '') ? "" : text,
      duration: 3000,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      className: "bg-blue-600/80",
      style: {
        background: "rgba(8, 145, 178, 0.7)",
        width: "400px"
      }
    }).showToast();
  }

  const [instruction, setInstruction] = createSignal(false);
  const showInstruction = () => {
    (instruction()) ? setInstruction(false) : setInstruction(true);
  }

  const [enableRemark] = createSignal(props.component.enableRemark !== undefined ? props.component.enableRemark : true);

  return (
    <div>
      <div class="grid grid-cols-12 border-b border-gray-300/[.40] dark:border-gray-200/[.10] p-2">
              
        <div class="font-light text-sm space-y-2 py-2.5 px-2 col-span-11">
          <div class="inline-flex space-x-2">
            <div innerHTML={props.component.label} />
            <Show when={props.component.hint}>
              <button class="bg-transparent text-gray-300 rounded-full focus:outline-none h-4 w-4 hover:bg-gray-400 hover:text-white flex justify-center items-center"
                onClick={showInstruction}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </Show>
          </div>
          <div class="flex mt-2">
            <Show when={instruction()}>
              <div class="italic text-xs font-extralight text-zinc-400 " innerHTML={props.component.hint} />
            </Show>
          </div>
        </div>

        <div class="font-light text-sm space-x-2 py-2.5 px-2 space-y-4 flex justify-end items-end -mt-2">
          <Show when={location() != ''} >
            <Switch>
              <Match when={config.clientMode === 2} >
                <button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-sky-200 hover:text-sky-400 hover:border-sky-200 border-2 border-gray-300 "
                  onClick={e => props.MobileOpenMap(props.value[0].value)}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </button>
              </Match>
              <Match when={config.clientMode === 1}>
                <button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-sky-200 hover:text-sky-400 hover:border-sky-200 border-2 border-gray-300 "
                  onClick={e => window.open(`https://maps.google.com/maps?q=loc:` + latLong().latitude + "," + latLong().longitude, "_blank")}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </button>
              </Match>
            </Switch>
          </Show>

          <Switch>
            <Match when={config.clientMode === 2} >
              <button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-teal-200 hover:text-teal-400 hover:border-teal-200 border-2 border-gray-300  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
               disabled = { disableInput() }
               onClick={() => clickMobileGps()}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </Match>
            <Match when={config.clientMode === 1}>
              <button class="bg-white text-gray-500 p-2 rounded-full focus:outline-none h-10 w-10 hover:bg-teal-200 hover:text-teal-400 hover:border-teal-200 border-2 border-gray-300  disabled:bg-gray-200 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                disabled = { disableInput() }
                onClick={() => clickGps()}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </Match>
          </Switch>

          <Show when={enableRemark()}>
            <button class="relative inline-block bg-white p-2 h-10 w-10 text-gray-500 rounded-full  hover:bg-yellow-100 hover:text-yellow-400 hover:border-yellow-100 border-2 border-gray-300 " onClick={e => props.openRemark(props.component.dataKey)}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span class="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6
                    text-xs font-semibold text-white transform translate-x-1/2 -translate-y-1/4 bg-pink-600/80 rounded-full"
                classList={{
                  'hidden': props.comments === 0
                }}>
                {props.comments}
              </span>
            </button>
          </Show>
        </div>
        
        <Show when={location() != ''}>
          <div className="font-light text-sm space-x-2 py-2.5 px-2 col-span-12 space-y-4 -mt-2">
            <div class="preview-class">
              <div class="container mx-auto space-y-3">
                <iframe class="border-2 rounded-md mb-2" src={location()} style={"width:100%;height:100%;pointer-events: none;"}></iframe>
                <span class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800">{"lon : " + latLong().longitude}</span>
                <span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{"lat : " + latLong().latitude}</span>
              </div>
            </div>
          </div>
        </Show>

        <div class="col-span-12"
            classList={{
                ' border-b border-orange-500 pb-3 ' : props.classValidation === 1,
                ' border-b border-pink-600 pb-3 ' : props.classValidation === 2,
            }}>    

        </div>
        <div class="col-span-12 pb-4">
          <Show when={props.validationMessage.length > 0}>
            <For each={props.validationMessage}>
            {(item:any) => (
              <div 
              class="text-xs font-light mt-1"> 
              <div class="grid grid-cols-12"                  
                classList={{
                ' text-orange-500 dark:text-orange-200 ' : props.classValidation === 1,
                ' text-pink-600 dark:text-pink-200 ' : props.classValidation === 2,
                }} >
                <Switch>
                <Match when={props.classValidation === 1}>
                  <div class="col-span-1 flex justify-center items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  </div>
                </Match>
                <Match when={props.classValidation === 2}>
                  <div class="col-span-1 flex justify-center items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  </div>
                </Match>
                </Switch>
                <div class="col-span-11 text-justify mr-1" innerHTML={item}/>
              </div>
              </div>
            )}
            </For>
          </Show>
        </div>
               

      </div>
    </div>

  )
}

// transition ease-in-out m-0
// focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"

export default GpsInput