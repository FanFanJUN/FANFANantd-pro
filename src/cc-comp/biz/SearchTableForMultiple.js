import React, { Component } from 'react';
import Dropdown from 'rc-dropdown';
import 'rc-dropdown/assets/index.css';
import { Button, Tag, Col, Icon, Input, message, Row } from 'antd';
import { isEmpty, checkNull } from '@/utils/utils';
import './SearchTable.css';
import { isEqual } from 'lodash';
import SimpleTable from './SimpleTable';
import ScrollBar from 'react-perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import PropTypes from 'prop-types';
import { defaultPageSize } from '@/constants/comm';

class SearchTableForMultiple extends Component {
  params = null;
  value = '';

  constructor(props) {
    super(props);
    this.state = {
        pageInfo: {'page': 1, 'rows': defaultPageSize},
      searchValue: '',
      textValue: '',
      value: '',
      loading: false,
      selectedRows: [],
      show: false,
      style: {},
      dataSource: [],
      filterData: [],
    };
    this.params = props.params;
  }

  //传入参数，级联操作
  componentWillReceiveProps(nextProps) {

    if (nextProps.value && typeof nextProps.value === 'string' && nextProps.value.indexOf(',') === -1) {
      if (this.state.value !== nextProps.value) {
        this.initValue(nextProps.value, nextProps);
      }

    } else if (this.state.textValue && !nextProps.value) {
      if (this.state.searchValue || this.state.searchValue.length > 0) {
        // this.getDataSource();
        this.setState({ textValue: '', value: '', searchValue: '', selectedRows: [] });
      } else {
        this.setState({ textValue: '', value: '', selectedRows: [] });
      }
    }

    if (nextProps.params &&
      this.props.params &&
      !isEqual(nextProps.params, this.props.params)
    // Object.values(nextProps.params).toString() !== Object.values(this.props.params).toString()
    ) {
      this.params = nextProps.params;
      if (this.props.initValue) {
        console.log(111);
        this.getInitData();
      } else {
        console.log(22);
        if (!this.props.noRequest) {
          this.getDataSource();
        }

        //this.initValue(nextProps.value)
      }
      if (Object.values(this.props.params)[0]) {
        this.setState({ searchValue: '', pageInfo: {} }, () => {
          if (this.props.value === nextProps.value && !isEmpty(nextProps.value)) {
            if (this.props.onChange) {
              this.props.onChange('');
            }
          }
        });
      }

    }
  }

  componentDidUpdate() {
    if (this.state.show && this.innerInput) {
      this.innerInput.input.focus();
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (this.mainContent && !this.mainContent.contains(e.target)) {
      if (this.state.show) {
        this.setState({ show: false });
      }
    }
  };

  componentWillMount() {
    if (!this.props.value) {
      this.setState({ textValue: '', value: '' });
    }
    const { initValue, value, textValue } = this.props;
    if (initValue && !this.props.value) {
      this.getInitData();
    } else {
      if (!this.props.noRequest) {
        this.getDataSource();
      }

      this.setState({ value: value, textValue: textValue });
    }
  }

  initValue = (value, nextProps) => {
    const { config, textValue } = this.props;
    // console.log(" keyValue.push(selectedRows[i][key]);",this.state.value,value);
    if (value && config.text === config.key) {//当text和key相等时候就直接处理
      this.setState({ value: [...value], textValue: [...value] });
    }
    else if (value && config.text !== config.key) {//当text和key不相等时候就分别处理 --------
      this.setState({ value: value, textValue: nextProps.textValue });
    }

  };

  getInitData(value) {
    const { key, text } = this.props.config;
    if (this.props.dataSource) {
      if (this.props.dataSource.length === 0) {
        this.setState({ dataSource: [], filterData: [], textValue: '', value: '' },
          //状态更新完毕之后执行
          () => {
            if (this.props.onChange) {
              this.props.onChange('', '');
            }
            if (this.props.selectChange) {
              this.props.selectChange('');
            }
          });
      } else {
        let res = this.props.dataSource;
        let textVal = '';
        if (text.includes('.')) {
          textVal = res[0][text.split('.')[0]][text.split('.')[1]];
        }
        else if (text.includes(',')) {
          textVal = res[0][text.split(',')[0]] || '' + ' ' + res[0][text.split(',')[1]] || '';
        }
        else {
          textVal = res[0][text];
        }
        this.setState({ dataSource: res, filterData: res, textValue: textVal, value: res[0][key] },
          //状态更新完毕之后执行
          () => {
            if (this.props.onChange) {
              this.props.onChange(res[0][key], res[0]);
            }
            if (this.props.selectChange) {
              this.props.selectChange(res[0]);
            }
          });
      }

    } else {
      let frozen = { Q_EQ_frozen__bool: 0 };
      if (this.props.config.deleteFrozen) {
        frozen = { deleteFlag: false };
      }
      this.props.config.dataService({ ...value, ...this.params, ...frozen }).then((res) => {
        if(res && res.status === 'FAILURE') {
          this.setState({textValue : ''});
          message.error(res.message);
          return;
        }
        let list;
        let whetherUseList = false;
        if (res && res.rows) {
          list = res.rows;
        } else if (res && res.data && res.data.rows) {
          list = res.data.rows;
        } else if (res && res.data && res.data.length >= 0) {
          whetherUseList = true;
          list = res.data;
        } else {
          list = res;
        }
        let result = this.bulidByCloumns(list);
        if (result && result.length > 0) {
          let textVal = '';
          if (text.includes('.')) {
            textVal = result[0][text.split('.')[0]][text.split('.')[1]];
          }
          else if (text.includes(',')) {
            textVal = result[0][text.split(',')[0]] || '' + ' ' + result[0][text.split(',')[1]] || '';
          }
          else {
            textVal = result[0][text];
          }
          this.setState({
              dataSource: whetherUseList ? list : res,
              filterData: whetherUseList ? list : res,
              textValue: textVal,
              value: list[0][key],
            },
            //状态更新完毕之后执行
            () => {
              if (this.props.onChange) {
                this.props.onChange(list[0][key], list[0]);
              }
              if (this.props.selectChange) {
                this.props.selectChange(list[0]);
              }
            });
        }
      });
    }
  };

  getDataSource(value, pageInfo) {
    this.setState({ loading: true });

    if (this.props.dataSource) {
      let res = this.props.dataSource;
      this.setState({ dataSource: res, filterData: res });
      this.setState({ loading: false });
      if (this.props.value && this.props.selectChange) {
        let list = res;
        let index = list.findIndex(item => item.id === this.props.value);
        if (index !== -1) {
          this.props.selectChange(list[index]);
        }
      }
      this.initValue(this.props.value, this.props);
    }
    else {
        let newPageInfo = pageInfo || this.state.pageInfo;
      let frozen = { Q_EQ_frozen__bool: 0 };
      if (this.props.config.deleteFrozen) {
        frozen = { deleteFlag: false };
      }
      this.props.config.dataService({
          ...value, ...newPageInfo, ...this.params,
        ...frozen,
      }).then((data) => {
        let res = data;

        // if (data.success) {
        //   res = data.data;
        // }
        // if (data.status === 'SUCCESS') {
        //   res = data.data || data;
        // } else if(data.status === 'FAILURE') {
        //   res = [];
        //   console.log(`请求接口${this.props.config.dataService},${data.message}`);
        //   message.error(data.message);
        // }
        // if (this.props.message) {
        //   if (data.status === 'FAILURE') {
        //     res = [];
        //     message.error(data.message);
        //   } else {
        //     res = data;
        //   }
        // }
        // if (data.rows && data.rows.length !== 0 && this.props.applicationScenarios === 'DEMAND') {
        //   res = data.rows
        // }
        if (res && res.data && res.data.dataSource) {
            res = res.data.dataSource;
          }
        //选中行在下拉框的匹配, 前端分页的时候匹配，后端分页不匹配
        // if(Array.isArray(res) && this.props.value){
        //     let key = this.props.config.key;
        //     let selectedRows = res.filter(item => this.props.value.includes(item[key]));
        //     this.setState({selectedRows});
        // }else if(res.rows && !res.records && Array.isArray(res.rows) && this.props.value){
        //   let key = this.props.config.key;
        //   let selectedRows = res.rows.filter(item => this.props.value.includes(item[key]));
        //   this.setState({selectedRows});
        // }else if(res.rows && res.records && Array.isArray(res.rows) && this.props.value && this.props.applicationScenarios === 'DEMAND_COMPANY'){
        //     let key = this.props.config.key;
        //     let selectedRows = res.rows.filter(item => this.props.value.includes(item[key]));
        //     this.setState({selectedRows});
        // }

        this.setState({ dataSource: res, filterData: res});
        this.setState({ loading: false });
        if (this.props.value && this.props.selectChange) {
          let list;
          if (res && res.rows) {
            list = res.rows;
          }
          else if (res && res.status === 'SUCCESS') {
            list = res.data;
          } else {
            list = res;
          }
          let index = list.findIndex(item => item.id === this.props.value);
          if (index !== -1) {
            this.props.selectChange(list[index]);
          }
        }
        this.initValue(this.props.value, this.props);
      }).catch(err => {
        this.setState({ loading: false });
      });
    }
  };

  pageChange = (pagination) => {
    this.setState({ pageInfo: pagination });
    if (!this.props.config.searchService) {

      this.getDataSource(
        { Quick_value: this.state.searchValue, quickSearchValue: this.state.searchValue },
        this.props.config.isPageInfo ? { pageInfo: { 'page': pagination.page, 'rows': pagination.rows } } : pagination,
      );
    }
  };

  handleSearch = (values) => {
    if (this.props.config.searchService) {
      let searchParam = { keyword: values };
      this.props.config.searchService(this.state.dataSource, searchParam).then(data => {
        this.setState({ filterData: data.rows ? data.rows : data });
      });
    } else {
      let searchParam = {};
      if (this.props.config.Quick_value) {
        searchParam = { [this.props.config.Quick_value]: values };
      }
      if (this.props.config.quickSearchProperties) {
        Object.assign(searchParam, this.props.config.quickSearchProperties);
      }

      else {
        searchParam = { Quick_value: values };
      }

      this.getDataSource(searchParam);
    }
    this.setState({ searchValue: values });
  };

  refreshData = (value) => {
    this.getDataSource(value);
  };

  rowOnChange = (selectedRows) => {
    const { key, text } = this.props.config;
    if (!this.props.multiple) {
      if (selectedRows.length > 0) {
        let textVal = '';
        if (text.includes('.')) {
          textVal = selectedRows[0][text.split('.')[0]][text.split('.')[1]];
        }
        else if (text.includes(',')) {
          textVal = `${selectedRows[0][text.split(',')[0]] || ''} ${selectedRows[0][text.split(',')[1]] || ''}`;
        }
        else {
          textVal = selectedRows[0][text];
        }
        this.setState({
          show: false,
          textValue: textVal,
          value: selectedRows[0][key],
          selectedRows: [],
        }, () => {
          if (this.props.onChange) {
            this.props.onChange(selectedRows[0][key], selectedRows[0]);
          }
        });
      }
    } else {
      let textValue = [];
      let keyValue = [];
      for (let i = 0; i < selectedRows.length; i++) {
        let textVal = [];
        /*if (text.includes('.')) {
          textVal = selectedRows[i][text.split('.')[0]][text.split('.')[1]];
        }
        else if (text.includes(',')) {
          textVal = selectedRows[i][text.split(',')[0]] || '' + ' ' + selectedRows[i][text.split(',')[1]] || '';
        }
        else {*/
          textVal = selectedRows[i][text];
     //   }
        textValue.push(textVal);
        keyValue.push(selectedRows[i][key]);
      }
      this.setState({ textValue: textValue, value: keyValue, selectedRows }, () => {
        if (this.props.onChange) {
          this.props.onChange(keyValue, selectedRows);
        }
      });
    }
    if (this.props.selectChange) {
      if (!this.props.multiple) {
        this.props.selectChange(selectedRows[0]);
      } else {
        this.props.selectChange(selectedRows);
      }

    }
  };

  emptyValue = () => {
    this.setState({ textValue: '', value: '', selectedRows: [] }, () => {
      if (this.props.onChange) {
        this.props.onChange('');
      }
      if (this.props.selectChange) {
        this.props.selectChange([]);
      }
    });
  };

  bulidByCloumns = (list) => {
    const { columns } = this.props.config;
    for (let i = 0; i < list.length; i++) {
      let data = list[i];
      columns.map(item => {
        if (item['render']) {
          item.render(data[item['dataIndex']], data);
        }
      });
    }
    return list;
  };

  handleSure = () => {
    this.setState({ show: false, selectedRows: [] });
  };
  handelClear = () => {
    this.setState({
      selectedRows: [],
      value: [],
      textValue: [],
      show: false,
    });
    if (this.props.onChange) {
      this.props.onChange([], []);
    }
    if (this.props.selectChange) {
      this.props.selectChange([], []);
    }
  };
  searchChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  dropDown = () => {

    const { columns } = this.props.config;
    const { filterData } = this.state;
    const { multiple } = this.props;

    const style = {...this.state.style, border:"1px solid #40a9ff",boxShadow:"0 0 0 2px rgba(24,144,255,.2)"}

    return <div id={'SearchTableChild'} ref={(ref) => this.mainContent = ref} style={style}>
      <Row style={{ background: '#F3F8FC', padding: 1 }}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <div style={{ width: multiple ? `calc(100% - 80px)` : '100%', float: 'left' }}>{this.search()}</div>
          {multiple ? <div style={{ textAlign: 'right', float: 'right' }}>
            <Button key="sure" onClick={this.handelClear}>清空</Button>
          </div> : null}
        </Col>
      </Row>
      <SimpleTable
        radio={this.props.radio}
        noSequence={this.props.noSequence}
        checkBox={this.props.multiple || 'radio'}
        rowsSelected={this.state.selectedRows}
        loading={this.state.loading}
        onSelectRow={this.rowOnChange}
        data={filterData}
        noCheckBox={this.props.noCheckBox}
        columns={columns}
        heightY={180}
        pageChange={this.props.config.searchService ? null : this.pageChange}
        sequenceWidth={this.props.config.sequenceWidth}
      />
    </div>;
  };

  showDrop = (e) => {
    if (this.props.noRequest) {
      let { pageInfo } = this.state;
      if (!this.props.config.searchService) {
        this.getDataSource(
          { Quick_value: this.state.searchValue, quickSearchValue: this.state.searchValue },
          this.props.config.isPageInfo ? { pageInfo: { 'page': pageInfo.page, 'rows': pageInfo.rows } } : pageInfo,
        );
      } else {
        this.getDataSource();
      }
    }
    this.setState({ show: true });
  };

  search = () => {
    return (<Input.Search
      key="TableSearchI"
      placeholder="请输入查询关键字"
      value={this.state.searchValue}
      onChange={this.searchChange}
      onSearch={value => this.handleSearch(value)}
      ref={(ref) => this.innerInput = ref}
      style={{ marginRight: '5px' }}
      enterButton
    />);
  };
  handleClose = (tag) => {
    const { textValue, value, selectedRows } = this.state;
        // console.log(tag, textValue, value, selectedRows, 'tag')
    const Index = textValue.findIndex((item) => item === tag);
        // console.log(Index, 'Index')
    textValue.splice(Index, 1);
    value.splice(Index, 1);
    selectedRows.splice(Index, 1);
    this.setState({
      textValue,
      value,
      selectedRows,
    });
    if (this.props.onChange) {
      this.props.onChange(value, selectedRows);
    }
    if (this.props.selectChange) {
      this.props.selectChange(selectedRows);
    }
  };

  render() {
    const suffix = !this.props.disabled && ([
      this.props.value && <Icon key="emptyClick" type="close" onClick={this.emptyValue}/>,
      <Icon key="selectClict" type="down" onClick={this.showDrop}/>,
    ]);
    const { textValue } = this.state;
    const stringToArray = (list) => {
      if (!checkNull(list)) {
        if (list && list instanceof Array) {
          return list;
        }
        else {
          return list.split(',');
        }
      }
      else {
        return [];
      }
    };
    const { disabled, tagHeight } = this.props;
    const contentStyle = {
      border: '1px solid #ccc',
      borderRadius: 5,
      background: disabled ? '#f5f5f5' : 'none',
      minHeight: tagHeight || 32,
      height:tagHeight||'auto',
      paddingLeft: 11,
      outLine: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      position: 'relative',
      lineHeight: 2,
    };
    const iconStyle = {
      width: 12,
      cursor: 'pointer',
      float: 'right',
      right: '11px',
      marginTop: 6,
      position: 'absolute',
      color: 'rgba(0, 0, 0, 0.25)',
    };
    const placeholderStyle = {
      display: stringToArray(textValue).length !== 0 ? 'none' : 'block',
      userSelect: 'none',
      color: '#bfbfbf',
      position: 'absolute',
      maxWidth: '100%',
      overflow: 'hidden',
      lineHeight: '30px',
      whiteSpace: 'nowrap',
      textAlign: 'left',
      textOverflow: 'ellipsis',
    };

    return (
      <Dropdown
        overlay={this.dropDown()}
        animation="slide-up"
        visible={this.state.show}
      >
        {this.props.multiple ?
          <div
               suppressContentEditableWarning={true}
               contentEditable={this.props.disabled ? 'false' : 'true'}
               style={{...contentStyle}}
               onClick={disabled ? () => {
               } : this.showDrop}>
            <ScrollBar style={{height:'100%',position:'relative',width:'100%',minHeight:'32px'}}>
           {/* <div style={{ minHeight: tagHeight || 32, height: tagHeight, overflow: tagHeight ? 'auto' : 'hidden' ,width:tagHeight?'102%':'100%'}}>*/}
                <div unselectable="on"
                     contentEditable="false"
                     suppressContentEditableWarning
                     style={placeholderStyle}
                >{this.props.placeholder || '请选择'}
                </div>
                {stringToArray(textValue).length !== 0 && stringToArray(textValue).map((item, index) =>
                  <Tag key={index} contentEditable="false" suppressContentEditableWarning closable={!this.props.disabled} style={{}} onClose={e => {
                    e.preventDefault();
                    this.handleClose(item);
                  }}>
                    {item}
                  </Tag>,
                )
                }
                <Icon contentEditable="false" suppressContentEditableWarning type={this.state.show ? 'up' : 'down'} style={iconStyle}/>
            </ScrollBar>
            {/*</div>*/}
          </div> :
          <Input placeholder={this.props.placeholder || '请选择'} disabled={this.props.disabled}
                 onFocus={this.showDrop}
                 readOnly style={this.props.style} title={this.state.textValue}
                 value={this.state.textValue} ref={(ref) => this.searchInput = ref} suffix={suffix}/>
        }

      </Dropdown>
    );
  }
}

SearchTableForMultiple.propTypes = {
  //默认
  placeholder: PropTypes.string,
  //选择回调方法,formItem使用，一般不用自己实现
  onChange: PropTypes.func,
  //选择回调方法，自主回调选择变化
  selectChange: PropTypes.func,
  //过滤条件动态请求参数
  params: PropTypes.object,
  // 应用场景,为‘FACTORY时触发工厂场景
  applicationScenarios: PropTypes.string,
  //
  //value: PropTypes.string,
  //
  config: PropTypes.object,

};

SearchTableForMultiple.defaultProps = {
  applicationScenarios: 'OTHER'
}


export default SearchTableForMultiple;
