// api/update.js
import { Octokit } from "@octokit/rest";
import { Buffer } from "buffer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const newContent = req.body;
    const contentStr = JSON.stringify(newContent, null, 2);

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN, // Set in Vercel env
    });

    const owner = "তোমার-গিটহাব-ইউজারনেম"; // e.g., "darks360"
    const repo = "my-json-config";
    const path = "config.json";
    const branch = "main";

    // Get current file SHA
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    const sha = fileData.sha;

    // Update file
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: "Update config.json via Vercel editor",
      content: Buffer.from(contentStr).toString("base64"),
      sha,
      branch,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
