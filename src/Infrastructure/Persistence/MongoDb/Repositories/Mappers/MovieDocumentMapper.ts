import type { Document } from '@mongodb';

import {
    AgeRating,
    Genre,
    MovieDuration,
    MovieTitle,
    PosterUrl,
} from '@/Domain/Shared/mod.ts';
import { Movie, MovieId } from '@/Domain/Ticketing/Movies/mod.ts';
import { Money } from '@/Domain/Shared/ValueObjects/Money.ts';
import { type DocumentMapper } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';

interface MovieDocumentShape {
    _id?: string;
    id?: string;
    externalId: string;
    title: string;
    duration: number;
    genres: string[];
    ageRating: string;
    posterUrl: string;
    price: number;
}

export class MovieDocumentMapper implements DocumentMapper<Movie> {
    toDocument(aggregate: Movie): Document {
        return {
            _id: aggregate.id.value,
            externalId: aggregate.externalId,
            title: aggregate.title.value,
            duration: aggregate.duration.duration,
            genres: aggregate.genres.map((g) => g.value),
            ageRating: aggregate.ageRating.value,
            posterUrl: aggregate.posterUrl.value,
            price: aggregate.price.amount,
        };
    }

    reconstitute(document: Document): Movie {
        const snapshot = document as unknown as MovieDocumentShape;

        const movie = Object.create(Movie.prototype) as {
            _id: MovieId;
            _externalId: string;
            _title: MovieTitle;
            _ageRating: AgeRating;
            _genres: Genre[];
            _movieDuration: MovieDuration;
            _posterUrl: PosterUrl;
            _price: Money;
            _domainEvents: unknown[];
        };

        movie._id = MovieId.create((snapshot._id ?? snapshot.id) as string);
        movie._externalId = snapshot.externalId;
        movie._title = MovieTitle.create(snapshot.title);
        movie._ageRating = AgeRating.create(snapshot.ageRating);
        movie._genres = snapshot.genres.map((g) => Genre.create(g));
        movie._movieDuration = MovieDuration.create(snapshot.duration);
        movie._posterUrl = PosterUrl.create(snapshot.posterUrl);
        movie._price = Money.create(snapshot.price ?? 0);
        movie._domainEvents = [];

        return movie as unknown as Movie;
    }
}
