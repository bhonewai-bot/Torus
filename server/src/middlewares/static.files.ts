import express from "express";
import path from "path";
import * as process from "node:process";

export function serveUploads(app: express.Application) {
    const uploadsPath = path.join(process.cwd(), "uploads");

    app.use("/uploads", express.static(uploadsPath, {
        maxAge: "1y",
        etag: true,
        lastModified: true,
    }));
}