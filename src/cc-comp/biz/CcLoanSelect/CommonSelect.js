import React from 'react';
import { CcSelect } from '@/cc-comp/basic';
import { isEmptyArray, getEllipsis } from '@/utils/utils';
import Ellipsis from '@/components/Ellipsis';


const { Option } = CcSelect;


/**
 * @description
 * @author LC@1981824361
 * @date 2019-06-01
 * @param valueProp 取值用属性名
 * @param titleProp 显示用属性名
 * @class CommonSelect
 * @extends {React.Component}
 */
class CommonSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      options: [],
    };
  }

  componentDidMount() {
    const { titleProp, valueProp, options } = this.props;
    if (!isEmptyArray(options)) {
      this.setState({
        options: options.map((dicItem, index) => (
          <Option key={index} value={dicItem[valueProp]}>
            {dicItem[titleProp]}
          </Option>
        )),
      });
    }
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.options) {
      const { titleProp, valueProp } = this.props;
      this.setState({
        options: nextprops.options.map((dicItem, index) => (
          <Option key={index} value={dicItem[valueProp]}>
            {dicItem[titleProp]}
          </Option>
        )),
      });
    }
  }

  handleSearchChange= (value) => {
    const { options } = this.state;
    const { titleProp, valueProp } = this.props;
    let searchOptions;
    if (!value) {
      searchOptions = [];
    } else {
      searchOptions = options.map((dicItem) => {
        return <Option value={dicItem[valueProp]}>{dicItem[titleProp]}</Option>;
      });
    }
    this.setState({ options: searchOptions });
  }

  getOptions=() => {
    const { notoptions, addoptions, titleProp, valueProp, options, ChooseFlag } = this.props;
    const ChooseFlagBoolean = ChooseFlag == null ? false : ChooseFlag;
    const distinctoptions = [
      {
        dictionaryCategoryNm: '请选择',
        dictionaryCategoryNo: '请选择',
        dictionaryNm: '--全部--',
        dictionaryNo: null,
      },
    ];
    let newoptions = [];
    let Options = [];
    // 过滤不显示的字典项
    if (Array.isArray(options)) {
      if (Array.isArray(notoptions)) {
        newoptions = options.filter((dicItem) => {
          return notoptions.every(tmpitem => dicItem[valueProp] !== tmpitem[valueProp]);
        });
      } else {
        newoptions = options;
      }
    }

    if (Array.isArray(addoptions)) {
      newoptions = newoptions.concat(addoptions);
    }

    // 去重
    if (Array.isArray(newoptions)) {
      if (Array.isArray(distinctoptions)) {
        newoptions = newoptions.filter((dicItem) => {
          return distinctoptions.every(tmpitem => dicItem[valueProp] !== tmpitem[valueProp]);
        });
      } else {
        newoptions = options;
      }
    }
    // unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
    if (ChooseFlagBoolean) {
      newoptions.unshift({
        dictionaryCategoryNm: '请选择',
        dictionaryCategoryNo: '请选择',
        dictionaryNm: '--全部--',
        dictionaryNo: null,
      });
    }

    if (newoptions && newoptions.length > 0) {
      Options = newoptions.map((dicItem, index) => {
        return (
          // title={dicItem[titleProp]} 去除鼠标悬停提示说明文字 去掉  title  属性
          <Option key={index} value={dicItem[valueProp]}>
            {getEllipsis(dicItem[titleProp])}
          </Option>
        );
      });
    }
    return Options;
  }
  render() {
    const {
      disabled,
      mode,
      placeholder,
      options,
      titleProp,
      valueProp,
      onChange,
      style,
      defaultValue,
      ...rest
    } = this.props;
    return (
      <CcSelect
        onChange={onChange}
        style={style}
        placeholder={placeholder}
        disabled={disabled}
        optionLabelProp="title"
        mode={mode}
        showArrow
        {...rest}
      >
        {Array.isArray(options) ? this.getOptions() : null}
      </CcSelect>
    );
  }
}

export default CommonSelect;
