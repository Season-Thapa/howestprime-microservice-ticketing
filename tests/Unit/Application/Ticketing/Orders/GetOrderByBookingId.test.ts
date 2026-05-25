import { assertEquals, assertRejects } from "@std/assert";
import { GetOrderByBookingId, type GetOrderByBookingIdInput } from "@/Application/Ticketing/Orders/GetOrderByBookingId.ts";
import { Optional } from "@domaincrafters/std";
import type { FindOrderByBookingIdQueryPort, OrderData } from "@/Application/Ports/Queries/mod.ts";

// Helper to create mock OrderData
function createMockOrderData(overrides?: Partial<OrderData>): OrderData {
  return {
    orderId: crypto.randomUUID(),
    bookingId: crypto.randomUUID(),
    status: "Open",
    price: 45.0,
    agreeToTerms: false,
    customer: null,
    tickets: [
      {
        id: crypto.randomUUID(),
        movieId: crypto.randomUUID(),
        room: "Room A",
        seatNumber: 12,
        visitorType: "standard",
        price: 15.0,
        showtime: new Date("2026-05-15T18:30:00.000Z"),
      },
      {
        id: crypto.randomUUID(),
        movieId: crypto.randomUUID(),
        room: "Room A",
        seatNumber: 13,
        visitorType: "standard",
        price: 15.0,
        showtime: new Date("2026-05-15T18:30:00.000Z"),
      },
      {
        id: crypto.randomUUID(),
        movieId: crypto.randomUUID(),
        room: "Room A",
        seatNumber: 14,
        visitorType: "discounted",
        price: 15.0,
        showtime: new Date("2026-05-15T18:30:00.000Z"),
      },
    ],
    ...overrides,
  } as OrderData;
}

Deno.test("GetOrderByBookingId - successfully retrieves order by booking id", async () => {
  // Arrange
  const bookingId = crypto.randomUUID();
  const orderData = createMockOrderData({ bookingId }) as OrderData;

  const mockQuery: FindOrderByBookingIdQueryPort = {
    getOrderByBookingId: async (id: string): Promise<Optional<OrderData>> => {
      if (id === bookingId) {
        return Optional.of<OrderData>(orderData);
      }
      return Optional.empty<OrderData>();
    },
  };

  const useCase = new GetOrderByBookingId(mockQuery);

  const input: GetOrderByBookingIdInput = {
    bookingId,
  };

  // Act
  const result = await useCase.execute(input);

  // Assert
  assertEquals(result.id, orderData.id);
  assertEquals(result.bookingId, bookingId);
  assertEquals(result.status, "Open");
  assertEquals(result.price, 45.0);
  assertEquals(result.agreeToTerms, false);
  assertEquals(result.customer, null);
  assertEquals(result.tickets.length, 3);
});

Deno.test("GetOrderByBookingId - returns order with customer details when present", async () => {
  // Arrange
  const bookingId = crypto.randomUUID();
  const customerData = {
    salutation: "Mr.",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };
  const orderData = createMockOrderData({
    bookingId,
    customer: customerData,
    agreeToTerms: true,
  }) as OrderData;

  const mockQuery: FindOrderByBookingIdQueryPort = {
    getOrderByBookingId: async (id: string): Promise<Optional<OrderData>> => {
      if (id === bookingId) {
        return Optional.of<OrderData>(orderData);
      }
      return Optional.empty<OrderData>();
    },
  };

  const useCase = new GetOrderByBookingId(mockQuery);

  const input: GetOrderByBookingIdInput = {
    bookingId,
  };

  // Act
  const result = await useCase.execute(input);

  // Assert
  assertEquals(result.customer?.salutation, "Mr.");
  assertEquals(result.customer?.firstName, "John");
  assertEquals(result.customer?.lastName, "Doe");
  assertEquals(result.customer?.email, "john.doe@example.com");
  assertEquals(result.agreeToTerms, true);
});

Deno.test("GetOrderByBookingId - returns order with paid status and released tickets", async () => {
  // Arrange
  const bookingId = crypto.randomUUID();
  const orderData = createMockOrderData({
    bookingId,
    status: "TicketReleased",
  }) as OrderData;

  const mockQuery: FindOrderByBookingIdQueryPort = {
    getOrderByBookingId: async (id: string): Promise<Optional<OrderData>> => {
      if (id === bookingId) {
        return Optional.of<OrderData>(orderData);
      }
      return Optional.empty<OrderData>();
    },
  };

  const useCase = new GetOrderByBookingId(mockQuery);

  const input: GetOrderByBookingIdInput = {
    bookingId,
  };

  // Act
  const result = await useCase.execute(input);

  // Assert
  assertEquals(result.status, "TicketReleased");
});

Deno.test("GetOrderByBookingId - throws error when order not found", async () => {
  // Arrange
  const bookingId = crypto.randomUUID();

  const mockQuery: FindOrderByBookingIdQueryPort = {
    getOrderByBookingId: async () => Optional.empty<OrderData>(),
  };

  const useCase = new GetOrderByBookingId(mockQuery);

  const input: GetOrderByBookingIdInput = {
    bookingId,
  };

  // Act & Assert
  await assertRejects(async () => await useCase.execute(input), Error, `Order not found for booking ID: ${bookingId}`);
});

Deno.test("GetOrderByBookingId - handles order with single ticket", async () => {
  // Arrange
  const bookingId = crypto.randomUUID();
  const orderData = createMockOrderData({
    bookingId,
    tickets: [
      {
        id: crypto.randomUUID(),
        movieId: crypto.randomUUID(),
        room: "Room A",
        seatNumber: 12,
        visitorType: "standard",
        price: 15.0,
        showtime: new Date("2026-05-15T18:30:00.000Z"),
      },
    ],
    price: 15.0,
  }) as OrderData;

  const mockQuery: FindOrderByBookingIdQueryPort = {
    getOrderByBookingId: async (id: string): Promise<Optional<OrderData>> => {
      if (id === bookingId) {
        return Optional.of<OrderData>(orderData);
      }
      return Optional.empty<OrderData>();
    },
  };

  const useCase = new GetOrderByBookingId(mockQuery);

  const input: GetOrderByBookingIdInput = {
    bookingId,
  };

  // Act
  const result = await useCase.execute(input);

  // Assert
  assertEquals(result.tickets.length, 1);
  assertEquals(result.price, 15.0);
  const ticket = result.tickets[0];
  if (ticket) {
    assertEquals(ticket.seatNumber, 12);
  }
});

Deno.test("GetOrderByBookingId - returns correct ticket details", async () => {
  // Arrange
  const bookingId = crypto.randomUUID();
  const movieId = crypto.randomUUID();
  const ticketId = crypto.randomUUID();
  const ticket = {
    id: ticketId,
    movieId,
    room: "Room B",
    seatNumber: 25,
    visitorType: "discounted",
    price: 12.5,
    showtime: new Date("2026-05-16T20:00:00.000Z"),
  };
  const orderData = createMockOrderData({
    bookingId,
    tickets: [ticket],
  }) as OrderData;

  const mockQuery: FindOrderByBookingIdQueryPort = {
    getOrderByBookingId: async (id: string): Promise<Optional<OrderData>> => {
      if (id === bookingId) {
        return Optional.of<OrderData>(orderData);
      }
      return Optional.empty<OrderData>();
    },
  };

  const useCase = new GetOrderByBookingId(mockQuery);

  const input: GetOrderByBookingIdInput = {
    bookingId,
  };

  // Act
  const result = await useCase.execute(input);

  // Assert
  const retrievedTicket = result.tickets[0];
  if (retrievedTicket) {
    assertEquals(retrievedTicket.id, ticketId);
    assertEquals(retrievedTicket.movieId, movieId);
    assertEquals(retrievedTicket.room, "Room B");
    assertEquals(retrievedTicket.seatNumber, 25);
    assertEquals(retrievedTicket.visitorType, "discounted");
    assertEquals(retrievedTicket.price, 12.5);
    assertEquals(retrievedTicket.showtime, new Date("2026-05-16T20:00:00.000Z"));
  }
});
