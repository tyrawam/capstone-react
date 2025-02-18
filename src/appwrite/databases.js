import { databases } from "./config";
import { ID } from "appwrite";

const db = {};

const collections = [
    {
        dbId: process.env.REACT_APP_DATABASE_ID,
        id: process.env.REACT_APP_COLLECTION_ID_EVENTS,
        name: "events",
    },
];

// iterate through collection and attach to the empty db object
collections.forEach((col) => {

    // set key in db object as collection name, then add the following crud methods
    db[col.name] = {
        create: (payload, permissions, id = ID.unique()) =>
            databases.createDocument(
                col.dbId,
                col.id,
                id,
                payload,
                permissions
            ),
        update: (id, payload, permissions) =>
            databases.updateDocument(
                col.dbId,
                col.id,
                id,
                payload,
                permissions
            ),
        delete: (id) => databases.deleteDocument(col.dbId, col.id, id),
        list: (queries = []) =>
            databases.listDocuments(col.dbId, col.id, queries),
        get: (id) => databases.getDocument(col.dbId, col.id, id),
    };
});

export default db;