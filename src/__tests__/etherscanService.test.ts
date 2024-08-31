import axios from 'axios';
import * as etherscanService from '../services/etherscan.services';

jest.mock('axios');

describe('Etherscan Service', () => {
  it('should fetch transactions successfully', async () => {
    const mockResponse = {
      data: {
        status: '1',
        result: [
          { hash: '0x123', gasUsed: '21000', gasPrice: '20000000000' },
          { hash: '0x456', gasUsed: '21000', gasPrice: '25000000000' },
        ],
      },
    };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await etherscanService.fetchTransactions('0x789');

    expect(axios.get).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('hash', '0x123');
    expect(result[1]).toHaveProperty('hash', '0x456');
  });

  it('should throw an error when Etherscan API returns an error', async () => {
    const mockResponse = {
      data: {
        status: '0',
        message: 'Error message',
      },
    };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    await expect(etherscanService.fetchTransactions('0x789')).rejects.toThrow('Error message');
  });
});