const { expect } = require('chai');
const sinon = require('sinon');
const { submitLogin } = require('../backend/userLogin');

describe('User Login Tests', function () {
    describe('submitLogin', function () {
        it('should handle successful login and session addition', async function () {
            // Clear existing fetch modifications
            sinon.stub(global, 'fetch').resetHistory();

            // Mock the fetch function for login
            const loginFetchStub = sinon.stub(global, 'fetch');
            loginFetchStub.onFirstCall().resolves({
                ok: true,
                json: async () => ({ success: true, UserID: 123 }), // Assuming a sample UserID
            });

            // Mock the fetch function for addToUserSessions
            const addToUserSessionsStub = sinon.stub(global, 'fetch');
            addToUserSessionsStub.onSecondCall().resolves({
                ok: true,
                json: async () => ({ success: true }),
            });

            // Mock the window location object
            const originalLocation = global.window.location;
            delete global.window.location;
            global.window.location = { href: '' };

            // Call the function
            await submitLogin();

            // Your assertions, e.g., check if the window location is updated, or other expected behavior
            expect(global.window.location.href).to.equal('../frontend/mainDashboard.html');

            // Cleanup
            global.window.location = originalLocation;
            loginFetchStub.restore();
            addToUserSessionsStub.restore();
        });

        it('should handle failed login', async function () {
            // Clear existing fetch modifications
            sinon.stub(global, 'fetch').resetHistory();

            // Mock the fetch function for login
            const loginFetchStub = sinon.stub(global, 'fetch');
            loginFetchStub.resolves({
                ok: true,
                json: async () => ({ success: false }),
            });

            // Mock the window alert function
            const originalAlert = global.alert;
            let alertCalled = false;
            global.alert = () => { alertCalled = true; };

            // Call the function
            await submitLogin();

            // Your assertions, e.g., check if an alert was called
            expect(alertCalled).to.be.true;

            // Cleanup
            global.alert = originalAlert;
            loginFetchStub.restore();
        });
    });
});
