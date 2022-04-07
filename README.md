# FormGear

FormGear is a framework engine for dynamic form creation and complex form processing and validation for data collection. It is easy to use and efficiently handle nested inquiries to capture everything down to the last detail. Unlike other similar framework, validation is handled in a *FALSE* condition in which each field is validated against a test equation. This leads to a more efficient and effective way to validate each component.

# Usage

### Installation

FormGear can be installed via package manager like `npm` or `yarn`, or it can be used directly via CDN.

```json
npm install form-gear
```

```jsx
import { FormGear } from 'form-gear'
import {  } from './node_modules/form-gear/dist/style.css'

const data = Promise.all([
                fetch("./data/template.json").then((res) => res.json()),
                fetch("./data/preset.json").then((res) => res.json()),
                fetch("./data/response.json").then((res) => res.json()),
                fetch("./data/validation.json").then((res) => res.json())
                fetch("./data/remark.json").then((res) => res.json())
            ]);

data.then(([template, preset, response, validation, remark]) => initForm(template, preset, response, validation, remark));

function initForm(template, preset, response, validation, remark){
    
   let baseUrl = `https://api-survey.bps.go.id/designer/api/lookup-data/json`;
   let username = 'AdityaSetyadi';

   //set client mode
   // CAWI => 1
   // CAPI => 2
   let clientMode = 1;

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

   var cameraFunction = null;
   var cameraGPSFunction = null;
   var respons = null;
   var remarks = null;


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

   let token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.`

   const setBearer = () => {
   return ({
      method: 'GET',
      headers: {
         "Content-Type": "application/json",
         "Authorization": "Bearer " + token
      }
   })
   }

   let setResponse = function(res, rem) {
   respons = res
   remarks = rem

   // console.log('respons', respons)
   // console.log('remarks', remarks)
   }

   // pencarian online
   let onlineSearch = async (url) =>
   (await fetch(url, setBearer())
   .then((res: any) => {
      let temp = res.json();
      return temp;
   }).then((res: any) => {
      return res;
   }));
    
    let form = FormGear(template, preset, response, validation, remark, username, baseUrl, clientMode, uploadHandler, GpsHandler, onlineSearch, setResponse);
    return form;
}
```

# Template

FormGear use defined template which is based on JSON Object. 

```
template.json
│   title
│   acronym
│
└───components
│   │   section
│   └───components
│       │   textInput
│       │   checkboxInput
│       │   selectInput
│       │   ...
└───
│   │   section
│   └───components
│       │   textInput
│       │   checkboxInput
│       │   nestedInput
│       └───
│           │   sourceQuestion
│           └───components
│               │   textInput
│               │   checkboxInput
│               │   nestedInput
│               └───
│                   │   sourceQuestion
│                   └───components
│                       │   textInput
│                       │   dateInput
│                       │   ...
│               │   ...
│       │
│       │   dateInput
│       │   ...
└───
│   │   section
│   └───components
│       │   textInput
│       │   checkboxInput
│       │   selectInput
│       │   ...
│

```

### Control Type

| Control Type | Code | Description |
| --- | --- | --- |
| Section | 1 | Adds section to form. |
| NestedInput | 2 | Adds nested input field to existing field. |
| InnerHTML | 3 |  |
| VariableInput | 4 | Variable input. |
| DateInput | 11 | Date input. |
| DateTimeLocalInput | 12 | Date and time input field with no time zone. |
| TimeInput | 13 | Time input field. |
| MonthInput | 14 | Month input field. |
| WeekInput | 15 | Week input field. |
| SingleCheckInput | 16 |  |
| ToggleInput | 17 | Toggle input. |
| RangeSliderInput | 18 | Range slider input, lets user to select a value or range of value from a specified min and max. |
| UrlInput | 19 | URL input field. |
| CurrencyInput | 20 | Currency input field, limited to IDR and USD. |
| ListTextInputRepeat | 21 |  |
| ListSelectInputRepeat | 22 |  |
| MultipleSelectInput | 23 |  |
| MaskingInput | 24 |  |
| TextInput | 25 | Single-line input field. |
| RadioInput | 26 | Radio button, lets user choose one options of limited choices. |
| SelectInput | 27 | Drop-down input. |
| NumberInput | 28 | Numeric input field. |
| CheckboxInput | 29 | Checkbox input field, lets user choose one or more options of limited choices. |
| TextAreaInput | 30 | Adjustable text area input field. |
| EmailInput | 31 | Email address input field. |
| PhotoInput | 32 | Photo input. |
| GpsInput | 33 | GPS input. |

### Option

Defines properties for 

- `label`: label of an option
- `value`: value
- `open`:

### Range

Define properties for `RangeSliderInput` 

- `min`: min of a range
- `max`: max of a range
- `step`: value for each step

### Component Type

| Component Type | Corresponding ControlType  | input type | Description | Notes |
| --- | --- | --- | --- | --- |
| dataKey | All | string |  |  |
| label | All | string |  |  |
| hint | All | string | Provide hint on how to fill the corresponding field. |  |
| type | All | ControlType | any |  |  |
| components | 1, 2 | ComponentType |  |  |
| rows | 30 | number |  |  |
| cols | 26, 29 | number |  |  |
| options | 22, 23, 26, 29 | Option[] |  |  |
| range | 18 | Range[] | Define the min, max, and value of each step for a RangeSliderInput. |  |
| description | 1, 2 | string | Adds description for a Section or NestedInput. |  |
| answer | All | any |  | 22, 23 wajib seperti ini: [{"label": "lastId#0","value": "0"}] |
| sourceQuestion | 2 | string | Define the source question for a NestedInput field. |  |
| sourceOption | 22, 23, 26, 27, 29 | string |  |  |
| typeOption | 22, 23, 26, 27, 29 | number |  |  |
| currency | 20 | string | Define the currency that will be used in a CurrencyInput field, limited to IDR and USD. |  |
| separatorFormat | 20 | string | Define the separator that will be used in a CurrencyInput field. |  |
| isDecimal | 20 | boolean |  |  |
| maskingType | 24 | string |  |  |
| expression | 4 | string |  |  |
| componentVar | 4 | string[] |  |  |
| render | 4 | boolean |  |  |
| renderType | 4 | number |  |  |
| parentOption | 27 | string |  |  |
| pathOption | 27 | string |  |  |
| enable | All | boolean |  |  |
| enableCondition | All | string |  |  |
| componentEnable | All | string[] |  |  |
| enableRemark | All | boolean |  |  |
| client | 32 | string |  |  |
| titleModalDelete | 21, 22 | string |  |  |
| contentModalDelete | 21, 22 | string |  |  |

# Preset

Preset is used to provide prefilled data given prior to data collection.  This prefilled data usually obtained from previous data collection or a listing conducted before the actual data collection. Preset consists of`dataKey` of the corresponding field and the prefilled`answer` to that field.

```
preset.json
│
└───predata
│   │
│   └───
│       │   dataKey
│       │   answer
│   │
│   └───
│       │   dataKey
│       │   answer
│
```

```json
{
   "description":"sample template",
   "dataKey":"sample_tpl1",
   "predata":[
      {
         "dataKey":"nama_lengkap",
         "answer":"Setyadi"
      }
   ]
}
```

# Response

Response is used to store any response given during data collection. Preset consists of`dataKey` of the corresponding field and the `answer` collected from that field. `answer` from a field that has both `label` and `value` will record both.

```
response.json
│
└───answers
│   │
│   └───
│       │   dataKey
│       │   answer
│   │
│   └───
│       │   dataKey
│       │   answer
│

```

```json
{
   "description":"sample template",
   "dataKey":"sample_tpl1",
   "answers":[
      {
         "dataKey":"agree",
         "answer":true
      },
      {
         "dataKey":"nm_lengkap",
         "answer":"Agung"
      },
      {
         "dataKey":"anggota",
         "answer": {
            "value" : "3",
            "label" : "Clementine Bauch"
         }
      },
      {
         "dataKey":"alamat",
         "answer":"Jalan Otista"
      },
      {
         "dataKey":"penggunaan_lahan",
         "answer":[
            {
               "label": "lastId#1",
               "value": "0"
            },
            {
               "label": "Sawah",
               "value": "1"
            },
            {
               "label": "Padang Rumput Permanen",
               "value": "3"
            }
         ]
      },
   ]
}

```

# Validation

Validation is used to validate the answer given during data collection against a test function. The validation is handled in a FALSE condition, meaning the test function is a condition we do not want

- `dataKey` validation key
- `message` is the warning message that will show up when
- `testString`: test function written in JavaScript expression, with alphabet as a placeholder for components
- `componentList`: test function’s components, components are written in order of the alphabet used in `testString`

```
validation.json
│
└───testFunctions
│   │
│   └───
│       │   dataKey
│       │   message
│       │   testString
│       │   componentList
│   │
│   └───
│       │   dataKey
│       │   message
│       │   testString
│       │   componentList
│

```

```json
{
    "description":"sample template",
    "dataKey":"sample_tpl1",
    "testFunctions":[
        {
            "dataKey":"usia",
            "message":"Usia min 10 tahun",
            "testString":"parseInt(a) < 10",
            "componentList":["usia"]
        }
    ]
 }
```