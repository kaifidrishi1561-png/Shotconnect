export type MatchingCriteria = {
  category?: string;
  location?: string;
  budget?: number;
  availability?: string[];
  rating?: number;
  experience?: number;
  portfolioCount?: number;
  photographyStyle?: string;
};

export type MatchingCandidate = {
  id: string;
  category?: string;
  location?: string;
  budget?: number;
  availability?: string[];
  rating?: number;
  experience?: number;
  portfolioCount?: number;
  photographyStyle?: string;
};

export const calculateMatchScore = (candidate: MatchingCandidate, criteria: MatchingCriteria): number => {
  let score = 0;

  if (criteria.category && candidate.category === criteria.category) score += 25;
  else if (criteria.category && candidate.category) score += 10;

  if (criteria.location && candidate.location === criteria.location) score += 15;
  else if (criteria.location && candidate.location) score += 5;

  if (criteria.budget && candidate.budget) {
    const ratio = Math.min(candidate.budget / Math.max(criteria.budget, 1), 1);
    score += Math.round(ratio * 15);
  }

  if (criteria.availability && candidate.availability?.length) {
    const overlap = (criteria.availability || []).filter((slot) => candidate.availability?.includes(slot));
    score += Math.min(15, overlap.length * 5);
  }

  if (criteria.rating && candidate.rating) {
    score += Math.min(10, Math.round((candidate.rating / 5) * 10));
  }

  if (criteria.experience && candidate.experience) {
    score += Math.min(10, Math.round(Math.min(candidate.experience / 10, 1) * 10));
  }

  if (criteria.portfolioCount && candidate.portfolioCount) {
    score += Math.min(10, Math.round(Math.min(candidate.portfolioCount / 20, 1) * 10));
  }

  if (criteria.photographyStyle && candidate.photographyStyle === criteria.photographyStyle) score += 10;

  return Math.min(100, Math.max(0, score));
};

export const sortMatches = (candidates: MatchingCandidate[], criteria: MatchingCriteria) =>
  [...candidates].sort((a, b) => calculateMatchScore(b, criteria) - calculateMatchScore(a, criteria));
