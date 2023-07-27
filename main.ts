import {
  Client,
  httpTransportProvider,
} from "https://deno.land/x/mtkruto@0.0.973/mod.ts";
import {
  StorageDenoKV,
} from "https://deno.land/x/mtkruto@0.0.973/storage/1_storage_deno_kv.ts";
import env from "./env.ts";

const chat = "@MTKrutoTest";

const kv = await Deno.openKv();

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const text = url.searchParams.get("text");
  if (typeof text !== "string" || text.length < 1 || text.length > 4096) {
    return new Response(null, { status: 400 });
  }
  const i = await kv.get(["i"]);
  if (i.versionstamp != null) {
    return new Response(null, { status: 503 });
  }
  await kv.set(["i"], 1);
  try {
    const client = new Client(
      new StorageDenoKV(),
      env.API_ID,
      env.API_HASH,
      { transportProvider: httpTransportProvider({ initialDc: "1" }) },
    );

    await client.connect();

    await client.authorize(env.BOT_TOKEN);

    await client.sendMessage(
      chat,
      `Hello from Deno Deploy (${env.DENO_REGION})!`,
    );

    await client.disconnect();
    return new Response(null);
  } catch (err) {
    return new Response(Deno.inspect(err, { colors: false }), { status: 500 });
  } finally {
    await kv.delete(["i"]);
  }
});
