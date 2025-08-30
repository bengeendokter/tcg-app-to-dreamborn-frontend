ARG NODE_VERSION=22.14.0-alpine
ARG NGINX_VERSION=alpine3.21

FROM node:${NODE_VERSION} AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY ["package.json", "pnpm-lock.yaml*", "./"]

# Install dependencies with pnpm
RUN pnpm install --silent

# install Angular CLI globally
RUN pnpm add -g @angular/cli --silent

COPY . .
RUN chown -R node /app
USER node

RUN pnpm build

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

# Use a built-in non-root user for security best practices
USER nginx

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the static build output from the build stage to Nginx's default HTML serving directory
COPY --chown=nginx:nginx --from=builder /app/dist/*/browser /usr/share/nginx/html

# Expose port 8080 to allow HTTP traffic
# Note: The default NGINX container now listens on port 8080 instead of 80 
EXPOSE 8080

# Start Nginx directly with custom config
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
