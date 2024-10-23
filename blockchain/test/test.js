let contract = await UserManager.deployed()
let accounts = await web3.eth.getAccounts()
// Use the same hashing function to create the test hashes
let result = await contract.authenticateUser(emailHash, passwordHash, {from: userAddress})