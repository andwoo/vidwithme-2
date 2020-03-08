import { TestObject } from '../Store';

function testReducerMethod(stateTestObject: TestObject = { name: '' }, action): TestObject {
  if (action.type == 'TEST_ACTION') {
    const newObj: TestObject = { ...stateTestObject };
    newObj.name = action.name;
    return newObj;
  }
  return { ...stateTestObject };
}

export default testReducerMethod;
