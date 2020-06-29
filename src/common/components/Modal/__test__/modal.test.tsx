import * as React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalButton from "../ModalButton";
import renderWithContext from "../../../testing/renderWithContext";

describe("modal", () => {
  it("should only mount children when open", async () => {
    renderWithContext(
      <ModalButton title="Test Modal" buttonLabel="Open Modal">
        {({ close }) => <button data-testid="test-close" onClick={close} />}
      </ModalButton>
    );

    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("test-close")).not.toBeInTheDocument();

    userEvent.click(screen.getByText("Open Modal"));
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByTestId("test-close")).toBeInTheDocument();

    // Close via built-in modal close button
    userEvent.click(screen.getByLabelText("close"));
    await waitFor(() => {
      expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("test-close")).not.toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Open Modal"));
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByTestId("test-close")).toBeInTheDocument();

    // close via callback supplied to children
    userEvent.click(screen.getByTestId("test-close"));
    await waitFor(() => {
      expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("test-close")).not.toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Open Modal"));
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByTestId("test-close")).toBeInTheDocument();

    // Close via clicking the overlay
    userEvent.click(screen.getByTestId("modal-overlay"));
    await waitFor(() => {
      expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("test-close")).not.toBeInTheDocument();
    });
  });
});
