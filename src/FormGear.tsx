import { render } from "solid-js/web";

import "./index.css";
import Form from "./Form";
import { FormProvider } from "./FormProvider";

import { template, setTemplate, Questionnaire } from './stores/TemplateStore';
import { preset, setPreset, Preset } from './stores/PresetStore';
import { response, setResponse, Response } from './stores/ResponseStore';
import { validation, setValidation, Validation } from './stores/ValidationStore';
import { remark, setRemark, Remark } from './stores/RemarkStore';

export function FormGear(templateFetch, presetFetch, responseFetch, validationFetch, remarkFetch, config, uploadHandler, GpsHandler, onlineSearch, setResponseMobile, setSubmitMobile, openMap) {

  console.log('form-gear@0.1.1');
  console.time('FormGear renders successfully in ');

    setTemplate({details: templateFetch});
    setPreset({details: presetFetch});
    setResponse({details: responseFetch});
    setValidation({details: validationFetch});
    setRemark({details: remarkFetch});
    
    render(() => (
      <FormProvider config={config}>
        <Form template={template} preset={preset} response={response} validation={validation} remark={remark} uploadHandler={uploadHandler} GpsHandler={GpsHandler} onlineSearch={onlineSearch} setResponseMobile={setResponseMobile} setSubmitMobile={setSubmitMobile} openMap={openMap}/>
      </FormProvider>
    ), document.getElementById("FormGear-root") as HTMLElement);

  console.timeEnd('FormGear renders successfully in ');
  
}

