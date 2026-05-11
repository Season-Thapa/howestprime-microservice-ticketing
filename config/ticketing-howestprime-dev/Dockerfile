FROM denoland/deno:alpine

EXPOSE 8000

WORKDIR /app

USER deno

COPY --chown=deno:deno . .

RUN deno cache src/Main/main.ts

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]