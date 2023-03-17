import { promises as fs } from "fs";
import path from "path";
import jwt from "jsonwebtoken";
require("dotenv").config();

import { NextRequest } from "next/server";
import { cores } from "@/config/cores";

async function createDirectory(path: string) {
  try {
    await fs.mkdir(path);
  } catch {}
}

async function exists(path: string) {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function sanitizePath(prefix: string, subPath: string) {
  const unsafePath = prefix + subPath;
  const safePath = path.normalize(unsafePath).replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(process.cwd(), safePath);
}

async function getBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function verifyToken(request: NextRequest) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;

  const tokenCookie = request.cookies.get("token");
  if (!tokenCookie) return false;

  try {
    jwt.verify(tokenCookie.value, secret);
    return true;
  } catch {
    return false;
  }
}

function isCore(core: string) {
  return Object.keys(cores).includes(core);
}

export { createDirectory, exists, sanitizePath, getBody, verifyToken, isCore };
