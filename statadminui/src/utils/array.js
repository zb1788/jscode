/**
 * object数组 字段转换
 * @param arr {Array<Object>}
 * @param convertFields {{ field: string }}
 * @returns {{}[]}
 */

export function objectListFieldConvert (
  arr = [],
  convertFields = {}
) {
  return arr.map(item => {
    return Object.keys(convertFields).reduce((result, field) => {
      if (field && item && item[field]) {
        const convertedField = convertFields[field];
        result[convertedField] = item[field];
      }

      return result;
    }, {});
  });
}

/**
 * 获取最后一个元素
 * @param arr
 * @returns {*}
 */
export function last (arr = []) {
  return arr[arr.length - 1];
}

/**
 * 获取第一个元素
 * @param arr
 * @returns {*}
 */
export function first (arr = []) {
  return arr[0];
}

/**
 * 字段抽取 sampling([{a: 1}], 'a') === [1]
 * @param arr
 * @param field { String }
 * @returns {*[]}
 */
export function sampling (
  arr = [],
  field = ''
) {
  return arr
    .filter(item => item)
    .map(item => item[field]);
}

/**
 * 去重
 * @param arr
 * @param field
 * @returns {unknown[]}
 */
export function distinctObjectList (arr = [], field = 'id') {
  return [...new Set(sampling(arr, field))]
    .map(val => arr.find(item => item[field] === val));
}

/**
 * 合并 Object[]
 * @param arr Array<Object>>
 * @param obj {Object}
 * @returns {*}
 */
export function mergeObjectArr (
  arr,
  objOrFunc = {}
) {
  return arr
    .filter(item => item)
    .map(item => ({ ...item, ...(typeof objOrFunc === 'function' ? objOrFunc(item) : (objOrFunc || {})) }));
}

/**
 * @description: 产品模块数组转为树
 * @param {type}
 * @return:
 */

export function modsConvertTree (arr = []) {
  let moduleId = [];
  arr.forEach(item => {
    moduleId.push(item.moduleId);
  });
  let treeArr = [];
  arr.forEach(item => {
    if (!item.parentId || !moduleId.includes(item.parentId)) {
      treeArr.push(getChildrenByParentId(arr, item.moduleId, item));
    }
  });
  return treeArr;
}

export function getChildrenByParentId (arr = [], parentId = null, obj = {}) {
  let children = [];
  arr.forEach((item) => {
    if (item.parentId === parentId) {
      children.push(item);
      getChildrenByParentId(arr, item.moduleId, item);
    }
  });
  obj.children = children;
  return obj;
}
/**
 * @description 深拷贝
 * @param {*} obj: Array | Object
 */
export let clone = function (obj) {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = this.clone(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
};
