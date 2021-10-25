FROM rust:buster as build

# Copy everything
RUN mkdir backend
WORKDIR /backend
COPY . .
RUN rm -rf ./target

# Build
RUN cargo build --release --bin server

# Final base
FROM debian:buster-slim

COPY --from=build /backend/target/release/server .

CMD ["./server"]