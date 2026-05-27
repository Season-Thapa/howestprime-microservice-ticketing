import { ValueObject, ExternalMovieId } from '@/Domain/Shared/mod.ts';
import { MovieTitle } from '../../Movies/ValueObjects/MovieTitle.ts';
import { MovieDuration } from '../../Movies/ValueObjects/MovieDuration.ts';
import { Genre } from '../../Movies/ValueObjects/Genre.ts';
import { PosterUrl } from '../../Movies/ValueObjects/PosterUrl.ts';
import { AgeRating } from '../../Movies/ValueObjects/AgeRating.ts';
import { Money } from '../../../Shared/ValueObjects/Money.ts';

export class MovieInfo extends ValueObject {
    private readonly _id: ExternalMovieId;
    private readonly _title: MovieTitle;
    private readonly _duration: MovieDuration;
    private readonly _genres: Genre[];
    private readonly _posterUrl: PosterUrl;
    private readonly _ageRating: AgeRating;
    private readonly _price: Money;

    private constructor(
        id: ExternalMovieId,
        title: MovieTitle,
        duration: MovieDuration,
        genres: Genre[],
        posterUrl: PosterUrl,
        ageRating: AgeRating,
        price: Money,
    ) {
        super();
        this._id = id;
        this._title = title;
        this._duration = duration;
        this._genres = genres;
        this._posterUrl = posterUrl;
        this._ageRating = ageRating;
        this._price = price;
    }

    public static create(
        id: ExternalMovieId,
        title: MovieTitle,
        duration: MovieDuration,
        genres: Genre[],
        posterUrl: PosterUrl,
        ageRating: AgeRating,
        price: Money,
    ): MovieInfo {
        return new MovieInfo(id, title, duration, genres, posterUrl, ageRating, price);
    }

    get id(): ExternalMovieId {
        return this._id;
    }

    get title(): MovieTitle {
        return this._title;
    }

    get duration(): MovieDuration {
        return this._duration;
    }

    get genres(): Genre[] {
        return this._genres;
    }

    get posterUrl(): PosterUrl {
        return this._posterUrl;
    }

    get ageRating(): AgeRating {
        return this._ageRating;
    }

    get price(): Money {
        return this._price;
    }
    override equals(other: MovieInfo): boolean {
        if (other === null || other === undefined) {
            return false;
        }
        if (!(other instanceof MovieInfo)) {
            return false;
        }

        const areGenresEqual = this._genres.length === other.genres.length &&
            this._genres.every((genre, index) => genre.equals(other.genres[index]!));

        return (
            this._id.equals(other.id) &&
            this._title.equals(other.title) &&
            this._duration.equals(other.duration) &&
            this._posterUrl.equals(other.posterUrl) &&
            this._ageRating.equals(other.ageRating) &&
            this._price.equals(other.price) &&
            areGenresEqual
        );
    }
}
