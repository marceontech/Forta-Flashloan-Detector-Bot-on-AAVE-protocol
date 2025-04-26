const { hasAaveFlashloan } = require('./detectors/aave-detector');

const allSupportedProtocols = ['aave'];

module.exports = class FlashloanDetector {
  constructor(supportedProtocols) {
    // If there are no provided protocols then support all
    const tempProtocols = supportedProtocols || allSupportedProtocols;

    this.protocols = {};
    tempProtocols.forEach((protocol) => {
      if (!allSupportedProtocols.includes(protocol)) {
        throw new Error('Unsupported protocol. Supported protocols: "aave"');
      }

      // Store the protocols as an object ("name": true) for easier access
      this.protocols[protocol] = true;
    });
  }

  // Initialize the AAVE protocol
  async init() {
    if (this.protocols.aave) await initAave();
  }

  // Returns an array of protocols from which a flashloan was taken, but in this case only AAVE protocol
  getFlashloans(txEvent) {
    const flashloanProtocols = [];
    if (this.protocols.aave && hasAaveFlashloan(txEvent)) {
      flashloanProtocols.push('Aave');
    }
   
    return flashloanProtocols;
  }
};
