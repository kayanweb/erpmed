
import { IDatabaseAdapter } from "./adapter";

export class PocketBaseAdapter implements IDatabaseAdapter {
  async fetchCollection(collectionName: string): Promise<any[]> {
    throw new Error("PocketBase fetchCollection not implemented");
  }
  async saveItem(collectionName: string, item: any): Promise<boolean> {
    throw new Error("PocketBase saveItem not implemented");
  }
  async deleteItem(collectionName: string, id: string): Promise<boolean> {
    throw new Error("PocketBase deleteItem not implemented");
  }
}
