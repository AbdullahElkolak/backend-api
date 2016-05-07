import DelegatorController from '../../../api/server/controllers/delegator';

describe('Unit', () => {
    describe('Controller',  () => {
        describe('Delegator',  () => {
            let delegatorController;

            beforeEach(() => {
                delegatorController = new DelegatorController();
            });

            describe('constructor', () => {
                it('should instantiate an empty object as delegatees', () => {
                    expect(delegatorController.subscribe).to.be.defined;
                    expect(delegatorController.delegateTo).to.be.defined;
                });
            });

            describe('subscribe', () => {
                it('should add controller to delegatees', () => {
                    expect(delegatorController.subscribe('testController', { abc: 123 })).to.deep.eq({ abc: 123 });
                });
            });

            describe('delegateTo', () => {
                it('should call specified handler of delegatee', () => {
                    const testController = {
                        someHandler: sinon.spy()
                    };

                    delegatorController.subscribe('testController', testController);
                    delegatorController.delegateTo('testController', 'someHandler', 123);

                    expect(testController.someHandler).calledWith(123);
                });
            });
        });
    });

});
