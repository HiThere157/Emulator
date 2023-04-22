import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

import { validateToken } from "@/helpers/auth";

export const revalidate = 0;
const stateDBPath = path.join(process.cwd(), "data/states.json");

/*
  Response: StateFileDetails[]
  Codes: 401
*/
export async function GET(request: NextRequest) {}
