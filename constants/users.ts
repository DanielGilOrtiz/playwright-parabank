interface User {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    ssn: string;
}

export const USERS = {
    validUser: {
        username: "existing_user",
        password: "secret_password",
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        phone: "123-456-7890",
        ssn: "123-45-6789"
    } as User,
    
    nonValidUser: {
        username: "non_exisintg_user",
        password: "wrong_password"
    } as User
};