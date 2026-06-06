import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../db.json');

const defaultData = {
  users: [],
  tasks: []
};

const adapter = new JSONFile(dbPath);
export const db = new Low(adapter, defaultData);

export async function initDb() {
  await db.read();
  if (!db.data.users) {
    db.data.users = [];
  }
  if (!db.data.tasks) {
    db.data.tasks = [];
  }
  await db.write();
}

export async function saveDb() {
  await db.write();
}
