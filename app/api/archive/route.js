import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { format } from 'date-fns';

const DATA_DIR = path.join(process.cwd(), 'data');
const ARCHIVE_DIR = path.join(process.cwd(), 'archives');

export async function POST() {
  try {
    // Ensure the archive directory exists
    if (!fs.existsSync(ARCHIVE_DIR)) {
      fs.mkdirSync(ARCHIVE_DIR);
    }

    // Generate timestamped archive filename
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const archivePath = path.join(ARCHIVE_DIR, `archive_${timestamp}.zip`);

    // Create the zip archive command
    const zipCommand = `zip -r ${archivePath} ${DATA_DIR}`;

    // Execute the zip command
    await new Promise((resolve, reject) => {
      exec(zipCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('Error creating archive:', stderr);
          reject(error);
        } else {
          console.log('Archive created successfully:', stdout);
          resolve(stdout);
        }
      });
    });

    return NextResponse.json({ message: 'Archive created successfully', archivePath });
  } catch (error) {
    console.error('Error archiving files:', error);
    return NextResponse.json({ error: 'Failed to create archive' }, { status: 500 });
  }
}
