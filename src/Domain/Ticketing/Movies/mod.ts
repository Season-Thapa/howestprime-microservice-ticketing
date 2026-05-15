export { Movie, MovieId } from './Movie.ts';
export { MovieDomainEvent } from './Events/MovieDomainEvent.ts';
export { MovieRegistered } from './Events/MovieRegistered.ts';
export { type MovieRepository } from './MovieRepository.ts';
export { InvalidMovieTitleException, MovieTitle } from './ValueObjects/MovieTitle.ts';
export { AgeRating, InvalidAgeRatingException } from './ValueObjects/AgeRating.ts';
export { Genre, InvalidGenreException } from './ValueObjects/Genre.ts';
export { InvalidMovieDurationException, MovieDuration } from './ValueObjects/MovieDuration.ts';
export { InvalidPosterUrlException, PosterUrl } from './ValueObjects/PosterUrl.ts';
