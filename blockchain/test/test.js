const UserManager = artifacts.require("UserManager");
const crypto = require('crypto');

function hashToBytes32(str) {
  const hash = crypto.createHash('sha256').update(str).digest();
  return '0x' + hash.toString('hex');
}

contract("UserManager", (accounts) => {
  let userManager;

  before(async () => {
    userManager = await UserManager.deployed();
  });

  it("should register a new user", async () => {
    const fullName = "John Doe";
    const email = "johndoe@example.com";
    const password = "password123";
    const role = "student";

    const emailHash = hashToBytes32(email);
    const passwordHash = hashToBytes32(password);

    await userManager.registerUser(fullName, emailHash, passwordHash, role, { from: accounts[0] });

    const user = await userManager.users(accounts[0]);
    assert.equal(user.fullName, fullName, "Full name does not match");
    assert.equal(user.emailHash, emailHash, "Email hash does not match");
    assert.equal(user.passwordHash, passwordHash, "Password hash does not match");
    assert.equal(user.role, role, "Role does not match");
  });

  it("should authenticate a user", async () => {
    const email = "johndoe@example.com";
    const password = "password123";

    const emailHash = hashToBytes32(email);
    const passwordHash = hashToBytes32(password);

    const isAuthenticated = await userManager.authenticateUser(emailHash, passwordHash, { from: accounts[0] });
    assert.isTrue(isAuthenticated, "User should be authenticated");
  });

  it("should not authenticate a user with incorrect credentials", async () => {
    const email = "johndoe@example.com";
    const password = "wrongpassword";

    const emailHash = hashToBytes32(email);
    const passwordHash = hashToBytes32(password);

    const isAuthenticated = await userManager.authenticateUser(emailHash, passwordHash, { from: accounts[0] });
    assert.isFalse(isAuthenticated, "User should not be authenticated");
  });

  it("should not register a user with an invalid role", async () => {
    const fullName = "Jane Doe";
    const email = "janedoe@example.com";
    const password = "password123";
    const role = "admin";

    const emailHash = hashToBytes32(email);
    const passwordHash = hashToBytes32(password);

    try {
      await userManager.registerUser(fullName, emailHash, passwordHash, role, { from: accounts[1] });
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert.include(error.message, "Invalid role", "Error message should contain 'Invalid role'");
    }
  });

  it("should not register a user with an existing email hash", async () => {
    const fullName = "John Smith";
    const email = "johndoe@example.com";
    const password = "password123";
    const role = "student";
  
    const emailHash = hashToBytes32(email);
    const passwordHash = hashToBytes32(password);
  
    try {
      const tx = await userManager.registerUser(fullName, emailHash, passwordHash, role, { from: accounts[2] });
      assert.fail("Expected an error but did not get one");
    } catch (error) {
      assert.isTrue(error.message.includes("User already registered"), "Error message should contain 'User already registered'");
    }
  });
  
  
});
