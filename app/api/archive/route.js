// app/api/archive/route.js
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const dataDir = path.join(process.cwd(), "data");
    const archiveDir = path.join(process.cwd(), "archives");

    // Ensure the archive directory exists
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir);
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .replace(/\..+/, "");
    const archiveName = `archive_${timestamp}.zip`;
    const archivePath = path.join(archiveDir, archiveName);

    // Archive command
    const command = `zip -r "${archivePath}" "${dataDir}"`;

    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during archiving: ${error.message}`);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }

      console.log(`stdout: ${stdout}`);
    });

    return NextResponse.json({ success: true, message: `Files archived successfully at ${archivePath}` });
  } catch (err) {
    console.error("Error during file archiving:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}