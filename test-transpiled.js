const assert = require('chai').assert;
const sinon = require('sinon');
const fetchMock = require('fetch-mock');

// Include your functions
const {
  signup,
  addToUserSessions,
  submitLogin
} = require('./backend/userLogin'); // Update with your actual file name

describe('signup', () => {
  afterEach(() => {
    fetchMock.reset();
  });
  it('should handle successful registration', async () => {
    fetchMock.postOnce('http://localhost:3000/signupUser', {
      success: true
    });

    // Your validation logic here (mocking document.getElementById, etc.)

    const result = await signup();
    assert.isTrue(result);
  });
  it('should handle failed registration', async () => {
    fetchMock.postOnce('http://localhost:3000/signupUser', {
      success: false
    });

    // Your validation logic here (mocking document.getElementById, etc.)

    const result = await signup();
    assert.isFalse(result);
  });
});
describe('addToUserSessions', () => {
  afterEach(() => {
    fetchMock.reset();
  });
  it('should handle successful addToUserSessions', async () => {
    fetchMock.postOnce('http://localhost:3000/addToUserSessions', {
      success: true
    });
    const result = await addToUserSessions('mockedUserID');
    assert.isTrue(result);
  });
  it('should handle failed addToUserSessions', async () => {
    fetchMock.postOnce('http://localhost:3000/addToUserSessions', {
      success: false
    });
    const result = await addToUserSessions('mockedUserID');
    assert.isFalse(result);
  });
});
describe('submitLogin', () => {
  afterEach(() => {
    fetchMock.reset();
  });
  it('should handle successful login', async () => {
    fetchMock.postOnce('http://localhost:3000/loginuser', {
      success: true,
      UserID: 'mockedUserID'
    });

    // Your validation logic here (mocking document.getElementById, etc.)

    const result = await submitLogin();
    assert.isTrue(result);
  });
  it('should handle failed login', async () => {
    fetchMock.postOnce('http://localhost:3000/loginuser', {
      success: false
    });

    // Your validation logic here (mocking document.getElementById, etc.)

    const result = await submitLogin();
    assert.isFalse(result);
  });
});

// Run the tests
mocha.run();
