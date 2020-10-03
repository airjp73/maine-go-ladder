/**
 * @jest-environment ./test/testEnv.js
 */
import { cleanupDB } from "./dbUtil";
import {
  forEachPage,
  generateCollection,
  randomAuditEvent,
  wait,
} from "./apiTestUtils";
import { AUDIT_PAGE_SIZE, getAuditEvents } from "../pages/api/audit-events";

describe("audit events", () => {
  beforeEach(async () => {
    await cleanupDB();
  });

  describe("get audit events", () => {
    it("should return all audit events", async () => {
      const allAuditEvents = await generateCollection(async (num) => {
        await wait(num * 50);
        return randomAuditEvent();
      }, 50);
      const expected = allAuditEvents.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      await forEachPage(
        expected,
        AUDIT_PAGE_SIZE,
        async (page, numItemsOnPage, expectedPage) => {
          const actual = await getAuditEvents(page);

          expect(actual.items).toHaveLength(numItemsOnPage);
          expect(actual.items.map((item) => item.id)).toEqual(
            expectedPage.map((item) => item.id)
          );
          expect(actual.page).toEqual(page);
          expect(actual.hasMore).toEqual(numItemsOnPage === AUDIT_PAGE_SIZE);
          actual.items.forEach((event, index) => {
            expect(expectedPage[index]).toMatchObject({ id: event.id });
          });
        }
      );
    });
  });

  it("should return empty if the page is too large", async () => {
    await generateCollection(() => randomAuditEvent(), 3);
    const { items } = await getAuditEvents(5);
    expect(items).toHaveLength(0);
  });
});
