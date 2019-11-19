/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { getFormItemLayout } from '@/utils/layout';
import { Col, Form, Cascader } from 'antd';
import request from '@/utils/request';
import { isRespSucc, showErrorMsg, isEmptyArray, isEmptyObject } from '@/utils/utils';
import { setSessionStorage, getSessionStorage } from '@/utils/storage';

/** 处理数据 添加 是否叶子节点 isLeaf属性  数据库字段为 isLeafNode */
const addFields = data => {
  const arr = [];
  if (data) {
    for (let i = 0; i < data.length; i++) {
      arr.push({
        ...data[i],
        isLeaf: data[i].isLeafNode === '1',
      });
    }
  }
  return arr;
};
/**
 * @description 区域级联树
 * @author LC@1981824361
 * @date 2019-11-19
 * @param district 行政区域查询(可选，类型 String '1'表示只查询一级行政区，默认省市区)
 * @param defaultInitiVal 是否默认选择重庆市
 * @param initialValue
 * 格式      // initialValue={['510000', '511000', '511024']}
            // initialValue={['500000', '500100', '']} 省市区默认值 
            // initialValue={['500000', '500100', '500122']}
            // initialValue={['500000']}
 * @class CcRegionCasCader
 * @extends {React.PureComponent}
 */
class CcRegionCasCader extends React.PureComponent {
    state = {
      options: [],
      initialLoad: true,
    };

  inited = false;

  componentDidMount() {
    this.initTree();
  }

  componentWillReceiveProps(nextProps) {
    const { initialLoad } = this.state;
    if (nextProps.initialValue && initialLoad && !this.inited) {
      if (
        nextProps.initialValue &&
              nextProps.initialValue instanceof Array &&
              nextProps.initialValue.length > 1 &&
              nextProps.initialValue[0] !== 'undefined'
      ) {
        this.addChildNodeByCodes(nextProps.initialValue);
      }
    }
  }

  initTree=() => {
    const { initialLoad } = this.state;
    const { initialValue } = this.props;
    const param = {
      dictionaryCategoryNo: 'STD_GB_AREA',
      higherLevelDictionaryNo: 'all',
    };
    let newOptions = [];
    if (initialLoad) {
      return request('/api/lc/SELECTAREATREE', {
        method: 'POST',
        data: param,
      }).then(response => {
        if (!isRespSucc(response)) {
          showErrorMsg(response);
          return;
        }
        const DataList = response.data;
        newOptions = addFields(DataList);
        setSessionStorage('defaultProvinceNodes', JSON.stringify(newOptions));
        if (initialValue instanceof Array && initialValue.length > 1 && initialValue[0]) {
          this.addChildNodeByCodes(initialValue);
        } else {
          this.setState({
            options: newOptions,
          });
        }
        return newOptions;
      });
    }
  }

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  }

  onLoadData = selectOptions => {
    const targetOptions = selectOptions[selectOptions.length - 1];
    targetOptions.loading = true;
    const param = {
      higherLevelDictionaryNo: targetOptions.dictionaryNo,
      dictionaryCategoryNo: 'STD_GB_AREA',
    };
    request('/api/lc/SELECTAREATREE', {
      method: 'POST',
      data: param,
    }).then(response => {
      if (!isRespSucc(response)) {
        showErrorMsg(response);
        return;
      }
      targetOptions.loading = false;
      const DataList = response.data;
      targetOptions.children = addFields(DataList);
      this.setState({
        // eslint-disable-next-line react/no-access-state-in-setstate
        options: [...this.state.options],
      });
    });
  }

  addChildNodeByCodes=(codeArr) => {
    this.inited = true;
    let newOptions = null;
    if (getSessionStorage('defaultProvinceNodes')) {
      newOptions = JSON.parse(getSessionStorage('defaultProvinceNodes'));
      this.appendNodeByParent(codeArr, addFields(newOptions));
    } else {
      this.initTree().then(options => {
        this.appendNodeByParent(codeArr, options);
      });
    }
  }

  
  /**
   * @description 异步获取下一节点
   * @memberof CcRegionCasCader
   */
  appendNodeByParent=(codeArr, options) => {
    let newOptions = options;
    const param = {
      dictionaryCategoryNo: 'STD_GB_AREA',
      higherLevelDictionaryNo: null,
    };
    if (codeArr instanceof Array && codeArr.length > 1) {
      const [ProvinceCd, CityCd] = codeArr;

      if (ProvinceCd) {
        param.higherLevelDictionaryNo = ProvinceCd;
        this.addChildNode(param, newOptions).then(CityOptions => {
          newOptions = newOptions.map(item => {
            const itemTemp = item;
            if (item.dictionaryNo === ProvinceCd) {
              itemTemp.children = addFields(CityOptions);
            }
            return itemTemp;
          });
          if (CityCd && codeArr.length > 2) {
            param.higherLevelDictionaryNo = CityCd;
            this.addChildNode(param, newOptions).then(DistrictOptions => {
              newOptions = newOptions.map(item => {
                if (item && item.children) {
                  try {
                    item.children.map(child => {
                      const childTemp = child;
                      if (childTemp.dictionaryNo === CityCd) {
                        childTemp.children = addFields(DistrictOptions);
                        throw new Error('匹配成功');
                      }
                      return childTemp;
                    });
                  } catch (e) {
                    console.log(e);
                  }
                }
                return item;
              });
              this.setState({
                options: newOptions,
                initialLoad: false,
              });
            });
          }
          return newOptions;
        });
      }
    }
  }

  addChildNode=(param) => {
    let children = null;
    return request('/api/lc/SELECTAREATREE', {
      method: 'POST',
      data: param,
    }).then(response => {
      if (!isRespSucc(response)) {
        showErrorMsg(response);
        return;
      }
      const DataList = response.data;
      children = addFields(DataList);
      return children;
    });
  }

  createFormItem =(formItemLayout) => {
    const {
      form,
      form: { getFieldDecorator },
      field,
      required,
      district,
      disabled,
      initialValue,
      label,
      size,
      width,
      defaultInitiVal,
      ...rest
    } = this.props;

    const { options } = this.state;
    let initialValuePrc;
    if (defaultInitiVal) {
      initialValuePrc = isEmptyArray(this.props.initialValue) || isEmptyObject(this.props.initialValue) ? ['500000'] : this.props.initialValue;
    } else {
      initialValuePrc = this.props.initialValue;
    }
    const styleWidth = width == null ? '100%' : width;
    return (
      <Form.Item {...formItemLayout} label={label} required={required} style={{ width: styleWidth }}>
        {
              getFieldDecorator(field, {
                initialValue: typeof initialValue === 'function' ? initialValuePrc() : initialValuePrc,
                validateFirst: true,
                rules: [
                  {
                    required,
                    message: `请选择${label}`,
                  },
                ],
              })(
                <Cascader
                  filedNames={{ label: 'dictionaryNm', value: 'dictionaryNo' }}
                  options={options}
                  loadData={district === '1' ? null : this.onLoadData}
                  onChange={this.onChange}
                  changeOnSelect
                  // size={!size ? 'small' : size}
                  style={{ width: styleWidth }}
                  placeholder="请选择"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  {...rest}
                />
              )
        }
      </Form.Item>
    );
  }

  createLayout=() => {
    const columnLayout = this.props.columnLayout == null ? 1 : this.props.columnLayout;
    const columnIndex = this.props.columnIndex == null ? 0 : this.props.columnIndex;
    const colLayout = getFormItemLayout(columnLayout, columnIndex);
    const C1FormItemLayout = getFormItemLayout(1);
    if (columnLayout === 1) {
      return <div>{this.createFormItem(C1FormItemLayout)}</div>;
    }
    return (
      <div>
        <Col {...colLayout}>{this.createFormItem(C1FormItemLayout)}</Col>
      </div>
    );
  }
  render() {
    return this.createLayout();
  }
}

export default CcRegionCasCader;
