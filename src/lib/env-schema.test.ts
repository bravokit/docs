import { describe, expect, it } from "vitest";

import { parseEnv } from "./env-schema";

describe("parseEnv", () => {
  it("accepts the site's URL", () => {
    expect(parseEnv({ NEXT_PUBLIC_APP_URL: "https://docs.example.com" })).toEqual({
      NODE_ENV: "development",
      NEXT_PUBLIC_APP_URL: "https://docs.example.com",
    });
  });

  it("refuses a missing or empty URL with a readable message", () => {
    expect(() => parseEnv({})).toThrow(/NEXT_PUBLIC_APP_URL/);
    expect(() => parseEnv({ NEXT_PUBLIC_APP_URL: "" })).toThrow(/NEXT_PUBLIC_APP_URL/);
    expect(() => parseEnv({ NEXT_PUBLIC_APP_URL: "ftp://docs.example.com" })).toThrow(
      /http\(s\) URL/,
    );
  });
});
