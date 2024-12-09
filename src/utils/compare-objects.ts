import * as lodash from 'lodash';

export const getUpdatedKey = (oldData, newData) => {
  const data = lodash.uniq([...Object.keys(oldData), ...Object.keys(newData)]);

  for (const key of data) {
    if (!lodash.isEqual(oldData[key], newData[key])) {
      return key;
    }
  }

  return null;
};
