export class Adjuster {
    public adjusterName: string;
    public lossZipcode: number; 
    public policyNumber: number;
    public lossState: string;
    public insuredFirstName: string;
    public policyEffDate: Date;
    public adjusterEmail: string;
    public insuredLastName: string;
    public lossAddress1: string;
    public lossAddress2: string; 
    public adjusterPhone: number;
    public dateOfLoss: Date; 
    public policyExpDate: Date;
    public claimNumber: number;
    public ourFileNumber: number;
    public lossCity: string;
    constructor(values: Object = {}) { Object.assign(this, values); }
}

