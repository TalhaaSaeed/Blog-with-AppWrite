import { Client, Account, ID } from "appwrite";
import config from "../config/config";

/**
 * Lightweight wrapper around Appwrite `Account` with basic validation
 * and consistent error handling.
 */
export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client.setEndpoint(config.appwrite).setProject(config.projectId);
    this.account = new Account(this.client);
  }

  async createAccount(email, password, name) {
    if (!email || !password || !name) {
      throw new Error(
        "email, password and name are required to create an account",
      );
    }

    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
      );
      if (userAccount) {
        return await this.login(email, password);
      }
      return userAccount;
    } catch (error) {
      console.error("Create account failed:", error);
      throw error;
    }
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("email and password are required to login");
    }

    try {
      return await this.account.createEmailSession(email, password);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      if (error?.code !== 401) {
        console.error("Failed to get current user:", error);
      }
      return null;
    }
  }

  async logout() {
    try {
      // deleteSessions() removes all sessions for the current user
      await this.account.deleteSessions();
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  }

  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  }
}

const authService = new AuthService();
export default authService;
