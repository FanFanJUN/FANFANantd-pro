/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-10 17:17:09
 * @LastEditTime: 2020-10-10 17:43:45
 * @Description: 样式
 * @FilePath: /FANFANantd/src/pages/ExamplePage/rigister/style.js
 */
import styled from 'styled-components';

export const Span = styled.span`
     display: inline-block;
     width: 400px;
 `;
export const Wrapper = styled.div`
     display: flex;
     flex-direction: column;
     overflow: hidden;
     height: 100vh;
     &.with-header{
       height: calc(100vh - 69px);
     }
     .header{
        width: 80%;
        height:80px;
        padding: 25px 0 2px 0;
        margin: auto;
     }
     .content{
        flex: 1;
        padding: 0 5px;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        overflow: auto;
     }
     .footer{
        display: flex;
        justify-content: center;
        height: 50px;
        padding: 10px 0;
     }
     .regfooter{
       width:100%;
       text-align:center;
       .checkoutname {
          width:100%;
          padding-bottom:10px
       }
       .buttonname {
          margin-bottom:20px
       }
     }
 `;
export const CardWrapper = styled.div`
     background-color: rgb(236, 236, 236);
     padding: 15px 15px 0 15px;
     &.last{
       padding-bottom: 15px;
     }
     :hover .ant-card-body{
        border-bottom: 1px solid deepskyblue; 
        border-radius: 2px;
        box-shadow: 0 5px 5px -3px #3A9BFF;
        box-sizing: border-box;
     }
 `;
export const AddButtonWrapper = styled.div`
     display: flex;
     justify-content: center;
     margin-top: 10px;
 `;
export const ModalBox = styled.div`
    .ant-modal-body{
       padding: 2px 15px;
    }
 `;
