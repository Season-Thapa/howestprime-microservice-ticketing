import { assertEquals, assertThrows } from '@std/assert';
import { MovieTitle, InvalidMovieTitleException } from "@/Domain/Ticketing/Movies/mod.ts";

// --- Movie Title ---
Deno.test("MovieTitle - creates successfully with valid string", () => {
    const title = MovieTitle.create("Spider-Man");
    assertEquals(title.value, "Spider-Man");
});

Deno.test("MovieTitle - throws error when empty or whitespace", () => {
    assertThrows(() => MovieTitle.create(""), InvalidMovieTitleException);
    assertThrows(() => MovieTitle.create("   "), InvalidMovieTitleException);
});