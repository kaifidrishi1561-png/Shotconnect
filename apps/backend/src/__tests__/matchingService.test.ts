import { calculateMatchScore } from '../services/matchingService';

describe('matchingService', () => {
  it('scores a strong portfolio match highly', () => {
    const score = calculateMatchScore(
      {
        id: 'p1',
        category: 'Fashion',
        location: 'Bengaluru',
        budget: 15000,
        availability: ['Monday', 'Tuesday'],
        rating: 4.8,
        experience: 6,
        portfolioCount: 18,
        photographyStyle: 'Studio'
      },
      {
        category: 'Fashion',
        location: 'Bengaluru',
        budget: 20000,
        availability: ['Monday', 'Tuesday'],
        rating: 4.5,
        experience: 5,
        portfolioCount: 15,
        photographyStyle: 'Studio'
      }
    );

    expect(score).toBeGreaterThan(70);
  });
});
