/**
 * 时间相关工具类
 */
import moment from 'moment';

const formatter = 'YYYY-MM-DD';

const dateUtils = {

  // 对单个时间字段格式化处理
  formart: (date, dateFormat) => {
    if (!moment(date).isValid()) return date;
    return moment(date).format(dateFormat === undefined ? formatter : dateFormat);
  },

  // 对区间两个时间字段格式化处理
  rangerFormart: (startTime, endTime, dateFormat) => {
    if (!moment(startTime).isValid()) return startTime;
    if (!moment(endTime).isValid()) return endTime;
    return `${moment(startTime).format(dateFormat === undefined ? formatter : dateFormat)} 至 ${moment(endTime).format(dateFormat === undefined ? formatter : dateFormat)}`;
  },
};

export default dateUtils;
