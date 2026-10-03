jest.mock('../models/User', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

import { createUser } from '../services/authService';
import { User } from '../models/User';

describe('createUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws a conflict error when email already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });

    await expect(
      createUser({
        firstName: 'Test',
        lastName: 'User',
        email: 'existing@example.com',
        password: 'Password123',
        role: 'BRAND'
      })
    ).rejects.toMatchObject({
      message: 'User already exists',
      statusCode: 409
    });
  });
});
