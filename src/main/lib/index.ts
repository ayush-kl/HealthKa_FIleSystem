import { ensureDir, readFile, writeFile } from 'fs-extra';
import { homedir } from 'os';
import path from 'path';
import { readdir } from 'fs/promises';
import { readdirSync, statSync } from "fs";

const fileEncoding = 'utf-8';
const appDirectoryName = 'dawaiInvoices';

export const getRootDir = () => path.join(homedir(), appDirectoryName);

/* ---------------------- FOLDER + FILE HELPERS ---------------------- */

const getMonthFolderName = (date = new Date()) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}-${year}`;
};

const getDateFileName = (date = new Date()) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}.json`;
};

const getInvoiceFilePath = (date = new Date()) => {
  return path.join(
    getRootDir(),
    getMonthFolderName(date),
    getDateFileName(date)
  );
};

/* =================================================================== */
/* -------------------------- CREATE INVOICE -------------------------- */
/* =================================================================== */

export const createInvoice = async () => {
  const id = "INV-" + Date.now(); // unique ID
  const root = getRootDir();
  const file = getInvoiceFilePath();

  await ensureDir(path.dirname(file));

  let invoices: any[] = [];
  try {
    const content = await readFile(file, { encoding: fileEncoding });
    invoices = JSON.parse(content);
  } catch {
    invoices = [];
  }

  const newInvoice = {
    id,
    createdAt: Date.now(),
  };

  invoices.push(newInvoice);
  await writeFile(file, JSON.stringify(invoices, null, 2), { encoding: fileEncoding });

  return id; // important: frontend expects id
};

/* =================================================================== */
/* -------------------------- READ INVOICE ---------------------------- */
/* =================================================================== */

export const readInvoice = async (invoiceId: string) => {
  try {
    const root = getRootDir();
    const monthDirs = readdirSync(root).filter((entry) =>
      statSync(path.join(root, entry)).isDirectory()
    );

    for (const folder of monthDirs) {
      const folderPath = path.join(root, folder);
      const files = readdirSync(folderPath).filter((f) => f.endsWith(".json"));

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        try {
          const content = await readFile(filePath, { encoding: fileEncoding });
          const invoices = JSON.parse(content);

          const found = invoices.find((inv: any) => inv.id === invoiceId);
          if (found) return found;

        } catch (error) {
          console.error("Failed to read invoice:", error);
        }
      }
    }

    return null;
  } catch (err) {
    console.error("Error reading invoice:", err);
    return null;
  }
};

/* =================================================================== */
/* -------------------------- DELETE INVOICE -------------------------- */
/* =================================================================== */

export const deleteInvoice = async (invoiceId: string) => {
  const root = getRootDir();
  const monthDirs = readdirSync(root).filter((entry) =>
    statSync(path.join(root, entry)).isDirectory()
  );

  for (const folder of monthDirs) {
    const folderPath = path.join(root, folder);
    const files = readdirSync(folderPath).filter((f) => f.endsWith(".json"));

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      try {
        const content = await readFile(filePath, { encoding: fileEncoding });
        let invoices = JSON.parse(content);

        const before = invoices.length;
        invoices = invoices.filter((inv: any) => inv.id !== invoiceId);

        if (invoices.length !== before) {
          await writeFile(
            filePath,
            JSON.stringify(invoices, null, 2),
            { encoding: fileEncoding }
          );
          return true;
        }
      } catch (error) {
        continue;
      }
    }
  }

  return false; // not found
};

/* =================================================================== */
/* --------------------------- WRITE INVOICE --------------------------- */
/* =================================================================== */

export const writeInvoice = async (id: string, content: string) => {
  const root = getRootDir();
  await ensureDir(root);
  const parsedContent = JSON.parse(content);

  const monthDirs = await readdir(root, { withFileTypes: true });
  for (const entry of monthDirs) {
    if (!entry.isDirectory()) continue;

    const monthPath = path.join(root, entry.name);
    try {
      const files = await readdir(monthPath);
      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = path.join(monthPath, file);
        try {
          const existingContent = await readFile(filePath, { encoding: fileEncoding });
          let invoices = JSON.parse(existingContent);

          const index = invoices.findIndex((inv: any) => inv.id === id);
          if (index !== -1) {
            invoices[index] = parsedContent;
            await writeFile(filePath, JSON.stringify(invoices, null, 2), { encoding: fileEncoding });
            return;
          }
        } catch {
          continue;
        }
      }
    } catch {
      continue;
    }
  }

  // Not found, add new
  const todayFile = getInvoiceFilePath();
  await ensureDir(path.dirname(todayFile));
  let invoices: any[] = [];
  try {
    const content = await readFile(todayFile, { encoding: fileEncoding });
    invoices = JSON.parse(content);
  } catch {
    invoices = [];
  }

  invoices.push({ id, ...parsedContent });
  await writeFile(todayFile, JSON.stringify(invoices, null, 2), { encoding: fileEncoding });
};

/* =================================================================== */
/* --------------------------- GET INVOICES ---------------------------- */
/* =================================================================== */

export const getInvoices = async (
  dateStr?: string,
  filters?: { patientName?: string; mobile?: string }
) => {
  const result: { title: string; lastEditTime: number; data: any }[] = [];

  try {
    const root = getRootDir();
    const monthDirs = readdirSync(root).filter((entry) =>
      statSync(path.join(root, entry)).isDirectory()
    );

    for (const folder of monthDirs) {
      const folderPath = path.join(root, folder);
      const files = readdirSync(folderPath).filter((f) => f.endsWith(".json"));

      for (const file of files) {
        if (dateStr) {
          const date = new Date(dateStr);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const expectedFile = `${day}-${month}.json`;
          if (file !== expectedFile) continue;
        }

        const filePath = path.join(folderPath, file);
        try {
          const content = await readFile(filePath, { encoding: fileEncoding });
          const invoices = JSON.parse(content);

          for (const inv of invoices) {
            const patientMatch =
              !filters?.patientName ||
              inv.patientName?.toLowerCase().includes(filters.patientName.toLowerCase());

            const mobileMatch =
              !filters?.mobile || inv.mobile?.includes(filters.mobile);

            if (!filters || (patientMatch && mobileMatch)) {
              result.push({
                title: inv.id,
                lastEditTime: inv.createdAt || 0,
                data: inv,
              });
            }
          }
        } catch (err) {
          console.error(`Error reading/parsing ${filePath}:`, err);
        }
      }
    }
  } catch (err) {
    console.error("Error reading invoice folders:", err);
    return [];
  }

  return result;
};
