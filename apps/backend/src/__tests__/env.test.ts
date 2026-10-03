describe('default environment configuration', () => {
  it('uses the default backend port by default', () => {
    jest.resetModules();
    const { env } = require('../config/env');
    expect(env.port).toBe(8000);
  });
});
