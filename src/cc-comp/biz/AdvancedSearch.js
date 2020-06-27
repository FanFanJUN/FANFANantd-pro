import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import StandardForm from './StandardForm';
import 'rc-dropdown/assets/index.css';

/**
 * @description 高级搜索
 * @author LC@1981824361
 * @date 2020-06-02
 * @class AdvancedSearch
 * @extends {Component}
 */
class AdvancedSearch extends Component {
    state={
      toggleForm: false,
    };

    showFrom = () => {
      this.setState({ toggleForm: !this.state.toggleForm });
    };

    componentDidMount() {
      if (this.props.initToggle) {
        this.setState({ toggleForm: true });
      }
    }


    getSearchButton = () => (
      <div style={{ marginBottom: 24 }}>
        <Button type="primary" onClick={this.onSearch}>查询</Button>
        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
      </div>
    );

    onSearch = () => {
      if (this.props.handleSearch) {
        this.form.validateFields((err, fieldsValue) => {
          if (err) return;
          this.props.handleSearch(fieldsValue);
          this.showFrom();
        });
      }
    };

    handleFormReset = () => {
      const resetArr = [];
      this.props.config.map(item => {
        if (item.initValue === true) {
        } else {
          resetArr.push(item.code);
        }
      });
      this.form.resetFields(resetArr);
    };

    render() {
      return (
        <>
          <div style={{ display: 'inline-flex' }}>
            <Button style={{ marginLeft: 8 }} onClick={this.showFrom}>高级查询
              <Icon type={this.state.toggleForm ? 'up' : 'down'} />
            </Button>
          </div>
          <div style={{ display: this.state.toggleForm ? 'block' : 'none',
            marginTop: this.props.marginTop ? this.props.marginTop : '34px',
            position: 'absolute',
            zIndex: '9',
            right: '1px',
            background: 'white',
            padding: '5px',
            boxShadow: '#666 0px 10px 10px',
            width: '100%' }}
          >
            <StandardForm ref={(ref) => this.form = ref} style={{marginTop: '18px',padding: '5px'}}
                    trebleLine fieldsConfig={this.props.config} extra={this.getSearchButton()}/>
          </div>
        </>
      );
    }
}


export default AdvancedSearch;
