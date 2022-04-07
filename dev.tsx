// import handler  from "./src/FormGear"
import { FormGear } from "./src/index"

let config = {
  clientMode: 1, // CAWI = 1, CAPI = 2
  token: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJpZFwiOlwiNTlGQjk2NjctRUQ3QS00QjA1LTlGNDUtODMyMjFBMzkxODFEXCIsXCJ1c2VybmFtZVwiOlwicGNscHVzYXRfMzMxM18xXCIsXCJmdWxsbmFtZVwiOlwicGNscHVzYXRfMzMxM18xXCIsXCJlbWFpbFwiOlwicGNscHVzYXRfMzMxM18xQHkuY29tXCIsXCJyb2xlSWRcIjpcIkVFMzFGN0M0LTVDNkEtNDMwQy1BRjEzLUJDRDRDNkQ5RTVCRVwiLFwicm9sZU5hbWVcIjpcIlBFVFVHQVNcIixcInByb3ZpbmNlSWRcIjpcIjZCQjEyODAyLTVDNUUtNEJGMS1BOTA2LUM1N0NCNEZDRTQwN1wiLFwicHJvdmluY2VOYW1lXCI6XCJKYXdhIFRlbmdhaFwiLFwicmVnZW5jeUlkXCI6XCJFRENFMDcwMi03QzIzLTQyQTMtQjgzOC1BNUVEMzQxRTlBNTJcIixcInJlZ2VuY3lOYW1lXCI6XCJLYXJhbmdhbnlhclwiLFwid29ya1VuaXRJZFwiOlwiQzM4QzU2NjctM0JCMC00NDNDLUE0MzUtMUVFQ0Q3QzZERkEyXCIsXCJ3b3JrVW5pdE5hbWVcIjpcIkJBREFOIFBVU0FUIFNUQVRJU1RJS1wifSIsImF1ZCI6Im5vbi1jYXdpIiwiZXhwIjoxNjUwMzc2MzM3LCJyb2wiOiJQRVRVR0FTIn0.JW2CzU5rLnqtksI2J7weMiSYmzzxO0XnP4vGm9xEZ-XYKhUo5JRyVdbXaeGptdciW6Sd9BbO14N_XBn-iUuemg`,
  baseUrl: `https://api-survey.bps.go.id/designer/api/lookup-data/json`,
  lookupKey: `key%5B%5D`,
  lookupValue: `value%5B%5D`,
  username: 'AdityaSetyadi'
}

var cameraFunction = null;
var cameraGPSFunction = null;
var respons = null;
var remarks = null;

let template = await fetch("../src/data/template.json").then((res) => res.json()) || []
let preset = await fetch("../src/data/preset.json").then((res) => res.json()) || []
let response = await fetch("../src/data/response.json").then((res) => res.json()) || []
let validation = await fetch("../src/data/validation.json").then((res) => res.json()) || []
let remark = await fetch("../src/data/remark.json").then((res) => res.json()) || []

function openCamera() {
  // window.MyHandler.action("CAMERA", "", "", "");
  console.log('open camera');
}

function openCameraGPS(needPhoto) {
  var isNeedPhoto = false
  if (needPhoto !== null && needPhoto !== undefined)
    isNeedPhoto = needPhoto
  console.log("new-capi: open-camera-gps " + isNeedPhoto.toString())
  let result = '{"coordinat":{"long":106.8924928,"lat":-6.2488576},"remark":"Akurasi dalam rentang yang tepat","accuracy":17.884000778198242}'

  resultCameraGPS(result);


  // window.MyHandler.action("CAMERA_GPS", "", isNeedPhoto.toString(), "");
}

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

function resultCamera(result) {
  console.log('camera_result : ' + result);
  if (cameraFunction != null) {
    console.log('camera_result_funcion : not null');
    cameraFunction(result);
  } else {
    console.log('camera_result_funcion : null');
  }
}

function resultCameraGPS(result) {
  console.log('gps-results: ' + result);
  const obj = JSON.parse(result);
  var remark = obj.remark;
  cameraGPSFunction(obj, remark);
}

let uploadHandler = function (setter) {
  console.log('camera handler', setter);
  cameraFunction = setter;
  openCamera();
}

let GpsHandler = function (setter, isPhoto) {
  console.log('camera handler', setter);
  isPhoto = true,
    cameraGPSFunction = setter;
  openCameraGPS(isPhoto);
}

const setBearer = () => {
  return ({
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + config.token
    }
  })
}

// pencarian online
let onlineSearch = async (url) =>
(await fetch(url, setBearer())
  .catch((error: any) => {
    return {
      success: false,
      data: {},
      message: '500'
    }
  }).then((res: any) => {
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

let setResponseMobile = function (res, rem) {
  respons = res
  remarks = rem

  console.log('respons', respons)
  console.log('remarks', remarks)
}

let setSubmitMobile = function (res, rem) {
  respons = res
  remarks = rem

  console.log('respons submit', respons)
  console.log('remarks submit', remarks)
}

let openMap = function (koordinat) {
  koordinat = koordinat

  console.log('hasilny adalah : ', koordinat)
}


FormGear(template, preset, response, validation, remark, config, uploadHandler, GpsHandler, onlineSearch, setResponseMobile, setSubmitMobile, openMap);
