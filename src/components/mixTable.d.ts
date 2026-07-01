interface SelectConfigType {
  key: string;
  label: string;
  type: "number" | "string" | "select" | "enable" | "yesno" | "time" | "range";
  // 仅number
  numberConfig?: {
    min?: number;
    max?: number;
    precision?: number;
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
  // 仅time和range
  timeConfig?: {
    timeFormat?: MomentFormatType;
    dateType?: "year" | "month" | "date";
  };
}

interface SelectExtraBtnsType {
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | '';
  title: string;
  action: Function;
}

interface TableRowsType {
  type?:
    | "enable"
    | "yesno"
    | "time"
    | "link"
    | "json"
    | "image"
    | "hide"
    | "option"
    | "slot"
    | "option-slot";
  name: string;
  key: string;
  width: string;
  overflow?: boolean;
  sortable?: boolean;
  format?: (row: any, index: number) => string;
  timeFormat?: MomentFormatType;
  url?: string;
  imageSize?: [number, number];
  hideKey?: string;
}

export {
  SelectConfigType,
  SelectExtraBtnsType,
  TableRowsType,
}
