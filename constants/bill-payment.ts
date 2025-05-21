
interface BillPayment {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    account: string;
    verifyAccount: string;
}

export const BILL_PAYMENT = {
    billPayment: {
        name: "Acme Corp.",
        address: "456 Market St",
        city: "Metropolis",
        state: "NY",
        zipCode: "67890",
        phone: "555-123-4567",
        account: "987654321",
        verifyAccount: "987654321",
    } as BillPayment
};
