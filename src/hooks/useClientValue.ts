"use client";

import { useEffect, useState } from "react";

/**
 * A value that can only be known in the browser (today's date, the visitor's time, the screen size ...).
 * The first render, on the server and in the browser, uses `serverValue`, so the two always match; right after the page
 * is shown the real value is read. Reading it during the first render would break hydration.
 */
export function useClientValue<T>(read: () => T, serverValue: T): T {
  const [value, setValue] = useState(serverValue);
  useEffect(() => setValue(read()), []); // eslint-disable-line react-hooks/exhaustive-deps
  return value;
}
