import * as ethpriceController from '../controllers/ethprice.controllers';
import EthPrice from '../models/ethprice.models';
import * as coingeckoService from '../services/coingecko.services';

jest.mock('../models/ethprice.models');
jest.mock('../services/coingecko.services');

describe('EthPrice Controller', () => {
  describe('fetchAndStoreEthPrice', () => {
    it('should fetch and store Ethereum price successfully', async () => {
      const mockPrice = 2000;
      (coingeckoService.fetchEthPrice as jest.Mock).mockResolvedValue(mockPrice);
      (EthPrice.create as jest.Mock).mockResolvedValue({ price: mockPrice });

      await ethpriceController.fetchAndStoreEthPrice();

      expect(coingeckoService.fetchEthPrice).toHaveBeenCalled();
      expect(EthPrice.create).toHaveBeenCalledWith({ price: mockPrice });
    });

    it('should handle errors when fetching or storing price', async () => {
      (coingeckoService.fetchEthPrice as jest.Mock).mockRejectedValue(new Error('API error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await ethpriceController.fetchAndStoreEthPrice();

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching and storing Ethereum price:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});