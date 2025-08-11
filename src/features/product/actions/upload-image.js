"use server"

import path from "path";
import fs from "fs/promises";

export async function uploadImageAction(formData) {
    const file = formData.get("image"); 
    if (!file) {
        throw new Error("No file uploaded");
    }

    // Ensure upload folder exists
    const uploadDir = path.join(process.cwd(), "public", "upload");
    await fs.mkdir(uploadDir, { recursive: true });

    // Create a unique filename
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const fileName = `${file.name.split(".")[0]}_${timestamp}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return `/upload/${fileName}`; 
}
