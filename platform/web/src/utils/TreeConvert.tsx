import { isNumber, isArray } from './is';
import { cloneDeep } from 'lodash-es';
function _flatten(obj: { [key: string]: any }, sep = '.') {
  function recurse(curr: { [key: string]: any }, prefix: any, res: { [key: string]: any }) {
    if (Array.isArray(curr)) {
      curr.forEach((item, index) => {
        recurse(item, prefix ? `${prefix}${sep}${index}` : `${index}`, res);
      });
    } else if (curr instanceof Object) {
      const keys = Object.keys(curr);
      if (keys.length) {
        keys.forEach((key) => {
          recurse(curr[key], prefix ? `${prefix}${sep}${key}` : `${key}`, res);
        });
      } else if (prefix) {
        res[prefix] = curr;
      }
    } else {
      res[prefix] = curr;
    }
    return res;
  }
  let output = {};
  output = recurse(obj, '', output);
  return output;
}

function _unflatten(obj: { [key: string]: any }, sep = '.') {
  const keys = Object.keys(obj);
  const allNumber = !keys.some((k) => {
    if (!k) {
      return true;
    }
    const tmp = k.split(sep);
    return isNumber(tmp[0]);
  });
  let output: { [key: string]: any } = allNumber ? [] : {};
  Object.keys(obj).forEach((key) => {
    if (key.indexOf(sep) !== -1) {
      const keyArr: any[] = key.split(sep).filter((item) => item !== '');
      let currObj: { [key: string]: any } = output;
      keyArr.forEach((k, i) => {
        if (typeof currObj[k] === 'undefined') {
          if (i === keyArr.length - 1) {
            currObj[k] = obj[key];
          } else {
            currObj[k] = isNaN(keyArr[i + 1]) ? {} : [];
          }
        }
        currObj = currObj[k];
      });
    } else {
      output[key] = obj[key];
    }
  });
  return output;
}

function _assign(targetObj: { [key: string]: any }, ...objs: any[]) {
  let sep = '$%#$';
  const res = _flatten(targetObj, sep);
  objs.forEach((obj) => {
    Object.assign(res, _flatten(obj, sep));
  });
  Object.assign(targetObj, _unflatten(res, sep));
  return targetObj;
}

export function _array2tree(data: { [key: string]: any }, options = {}) {
  if (!isArray(data)) {
    throw new Error('data must be an array');
  }
  const c = _assign(
    {
      parent_index: 'parent_id',
      data_index: 'id',
      child_name: 'children',
    },
    options,
  );

  const items: any[] = [];
  data.forEach((d) => {
    if (typeof d[c.child_name] === 'undefined') {
      d[c.child_name] = [];
    } else {
      throw new Error(
        'child name "' + c.child_name + '" is reserved for child data, please use another name',
      );
    }
    items[d[c.data_index]] = d;
    if (typeof d[c.parent_index] === 'undefined' || typeof d[c.data_index] === 'undefined') {
      throw new Error('data must have "' + c.parent_index + '" and "' + c.data_index + '"');
    }
  });

  const tree: any[] = [];
  let n = 0;
  data.forEach((item) => {
    if (items[item[c.parent_index]]) {
      items[item[c.parent_index]][c.child_name].push(items[item[c.data_index]]);
      items[item[c.parent_index]][c.child_name].sort(
        (a: any, b: any) => a.sort_order - b.sort_order,
      );
      // items[item[c.parent_index]][c.child_name].sort((a: any, b: any) => a.sort_order - b.sort_order);
    } else {
      tree[n++] = items[item[c.data_index]];
    }
  });
  return tree;
}

export function _tree2array(tree: any[], options = {}, cutTree?: any) {
  let treeConvert = cloneDeep(tree);
  if (!isArray(tree)) {
    tree = [tree];
  }
  const c = _assign(
    {
      parent_index: 'parent_id',
      data_index: 'id',
      child_name: 'children',
    },
    options,
  );
  const res: any[] = [];
  function recurse(data: any[], parent_id: number, cutTreeKey?: any) {
    data.forEach((d) => {
      const child = d[c.child_name].map((i: any) => i);
      delete d[c.child_name];
      d[c.parent_index] = parent_id || 0;
      if (d[c.data_index] === cutTreeKey) return;
      res.push(d);
      if (child.length) {
        recurse(child, d[c.data_index], cutTreeKey);
      } else {
        d.isLeaf = true;
      }
    });
  }
  recurse(treeConvert, 0, cutTree);
  return res;
}
