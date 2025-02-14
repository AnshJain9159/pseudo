declare module 'web3' {
    import { Contract, ContractAbi } from 'web3';
    export { Contract, ContractAbi };
    export default class Web3 {
        eth: {
            Contract: {
                create(abi: any, address: string): Contract<ContractAbi>;
            };
            getAccounts(): Promise<string[]>;
            getBalance(address: string): Promise<string>;
            accounts: {
                create(entropy: string): { address: string };
            };
            sendTransaction(tx: {
                from: string;
                to: string;
                value: string;
            }): Promise<any>;
        };
        utils: {
            toWei(value: string, unit: string): string;
        };
    }
}

declare module 'firebase/app' {
    export interface FirebaseOptions {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
    }
    export function initializeApp(config: FirebaseOptions): any;
}

declare module 'firebase/auth' {
    export interface User {
        uid: string;
        email: string | null;
        displayName: string | null;
        photoURL: string | null;
    }

    export interface UserCredential {
        user: User;
    }

    export interface Auth {
        signOut(): Promise<void>;
    }

    export class GoogleAuthProvider {
        constructor();
    }

    export function getAuth(app: any): Auth;
    export function signInWithPopup(auth: Auth, provider: GoogleAuthProvider): Promise<UserCredential>;
    export function onAuthStateChanged(auth: Auth, callback: (user: User | null) => void): () => void;
    export function signInWithEmailAndPassword(auth: Auth, email: string, password: string): Promise<UserCredential>;
} 