import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

const TEST_FILES = [
  {
    name: 'test_scale.musicxml',
    expectedEvents: 8,
    expectedFirstNote: 'C4',
    expectedLastNote: 'C5',
    expectedQpm: 100,
  },
  {
    name: 'test_rests.musicxml',
    expectedEvents: 3,
    expectedFirstNote: 'E4',
    expectedLastNote: 'G4',
    expectedQpm: 120,
  },
  {
    name: 'test_ties.musicxml',
    expectedEvents: 4,
    expectedFirstNote: 'C4',
    expectedLastNote: 'F4',
    expectedQpm: 90,
  },
];

function getTestFilePath(filename: string): string {
  // Test files are in backend/tests
  // Playwright runs from frontend directory, so go up one level to project root
  return join(process.cwd(), '..', 'backend', 'tests', filename);
}

test.describe('MusicXML Upload and Parsing', () => {
  for (const testFile of TEST_FILES) {
    test(`should parse ${testFile.name} correctly`, async ({ page }) => {
      // Navigate to the app
      await page.goto('/');
      
      // Wait for the page to load
      await expect(page.locator('.brand')).toBeVisible();
      
      // Get the file input
      const fileInput = page.locator('input[type="file"]');
      expect(fileInput).toBeVisible();
      
      // Read the test file
      const filePath = getTestFilePath(testFile.name);
      const fileContent = readFileSync(filePath);
      
      // Upload the file
      await fileInput.setInputFiles({
        name: testFile.name,
        mimeType: 'application/xml',
        buffer: fileContent,
      });
      
      // Wait for file to be selected (the parse button should become enabled)
      await expect(page.locator('button:has-text("Parse on server")')).toBeEnabled();
      
      // Click parse button
      await page.locator('button:has-text("Parse on server")').click();
      
      // Wait for parsing to complete (button text changes back from "Parsing…")
      await expect(page.locator('button:has-text("Parse on server")')).toBeEnabled();
      await expect(page.locator('button:has-text("Parsing…")')).not.toBeVisible();
      
      // Check that no error message is shown
      const errorSection = page.locator('section.error');
      if (await errorSection.isVisible()) {
        const errorText = await errorSection.textContent();
        throw new Error(`Parsing failed with error: ${errorText}`);
      }
      
      // Check that events table is visible
      await expect(page.locator('table')).toBeVisible();
      
      // Check metadata - tempo
      await expect(page.locator(`text=${testFile.expectedQpm} qpm`)).toBeVisible();
      
      // Check that we have the expected number of events
      const eventRows = page.locator('tbody tr');
      await expect(eventRows).toHaveCount(testFile.expectedEvents);
      
      // Check first note
      const firstRow = eventRows.first();
      await expect(firstRow.locator('td').nth(3)).toContainText(testFile.expectedFirstNote);
      
      // Check last note
      const lastRow = eventRows.last();
      await expect(lastRow.locator('td').nth(3)).toContainText(testFile.expectedLastNote);
      
      // Check that fingerings are present (sax fingering component should be visible)
      await expect(page.locator('text=Alto Saxophone Fingering')).toBeVisible();
      
      // Check that SVG diagram is rendered
      await expect(page.locator('.sax-diagram')).toBeVisible();
      
      // Check that score is rendered
      const scoreContainer = page.locator('.scoreShell, .score');
      await expect(scoreContainer).toBeVisible();
    });
  }
  
  test('should display transport controls when parsed', async ({ page }) => {
    await page.goto('/');
    
    // Initially, transport controls should be disabled
    await expect(page.locator('button:has-text("Play")')).toBeDisabled();
    
    // Upload and parse a file
    const filePath = getTestFilePath('test_scale.musicxml');
    const fileContent = readFileSync(filePath);
    
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test_scale.musicxml',
      mimeType: 'application/xml',
      buffer: fileContent,
    });
    
    await page.locator('button:has-text("Parse on server")').click();
    await expect(page.locator('button:has-text("Parse on server")')).toBeEnabled();
    
    // After parsing, transport controls should be enabled
    await expect(page.locator('button:has-text("Play")')).toBeEnabled();
    await expect(page.locator('button:has-text("Pause")')).toBeEnabled();
    
    // Time display should be visible
    await expect(page.locator('text=/t=\\d+\\.\\d+s/')).toBeVisible();
  });
  
  test('should handle file upload and display score', async ({ page }) => {
    await page.goto('/');
    
    const filePath = getTestFilePath('test_scale.musicxml');
    const fileContent = readFileSync(filePath);
    
    // Upload file
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test_scale.musicxml',
      mimeType: 'application/xml',
      buffer: fileContent,
    });
    
    // Score should be rendered even before parsing
    const scoreContainer = page.locator('.scoreShell, .score');
    await expect(scoreContainer).toBeVisible();
    
    // Parse the file
    await page.locator('button:has-text("Parse on server")').click();
    await expect(page.locator('button:has-text("Parse on server")')).toBeEnabled();
    
    // Events table should be visible after parsing
    await expect(page.locator('table')).toBeVisible();
  });
});

