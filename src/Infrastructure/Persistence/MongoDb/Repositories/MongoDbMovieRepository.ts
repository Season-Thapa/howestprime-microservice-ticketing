import type { MovieRepository } from "@/Domain/Ticketing/Movies/mod.ts";
import { Optional } from '@domaincrafters/std';
import type { Document, Filter } from '@mongodb';
import { Movie } from "@/Domain/Ticketing/Movies/mod.ts";
import type { MovieId } from "@/Domain/Ticketing/Movies/mod.ts";
import { MongoDbClient, MongoDbRepository } from "@/Infrastructure/Persistence/MongoDb/Shared/mod.ts";
import { MovieDocumentMapper } from "./Mappers/MovieDocumentMapper.ts";


export class MongoDbMovieRepository extends MongoDbRepository<Movie, MovieId> implements MovieRepository {
  static override readonly collectionName: string = "movies";

  constructor(client: MongoDbClient, mapper: MovieDocumentMapper) {
    super(client, mapper, MongoDbMovieRepository.collectionName);
  }
  async findById(id: MovieId): Promise<Optional<Movie>> {
    const filter: Filter<Document> = {
      _id: id.toString()
    } as Filter<Document>;
    const document = await this._dbClient.findDocument(
        filter,
        MongoDbMovieRepository.collectionName
    );
    if (!document.isPresent) {
      return Optional.empty<Movie>();
    }

    return document.map((doc) => this['_documentMapper'].reconstitute(doc));

  }

  override get entityName(): string {
    return Movie.name;
  }
}
