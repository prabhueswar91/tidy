import crypto from "crypto";
import {getk} from "../auth1/authkey"
const k = getk();
const ilength = 16;

export function encryptData<T>(data: T): string {
  try {
    const iv = crypto.randomBytes(ilength);
    const key = crypto.createHash("sha256").update(String(k)).digest("base64").substring(0, 32);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

    const jsonData = JSON.stringify(data);
    let encrypted = cipher.update(jsonData, "utf8", "base64");
    encrypted += cipher.final("base64");

    // Return iv + encrypted data
    return encodeURIComponent(iv.toString("base64") + ":" + encrypted);
  } catch (err) {
    console.error("Encryption error:", err);
    return "";
  }
}
