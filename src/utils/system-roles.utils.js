

// system roles used for authorizations
export const systemRoles = {
    USER: "user",
    COMPANY_HR: "company_HR"
}

const {USER, COMPANY_HR} = systemRoles;

export const roles = {
    USER_COMPANY_HR: [USER, COMPANY_HR],
}