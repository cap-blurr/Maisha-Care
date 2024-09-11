const ethers = require('ethers');

class Verifier {
    constructor(privateKey) {
        this.wallet = new ethers.Wallet(privateKey);
    }

    async createVerificationSignature(role, address) {
        const message = ethers.utils.solidityKeccak256(
            ['bytes32', 'address'],
            [role, address]
        );
        const messageHash = ethers.utils.arrayify(message);
        return this.wallet.signMessage(messageHash);
    }
}

module.exports = Verifier;