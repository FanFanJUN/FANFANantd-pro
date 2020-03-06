/**
 * 数据表格相关工具
 */

const tableUtils = {

  // 分页、筛选、表头排序
  onChange: (pagination, filters, sorter, searchParams = {}) => {
    let sorterParams;
    if (!sorter || !sorter.columnKey || !sorter.order) {
      sorterParams = {};
    } else {
      // 将字段转化后端可以识别的排序名称
      sorterParams = {
        orderBy: sorter.columnKey, // 排序字段
        isDesc: sorter.order === 'descend' ? 'desc' : sorter.order === 'ascend' ? 'asc' : sorter.order, // 正序或者倒序
      };
    }

    const allSortParams = {
      pageSize: pagination.pageSize, // 页数
      pageNum: pagination.current, // 页码
      ...sorterParams, // 表头排序参数
      ...searchParams, // 搜索条件参数
    };

    return allSortParams;
  },


  // 分页展示参数
  pagination: (params, otherParams = {}) => {
    // 注:params参数可以从model中,通过this.props获取
    const paginationParams = {
      current: params.pageNum, // 页码
      pageSize: params.pageSize, // 页数
      total: params.total, // 总数
      showSizeChanger: true, // 是否可以改变 pageSize
      showQuickJumper: true, // 是否可以快速跳转至某页
      showTotal: () => `共${params.total}条`, // 显示总数
      ...otherParams,
    };

    return paginationParams;
  },

};


export default tableUtils;
