import { createSampleResumeFromDashboard, openSidebarSection } from "../fixtures/resume";
import { expect, test } from "../fixtures/test";

test("creates a sample resume and persists a basics edit", async ({ authPage: page }, testInfo) => {
	await createSampleResumeFromDashboard(page, testInfo);

	const updatedName = `E2E Edited ${Date.now()}`;
	await openSidebarSection(page, "Basics");
	await page.getByLabel("Name").fill(updatedName);

	await page.reload();
	await openSidebarSection(page, "Basics");
	await expect(page.getByLabel("Name")).toHaveValue(updatedName);
});
