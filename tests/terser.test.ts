import { assert, assertStrictEquals as equals } from "../deps/assert.ts";
import { build, getSite, testPage } from "./utils.ts";
import terser from "../plugins/terser.ts";

Deno.test("terser plugin", async () => {
  const site = getSite({
    test: true,
    src: "terser",
  });

  site.use(terser());

  await build(site);

  equals(site.pages.length, 2);

  // Register the .js loader
  assert(site.source.assets.has(".js"));
  assert(site.source.pages.has(".js"));
  assert(!site.source.assets.has(".ts"));

  testPage(site, "/numbers.js", (page) => {
    equals(page.data.url, "/numbers.js");
    equals(
      page.content,
      "export function one(){return 1}export function two(){return 2}",
    );
  });

  testPage(site, "/main", (page) => {
    equals(
      page.content,
      'import{one as o,two as m}from"./numbers.js";console.log(o()+m());',
    );
  });
});
