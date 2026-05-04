import { Client, ID, Databases, Storage, Query } from "appwrite";
import config from "../config/config";

export class Service {
  client = new Client();
  Databases;
  bucket;

  constructor() {
    this.client.setEndpoint(config.appwrite).setProject(config.projectId);
    this.Databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.Databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        },
      );
    } catch (error) {
      console.error("AppWrite service error :: createPost :: error", error);
      return false;
    }
  }

  async updatePost({ slug, title, content, featuredImage, status }) {
    try {
      return await this.Databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        },
      );
    } catch (error) {
      console.error("AppWrite service error :: createPost :: error", error);
    }
  }
  async deletePsot(slug) {
    try {
      return await this.Databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
      );
    } catch (error) {
      console.error("AppWrite service error :: createPost :: error", error);
    }
  }
  async getPost(slug) {
    try {
      return await this.Databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
      );
    } catch (error) {
      console.error("AppWrite service error :: createPost :: error", error);
      return false;
    }
  }
  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.Databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        queries,
      );
    } catch (error) {
      console.error("AppWrite service error :: createPost :: error", error);
      return false;
    }
  }

  // file upload service
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.error("AppWrite service error :: createPost :: error", error);
      return false;
    }
  }
  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(config.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("AppWrite service error :: createPost :: error", error);
      return false;
    }
  }
  getfilePreview(fileId) {
    return this.bucket.getFilePreview(config.appwriteBucketId, fileId);
  }
}
const service = new Service();
export default service;
