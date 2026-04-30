import { Client, Account, ID } from "appwrite";
import config from "../config/config";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client.setEndpoint(config.appwrite).setProject(config.projectId);

    this.account = new Account(this.client);
  }

  async createAccount(email, password, name) {
    const userAccount = await this.account.create(
      ID.unique(),
      email,
      password,
      name,
    );

    if (userAccount) {
      return this.login(email, password);
    }

    return userAccount;
  }

  async login(email, password) {
    return await this.account.createEmailSession(email, password);
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
}

const authService = new AuthService();
export default authService;
