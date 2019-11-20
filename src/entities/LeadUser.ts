class LeadUser {
    private _username = '';
    public name: string;
    public email: string;
    public career: string;

    constructor(name?: string, email?: string, username?: string, career?: string) {
        this.name = name || '';
        this.email = email || '';
        this._username = username || '';
        this.career = career || '';
    }

    get username() {
        return this._username;
    }

    set username(value: string) {
        this._username = this.capitalizeText(value);
    }

    public capitalizeText(value: string) {
        const newValue = value.charAt(0).toUpperCase() + value.substr(1);
        return newValue;
    }
}

export default LeadUser;
