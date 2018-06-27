import { MainModule } from './main.module';

describe('MainModule', () => {
  let coreModule: MainModule;

  beforeEach(() => {
    coreModule = new MainModule();
  });

  it('should create an instance', () => {
    expect(coreModule).toBeTruthy();
  });
});
