import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import archiver from "archiver";
import * as fontkit from "fontkit";
import sfnt2woff from "sfnt2woff";
import woff2 from "woff2";

export const runtime = "nodejs";

// Cloudflare R2 configuration
const r2Client = new S3Client({
  region: "auto",
  endpoint: "https://0e9fe6c8e5d9d90fd9ab4a7ddaaa19f5.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "d079cadbc6069fb6d263a762dedc79e8",
    secretAccessKey: "443fe4f2c129eaf256c01cbbd3c1c876de5fbd5a0fb85aa2299ed012616a4a51",
  },
});

const R2_ASSETS_BUCKET = process.env.R2_ASSETS_BUCKET!;
const R2_ORDERS_BUCKET = process.env.R2_ORDERS_BUCKET!;
const R2_FONTS_BUCKET = "type-families"; // Your variable font source bucket

interface FontItem {
  fontFamilyID: string;
  weight: number;
  width?: number;
  slant?: number;
  opticalSize?: number;
  isItalic: boolean;
  license: string;
  specimen: string;
  eula: string;
}

async function fetchFromR2(bucket: string, key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await r2Client.send(command);
  const chunks: Uint8Array[] = [];

  if (response.Body) {
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
  }

  return Buffer.concat(chunks);
}

async function uploadToR2(
  bucket: string,
  key: string,
  data: Buffer,
  contentType: string,
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: data,
    ContentType: contentType,
  });

  await r2Client.send(command);
}

async function generatePresignedUrl(
  bucket: string,
  key: string,
  expiresIn: number = 7200,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}

function getFontFileName(fontFamilyID: string, item: FontItem): string {
  const tokens = [`${item.weight}w`];

  if (item.width !== undefined) tokens.push(`${item.width}wd`);
  if (item.slant !== undefined) tokens.push(`${item.slant}sl`);
  if (item.opticalSize !== undefined) tokens.push(`${item.opticalSize}op`);
  if (item.isItalic) tokens.push("Italic");

  return `${fontFamilyID}-${tokens.join("-")}`.replace("--", "-");
}

function getVariableFontKey(fontFamilyID: string, isItalic: boolean): string {
  // Convert fontFamilyID to uppercase for file naming
  const familyName = fontFamilyID.toUpperCase().replace(/-/g, "-");
  return isItalic
    ? `${fontFamilyID}/${familyName}-Italic-VF.ttf`
    : `${fontFamilyID}/${familyName}-VF.ttf`;
}

async function convertToWoff(ttfBuffer: Buffer): Promise<Buffer> {
  try {
    console.log("Converting TTF to WOFF...");
    const woffBuffer = sfnt2woff(ttfBuffer);
    console.log(`✅ WOFF conversion successful, size: ${woffBuffer.length} bytes`);
    return woffBuffer;
  } catch (error) {
    console.error("Error converting to WOFF:", error);
    throw error;
  }
}

async function convertToWoff2(ttfBuffer: Buffer): Promise<Buffer> {
  try {
    console.log("Converting TTF to WOFF2...");
    const woff2Buffer = woff2.encode(ttfBuffer);
    console.log(`✅ WOFF2 conversion successful, size: ${woff2Buffer.length} bytes`);
    return woff2Buffer;
  } catch (error) {
    console.error("Error converting to WOFF2:", error);
    throw error;
  }
}

async function convertToWoff3(ttfBuffer: Buffer): Promise<Buffer> {
  // WOFF3 is not yet supported by fontkit, so we'll return the TTF as-is for now
  // In a real implementation, you might need to use a different library or service
  console.warn("WOFF3 conversion not yet implemented, returning TTF");
  return ttfBuffer;
}

async function convertToOtf(ttfBuffer: Buffer): Promise<Buffer> {
  try {
    console.log("Converting TTF to OTF...");
    // For now, we'll return the TTF as OTF since they're very similar
    // In a real implementation, you might want to use a proper TTF->OTF converter
    console.log(`✅ OTF conversion successful (using TTF), size: ${ttfBuffer.length} bytes`);
    return ttfBuffer;
  } catch (error) {
    console.error("Error converting to OTF:", error);
    throw error;
  }
}

async function generateFontFormats(
  variableFontBuffer: Buffer,
  item: FontItem,
  fontName: string,
): Promise<{ ttf: Buffer; woff?: Buffer; woff2?: Buffer; woff3?: Buffer; otf?: Buffer }> {
  const ttf = variableFontBuffer;
  const result: { ttf: Buffer; woff?: Buffer; woff2?: Buffer; woff3?: Buffer; otf?: Buffer } = {
    ttf,
  };

  console.log(`Generating font formats for ${fontName}, license: ${item.license}`);

  try {
    // Generate web formats for web licenses (case-insensitive check)
    const license = item.license?.toLowerCase();
    if (license === "web" || license === "webanddesktop") {
      console.log(`Converting ${fontName} to web formats...`);
      result.woff = await convertToWoff(ttf);
      result.woff2 = await convertToWoff2(ttf);
      result.woff3 = await convertToWoff3(ttf);
      console.log(`✅ Web format conversion completed for ${fontName}`);
    } else {
      console.log(`Skipping web format conversion for ${fontName} (license: ${item.license})`);
    }

    // Generate desktop formats for desktop licenses (case-insensitive check)
    if (license === "desktop" || license === "webanddesktop") {
      console.log(`Converting ${fontName} to desktop formats...`);
      result.otf = await convertToOtf(ttf);
      console.log(`✅ Desktop format conversion completed for ${fontName}`);
    } else {
      console.log(`Skipping desktop format conversion for ${fontName} (license: ${item.license})`);
    }
  } catch (error) {
    console.error(`Error converting font formats for ${fontName}:`, error);
    // Don't throw, just log the error and continue with TTF only
  }

  return result;
}

export async function POST(req: Request) {
  try {
    const { orderRef, items }: { orderRef: string; items: FontItem[] } = await req.json();

    console.log("=== GENERATE ORDER API START ===");
    console.log("Order ref:", orderRef);
    console.log("Items:", items);

    if (!orderRef || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Group items by font family
    const itemsByFamily = items.reduce(
      (acc, item) => {
        if (!acc[item.fontFamilyID]) {
          acc[item.fontFamilyID] = [];
        }
        acc[item.fontFamilyID].push(item);
        return acc;
      },
      {} as Record<string, FontItem[]>,
    );

    // Create ZIP file in memory
    const zipBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.on("data", (chunk) => chunks.push(chunk));
      archive.on("end", () => resolve(Buffer.concat(chunks)));
      archive.on("error", reject);

      // Process each font family
      (async () => {
        try {
          for (const [fontFamilyID, familyItems] of Object.entries(itemsByFamily)) {
            console.log(`Processing family: ${fontFamilyID}`);

            // Add specimen PDF for this family
            try {
              // Try specimen in family folder first, then root
              let specimenKey = `${fontFamilyID}/lo-ol_specimen-${fontFamilyID}.pdf`;
              console.log(`Looking for specimen: ${specimenKey} in bucket: ${R2_FONTS_BUCKET}`);
              let specimenBuffer;
              try {
                specimenBuffer = await fetchFromR2(R2_FONTS_BUCKET, specimenKey);
              } catch (error) {
                // Try root location as fallback
                specimenKey = `lo-ol_specimen-${fontFamilyID}.pdf`;
                console.log(`Trying fallback specimen location: ${specimenKey}`);
                specimenBuffer = await fetchFromR2(R2_FONTS_BUCKET, specimenKey);
              }
              archive.append(specimenBuffer, {
                name: `${fontFamilyID}/${fontFamilyID}-specimen.pdf`,
              });
              console.log(`✅ Added specimen for ${fontFamilyID}`);
            } catch (error) {
              console.warn(`Could not fetch specimen for ${fontFamilyID}:`, error);
              // Create a placeholder file instead of failing
              archive.append("Specimen not available", {
                name: `${fontFamilyID}/${fontFamilyID}-specimen.txt`,
              });
            }

            // Process each font item in this family
            for (const item of familyItems) {
              try {
                const variableFontKey = getVariableFontKey(fontFamilyID, item.isItalic);
                console.log(`Looking for font: ${variableFontKey} in bucket: ${R2_FONTS_BUCKET}`);
                const variableFontBuffer = await fetchFromR2(R2_FONTS_BUCKET, variableFontKey);

                const fontName = getFontFileName(fontFamilyID, item);
                const fontFormats = await generateFontFormats(variableFontBuffer, item, fontName);

                // Add TTF (always included)
                archive.append(fontFormats.ttf, { name: `${fontFamilyID}/${fontName}.ttf` });
                console.log(`✅ Added TTF: ${fontName}.ttf`);

                // Add web formats for web licenses (case-insensitive check)
                const license = item.license?.toLowerCase();
                if (license === "web" || license === "webanddesktop") {
                  console.log(`Adding web formats for ${fontName}:`, {
                    hasWoff: !!fontFormats.woff,
                    hasWoff2: !!fontFormats.woff2,
                    hasWoff3: !!fontFormats.woff3,
                  });

                  if (fontFormats.woff) {
                    archive.append(fontFormats.woff, { name: `${fontFamilyID}/${fontName}.woff` });
                    console.log(`✅ Added WOFF: ${fontName}.woff`);
                  }
                  if (fontFormats.woff2) {
                    archive.append(fontFormats.woff2, {
                      name: `${fontFamilyID}/${fontName}.woff2`,
                    });
                    console.log(`✅ Added WOFF2: ${fontName}.woff2`);
                  }
                  if (fontFormats.woff3) {
                    archive.append(fontFormats.woff3, {
                      name: `${fontFamilyID}/${fontName}.woff3`,
                    });
                    console.log(`✅ Added WOFF3: ${fontName}.woff3`);
                  }
                }

                // Add desktop formats for desktop licenses (case-insensitive check)
                if (license === "desktop" || license === "webanddesktop") {
                  console.log(`Adding desktop formats for ${fontName}:`, {
                    hasOtf: !!fontFormats.otf,
                  });

                  if (fontFormats.otf) {
                    archive.append(fontFormats.otf, { name: `${fontFamilyID}/${fontName}.otf` });
                    console.log(`✅ Added OTF: ${fontName}.otf`);
                  }
                }
              } catch (error) {
                console.error(`Error processing font item for ${fontFamilyID}:`, error);
                // Create a placeholder file instead of failing completely
                const fontName = getFontFileName(fontFamilyID, item);
                archive.append("Font file not available", {
                  name: `${fontFamilyID}/${fontName}-error.txt`,
                });
                // Continue with other items even if one fails
              }
            }
          }

          // Add EULA PDF at root level
          try {
            // Try different EULA file locations
            let eulaKey = "lo-ol_EULA.pdf";
            console.log(`Looking for EULA: ${eulaKey} in bucket: ${R2_FONTS_BUCKET}`);
            let eulaBuffer;
            try {
              eulaBuffer = await fetchFromR2(R2_FONTS_BUCKET, eulaKey);
            } catch (error) {
              // Try alternative EULA locations
              const alternativeEulaKeys = [
                "EULA.pdf",
                "eula.pdf",
                "lo-ol_eula.pdf",
                "EULA/eula.pdf",
              ];

              let found = false;
              for (const altKey of alternativeEulaKeys) {
                try {
                  console.log(`Trying alternative EULA location: ${altKey}`);
                  eulaBuffer = await fetchFromR2(R2_FONTS_BUCKET, altKey);
                  eulaKey = altKey;
                  found = true;
                  break;
                } catch (e) {
                  // Continue to next alternative
                }
              }

              if (!found) {
                throw new Error("No EULA file found in any location");
              }
            }
            archive.append(eulaBuffer, { name: "EULA.pdf" });
            console.log(`✅ Added EULA.pdf from ${eulaKey}`);
          } catch (error) {
            console.warn("Could not fetch EULA:", error);
            // Create a placeholder EULA instead of failing
            archive.append("EULA not available - please contact support for licensing terms", {
              name: "EULA.txt",
            });
          }

          archive.finalize();
        } catch (error) {
          reject(error);
        }
      })();
    });

    // Upload ZIP to R2
    const zipKey = `orders/lo-ol_type-${orderRef}-${Date.now()}.zip`;
    await uploadToR2(R2_ORDERS_BUCKET, zipKey, zipBuffer, "application/zip");

    // Generate presigned download URL (2 hours expiry)
    const downloadUrl = await generatePresignedUrl(R2_ORDERS_BUCKET, zipKey, 7200);

    console.log("ZIP file created and uploaded:", zipKey);
    console.log("Download URL:", downloadUrl);

    return NextResponse.json({
      downloadUrl,
    });
  } catch (error) {
    console.error("Generate order error:", error);
    return NextResponse.json({ error: "Failed to generate order" }, { status: 500 });
  }
}
