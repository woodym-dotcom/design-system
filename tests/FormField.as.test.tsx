import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FormField } from "../react/FormField";

describe("FormField as=textarea", () => {
  it("renders a textarea element with rows / cols", () => {
    const onChange = vi.fn();
    render(
      <FormField
        id="notes"
        label="Notes"
        as="textarea"
        rows={4}
        cols={20}
        value=""
        onChange={onChange}
      />,
    );
    const ta = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(ta.tagName).toBe("TEXTAREA");
    expect(ta.rows).toBe(4);
    expect(ta.cols).toBe(20);
    fireEvent.change(ta, { target: { value: "hi" } });
    expect(onChange).toHaveBeenCalledWith("hi");
  });
});

describe("FormField as=select", () => {
  it("renders select element with children options", () => {
    const onChange = vi.fn();
    render(
      <FormField
        id="role"
        label="Role"
        as="select"
        value="admin"
        onChange={onChange}
      >
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </FormField>,
    );
    const sel = screen.getByRole("combobox") as HTMLSelectElement;
    expect(sel.tagName).toBe("SELECT");
    expect(sel.value).toBe("admin");
    fireEvent.change(sel, { target: { value: "user" } });
    expect(onChange).toHaveBeenCalledWith("user");
  });
});

describe("FormField as=checkbox", () => {
  it("renders a checkbox; onChange receives boolean second arg", () => {
    const onChange = vi.fn();
    render(
      <FormField
        id="agree"
        label="I agree"
        as="checkbox"
        checked={false}
        onChange={onChange}
      />,
    );
    const cb = screen.getByRole("checkbox");
    fireEvent.click(cb);
    expect(onChange).toHaveBeenCalledWith("true", true);
  });
});

describe("FormField inline modifier", () => {
  it("adds cc-form-field--inline class", () => {
    const { container } = render(
      <FormField id="a" label="A" value="" onChange={() => {}} inline />,
    );
    expect(container.querySelector(".cc-form-field--inline")).toBeTruthy();
  });
});
