import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';
export const config= {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.pozzi',
    projectId: '66b274300037a784a700',
    databaseId: '66b275ec0017e699a6b6',
    userCollectionId: '66b27617003e296daa04',
    videoCollectionId: '66b275ec0017e699a6b6',
    storageId: '66b277d50016f3af8e99'
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async ( email, password, username ) => {
    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await SignIn(email, password);
        
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id, 
                email,
                username,
                avatar: avatarUrl 
            }
        )

        return newUser;
    } catch (error){
        console.log(error);
        throw new Error(error);
    }

}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]  
        )
        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}