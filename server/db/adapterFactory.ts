
import { PostgresAdapter } from "./postgresAdapter";
import { FirebaseAdapter } from "./firebaseAdapter";
import { PocketBaseAdapter } from "./pocketbaseAdapter";
import { SupabaseAdapter } from "./supabaseAdapter";
import { AppwriteAdapter } from "./appwriteAdapter";
import { IDatabaseAdapter } from "./adapter";

let activeProvider = "POSTGRES"; 

export function getAdapter(): IDatabaseAdapter {
  switch (activeProvider) {
    case "POSTGRES":
    case "POSTGRES_NEON":
    case "GOOGLE_CLOUD_SQL":
      return new PostgresAdapter();
    case "FIREBASE":
      return new FirebaseAdapter();
    case "POCKETBASE":
      return new PocketBaseAdapter();
    case "SUPABASE":
      return new SupabaseAdapter();
    case "APPWRITE":
      return new AppwriteAdapter();
    default:
      throw new Error(`Provider ${activeProvider} not implemented`);
  }
}

export function setProvider(provider: string) {
  activeProvider = provider;
  console.log("Provider set to:", provider);
}
