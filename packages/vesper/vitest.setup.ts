import * as jestMatchers from "@testing-library/jest-dom/matchers";
import * as axeMatchers from "vitest-axe/matchers";
import { expect } from "vitest";

expect.extend(jestMatchers);
expect.extend(axeMatchers);
