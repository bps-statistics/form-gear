// import handler  from "./src/FormGear"
import { FormGear } from "./src/index"

//variable config
let config = {
  clientMode: 1, // 1 => CAWI ; 2 => CAPI ;
  //both token and baseUrl are used for data lookup from the api (for selectInput, multiselect Input, and listSelectInput)
  token: ``, //for authentication such as bearer token 
  baseUrl: ``,
  lookupKey: `keys`, //optional
  lookupValue: `values`, //optional
  lookupMode: 1, // 1 => ONLINE ; 2 => OFFLINE
  username: 'AdityaSetyadi', //
  formMode: 1, // 1 => OPEN ; 2 => REVIEW ; 3 => CLOSE ;
  initialMode: 2 // 1=> INITIAL ; 2 => ASSIGN
}

//some variables initiation
var cameraFunction = null;
var cameraGPSFunction = null;

var responseGear = null;
var mediaGear = null;
var remarkGear = null;
var principalGear = null;
var referenceGear = null;

//JSON Object defined template
let reference = await fetch("../src/data/reference.json").then((res) => res.json()).catch((error: Error) => { return {} }) || []
let template = await fetch("../src/data/template.json").then((res) => res.json()).catch((error: Error) => { return {} }) || []
let preset = await fetch("../src/data/ec/preset.json").then((res) => res.json()).catch((error: Error) => { return {} }) || []
let response = await fetch("../src/data/response.json").then((res) => res.json()).catch((error: Error) => { return {} }) || []
let validation = await fetch("../src/data/validation.json").then((res) => res.json()).catch((error: Error) => { return {} }) || []
let media = await fetch("../src/data/media.json").then((res) => res.json()).catch((error: Error) => { return {} }) || []
let remark = await fetch("../src/data/remark.json").then((res) => res.json()).catch((error: Error) => { return {} }) || []

//function to open camera on mobile  CAPI
function openCamera() {
  // window.MyHandler.action("CAMERA", "", "", "");
  // console.log('open camera');
}

//function to open gps on mobile
function openCameraGPS(needPhoto) {
  var isNeedPhoto = false
  if (needPhoto !== null && needPhoto !== undefined)
    isNeedPhoto = needPhoto
  console.log("new-capi: open-camera-gps " + isNeedPhoto.toString())
  let result = '{"coordinat":{"long":106.8924928,"lat":-6.2488576},"remark":"Akurasi dalam rentang yang tepat","accuracy":17.884000778198242}'

  resultCameraGPS(result);


  // window.MyHandler.action("CAMERA_GPS", "", isNeedPhoto.toString(), "");
}

//function to receive results from mobile CAPI
function result(action, result, customData) {
  // if (action == "GET_LOC") {
  //   resultGps(result);
  // } else if (action == "CAMERA") {
  resultCamera(result);
  // } else if (action == "CAMERA_GPS") {
  //   resultCameraGPS(result);
  // } else if (action == "SIGNATURE") {
  //   resultSignature(result);
  // } else if (action == "BARCODE") {
  //   resultBarcode(result);
  // } else if (action == "AUDIO") {
  //   resultAudio(result);
  // } else if (action == "GET_ANSWER") {
  //   resultAnswer(result, customData);
  // } else if (action == "LOOKUP") {
  //   resultAnswer(result, customData);
  // }
}


//send camera result to form-gear from mobile CAPI
function resultCamera(result) {
  console.log('camera_result : ' + result);
  if (cameraFunction != null) {
    console.log('camera_result_funcion : not null');
    cameraFunction(result);
  } else {
    console.log('camera_result_funcion : null');
  }
}

//send gps result to form-gear from mobile CAPI
function resultCameraGPS(result) {
  console.log('gps-results: ' + result);
  const obj = JSON.parse(result);
  var remark = obj.remark;
  cameraGPSFunction(obj, remark);
}

//function to trigger open camera on Mobile CAPI
let uploadHandler = function (setter) {
  console.log('camera handler', setter);
  cameraFunction = setter;
  openCamera();
}

let offlineSearch = function (id, version, dataJson, setter) {

  let condition = JSON.stringify(dataJson)

  //here we use jquery to retrieve data from the local device
  $.ajax({
    url: `http://localhost:9090/lookup?id=${id}&v=${version}&c=${condition}`,//specify localhost endpoint to fetch
    type: "GET",
    crossDomain: true,
    dataType: "json",
    data: null,
    success: function (d) {
      console.log(d.hasil)
      setter(d)

    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {

    }
  });

}

//function to trigger open gps on Mobile GPS
let GpsHandler = function (setter, isPhoto) {
  console.log('camera handler', setter);
  isPhoto = true,
    cameraGPSFunction = setter;
  openCameraGPS(isPhoto);
}

//you can set  authentication for api lookup here, such as bearer token
const setBearer = () => {
  return ({
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  })
}

//custom function to trigger setResponsMobile to run from outside form-gear, you can custom the function name 
let mobileExit = (fun) => {
  // fun()
}


//online lookup
let onlineSearch = async (url) =>
(await fetch(url, setBearer())
  .catch((error: any) => {
    return {
      success: false,
      data: {},
      message: '500'
    }
  }).then((res: any) => {
    /*the return format must in object of 
      {
        success: false,
        data: {}, --> the data property must in format array of object [{key: {key}, value : {value}}, ...]
        message: status (200, 400 ,500 , etc )
      }
    }*/
    if (res.status === 200) {
      let temp = res.json();
      return temp;
    } else {
      return {
        success: false,
        data: {},
        message: res.status
      }
    }
  }).then((res: any) => {
    return res;
  }));

//function to get response, remark, principal and reference
let setResponseMobile = function (res, med, rem, princ, ref) {
  responseGear = res
  mediaGear = med
  remarkGear = rem
  principalGear = princ
  referenceGear = ref

  console.log('----------', new Date(), '----------');

  console.log('response', responseGear)
  console.log('media', mediaGear)
  console.log('remark', remarkGear)
  console.log('principal', principalGear)
  console.log('reference', referenceGear)
}

let setSubmitMobile = function (res, med, rem, princ, ref) {
  responseGear = res
  mediaGear = med
  remarkGear = rem
  principalGear = princ
  referenceGear = ref

  console.log('----------', new Date(), '----------');

  console.log('response', responseGear)
  console.log('media', mediaGear)
  console.log('remark', remarkGear)
  console.log('principal', principalGear)
  console.log('reference', referenceGear)
}

//function to open map on google map either in capi or cawi
let openMap = function (koordinat) {
  koordinat = koordinat
}


FormGear(reference, template, preset, response, validation, media, remark, config, uploadHandler, GpsHandler, offlineSearch, onlineSearch, mobileExit, setResponseMobile, setSubmitMobile, openMap);
