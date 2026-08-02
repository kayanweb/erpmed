import { db } from "./index";
import { PostgresAdapter } from "./postgresAdapter";
import { 
  patients, 
  prescriptions, 
  invoices, 
  staff, 
  logs, 
  dutyTasks, 
  notifications, 
  messages, 
  settings, 
  collectionsStore 
} from "./schema";
import { eq, and } from "drizzle-orm";

export interface IRepository {
  fetchCollection(collectionName: string): Promise<any[]>;
  saveItem(collectionName: string, item: any): Promise<boolean>;
  deleteItem(collectionName: string, id: string): Promise<boolean>;
}

export class PostgresRepository implements IRepository {
  private adapter = new PostgresAdapter();
  async fetchCollection(collectionName: string) { return this.adapter.fetchCollection(collectionName); }
  async saveItem(collectionName: string, item: any) { return this.adapter.saveItem(collectionName, item); }
  async deleteItem(collectionName: string, id: string) { return this.adapter.deleteItem(collectionName, id); }
}

export class ClinicalDataService {
  private repository: IRepository;
  private cache = new Map<string, { data: any[]; timestamp: number }>();
  private cacheTTL = 500; // 500ms Cache TTL for near-real-time responsiveness while preventing flood

  constructor(repository: IRepository) {
    this.repository = repository;
  }

  async getCollection(collectionName: string, bypassCache = false): Promise<any[]> {
    const cached = this.cache.get(collectionName);
    const now = Date.now();

    if (cached && !bypassCache && (now - cached.timestamp < this.cacheTTL)) {
      return cached.data;
    }

    const data = await this.repository.fetchCollection(collectionName);
    this.cache.set(collectionName, { data, timestamp: now });
    return data;
  }

  async saveItem(collectionName: string, item: any): Promise<boolean> {
    const success = await this.repository.saveItem(collectionName, item);
    if (success) {
      // Invalidate cache immediately on write
      this.cache.delete(collectionName);
    }
    return success;
  }

  async deleteItem(collectionName: string, id: string): Promise<boolean> {
    const success = await this.repository.deleteItem(collectionName, id);
    if (success) {
      // Invalidate cache immediately on delete
      this.cache.delete(collectionName);
    }
    return success;
  }

  async bulkSync(collectionNames: string[]): Promise<Record<string, any[]>> {
    const result: Record<string, any[]> = {};
    const promises = collectionNames.map(async (name) => {
      try {
        result[name] = await this.getCollection(name);
      } catch (err) {
        console.error(`Error syncing collection ${name} in bulkSync:`, err);
        result[name] = [];
      }
    });

    await Promise.all(promises);
    return result;
  }
}

import { getAdapter } from "./adapterFactory";

export const clinicalDataService = new ClinicalDataService(getAdapter());
