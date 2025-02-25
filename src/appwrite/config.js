import { Client, Databases, Account } from 'appwrite';

const client = new Client();

client.setProject(process.env.REACT_APP_PROJECT_ID);

const databases = new Databases(client);
const account = new Account(client);

export { client, databases, account};
export { ID } from 'appwrite';
