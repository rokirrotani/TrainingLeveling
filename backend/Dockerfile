FROM rust:1.82 AS builder
WORKDIR /app

COPY Cargo.toml ./
COPY src ./src
COPY migrations ./migrations

RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/target/release/training_leveling_api /usr/local/bin/training_leveling_api

EXPOSE 8080
CMD ["training_leveling_api"]
