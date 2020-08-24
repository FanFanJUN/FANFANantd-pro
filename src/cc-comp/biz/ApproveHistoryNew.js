// import React, {Component} from 'react';
// import {mainTabAction,} from 'sei-utils';
// import {getLocale,} from 'seid/es5/utils/common';
// import zhCN from 'seid/es5/components/Flow/ApproveHistory/locales/zh-CN';
// import LocaleReceiver from 'seid/es5/components/Basic/LocaleProvider/LocaleReceiver';

// import {Button, Col, Divider, Form, Icon, List, Modal, Row, Tabs, Timeline, message, Select} from "antd";
// import _extends from 'babel-runtime/helpers/extends';
// import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
// import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
// import _inherits from 'babel-runtime/helpers/inherits';
// import {isEmpty} from 'lodash';
// import {getFlowHistoryInfo} from 'seid/es5/components/Flow/api';
// import _Tooltip from 'antd/es/tooltip';

// const Fragment = React.Fragment;
// const TabPane = Tabs.TabPane;
// const FormItem = Form.Item;
// const Option = Select.Option;

// const formItemLayout = {
//     labelCol: {
//         span: 4
//     },
//     wrapperCol: {
//         span: 20
//     },
// };
// const flowMapUri = '/flow-web/design/showLook';
// let selectItem = [];

// let orgStyle = {
//     display: "inline-block",
//     maxWidth: 120,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//     verticalAlign: "top"
// };

// var ApproveHistory = function (_Component) {
//     _inherits(ApproveHistory, _Component);

//     function ApproveHistory(props) {
//         _classCallCheck(this, ApproveHistory);

//         var _this = _possibleConstructorReturn(this, _Component.call(this, props));

//         _this.getLocale = function (_ref, formatParams) {
//             var key = _ref.key,
//                 desc = _ref.desc;

//             return getLocale(_this.locale, {key: key, desc: desc}, formatParams);
//         };

//         _this.showTime = function (val) {
//             var day = _this.getLocale({key: 'day', desc: '天'});
//             var hour = _this.getLocale({key: 'hour', desc: '小时'});
//             var minute = _this.getLocale({key: 'minute', desc: '分钟'});
//             var second = _this.getLocale({key: 'second', desc: '秒'});

//             if (val < 60) {
//                 return val + '\t' + second;
//             }
//             var minTotal = Math.floor(val / 60); // 分钟
//             var sec = Math.floor(val % 60); // 余秒

//             if (minTotal < 60) {
//                 return minTotal + '\t' + minute + sec + '\t' + second;
//             }
//             var hourTotal = Math.floor(minTotal / 60); // 小时数
//             var min = Math.floor(minTotal % 60); // 余分钟

//             if (hourTotal < 24) {
//                 return hourTotal + '\t' + hour + min + '\t' + minute + sec + '\t' + second;
//             }
//             var dayTotal = Math.floor(hourTotal / 24);
//             var minHour = Math.floor(hourTotal % 24); // 余分钟
//             return dayTotal + '\t' + day + minHour + '\t' + hour + min + '\t' + minute + sec + '\t' + second;
//         };

//         _this.okHandle = function () {
//             var setHistoryKey = _this.props.setHistoryKey;

//             _this.setState({
//                 visible: false
//             }, function () {
//                 if (setHistoryKey) {
//                     setHistoryKey(null);
//                 }
//             });
//         };

//         _this.handleModalVisible = function () {
//             var setHistoryKey = _this.props.setHistoryKey;


//             _this.setState({
//                 visible: false
//             }, function () {
//                 if (setHistoryKey) {
//                     setHistoryKey(null);
//                 }
//             });
//         };

//         _this.onSelectChange = function (value) {
//             var allData = _this.state.allData;

//             _this.setState({
//                 selectValue: selectItem[value],
//                 data: allData[value]
//             });
//         };

//         _this.gotoFlowMap = function () {
//             var _this$state = _this.state,
//                 historyKey = _this$state.historyKey,
//                 data = _this$state.data;

//             var url = '' + window.location.origin + flowMapUri + '?id=' + historyKey + '&instanceId=' + data.flowInstance.id;
//             mainTabAction.tabOpen({
//                 id: 'flow_map_' + historyKey,
//                 name: _this.getLocale({key: 'ah_000007', desc: '查看流程'}),
//                 featureUrl: url
//             });
//         };

//         _this.getCurrentStateComponent = function () {
//             var _this$state$data = _this.state.data,
//                 data = _this$state$data === undefined ? {} : _this$state$data;
//             var flowHistoryList = data.flowHistoryList,
//                 flowTaskList = data.flowTaskList;

//             var style = {
//                 width: '100%',
//                 marginLeft: '250px',
//                 marginTop: '20px',
//                 fontSize: '24px'
//             };
//             if (flowTaskList.length === 0) {
//                 if (!isEmpty(flowHistoryList) && flowHistoryList[flowHistoryList.length - 1].depict[0] === '【') {
//                     return React.createElement(
//                         'div',
//                         {style: style},
//                         React.createElement(
//                             'b',
//                             null,
//                             _this.getLocale({key: 'ah_000008', desc: '该流程已被终止'})
//                         )
//                     );
//                 }
//                 return React.createElement(
//                     'div',
//                     {style: style},
//                     React.createElement(
//                         'b',
//                         null,
//                         _this.getLocale({key: 'ah_000009', desc: '流程已处理完成'})
//                     )
//                 );
//             }
//             return React.createElement(List, {
//                 itemLayout: 'horizontal',
//                 dataSource: flowTaskList,
//                 style: {marginLeft: '30px', marginTop: '10px'},
//                 renderItem: function renderItem(item) {
//                     return React.createElement(
//                         Fragment,
//                         null,
//                         React.createElement(
//                             'div',
//                             {style: {color: '#18A9FF'}},
//                             React.createElement(Icon, {type: 'flag'}),
//                             React.createElement(
//                                 'b',
//                                 null,
//                                 item.taskName
//                             )
//                         ),
//                         React.createElement(
//                             List.Item,
//                             null,
//                             React.createElement(List.Item.Meta, {
//                                 description: React.createElement(
//                                     'div',
//                                     null,
//                                     React.createElement(
//                                         Col,
//                                         {span: 12},
//                                         _this.getLocale({
//                                             key: 'ah_000010',
//                                             desc: '等待处理人：'
//                                         }),
//                                         item.ownerName,
//                                         item.executorOrgName ? React.createElement(
//                                             "span",
//                                             null,
//                                             "\u3010",
//                                             React.createElement(
//                                                 _Tooltip,
//                                                 {title: item.executorOrgName},
//                                                 React.createElement(
//                                                     "span",
//                                                     {style: orgStyle},
//                                                     item.executorOrgName
//                                                 )
//                                             ),
//                                             "\u3011"
//                                         ) : null
//                                     ),
//                                     React.createElement(
//                                         Col,
//                                         {span: 1},
//                                         React.createElement(Divider, {type: 'vertical'})
//                                     ),
//                                     React.createElement(
//                                         Col,
//                                         {span: 11, style: {textAlign: 'right'}},
//                                         _this.getLocale({
//                                             key: 'ah_000011',
//                                             desc: '任务到达时间：'
//                                         }),
//                                         item.lastEditedDate
//                                     )
//                                 )
//                             })
//                         )
//                     );
//                 }
//             });
//         };

//         _this.getStatus = function (status) {
//             var statusMap = {
//                 submit: _this.getLocale({key: 'ah_000012', desc: '-提交'}),
//                 agree: _this.getLocale({key: 'ah_000013', desc: '-同意'}),
//                 disagree: _this.getLocale({key: 'ah_000014', desc: '-不同意'}),
//                 turntodo: _this.getLocale({key: 'ah_000015', desc: '-转办'}),
//                 entrust: _this.getLocale({key: 'ah_000016', desc: '-委托'}),
//                 recall: _this.getLocale({key: 'ah_000017', desc: '-撤回'}),
//                 reject: _this.getLocale({key: 'ah_000018', desc: '-驳回'}),
//                 end: _this.getLocale({key: 'ah_000019', desc: '-终止'}),
//                 auto: _this.getLocale({key: 'ah_000020', desc: '-自动执行'})
//             };
//             var text = '';
//             if (status) {
//                 text = statusMap[status.toLowerCase()] || '';
//             }

//             return text;
//         };

//         _this.getFlowHistoryComponent = function () {
//             var _this$state$data2 = _this.state.data,
//                 data = _this$state$data2 === undefined ? {} : _this$state$data2;
//             var flowHistoryList = data.flowHistoryList,
//                 flowInstance = data.flowInstance,
//                 flowTaskList = data.flowTaskList;


//             return React.createElement(
//                 Fragment,
//                 null,
//                 React.createElement(
//                     Row,
//                     null,
//                     React.createElement(
//                         Col,
//                         {span: 8},
//                         React.createElement(
//                             'div',
//                             {style: {color: '#18A9FF'}},
//                             React.createElement(Icon, {type: 'flag'}),
//                             React.createElement(
//                                 'b',
//                                 null,
//                                 _this.getLocale({key: 'ah_000021', desc: '流程启动'})
//                             )
//                         )
//                     ),
//                     React.createElement(
//                         Col,
//                         {span: 16},
//                         React.createElement(
//                             'div',
//                             {
//                                 style: {
//                                     float: 'right',
//                                     marginRight: '30px',
//                                     color: 'rgba(0, 0, 0, 0.45)'
//                                 }
//                             },
//                             flowInstance.creatorName,
//                             React.createElement(Divider, {type: 'vertical'}),
//                             flowInstance.createdDate
//                         )
//                     )
//                 ),
//                 React.createElement(Divider, null),
//                 React.createElement(
//                     Timeline,
//                     {
//                         style: {
//                             marginLeft: '30px',
//                             marginTop: '20px',
//                             color: 'rgba(0, 0, 0, 0.45)'
//                         }
//                     },
//                     flowHistoryList.map(function (item) {
//                         return React.createElement(
//                             Timeline.Item,
//                             {
//                                 key: '' + item.flowTaskName + Math.random(),
//                                 dot: React.createElement(Icon, {type: 'clock-circle-o', color: 'red'})
//                             },
//                             React.createElement(
//                                 Row,
//                                 {gutter: 10},
//                                 React.createElement(
//                                     Col,
//                                     {span: 6},
//                                     React.createElement(
//                                         'div',
//                                         null,
//                                         React.createElement(
//                                             'b',
//                                             null,
//                                             item.flowTaskName,
//                                             _this.getStatus(item.flowExecuteStatus)
//                                         )
//                                     )
//                                 ),
//                                 React.createElement(
//                                     Col,
//                                     {span: 17},
//                                     React.createElement(
//                                         'div',
//                                         {style: {float: 'right'}},
//                                         _this.getLocale({key: 'ah_000022', desc: '处理人：'}),
//                                         item.executorName,
//                                         item.executorOrgName ? React.createElement(
//                                             "span",
//                                             null,
//                                             "\u3010",
//                                             React.createElement(
//                                                 _Tooltip,
//                                                 {title: item.executorOrgName},
//                                                 React.createElement(
//                                                     "span",
//                                                     {style: orgStyle},
//                                                     item.executorOrgName
//                                                 )
//                                             ),
//                                             "\u3011"
//                                         ) : null,
//                                         item.actEndTime,
//                                     )
//                                 )
//                             ),
//                             React.createElement(
//                                 Row,
//                                 {gutter: 10, style: {marginTop: '5px'}},
//                                 React.createElement(
//                                     Col,
//                                     {span: 21, offset: 2},
//                                     React.createElement(
//                                         'div',
//                                         {style: {float: 'right', marginRight: '10px'}},
//                                         _this.getLocale({key: 'ah_000023', desc: '流程耗时：'}),
//                                         _this.showTime((item.actDurationInMillis / 1000).toFixed(0))
//                                     )
//                                 )
//                             ),
//                             React.createElement(
//                                 Row,
//                                 {gutter: 10, style: {marginTop: '5px'}},
//                                 React.createElement(
//                                     Col,
//                                     {span: 21, offset: 2},
//                                     React.createElement(
//                                         'div',
//                                         {
//                                             style: {
//                                                 float: 'right',
//                                                 marginRight: item.depict[0] === '【' ? '5px' : '10px'
//                                             }
//                                         },
//                                         _this.getLocale({key: 'ah_000024', desc: '处理摘要：'}),
//                                         item.depict
//                                     )
//                                 )
//                             )
//                         );
//                     }),
//                     flowTaskList.length === 0 ? React.createElement(
//                         Fragment,
//                         null,
//                         React.createElement(Divider, null),
//                         React.createElement(
//                             Row,
//                             null,
//                             React.createElement(
//                                 Col,
//                                 {span: 8},
//                                 React.createElement(
//                                     'div',
//                                     {style: {color: '#18A9FF'}},
//                                     React.createElement(Icon, {type: 'flag'}),
//                                     React.createElement(
//                                         'b',
//                                         null,
//                                         _this.getLocale({key: 'ah_000025', desc: '流程结束'})
//                                     )
//                                 )
//                             ),
//                             React.createElement(
//                                 Col,
//                                 {span: 16},
//                                 React.createElement(
//                                     'div',
//                                     {
//                                         style: {
//                                             float: 'right',
//                                             marginRight: '30px',
//                                             color: 'rgba(0, 0, 0, 0.45)'
//                                         }
//                                     },
//                                     isEmpty(flowHistoryList) ? flowInstance.endDate : flowHistoryList[flowHistoryList.length - 1].actEndTime
//                                 )
//                             )
//                         )
//                     ) : null
//                 )
//             );
//         };

//         _this.renderCmp = function (contextLocale) {
//             var customLocale = _this.props.locale;
//             var _this$state2 = _this.state,
//                 _this$state2$data = _this$state2.data,
//                 data = _this$state2$data === undefined ? {} : _this$state2$data,
//                 visible = _this$state2.visible,
//                 selectValue = _this$state2.selectValue;
//             var flowHistoryList = data.flowHistoryList,
//                 flowInstance = data.flowInstance;

//             var locale = _extends({}, contextLocale, customLocale);
//             _this.locale = locale;

//             if (!flowHistoryList) {
//                 return null;
//             }

//             return React.createElement(
//                 Modal,
//                 {
//                     title: '' + flowInstance.flowName + _this.getLocale({
//                         key: 'ah_000026',
//                         desc: '详情'
//                     }),
//                     bodyStyle: {maxHeight: '480px', overflow: 'auto'},
//                     width: '735px',
//                     visible: visible,
//                     onOk: _this.okHandle,
//                     afterClose: _this.handleModalVisible,
//                     onCancel: _this.handleModalVisible,
//                     destroyOnClose: true,
//                     footer: [React.createElement(
//                         Button,
//                         {key: 'submit', type: 'primary', onClick: _this.okHandle},
//                         _this.getLocale({key: 'ah_000027', desc: '确定'})
//                     )],
//                     maskClosable: false
//                 },
//                 React.createElement(
//                     Row,
//                     {gutter: 10},
//                     React.createElement(
//                         Col,
//                         {span: 19},
//                         React.createElement(
//                             FormItem,
//                             _extends({}, formItemLayout, {
//                                 label: React.createElement(
//                                     'b',
//                                     null,
//                                     _this.getLocale({key: 'ah_000028', desc: '启动历史'})
//                                 )
//                             }),
//                             React.createElement(
//                                 Select,
//                                 {style: {width: '100%'}, value: selectValue, onChange: _this.onSelectChange},
//                                 selectItem.map(function (item, index) {
//                                     return React.createElement(
//                                         Option,
//                                         {key: index},
//                                         item
//                                     );
//                                 })
//                             )
//                         )
//                     ),
//                     React.createElement(
//                         Col,
//                         {span: 5, style: {marginTop: '3px'}},
//                         React.createElement(
//                             Button,
//                             {
//                                 title: _this.getLocale({key: 'ah_000029', desc: '查看流程图'}),
//                                 style: {width: 124, whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
//                                 icon: 'search',
//                                 onClick: _this.gotoFlowMap
//                             },
//                             _this.getLocale({key: 'ah_000029', desc: '查看流程图'})
//                         )
//                     )
//                 ),
//                 React.createElement(
//                     Tabs,
//                     {defaultActiveKey: '1', style: {align: 'center'}},
//                     React.createElement(
//                         TabPane,
//                         {
//                             tab: React.createElement(
//                                 'span',
//                                 null,
//                                 React.createElement(Icon, {type: 'task'}),
//                                 _this.getLocale({key: 'ah_000030', desc: '当前处理状态'})
//                             ),
//                             key: '1'
//                         },
//                         _this.getCurrentStateComponent()
//                     ),
//                     React.createElement(
//                         TabPane,
//                         {
//                             tab: React.createElement(
//                                 'span',
//                                 null,
//                                 React.createElement(Icon, {type: ''}),
//                                 _this.getLocale({key: 'ah_000031', desc: '流程处理历史'})
//                             ),
//                             key: '2'
//                         },
//                         _this.getFlowHistoryComponent()
//                     )
//                 )
//             );
//         };

//         _this.state = {
//             visible: false,
//             selectValue: '',
//             allData: [],
//             data: {},
//             historyKey: ''
//         };
//         return _this;
//     }

//     ApproveHistory.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
//         var _this2 = this;

//         var historyKey = nextProps.historyKey;
//         var setHistoryKey = this.props.setHistoryKey;

//         if (historyKey && historyKey.length > 0) {
//             var formData = {
//                 // businessId: nextProps.relatedId
//                 businessId: historyKey
//             };
//             getFlowHistoryInfo(formData).then(async function (res) {
//                 let allData = [];
//                 let returnError1 = false, returnError2 = false;
//                 nextProps.relatedId && await getFlowHistoryInfo({businessId: nextProps.relatedId}).then(function (subRes) {
//                     if (!isEmpty(subRes)) {
//                         allData = allData.concat(subRes);
//                     } else {
//                         returnError1 = true;
//                     }
//                 }).catch(function (err) {
//                     setHistoryKey(null);
//                     message.error(err.message);
//                 });
//                 if (!isEmpty(res) || allData.length > 0) {
//                     allData = allData.concat(res);
//                     allData.sort((a, b) => {
//                         return b['flowInstance']['createdDate'].localeCompare(a['flowInstance']['createdDate'])
//                     });
//                     selectItem = allData.map(function (item) {
//                         var flowInstance = item.flowInstance;
//                         return _this2.getLocale({
//                             key: 'ah_000004',
//                             desc: '{0}于{1}发起'
//                         }, [flowInstance.flowName, flowInstance.createdDate]);
//                     });
//                     _this2.setState({
//                         data: allData[0] || {},
//                         allData: allData,
//                         historyKey: historyKey,
//                         visible: true,
//                         selectValue: selectItem[0]
//                     });
//                 } else {
//                     returnError2 = true;
//                     if (returnError1 && returnError2) {
//                         message.error(_this2.getLocale({key: 'ah_000006', desc: '未找到相应流程历史'}));
//                         if (setHistoryKey) {
//                             setHistoryKey(null);
//                         }
//                     }
//                 }
//             }).catch(function (err) {
//                 setHistoryKey(null);
//                 message.error(err.message);
//             });
//         }
//     };

//     ApproveHistory.prototype.render = function render() {
//         return React.createElement(
//             LocaleReceiver,
//             {localeContext: 'ApproveHistory', defaultLocale: zhCN},
//             this.renderCmp
//         );
//     };

//     return ApproveHistory;
// }(Component);

// export default ApproveHistory;