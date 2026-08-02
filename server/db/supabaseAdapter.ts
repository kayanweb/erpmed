
import { IDatabaseAdapter } from "./adapter";

export class SupabaseAdapter implements IDatabaseAdapter {
  async fetchCollection(collectionName: string): Promise<any[]> {
    throw new Error("Supabase fetchCollection not implemented");
  }
  async saveItem(collectionName: string, item: any): Promise<boolean> {
    throw new Error("Supabase saveItem not implemented");
  }
  async deleteItem(collectionName: string, id: string): Promise<boolean> {
    throw new Error("Supabase deleteItem not implemented");
  }
}
