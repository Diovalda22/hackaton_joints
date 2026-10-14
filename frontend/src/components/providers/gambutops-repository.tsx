"use client";

import type { GambutOpsRepository } from "@/lib/api";
import { createRepositoryContext } from "./repository-context";

export const { RepositoryProvider, useRepository } = createRepositoryContext<GambutOpsRepository>();
