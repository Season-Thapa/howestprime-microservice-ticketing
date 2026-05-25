import { assertEquals } from '@std/assert';
import {AgeRating} from "@/Domain/Ticketing/Movies/mod.ts";

Deno.test("AgeRating - creates successfully with valid string", () => {
    const rating = AgeRating.create("PG-13");
    assertEquals(rating.value, "PG-13");
});
