import { Request, Response } from 'express';
import * as transactionController from '../controllers/transaction.controllers';
import Transaction from '../models/transaction.models';
import EthPrice from '../models/ethprice.models';
import * as etherscanService from '../services/etherscan.services';

jest.mock('../models/transaction.models');
jest.mock('../models/ethprice.models');
jest.mock('../services/etherscan.services');

describe('Transaction Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any = {};

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockImplementation(result => {
        responseObject = result;
      }),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getTransactions', () => {
    it('should fetch and store transactions', async () => {
      const mockTransactions = [
        { hash: '0x123', gasUsed: 21000, gasPrice: '20000000000' },
        { hash: '0x456', gasUsed: 21000, gasPrice: '25000000000' },
      ];
      (etherscanService.fetchTransactions as jest.Mock).mockResolvedValue(mockTransactions);
      (Transaction.insertMany as jest.Mock).mockResolvedValue(true);

      mockRequest.params = { address: '0x789' };

      await transactionController.getTransactions(mockRequest as Request, mockResponse as Response);

      expect(etherscanService.fetchTransactions).toHaveBeenCalledWith('0x789');
      expect(Transaction.insertMany).toHaveBeenCalledWith(mockTransactions, { ordered: false });
      expect(mockResponse.json).toHaveBeenCalledWith(mockTransactions);
    });

    it('should handle errors when fetching transactions', async () => {
        (etherscanService.fetchTransactions as jest.Mock).mockRejectedValue(new Error(' Error fetching transactions: Error: API error'));
    
        mockRequest.params = { address: '0x789' };
    
        await transactionController.getTransactions(mockRequest as Request, mockResponse as Response);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      });
    
      it('should handle database errors when storing transactions', async () => {
        const mockTransactions = [{ hash: '0x123', gasUsed: 21000, gasPrice: '20000000000' }];
        (etherscanService.fetchTransactions as jest.Mock).mockResolvedValue(mockTransactions);
        (Transaction.insertMany as jest.Mock).mockRejectedValue(new Error('Database error'));
    
        mockRequest.params = { address: '0x789' };
    
        await transactionController.getTransactions(mockRequest as Request, mockResponse as Response);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      });
  });

  describe('getUserExpenses', () => {
    it('should calculate total expenses correctly', async () => {
      const mockTransactions = [
        { gasUsed: 21000, gasPrice: '20000000000' },
        { gasUsed: 21000, gasPrice: '25000000000' },
      ];
      (Transaction.find as jest.Mock).mockResolvedValue(mockTransactions);
      (EthPrice.findOne as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue({ price: 200000 }),
      });

      mockRequest.params = { address: '0x789' };

      await transactionController.getUserExpenses(mockRequest as Request, mockResponse as Response);

      expect(Transaction.find).toHaveBeenCalledWith({ address: '0x789' });
      expect(responseObject).toHaveProperty('totalExpenses');
      expect(responseObject.totalExpenses).toBeCloseTo(0.000945, 6);
      expect(responseObject.currentEthPrice).toBe(200000);
    });

    it('should handle no transactions', async () => {
        (Transaction.find as jest.Mock).mockResolvedValue([]);
        (EthPrice.findOne as jest.Mock).mockReturnValue({
          sort: jest.fn().mockResolvedValue({ price: 200000 }),
        });
    
        mockRequest.params = { address: '0x789' };
    
        await transactionController.getUserExpenses(mockRequest as Request, mockResponse as Response);
    
        expect(responseObject.totalExpenses).toBe(0);
      });
  });
});