export class ClaimAssignment {
    public insuredFirstName: string;
    public insuredLastName: string;
    public claimNumber: string;
    public assignmentId: number;
    public externalAssignmentId: string;
    public policyNumber: string;
    public insuredPhone: string;
    public lossAddress1: string;
    public lossAddress2: string;
    public lossCity: string;
    public lossState: string;
    public lossZipcode: string;
    public Address1: string;
    public Address2: string;
    public City: string;
    public State: string;
    public Zipcode: string;
    public lat: string;
    public lng: string;
    public isSelected: boolean;
    public isSubmitted: boolean;
    public isHidden: boolean;
    public selectedAdj: string;
    public policyType: string;
    public filterString: string;
    public position: number;
    public time: number;
    public policyStart: string;
    public policyEnd: string;
    constructor(values: Object = {}) { Object.assign(this, values); }
}