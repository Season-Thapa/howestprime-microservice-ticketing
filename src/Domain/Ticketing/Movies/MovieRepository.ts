import type { Movie, MovieId } from "./Movie.ts";
import { Repository } from "@/Domain/Shared/mod.ts";

export interface MovieRepository extends Repository<Movie, MovieId> {
    findById(id: MovieId): Promise<Optional<Movie>>;
}
