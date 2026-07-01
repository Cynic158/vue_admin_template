import { IMAGE_TYPE, FILE_TYPE } from "../utils/fileType";

interface EditDialogInstance {
  updateFormVal: (key: string, val: any) => void;
}

interface FormType {
  [key: string]: any;
}

interface FormItemType {
  key: string;
  label: string;
  // files往后为自定义类型
  type:
    | "number"
    | "string"
    | "numstr"
    | "boolean"
    | "textarea"
    | "json"
    | "select"
    | "array"
    | "object"
    | "image"
    | "imgarr"
    | "file"
    | "files"
    | "code"
    | "password"
    | "button";
  required: boolean;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
  // 对于需要条件判断进行禁止的
  disabledFunc?: (formData: FormType) => boolean;
  // 仅string和textarea
  inputConfig?: {
    maxlength?: number;
    showWordLimit?: boolean;
    validator?: (val: string) => boolean;
  };
  // 仅number
  numberConfig?: {
    min?: number;
    max?: number;
    precision?: number;
  };
  // 仅numstr
  numberStringConfig?: NumberStringOptionsType;
  // 仅boolean
  booleanConfig?: {
    falseLabel: string;
    trueLabel: string;
    falseVal?: string | number | boolean;
    trueVal?: string | number | boolean;
  };
  // 仅textarea和json
  textareaConfig?: {
    minRows: number;
    maxRows: number;
  };
  // 仅select
  selectConfig?: {
    // 传入props.selectOptions对象，通过key取参
    optionsKey: string;
    multiple?: boolean;
    multipleLimit?: number;
    collapseTags?: boolean;
    maxCollapseTags?: number;
  };
  // 仅image和imgarr和file和files
  fileConfig?: {
    type: Array<IMAGE_TYPE | FILE_TYPE>;
    limit?: number;
    maxSize?: number;
    api?: (formData: FormData) => Promise<RspType<string>>;
    url?: string;
    listSize?: string;
  };
  // 仅code
  codeConfig?: {
    bindKey: string;
  };
  // 仅password
  pwdConfig?: {
    validator?: (val: string) => [boolean, string];
  };
  // 仅array
  arrayConfig?: {
    arrMap: Array<FormItemType>;
    labelWidth: string;
    insertVal: any;
  };
  // 仅object
  objectConfig?: {
    // 此时key和label无作用
    valType: FormItemType;
    insertVal: any;
  };
  // 仅button
  buttonConfig?: {
    title: string;
    type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | '';
    action: (formdata?: object) => void;
  };
}

export { EditDialogInstance, FormType, FormItemType };
