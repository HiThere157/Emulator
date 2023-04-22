import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

import { validateToken } from "@/helpers/auth";

export const revalidate = 0;
const stateDBPath = path.join(process.cwd(), "data/states.json");
const stateFilePath = path.join(process.cwd(), "data/states");

type Props = {
  params: {
    rom_id: number;
    slot: number;
  };
};

/*
  Params: rom_id, slot
  Response: blob
  Codes: 401, 404
*/
export async function GET(request: NextRequest, { params }: Props) {}

/*
  Params: rom_id, slot
  Body: blob
  Codes: 400, 401, 404
*/
export async function POST(request: NextRequest, { params }: Props) {}
