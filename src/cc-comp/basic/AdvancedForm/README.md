## props

| 参数名称  | 参数说明                       | 默认值 |
|:----------|:-------------------------------|:-------|
| formItems | 高级查询表单配置项（详见下表） | []     |
| onOk      | 点击查询回调                   | 无     |

## formItems
| 参数名称 | 参数说明                     | 是否必填 | 默认值 |
|:---------|:-----------------------------|:---------|:-------|
| type     | 当前表单类型(见可选类型列表) | 否       | Input  |
| props    | 表单组件props                | 否       | 无     |
| key      | 设置表单查询条件的key值      | 是       | 无     |


### 可选类型列表
| 类型   | 值                    | 对应组件  |
|:-------|:----------------------|:----------|
| String | grid 或者 searchTable | ComboGrid |
| String | list 或者 select      | ComboList |
| String | tree 或者 selectTree  | ComboTree |
```bash
注：type不为以上可选参数时，默认使用Input组件
```


### &示例&
```js

const formItems = [
  {
    type: "grid",
    key: "key",
    props: {
      reader: {
        name: "name"
      },
      placeholder: "提示信息"
    }
  }
  // ... other item
]

```