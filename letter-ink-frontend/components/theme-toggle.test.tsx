import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";

// Mock next-themes
const mockSetTheme = vi.fn();
vi.mock("next-themes", () => ({
	useTheme: () => ({
		setTheme: mockSetTheme,
		theme: "light",
	}),
}));

describe("ThemeToggle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders the theme toggle button", () => {
		render(<ThemeToggle />);
		expect(screen.getByRole("button", { name: /change theme/i })).toBeInTheDocument();
	});

	it("opens the dropdown and calls setTheme on click", async () => {
		const user = userEvent.setup();
		render(<ThemeToggle />);

		// Click the toggle button to open the dropdown
		const toggleButton = screen.getByRole("button", { name: /change theme/i });
		await user.click(toggleButton);

		// Find the dark theme option and click it
		const darkOption = await screen.findByText("Dark");
		expect(darkOption).toBeInTheDocument();

		await user.click(darkOption);

		// Assert setTheme was called with 'dark'
		expect(mockSetTheme).toHaveBeenCalledWith("dark");
	});
});
