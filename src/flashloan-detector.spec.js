const { ethers } = require('forta-agent');
const FlashloanDetector = require('./flashloan-detector');

// Mock the initAave method because
// it calls a JsonRpc provider
jest.mock('./detectors/aave-detector', () => ({
  ...jest.requireActual('./detectors/aave-detector'),
  initAave: () => {},
}));

const amount = ethers.utils.parseUnits('100', 18);

// Event information is not important if we mock 'filterLog'
const mockAaveEvent = {};


describe('FlashloanDetector library', () => {
  let flashloanDetector;
  const mockTxEvent = { filterLog: jest.fn() };

  beforeEach(() => {
    mockTxEvent.filterLog.mockReset();
  });

  describe('init', () => {
    it('should support all protocols by default', () => {
      flashloanDetector = new FlashloanDetector();

      expect(flashloanDetector.protocols).toEqual({
        aave: true, 
      });
    });

    it('should support only the provided protocols', () => {
      flashloanDetector = new FlashloanDetector(['aave', ]);

      expect(flashloanDetector.protocols).toEqual({
        aave: true, 
      });
    });

    it('should throw on creation if unsupported protocol is provided', () => {
      expect(() => {
        flashloanDetector = new FlashloanDetector(['otherProtocol']);
      }).toThrow();
    });
  });

  describe('getFlashloans', () => {
    it('should return empty array if there are no flashloans', () => {
      flashloanDetector = new FlashloanDetector();

      // Don't mock
      mockTxEvent.filterLog.mockReturnValue([]);
      const flashloans = flashloanDetector.getFlashloans(mockTxEvent);

      expect(flashloans).toStrictEqual([]);
    });

    it('should return the "Aave" protocol if there is a flashloan from Aave', () => {
      // Detect flashloans only for Aave so we don't have to mock
      // the filterLog calls for other protocols in case of including them in the array apart from AAVE
      flashloanDetector = new FlashloanDetector(['aave']);

      mockTxEvent.filterLog.mockReturnValueOnce([mockAaveEvent]);
      const flashloans = flashloanDetector.getFlashloans(mockTxEvent);

      expect(flashloans).toStrictEqual(['Aave']);
    });


    it('should return all the protocols if there is a flashloan from all', () => {
      flashloanDetector = new FlashloanDetector();

      mockTxEvent.filterLog.mockReturnValueOnce([mockAaveEvent]);
     
      const flashloans = flashloanDetector.getFlashloans(mockTxEvent);

      expect(flashloans).toStrictEqual(['Aave']);
    });
  });
});
