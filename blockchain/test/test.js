const UserManager = artifacts.require("UserManager");

contract("UserManager", (accounts) => {
  // Assign accounts for convenience
  const [deployer, user1] = accounts;

  // Helper function to generate SHA3 hashes for email and password
  const sha3Hash = (value) => web3.utils.sha3(value);

  let userManagerInstance;

  // Before each test case, deploy a fresh contract
  before(async () => {
    userManagerInstance = await UserManager.new();
  });

  it("should register a new user", async () => {
    const emailHash = sha3Hash("user@example.com");
    const passwordHash = sha3Hash("password123");
    const fullName = "John Doe";
    const role = "student";

    // Register the user
    const registerTx = await userManagerInstance.registerUser(fullName, emailHash, passwordHash, role, {
      from: user1,
    });

    // Check the emitted event for user registration
    const event = registerTx.logs[0].args;
    assert.equal(event.userAddress, user1, "The event address should match the user's address");
    assert.equal(event.fullName, fullName, "The event should log the correct user full name");
    assert.equal(event.role, role, "The event should log the correct user role");
  });

  it("should authenticate a registered user with correct credentials", async () => {
    const emailHash = sha3Hash("user@example.com");
    const passwordHash = sha3Hash("password123");

    // Authenticate the user
    const isAuthenticated = await userManagerInstance.authenticateUser(emailHash, passwordHash, {
      from: user1,
    });

    assert.isTrue(isAuthenticated, "The authentication should return true for correct credentials");
  });

  it("should fail to authenticate a user with incorrect credentials", async () => {
    const wrongEmailHash = sha3Hash("wrong@example.com");
    const wrongPasswordHash = sha3Hash("wrongpassword");

    // Try to authenticate with incorrect email and password
    const isAuthenticated = await userManagerInstance.authenticateUser(wrongEmailHash, wrongPasswordHash, {
      from: user1,
    });

    assert.isFalse(isAuthenticated, "The authentication should return false for incorrect credentials");
  });

  it("should not register a user with an invalid role", async () => {
    const emailHash = sha3Hash("invalid@example.com");
    const passwordHash = sha3Hash("password123");
    const fullName = "Invalid User";
    const invalidRole = "admin";

    try {
      // Attempt to register a user with an invalid role
      await userManagerInstance.registerUser(fullName, emailHash, passwordHash, invalidRole, {
        from: user1,
      });
      assert.fail("Registration should have failed with an invalid role");
    } catch (error) {
      assert.include(error.message, "Invalid role", "Expected invalid role error message");
    }
  });

  it("should not register a user who is already registered", async () => {
    const emailHash = sha3Hash("user@example.com");
    const passwordHash = sha3Hash("password123");
    const fullName = "John Doe";
    const role = "student";

    try {
      // Attempt to register the same user again
      await userManagerInstance.registerUser(fullName, emailHash, passwordHash, role, {
        from: user1,
      });
      assert.fail("Registration should have failed for an already registered user");
    } catch (error) {
      assert.include(error.message, "User already registered", "Expected user already registered error message");
    }
  });
});
