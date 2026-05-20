import * as React from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  useNavigateWithOrigin,
  encodeOrigin,
  decodeOrigin,
  buildUrlWithOrigin,
  type OriginContext,
} from "../react/hooks/useNavigateWithOrigin";

describe("encodeOrigin / decodeOrigin", () => {
  it("round-trips path + label", () => {
    const ctx: OriginContext = { path: "/vendors/acme", label: "Acme" };
    const round = decodeOrigin(encodeOrigin(ctx));
    expect(round).toEqual(ctx);
  });

  it("round-trips path only", () => {
    const round = decodeOrigin(encodeOrigin({ path: "/x" }));
    expect(round).toEqual({ path: "/x" });
  });

  it("returns null for malformed input", () => {
    expect(decodeOrigin("$$$not-valid$$$")).toBeNull();
  });

  it("encoded value is URL-safe (no +, /, =)", () => {
    const enc = encodeOrigin({ path: "/a/b/c?d=1" });
    expect(enc.includes("+")).toBe(false);
    expect(enc.includes("/")).toBe(false);
    expect(enc.includes("=")).toBe(false);
  });
});

describe("buildUrlWithOrigin", () => {
  it("uses ? when path has no query", () => {
    const url = buildUrlWithOrigin("/x", { path: "/from" });
    expect(url.startsWith("/x?origin=")).toBe(true);
  });

  it("uses & when path already has a query", () => {
    const url = buildUrlWithOrigin("/x?a=1", { path: "/from" });
    expect(url.includes("&origin=")).toBe(true);
    expect(url.indexOf("?")).toBe("/x".length); // '?' only at the original spot
  });
});

describe("useNavigateWithOrigin", () => {
  it("wraps navigate with the encoded origin", () => {
    const navigate = vi.fn();
    const { result } = renderHook(() =>
      useNavigateWithOrigin(navigate, "/dashboard", "Dashboard"),
    );
    act(() => {
      result.current("/detail/1");
    });
    expect(navigate).toHaveBeenCalledTimes(1);
    const arg = navigate.mock.calls[0][0] as string;
    expect(arg.startsWith("/detail/1?origin=")).toBe(true);
    const encoded = arg.split("origin=")[1];
    expect(decodeOrigin(encoded)).toEqual({ path: "/dashboard", label: "Dashboard" });
  });
});
