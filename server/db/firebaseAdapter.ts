
import { IDatabaseAdapter } from "./adapter";

export class FirebaseAdapter implements IDatabaseAdapter {
  async fetchCollection(collectionName: string): Promise<any[]> {
    throw new Error("Firebase fetchCollection not implemented");
  }
  async saveItem(collectionName: string, item: any): Promise<boolean> {
    throw new Error("Firebase saveItem not implemented");
  }
  async deleteItem(collectionName: string, id: string): Promise<boolean> {
    throw new Error("Firebase deleteItem not implemented");
  }
}
