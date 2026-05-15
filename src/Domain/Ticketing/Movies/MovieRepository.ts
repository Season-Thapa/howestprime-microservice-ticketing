import type { Movie, MovieId } from './Movie.ts';
import { Repository } from '@/Domain/Shared/mod.ts';
import { Optional } from '@domaincrafters/std';

export interface MovieRepository extends Repository<Movie, MovieId> {
    findById(id: MovieId): Promise<Optional<Movie>>;
}
