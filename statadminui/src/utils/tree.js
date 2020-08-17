/*
 * @Author: your name
 * @Date: 2020-04-28 19:12:14
 * @LastEditTime: 2020-04-28 19:37:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base\src\utils\tree.js
 */
/**
 * 遍历树节点
 * @param tree
 * @param callback
 * @param parents
 */
export const forEach = (
  tree = [],
  callback = () => { return false; },
  parents = [],
  childrenField = 'children'
) => {
  (tree || []).forEach(item => {
    callback(item, parents);
    forEach(item[childrenField], callback, [item, ...parents]);
  });
};

/**
 * 将数组转换为树结构
 * @param arr
 * @param id
 * @param parentId
 * @param rootKeyValue
 * @returns {[]}
 */
export function arrayToTree (
  arr,
  { id, parentId } = { id: 'id', parentId: 'parentId' },
  rootKeyValue = ''
) {
  let tree = [];

  arr.sort((a, b) => a[id].localeCompare(b[id])).forEach(item => {
    if (item[parentId] === rootKeyValue) {
      tree.push({ ...item });
    } else {
      forEach(tree, (parent) => {
        if (item[parentId] === parent[id]) {
          parent.children = [...(parent.children || []), item];
        }
      });
    }
  });

  return tree;
}

/**
 * 展开树
 * @param tree
 * @returns {[]}
 */
export function flattenTree (tree = []) {
  const flattened = [];

  forEach(tree, (item, parents) => {
    flattened.push({
      ...item,
      parents
    });
  });

  return flattened;
}

/**
 * 获取叶子节点
 * @param tree
 * @returns {[]}
 */
export function getLeafNodes (tree = []) {
  const leafNodes = [];

  forEach(tree, item => !item.children && leafNodes.push(item));

  return leafNodes;
}

/**
 * 查找树节点
 * @param tree
 * @param func
 * @returns {*}
 */
export function find (tree = [], func) {
  return flattenTree(tree).find(item => func(item));
}
