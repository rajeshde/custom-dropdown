import {useEffect, useRef} from 'react';

import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  if (ref.current === undefined) {
    switch (value) {
      case isObject(value):
        return {};
      case isString(value):
        return '';
    }
  }
  return ref.current;
}

export default usePrevious;
