import { test, expect } from "@playwright/test";

test.describe("MindMirror happy path", () => {
  test("onboarding → journal → insight → dashboard", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /get started/i }).click();
    await expect(page).toHaveURL(/onboarding/);

    await page.getByLabel(/what should we call you/i).fill("Test Student");
    await page.getByRole("radio", { name: "NEET" }).click();
    await page.getByRole("checkbox", { name: /consent/i }).check();
    await page.getByRole("button", { name: /begin my journey/i }).click();

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText(/burnout radar/i)).toBeVisible();

    await page.getByRole("link", { name: /journal/i }).click();
    await page
      .getByLabel(/what's on your mind/i)
      .fill("Mock test went okay today. Feeling relieved but tired.");
    await page.getByRole("radio", { name: /mood 4/i }).click();
    await page.getByRole("button", { name: /save entry/i }).click();

    await page.getByRole("link", { name: /dashboard/i }).click();
    await page.getByRole("button", { name: /reveal hidden patterns/i }).click();

    await expect(page.getByText(/hidden stress triggers/i)).toBeVisible({ timeout: 15000 });

    await expect(page.getByText(/burnout/i)).toBeVisible();
  });
});
