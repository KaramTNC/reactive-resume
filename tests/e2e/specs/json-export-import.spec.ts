import { createSampleResumeFromDashboard, openSidebarSection } from "../fixtures/resume";
import { expect, test } from "../fixtures/test";

test("exports and imports a resume JSON backup", async ({ authPage: page }, testInfo) => {
	const resumeName = await createSampleResumeFromDashboard(page, testInfo);

	await openSidebarSection(page, "Export");

	const downloadPromise = page.waitForEvent("download");
	await page.getByRole("button", { name: /^JSON/ }).click();
	const download = await downloadPromise;
	expect(download.suggestedFilename()).toMatch(/\.json$/);

	const downloadPath = await download.path();
	if (!downloadPath) throw new Error("Expected Playwright to provide a downloaded JSON path.");

	await page.goto("/dashboard/resumes");
	await page.getByText("Import an existing resume").click();
	await page.getByRole("combobox").click();
	await page.getByRole("option", { name: "Reactive Resume (JSON)" }).click();
	await page.locator('input[type="file"]').setInputFiles(downloadPath);
	await page.getByRole("button", { name: "Import" }).click();

	await page.waitForURL(/\/builder\/.+/);
	await openSidebarSection(page, "Basics");
	await expect(page.getByLabel("Name")).toHaveValue(/.+/);
	await expect(page.getByText(resumeName)).toBeVisible();
});
