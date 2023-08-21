export class HdWallet {
    static store(privateKey: string): void {
        window.sessionStorage.setItem("wallet", privateKey);
    }

    static retrieve(): string | null {
        return window.sessionStorage.getItem("wallet");
    }

    static clear(): void {
        window.sessionStorage.removeItem("wallet");
    }
}
