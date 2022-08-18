import { Component } from "solid-js"
import NestedInput from "./components/NestedInput"
import RadioInput from "./components/RadioInput"
import TextInput from "./components/TextInput"
import SelectInput from "./components/SelectInput"
import NumberInput from "./components/NumberInput"
import CheckboxInput from "./components/CheckboxInput"
import TextAreaInput from "./components/TextAreaInput"
import EmailInput from "./components/EmailInput"
import UrlInput from "./components/UrlInput"
import DateInput from "./components/DateInput"
import DateTimeLocalInput from "./components/DateTimeLocalInput"
import TimeInput from "./components/TimeInput"
import MonthInput from "./components/MonthInput"
import WeekInput from "./components/WeekInput"
import SingleCheckInput from "./components/SingleCheckInput"
import ToggleInput from "./components/ToggleInput"
import RangeSliderInput from "./components/RangeSliderInput"
import InnerHTML from "./components/InnerHTML"
import CurrencyInput from "./components/CurrencyInput"
import ListTextInputRepeat from "./components/ListTextInputRepeat"
import ListSelectInputRepeat from "./components/ListSelectInputRepeat"
import MultipleSelectInput from "./components/MultipleSelectInput"
import MaskingInput from "./components/MaskingInput"
import VariableInput from "./components/VariableInput"
import PhotoInput from "./components/PhotoInput"
import GpsInput from "./components/GpsInput"
import CsvInput from "./components/CsvInput"
import NowInput from "./components/NowInput"
import SignatureInput from "./components/SignatureInput"
import UnitInput from "./components/UnitInput"

import {
  PAPIDateInput,
  PAPIDateTimeLocalInput,
  PAPINumberInput,
  PAPIRadioInput,
  PAPIRangeSliderInput,
  PAPITextAreaInput,
  PAPITextInput
}
  from "./components/PAPI"

export enum ControlType {
  Section = 1,
  NestedInput = 2,
  InnerHTML = 3,
  VariableInput = 4,
  DateInput = 11,
  DateTimeLocalInput = 12,
  TimeInput = 13,
  MonthInput = 14,
  WeekInput = 15,
  SingleCheckInput = 16,
  ToggleInput = 17,
  RangeSliderInput = 18,
  UrlInput = 19,
  CurrencyInput = 20,
  ListTextInputRepeat = 21,
  ListSelectInputRepeat = 22,
  MultipleSelectInput = 23,
  MaskingInput = 24,
  TextInput = 25,
  RadioInput = 26,
  SelectInput = 27,
  NumberInput = 28,
  CheckboxInput = 29,
  TextAreaInput = 30,
  EmailInput = 31,
  PhotoInput = 32, // Media
  GpsInput = 33,
  CsvInput = 34,
  NowInput = 35,
  SignatureInput = 36,
  UnitInput = 37
}

export type Option = {
  label: string
  value: string
  open: boolean
}

export type RangeInput = {
  min: number | string
  max: number | string
  step?: number
}

export type selectOption = {
  id: string,
  version: string,
  tableName?: string,
  value: string,
  desc: string,
  parentCondition: []
}

export type LengthInput = {
  maxlength?: number
  minlength?: number
}

export type ComponentType = {
  dataKey?: string              //semua
  label?: string                //semua
  hint?: string                 //semua
  disableInput?: boolean        //semua
  type?: ControlType | any      //semua
  components?: ComponentType    //1, 2
  rows?: number                 //8
  cols?: number                 //4, 7
  options?: Option[]            //4, 7, 22, 23
  rangeInput?: RangeInput[]     //18
  description?: string          //1, 2
  answer?: any                  //semua, (22, 23 wajib seperti ini: [{"label": "lastId#0","value": "0"}] )
  sourceQuestion?: string       //2
  sourceOption?: string         //22, 23, 26, 27, 29 
  typeOption?: number           //22, 23, 26, 27, 29  default=1 => (1=template, 2=api, 3=component, 4=android/offline)
  currency?: string             //20 (IDR, USD)
  separatorFormat?: string      //20 (id-ID)
  isDecimal?: boolean           //20 (true false)
  maskingFormat?: string        //24 
  expression?: string           //25 (bisa memanggil nilai dengan perintah: getValue('hobiku'))
  componentVar?: string[]       //25 (array contoh: ["hobiku"])
  render?: boolean              //25 (true false)
  renderType?: number           //25 (0 untuk single value yang label aja, 1 untuk single value yg textbox dan readonly, 2 untuk array {"label":"labelname","value":valuenya})
  sourceSelect?: selectOption[] //27
  enable?: boolean              //semua
  enableCondition?: string      //semua
  componentEnable?: string[]    //semua
  enableRemark?: boolean        //semua
  client?: string               //32
  titleModalDelete?: string     //21,22
  contentModalDelete?: string   //21,22
  lengthInput?: LengthInput[]             //special for input attribute
  principal: number             //start with 1
  columnName: string
  titleModalConfirmation: string
  contentModalConfirmation: string
  required: boolean
  disableInitial?: boolean
  urlValidation?: string       //all

}

export interface FormComponentBase extends Component<{
  onMobile: boolean
  component: ComponentType
  index: number
  onValueChange?: (value: any) => void
  onUserClick?: (dataKey: string) => void
  value?: any
  config: any
  classValidation?: any
  validationMessage?: any
  comments?: number
  MobileUploadHandler?: (value: any) => void
  MobileGpsHandler?: (value: any) => void
  MobileOfflineSearch?: (id: any, version: any, conditions: any, setter: any) => void
  MobileOnlineSearch?: (value: any) => void
  MobileOpenMap?: (value: any) => void
  openRemark?: (dataKey: string) => void
  setResponseMobile?: any
}> { }

export const CONTROL_MAP = new Map<ControlType, FormComponentBase>([
  [ControlType.NestedInput, NestedInput],
  [ControlType.TextInput, TextInput],
  [ControlType.RadioInput, RadioInput],
  [ControlType.SelectInput, SelectInput],
  [ControlType.NumberInput, NumberInput],
  [ControlType.CheckboxInput, CheckboxInput],
  [ControlType.TextAreaInput, TextAreaInput],
  [ControlType.EmailInput, EmailInput],
  [ControlType.UrlInput, UrlInput],
  [ControlType.DateInput, DateInput],
  [ControlType.DateTimeLocalInput, DateTimeLocalInput],
  [ControlType.TimeInput, TimeInput],
  [ControlType.MonthInput, MonthInput],
  [ControlType.WeekInput, WeekInput],
  [ControlType.SingleCheckInput, SingleCheckInput],
  [ControlType.ToggleInput, ToggleInput],
  [ControlType.RangeSliderInput, RangeSliderInput],
  [ControlType.InnerHTML, InnerHTML],
  [ControlType.CurrencyInput, CurrencyInput],
  [ControlType.ListTextInputRepeat, ListTextInputRepeat],
  [ControlType.ListSelectInputRepeat, ListSelectInputRepeat],
  [ControlType.MultipleSelectInput, MultipleSelectInput],
  [ControlType.MaskingInput, MaskingInput],
  [ControlType.VariableInput, VariableInput],
  [ControlType.PhotoInput, PhotoInput],
  [ControlType.GpsInput, GpsInput],
  [ControlType.CsvInput, CsvInput],
  [ControlType.NowInput, NowInput],
  [ControlType.SignatureInput, SignatureInput],
  [ControlType.UnitInput, UnitInput]
]);

// const CONTROL_MAP_PAPI = CONTROL_MAP
// CONTROL_MAP_PAPI.set(ControlType.TextInput, PAPITextInput)
// CONTROL_MAP_PAPI.set(ControlType.NumberInput, PAPINumberInput)
// CONTROL_MAP_PAPI.set(ControlType.RadioInput, PAPIRadioInput)
// CONTROL_MAP_PAPI.set(ControlType.TextAreaInput, PAPITextAreaInput)
// CONTROL_MAP_PAPI.set(ControlType.DateInput, PAPIDateInput)

// export { CONTROL_MAP_PAPI }

export const OPTION_INPUT_CONTROL = [
  ControlType.SelectInput,
  ControlType.RadioInput
]

export const CONTROL_MAP_PAPI = new Map<ControlType, FormComponentBase>([
  [ControlType.NestedInput, NestedInput],
  [ControlType.TextInput, PAPITextInput],
  [ControlType.RadioInput, PAPIRadioInput],
  [ControlType.SelectInput, SelectInput],
  [ControlType.NumberInput, PAPINumberInput],
  [ControlType.CheckboxInput, CheckboxInput],
  [ControlType.TextAreaInput, PAPITextAreaInput],
  [ControlType.EmailInput, EmailInput],
  [ControlType.UrlInput, UrlInput],
  [ControlType.DateInput, PAPIDateInput],
  [ControlType.DateTimeLocalInput, PAPIDateTimeLocalInput],
  [ControlType.TimeInput, TimeInput],
  [ControlType.MonthInput, MonthInput],
  [ControlType.WeekInput, WeekInput],
  [ControlType.SingleCheckInput, SingleCheckInput],
  [ControlType.ToggleInput, ToggleInput],
  [ControlType.RangeSliderInput, PAPIRangeSliderInput],
  [ControlType.InnerHTML, InnerHTML],
  [ControlType.CurrencyInput, CurrencyInput],
  [ControlType.ListTextInputRepeat, ListTextInputRepeat],
  [ControlType.ListSelectInputRepeat, ListSelectInputRepeat],
  [ControlType.MultipleSelectInput, MultipleSelectInput],
  [ControlType.MaskingInput, MaskingInput],
  [ControlType.VariableInput, VariableInput],
  [ControlType.PhotoInput, PhotoInput],
  [ControlType.GpsInput, GpsInput],
  [ControlType.CsvInput, CsvInput],
  [ControlType.NowInput, NowInput],
  [ControlType.SignatureInput, SignatureInput],
  [ControlType.UnitInput, UnitInput]
]);
