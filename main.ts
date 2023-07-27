import {
  Client,
  httpTransportProvider,
} from "https://deno.land/x/mtkruto@0.0.969/mod.ts";
import {
  StorageDenoKV,
} from "https://deno.land/x/mtkruto@0.0.970/storage/1_storage_deno_kv.ts";
import env from "./env.ts";

const client = new Client(
  new StorageDenoKV(),
  env.API_ID,
  env.API_HASH,
  { transportProvider: httpTransportProvider({ initialDc: "1" }) },
);

await client.connect();

await client.authorize(env.BOT_TOKEN);

await client.sendMessage("@MTKrutoTest", "Hello from Deno Deploy!");

await client.disconnect();

Deno.exit();
