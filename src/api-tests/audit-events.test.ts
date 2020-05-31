/**
 * @jest-environment ./test/testEnv.js
 */
import { cleanupDB } from "./dbUtil";
import { generateCollection, randomAuditEvent } from "./randomUtils";
import { getAuditEvents } from "../pages/api/audit-events";

describe("audit events", () => {
  beforeEach(async () => {
    await cleanupDB();
  });

  describe("get audit events", () => {
    it("should return all audit events", async () => {
      const expected = await generateCollection(() => randomAuditEvent());
      const actual = await getAuditEvents();

      expect(actual).toHaveLength(expected.length);
      expected.forEach((event) => {
        expect(actual).toContainEqual(
          expect.objectContaining({ id: event.id })
        );
      });
    });
  });
});
