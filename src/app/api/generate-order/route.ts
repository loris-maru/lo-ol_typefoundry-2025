import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import Stripe from "stripe";
import slugify from "@/utils/slugify";
import { getStorage } from "../../../../lib/gcp/storage";

// Type definitions
export type FontItem = {
  fontID?: string;
  fontFamilyId?: string;
  fontFamilyID?: string; // Handle case variations
  family?: string;
  licenseType?: string;
  license?: string;
  widthName?: string;
  weightName?: string;
  weight?: number;
  slantName?: string;
  isItalic?: boolean;
};

export type PackageItem = {
  fonts?: FontItem[];
  [key: string]: unknown;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

const GCS_ASSETS_BUCKET = "typefaces-assets_2025";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, items, productType } = await req.json();

    console.log("=== VERCEL ORDER GENERATION API START ===");
    console.log("Session ID:", sessionId);
    console.log("Product Type:", productType);
    console.log("Items:", items);

    // Check environment variables
    console.log("Environment check:");
    console.log("- STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "SET" : "MISSING");

    // Test GCS connection
    try {
      const storage = getStorage();
      console.log("- Google Cloud Storage: CONNECTED");
    } catch (error) {
      console.log("- Google Cloud Storage: ERROR -", error);
    }

    if (!sessionId || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    // Validate Stripe session
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeError: unknown) {
      console.error("Stripe session retrieval error:", stripeError);
      if (
        stripeError &&
        typeof stripeError === "object" &&
        "code" in stripeError &&
        stripeError.code === "resource_missing"
      ) {
        const isLiveKey = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_");
        const isTestSession = sessionId.startsWith("cs_test_");

        if (isLiveKey && isTestSession) {
          return new NextResponse(
            "Cannot use live Stripe key with test session. Please use test key or create live session.",
            { status: 400 },
          );
        }

        return new NextResponse("Stripe session not found or expired", { status: 404 });
      }
      throw stripeError;
    }

    if (!session || session.payment_status !== "paid") {
      return new NextResponse("Unpaid or invalid Stripe session", { status: 403 });
    }

    console.log("Session payment status:", session.payment_status);
    console.log("Session amount total:", session.amount_total);

    // Route to appropriate handler based on product type
    let downloadUrl: string;

    switch (productType) {
      case "static":
        downloadUrl = await handleStaticProduct(items, sessionId);
        break;
      case "package":
        downloadUrl = await handlePackageProduct(items, sessionId);
        break;
      case "custom":
        downloadUrl = await handleCustomProduct(sessionId, items);
        break;
      default:
        return new NextResponse("Invalid product type. Must be 'static', 'package', or 'custom'", {
          status: 400,
        });
    }

    return NextResponse.json({ downloadUrl });
  } catch (err) {
    console.error("Vercel order generation API error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}

async function handleStaticProduct(items: FontItem[], sessionId: string): Promise<string> {
  console.log("=== HANDLING STATIC PRODUCT ===");

  // Create ZIP file in memory
  const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("data", (chunk) => chunks.push(chunk));
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", reject);

    (async () => {
      try {
        // Group items by family
        const families = new Map<string, FontItem[]>();
        for (const item of items) {
          // Handle both fontFamilyId and fontFamilyID (case variations)
          const familyId = slugify(item.fontFamilyId || (item as any).fontFamilyID || item.family);
          if (!families.has(familyId)) {
            families.set(familyId, []);
          }
          families.get(familyId)!.push(item);
        }

        console.log("Processing families:", Array.from(families.keys()));

        // Process each family
        for (const [familyId, familyItems] of families) {
          console.log(`Processing family: ${familyId} with ${familyItems.length} items`);

          // Create family folder structure
          await createFamilyFolder(archive, familyId, familyItems);
        }

        // Add EULA to root
        await addEulaToZip(archive);

        archive.finalize();
      } catch (error) {
        console.error("Error creating static product ZIP:", error);
        reject(error);
      }
    })();
  });

  // Upload ZIP to Google Cloud Storage
  const zipKey = `orders/static-${sessionId}-${Date.now()}.zip`;
  await uploadToGCS(GCS_ASSETS_BUCKET, zipKey, zipBuffer, "application/zip");

  // Generate signed URL
  const downloadUrl = await getSignedUrl(GCS_ASSETS_BUCKET, zipKey, 7200);

  console.log("Static product ZIP created:", downloadUrl);
  return downloadUrl;
}

async function handlePackageProduct(items: PackageItem[], sessionId: string): Promise<string> {
  console.log("=== HANDLING PACKAGE PRODUCT ===");

  // For package products, items should contain the package information
  // and a list of fonts included in the package
  const packageInfo = items[0]; // Assuming first item contains package info
  const packageFonts = packageInfo.fonts || []; // List of fonts in the package

  console.log("Package info:", packageInfo);
  console.log("Package fonts:", packageFonts);

  // Create ZIP file similar to static but using package fonts
  const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("data", (chunk) => chunks.push(chunk));
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", reject);

    (async () => {
      try {
        // Group package fonts by family
        const families = new Map<string, FontItem[]>();
        for (const font of packageFonts) {
          const familyId = slugify(font.family || font.fontFamilyId);
          if (!families.has(familyId)) {
            families.set(familyId, []);
          }
          families.get(familyId)!.push(font);
        }

        console.log("Processing package families:", Array.from(families.keys()));

        // Process each family
        for (const [familyId, familyItems] of families) {
          console.log(`Processing package family: ${familyId} with ${familyItems.length} items`);

          // Create family folder structure
          await createFamilyFolder(archive, familyId, familyItems);
        }

        // Add EULA to root
        await addEulaToZip(archive);

        archive.finalize();
      } catch (error) {
        console.error("Error creating package product ZIP:", error);
        reject(error);
      }
    })();
  });

  // Upload ZIP to Google Cloud Storage
  const zipKey = `orders/package-${sessionId}-${Date.now()}.zip`;
  await uploadToGCS(GCS_ASSETS_BUCKET, zipKey, zipBuffer, "application/zip");

  // Generate signed URL
  const downloadUrl = await getSignedUrl(GCS_ASSETS_BUCKET, zipKey, 7200);

  console.log("Package product ZIP created:", downloadUrl);
  return downloadUrl;
}

async function handleCustomProduct(sessionId: string, items: FontItem[]): Promise<string> {
  console.log("=== HANDLING CUSTOM PRODUCT ===");

  // Call the existing Google Cloud Run API for custom products
  if (!process.env.FONT_WORKER_URL) {
    throw new Error("FONT_WORKER_URL environment variable is not set");
  }

  const res = await fetch(`${process.env.FONT_WORKER_URL}/generate-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Worker-Auth": `Bearer ${process.env.WORKER_SHARED_SECRET!}`,
    },
    body: JSON.stringify({ sessionId, items }),
  });

  if (!res.ok) {
    const msg = await res.text();
    console.error("Custom product worker error:", msg);
    throw new Error(`Custom product generation failed: ${msg}`);
  }

  const data = await res.json();
  console.log("Custom product generated:", data.downloadUrl);
  return data.downloadUrl;
}

async function createFamilyFolder(
  archive: archiver.Archiver,
  familyId: string,
  familyItems: FontItem[],
) {
  console.log(`Creating family folder for: ${familyId}`);

  // Add specimen PDF
  try {
    const specimenKey = `${familyId}/lo-ol_specimen-${familyId}.pdf`;
    const specimenBuffer = await downloadFromGCS(GCS_ASSETS_BUCKET, specimenKey);
    archive.append(specimenBuffer, { name: `${familyId}/specimen.pdf` });
    console.log(`✅ Added specimen: ${familyId}/specimen.pdf`);
  } catch (error) {
    console.warn(`⚠️ Could not find specimen for ${familyId}:`, error);
    // Add placeholder
    archive.append("Specimen not available", { name: `${familyId}/specimen.txt` });
  }

  // Add trial font package
  try {
    const trialKey = `${familyId}/lo-ol_${familyId}-trial.zip`;
    const trialBuffer = await downloadFromGCS(GCS_ASSETS_BUCKET, trialKey);
    archive.append(trialBuffer, { name: `${familyId}/trial.zip` });
    console.log(`✅ Added trial package: ${familyId}/trial.zip`);
  } catch (error) {
    console.warn(`⚠️ Could not find trial package for ${familyId}:`, error);
    // Add placeholder
    archive.append("Trial package not available", { name: `${familyId}/trial.txt` });
  }

  // Process each font item
  for (const item of familyItems) {
    const license = item.licenseType?.toLowerCase() || item.license?.toLowerCase() || "web";
    const fontName = getFontFileName(familyId, item);

    console.log(`Processing font: ${fontName} with license: ${license}`);

    // Determine which extensions to include based on license
    // Print licenses get OTF and TTF, Web licenses get WOFF and WOFF2
    const isPrintLicense = license === "print" || license === "webandprint";
    const extensions = isPrintLicense ? ["otf", "ttf"] : ["woff", "woff2"];

    // Add each extension
    for (const ext of extensions) {
      try {
        const fontKey = `${familyId}/${ext}/${fontName}.${ext}`;
        console.log(`Trying to fetch font from assets bucket: ${fontKey}`);
        const fontBuffer = await downloadFromGCS(GCS_ASSETS_BUCKET, fontKey);
        archive.append(fontBuffer, { name: `${familyId}/${ext}/${fontName}.${ext}` });
        console.log(`✅ Added ${ext}: ${familyId}/${ext}/${fontName}.${ext}`);
      } catch (error) {
        console.warn(`⚠️ Could not find ${ext} font for ${fontName}:`, error);
        // Add placeholder
        archive.append(`Font file not available: ${fontName}.${ext}`, {
          name: `${familyId}/${ext}/${fontName}-error.txt`,
        });
      }
    }
  }
}

async function addEulaToZip(archive: archiver.Archiver) {
  try {
    const eulaKey = "lo-ol__EULA.pdf";
    const eulaBuffer = await downloadFromGCS(GCS_ASSETS_BUCKET, eulaKey);
    archive.append(eulaBuffer, { name: "EULA.pdf" });
    console.log("✅ Added EULA.pdf to root");
  } catch (error) {
    console.warn("⚠️ Could not find EULA.pdf:", error);
    // Add placeholder
    archive.append("EULA not available", { name: "EULA.txt" });
  }
}

function getFontFileName(familyId: string, item: FontItem): string {
  // Use fontID directly if available (exact filename in bucket)
  if (item.fontID) {
    return item.fontID;
  }

  // Fallback to generated name if fontID not provided
  const parts = [familyId];

  // Map weight numbers to weight names
  const weightMap: { [key: number]: string } = {
    100: "thin",
    200: "extralight",
    300: "light",
    400: "regular",
    500: "medium",
    600: "semibold",
    700: "bold",
    800: "extrabold",
    900: "black",
  };

  // Add weight information
  if (item.weightName) {
    parts.push(slugify(item.weightName));
  } else if (item.weight && weightMap[item.weight]) {
    parts.push(weightMap[item.weight]);
  }

  // Add width information
  if (item.widthName && item.widthName !== "Normal") {
    parts.push(slugify(item.widthName));
  }

  // Add slant information
  if (item.slantName && item.slantName !== "Normal") {
    parts.push(slugify(item.slantName));
  }

  // Add italic information
  if (item.isItalic) {
    parts.push("italic");
  }

  return parts.join("-");
}

async function downloadFromGCS(bucket: string, fileName: string): Promise<Buffer> {
  const storage = getStorage();
  const file = storage.bucket(bucket).file(fileName);

  try {
    const [data] = await file.download();
    return data;
  } catch (error) {
    throw new Error(`Failed to download ${bucket}/${fileName}: ${error}`);
  }
}

async function uploadToGCS(bucket: string, fileName: string, buffer: Buffer, contentType: string) {
  const storage = getStorage();
  const file = storage.bucket(bucket).file(fileName);

  await file.save(buffer, {
    metadata: {
      contentType: contentType,
    },
  });

  console.log(`Uploaded to GCS: ${bucket}/${fileName}`);
}

async function getSignedUrl(
  bucket: string,
  fileName: string,
  expiresInSeconds: number,
): Promise<string> {
  const storage = getStorage();
  const file = storage.bucket(bucket).file(fileName);

  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + expiresInSeconds * 1000,
  });

  return signedUrl;
}
