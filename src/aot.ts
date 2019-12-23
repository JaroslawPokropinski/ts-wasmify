class CModule {
  module: any;
  
  constructor(emodule: any) {
    this.module = emodule;
  }

  createFloatArray(): CArray<Float> {
    return createFloatArray(this.module);
  }

  onLoad(callback: () => void) {
    this.module['onRuntimeInitialized'] = function() {
      callback();
    }
  }
}

export const loadModule = function(emod: any, callback?: () => void) {
  const cmod = new CModule(emod);
  
  if (callback) {
    emod['onRuntimeInitialized'] = function() {
      callback();
    }
  }
  
  return cmod;
}

export default function aot(cmod: CModule) {
  return function(
    _target: Object,
    propertyName: string,
    propertyDesciptor: PropertyDescriptor
  ) {
    const foo = cmod.module['_' + propertyName] as (...args: any[]) => any;

    propertyDesciptor.value = function(...args: any[]) {
      return foo(...args);
    };
  };
}

export interface CArray<T> {
  size(): Int;

  get(index: Int): T;

  set(index: Int, obj: T): T;

  push(obj: T): T;
}

function createFloatArray(Module: any): CArray<Float> {
  const arr = Module['_createFloatArray']();
  const floatPushBack = Module['_floatPushBack'] as (...args: any[]) => any;
  const floatAt = Module['_floatAt'] as (...args: any[]) => any;
  const size = Module['_floatArraySize'];

  class FloatCArray extends Number implements CArray<Float> {
    constructor(...args: any[]) {
      super(...args);
    }
    size(): Int {
      return size(arr);
    }

    get(index: Int): Float {
      return floatAt(arr, index);
    }

    set(_index: Int, _obj: Float): Float {
      throw new Error('Unimplemented');
    }

    push(obj: Float): Float {
      return floatPushBack(arr, obj);
    }
  }

  return new FloatCArray(arr);
}

class CNumber extends Number {
  constructor(x: number) {
    super(x);
  }

  add(_y: CNumber): CNumber {
    throw new Error();
  }
  sub(_y: CNumber): CNumber {
    throw new Error();
  }

  mul(_y: CNumber): CNumber {
    throw new Error();
  }

  div(_y: CNumber): CNumber {
    throw new Error();
  }

  ge(_y: CNumber): CNumber {
    throw new Error();
  }

  le(_y: CNumber): CNumber {
    throw new Error();
  }

  gt(_y: CNumber): CNumber {
    throw new Error();
  }

  lt(_y: CNumber): CNumber {
    throw new Error();
  }
}

export class Int extends CNumber {
  constructor(x: number) {
    super(x);
  }
}

export class Float extends CNumber {
  constructor(x: number) {
    super(x);
  }
  add(_y: Float): Float {
    throw new Error();
  }
  sub(_y: Float): Float {
    throw new Error();
  }

  mul(_y: Float): Float {
    throw new Error();
  }

  div(_y: Float): Float {
    throw new Error();
  }

  ge(_y: Float): Float {
    throw new Error();
  }
}
