export function TestAction(name: string): TestAction {
  return {
    type: 'TEST_ACTION',
    name: name,
  };
}

export interface TestAction {
  type: string;
  name: string;
}
