FROM node:20-alpine AS build
RUN npm i -g pnpm
COPY . /project
WORKDIR /project
RUN --mount=type=cache,target=/project/node_modules pnpm i && npm rebuild --arch=x64 --platform=linux --libc=musl sharp && pnpm run build

FROM node:20-alpine
COPY --from=build /project/build /project
RUN adduser -D weird
RUN echo '{"type": "module"}' > /project/package.json
RUN chown -R weird:weird /project
USER weird
CMD ["node", "/project"]
