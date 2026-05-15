import type { UseCase } from '@/Application/Ports/mod.ts';
import type { SaveMovieInput } from '@/Application/Ticketing/Movies/mod.ts';
import type { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { IllegalArgumentException } from '@domaincrafters/std';

export interface MovieRegisteredRequest {
    movieId: unknown;
    title: unknown;
    duration: unknown;
    genres: unknown;
    ageRating: unknown;
    posterUrl: unknown;
}

export class MovieRegisteredController implements AmqpController<MovieRegisteredRequest> {
    constructor(private readonly _saveMovieUseCase: UseCase<SaveMovieInput, string>) {}

    async handle(request: MovieRegisteredRequest): Promise<void> {
        const input = this.extractInput(request as unknown);
        await this._saveMovieUseCase.execute(input);
    }

    private extractInput(request: unknown): SaveMovieInput {
        if (request === null || typeof request !== 'object') {
            throw new IllegalArgumentException('MovieRegistered payload must be a JSON object.');
        }

        const payload = request as Record<string, unknown>;

        // Accept either direct fields or wrapped in a `payload` object from AsyncAPI UI
        const body = Object.hasOwn(payload, 'payload')
            ? (payload.payload as Record<string, unknown>)
            : payload;

        return {
            movieId: this.requireNonEmptyString(body.movieId, 'movieId'),
            title: this.requireNonEmptyString(body.title, 'title'),
            duration: this.requireNumber(body.duration, 'duration'),
            ageRating: this.requireNonEmptyString(body.ageRating, 'ageRating'),
            genres: this.requireStringArray(body.genres, 'genres'),
            posterUrl: this.requireNonEmptyString(body.posterUrl, 'posterUrl'),
        };
    }

    private requireNonEmptyString(value: unknown, fieldName: string): string {
        if (typeof value !== 'string') {
            throw new IllegalArgumentException(`Field '${fieldName}' must be a string.`);
        }

        if (value.trim().length === 0) {
            throw new IllegalArgumentException(`Field '${fieldName}' must not be empty.`);
        }

        return value;
    }

    private requireNumber(value: unknown, fieldName: string): number {
        if (typeof value !== 'number') {
            throw new IllegalArgumentException(`Field '${fieldName}' must be a number.`);
        }

        return value;
    }

    private requireStringArray(value: unknown, fieldName: string): string[] {
        if (!Array.isArray(value)) {
            throw new IllegalArgumentException(`Field '${fieldName}' must be an array.`);
        }

        const arr = value as unknown[];
        if (arr.length === 0) {
            throw new IllegalArgumentException(`Field '${fieldName}' must not be empty.`);
        }

        for (const v of arr) {
            if (typeof v !== 'string' || v.trim().length === 0) {
                throw new IllegalArgumentException(
                    `All entries in '${fieldName}' must be non-empty strings.`,
                );
            }
        }

        return arr as string[];
    }
}
