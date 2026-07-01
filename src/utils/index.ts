import moment from "moment";
import { MIME_TYPE_MAP } from "./fileType";
import type { FILE_TYPE } from "./fileType";

const formatDate = (date: string | Date | moment.Moment, format: MomentFormatType = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) {
    return ''
  } else {
    try {
      return moment(date).format(format)
    } catch (error) {
      return ''
    }
  }
};

/**
 * 获取指定偏移量的日期范围
 * @param monthOffset 月份偏移量（默认0，负数为未来，正数为过去）
 * @param dayOffset 日期偏移量（默认0，负数为未来，正数为过去）
 * @param format 日期格式化类型
 * @returns 包含开始和结束日期的对象
 */
const getDateRange = (
  monthOffset: number = 0,
  dayOffset: number = 0,
  format: MomentFormatType = 'YYYY-MM-DD HH:mm:ss'
) => {
  // 今天的结束时间（23:59:59）
  const todayEnd = moment().endOf('day');
  // 计算偏移后的开始时间
  const startDate = moment()
    .subtract(monthOffset, 'months')
    .subtract(dayOffset, 'days')
    .startOf('day');

  return {
    start: formatDate(startDate, format),
    end: formatDate(todayEnd, format)
  };
};

// Element Plus DateTimePicker 常规快捷选项配置
const shortcuts = [
  {
    text: '今天',
    value: () => {
      const { start, end } = getDateRange(0, 0);
      return [start, end];
    }
  },
  {
    text: '前一周',
    value: () => {
      const { start, end } = getDateRange(0, 7);
      return [start, end];
    }
  },
  {
    text: '前一个月',
    value: () => {
      const { start, end } = getDateRange(1, 0);
      return [start, end];
    }
  },
  {
    text: '前三个月',
    value: () => {
      const { start, end } = getDateRange(3, 0);
      return [start, end];
    }
  }
];

// 指定格式的快捷选项
const getShortcutsWithFormat = (format: MomentFormatType) => [
  {
    text: '今天',
    value: () => {
      const { start, end } = getDateRange(0, 0, format);
      return [start, end];
    }
  },
  {
    text: '前一周',
    value: () => {
      const { start, end } = getDateRange(0, 7, format);
      return [start, end];
    }
  },
  {
    text: '前一个月',
    value: () => {
      const { start, end } = getDateRange(1, 0, format);
      return [start, end];
    }
  },
  {
    text: '前三个月',
    value: () => {
      const { start, end } = getDateRange(3, 0, format);
      return [start, end];
    }
  }
];

const arrayToString = (arr: Array<any>, separator: string = ',') => {
  return arr.join(separator)
}

/**
 * 将字符串按分隔符分割并转换为指定类型的数组
 * @param str 待处理的原始字符串
 * @param valueType 转换的目标类型
 * @param separator 分隔符，默认逗号
 * @returns 转换后的数组（自动过滤无效值）
 */
const stringToArray = (
  str: string,
  valueType: 'string' | 'number' | 'boolean',
  separator: string = ','
) => {
  // 空字符串直接返回空数组
  if (!str) return [];

  // 分割字符串为基础数组
  let baseArr = str.split(separator);

  switch (valueType) {
    case 'string':
      // 过滤空字符串
      return baseArr.filter(item => item.trim() !== '');
    
    case 'number':
      // 转换为数字并过滤 NaN
      return baseArr
        .map(item => Number(item.trim()))
        .filter(num => !isNaN(num));
    
    case 'boolean':
      // 转换为布尔值（支持 'true'/'false' 字符串，忽略大小写）
      return baseArr.map(item => {
        const trimmed = item.trim().toLowerCase();
        return trimmed === 'true'; // 非 'true' 均返回 false
      });
    
    default:
      return [];
  }
};

const isNumericString = (
  str: string,
  options: NumberStringOptionsType = {}
) => {
  // 设置默认配置
  const {
    allowNegative = true,
    allowDecimal = true,
    allowPercent = false,
    allowZero = true
  } = options;

  // 空字符串直接返回false
  if (str === "") return false;

  // 处理百分比符号（如果允许）
  let processedStr = str;
  if (allowPercent && str.endsWith('%')) {
    processedStr = str.slice(0, -1); // 移除末尾的%
  }

  // 尝试转换为数字
  const num = Number(processedStr);
  
  // 不是有效数字直接返回false
  if (isNaN(num)) return false;

  // 检查是否为0（如果不允许0）
  if (!allowZero && num === 0) return false;

  // 检查是否为负数（如果不允许负数）
  if (!allowNegative && num < 0) return false;

  // 检查是否为小数（如果不允许小数）
  if (!allowDecimal && !Number.isInteger(num)) return false;

  // 所有条件都满足则返回true
  return true;
}

const validateJson = (str: string) => {
  try {
    JSON.parse(str)
    return true
  } catch (error) {
    return false
  }
}

const download = (data: any, fileName: string, fileType: FILE_TYPE): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const blob = new Blob([data], { type: MIME_TYPE_MAP[fileType] });
      const navigator: any = window.navigator;

      // Handle IE
      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
        resolve(true);
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
        resolve(true);
      }
    } catch (error) {
      resolve(false);
    }
  });
};

const handleToken = (action: "get" | "set", val: string = "") => {
  if (action == "get") {
    return localStorage.getItem("VTK") || "";
  } else {
    localStorage.setItem("VTK", val);
    return "";
  }
};

const getFileSize = (byte: number) => {
  // 单位从低到高，最低 KB，最高 GB
  const units = ['KB', 'MB', 'GB'];
  let size = byte / 1024; // 先转成 KB
  let unitIndex = 0;

  // 只有 >=1 才往上升级单位
  while (unitIndex < units.length - 1 && size >= 1024) {
    size /= 1024;
    unitIndex++;
  }

  // 保留1位小数，去掉末尾 .0
  const formatted = size.toFixed(2).replace(/\.0$/, '');
  return `${formatted}${units[unitIndex]}`;
};

const getFileExt = (fileName: string) => {
  if (!fileName) return '-';

  // 截取最后一个 . 后面的内容
  const ext = fileName.split('.').pop() || '-';

  // 如果是纯文件名（没有后缀）返回空
  if (ext === fileName) return '-';

  // 统一小写（可选，更通用）
  return ext.toUpperCase();
}

const getFileName = (url: string) => {
  if (!url) return ''
  // 截取最后一个 / 后面的所有内容
  return url.substring(url.lastIndexOf('/') + 1)
}

export { formatDate, shortcuts, getShortcutsWithFormat, arrayToString, stringToArray, isNumericString, validateJson, download, handleToken, getFileSize, getFileExt, getFileName };
