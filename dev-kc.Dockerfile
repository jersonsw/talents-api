FROM alpine:latest AS dockerize-builder
ENV DOCKERIZE_VERSION v0.6.1
RUN apk add --no-cache wget tar \
    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /opt/keycloak

# Stage 2: Use the hardened Keycloak base image
FROM quay.io/keycloak/keycloak:latest as dev
# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Copy dockerize from the builder stage
COPY --from=dockerize-builder /usr/local/bin/dockerize /usr/local/bin/dockerize
