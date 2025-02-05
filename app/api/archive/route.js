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

    // Get the current date and time and format it as YYYY-MM-DD_HH
    const timestamp = new Date();
    const year = timestamp.getFullYear();
    const month = String(timestamp.getMonth() + 1).padStart(2, "0");
    const day = String(timestamp.getDate()).padStart(2, "0");
    const hour = String(timestamp.getHours()).padStart(2, "0");
    const formattedTimestamp = `${year}-${month}-${day}`;

    const archiveName = `archive_${formattedTimestamp}.zip`;
    const archivePath = path.join(archiveDir, archiveName);

    // Windows-specific archive command using PowerShell
    const command = `powershell Compress-Archive -Path \"${dataDir}\\*\" -DestinationPath \"${archivePath}\"`;

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
