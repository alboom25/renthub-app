class ValidationHelper {
    static newAdminWorkOrder(){
        return {
            rules: { 
                unit_code:{
                    required: true                         
                },
                description:{                      
                      required: true,
                      maxlength: 600,
                      minlength:10   
                }               
              },
              messages: {              
                unit_code:{
                    required: "Please select the target unit"                          
                },
                description:{                           
                      required: "Please provide a description of the work order",
                      maxlength: "The maximum description length is 600 characters",
                      minlength: "The minimum description length is 10 characters"   
                }             
              }
        };
    }

    static addNewSupplier(){
        return {
            rules: {                   
                first_name:{
                    required: true,
                      minlength:3,
                      maxlength: 100   
                },
                last_name:{
                    required: true,
                      minlength:3,
                      maxlength: 100   
                },
                email_address:{                   
                      email: true,
                      required: true,
                      maxlength: 255   
                },
                phone_number:{                     
                    maxlength: 12,
                    minlength:8
                }                   
              },
              messages: {
                first_name:{
                    required: "Please enter the first name",
                      minlength:"First name should be between 1 and 100 characters",
                      maxlength: "First name should be between 1 and 100 characters",   
                },
                last_name:{
                    required: "Please enter the last name",
                      minlength:"Last name should be between 1 and 100 characters",
                      maxlength: "Last name should be between 1 and 100 characters",  
                },
                email_address:{                       
                      email: "Please enter a correct email address",
                      required: "Please enter a correct email address",
                      maxlength: "Please enter a correct email address"   
                },
                phone_number:{                     
                    maxlength: "Please enter a correct phone number ie 07XXXXXXXX",
                    minlength:"Please enter a correct phone number ie 07XXXXXXXX"
                } 
            }             
        };
    }
    static addExpensePayment(){
        return{
            rules:{ 
                payment_date:{
                  required: true,
                  date:true
                },
                payment_method:{
                  required: true
                },
                payment_amount:{
                  required: true,
                  number: true,
                  min: 10
                },
                payment_ref :{
                  maxlength: 255
                },
                payment_by:{
                  maxlength: 255
                }
              },
              messages:{     
                payment_date:{
                  required: "Please click to select payment date",
                  date:"Invalid date value"
                },
                payment_method:{
                  required: "Invalid payment method"
                },
                payment_amount:{
                  required: "Please enter the paid amount",
                  number: "Please enter the paid amount",
                  min: "Amount should be greater than 10"
                },
                payment_ref :{
                  maxlength: "Maximum length required is 255 characters"
                },
                payment_by:{
                  maxlength: "Maximum length required is 255 characters"
                }
              }
        };
    }

    static newPropertyManager(){
        return{
            rules: {                   
                first_name:{
                    required: true,
                      minlength:3,
                      maxlength: 100   
                },
                last_name:{
                    required: true,
                      minlength:3,
                      maxlength: 100   
                },
                email_address:{
                      email: true,
                      required: true,
                      maxlength: 255   
                },
                phone_number:{                     
                    maxlength: 12,
                    minlength:8
                }               
              },
              messages: {
                first_name:{
                    required: "Please enter the first name",
                      minlength:"First name should be between 1 and 100 characters",
                      maxlength: "First name should be between 1 and 100 characters",   
                },
                last_name:{
                    required: "Please enter the last name",
                      minlength:"Last name should be between 1 and 100 characters",
                      maxlength: "Last name should be between 1 and 100 characters",  
                },
                email_address:{
                      email: "Please enter a correct email address",
                      required: "Please enter a correct email address",
                      maxlength: "Please enter a correct email address"   
                },
                phone_number:{                     
                    maxlength: "Please enter a correct phone number ie 07XXXXXXXX",
                    minlength:"Please enter a correct phone number ie 07XXXXXXXX"
                }               
              }
        };
    } 

    static newLease() {
        return {
            rules: {
                unit_code: {
                    required: true,
                },
                tenant_id: {
                    required: true,
                },
                payment_date: {
                    required: true,
                    number: true,
                },
                monthly_rent: {
                    required: true,
                    number: true,
                    min: 0,
                },
                lease_date: {
                    required: true,
                },
            },
            messages: {
                unit_code: {
                    required: "Please select a unit from the list.",
                },
                tenant_id: {
                    required: "Please select the tenant from the list",
                },
                payment_date: {
                    required: "Select the bills payment date from the list",
                    number: "Select the bills payment date from the list",
                },
                monthly_rent: {
                    required: "Enter the monthly rent amount",
                    number: "Enter the monthly rent amount",
                    min: "Rent amount cannot be a negative number",
                },
                lease_date: {
                    required: "Please select the lease date",
                },
            },
        };
    }

    static newUser() {
        return {
            rules: {
                user_email: {
                    required: true,
                    email: true,
                },               
                referal_code:{
                    maxlength:6
                },
                user_password: {
                    required: true,
                    minlength: 6,
                    maxlength: 15,
                },
                password_repeat: {
                    required: true,
                    minlength: 6,
                    maxlength: 15,
                    equalTo: "#user_password",
                },
                agree_terms: {
                    required: true,
                },
            },
            messages: {
                user_email: {
                    required: "Please enter your email address",
                    email: "Please enter a valid email address",
                },               
                referal_code:{
                    maxlength: "Invalid referal code"
                },
                user_password: {
                    required: "Please provide a password",
                    minlength: "Your password must be at least 6 characters long",
                    maxlength: "Your password must be at most 15 characters long",
                },
                password_repeat: {
                    required: "Please repeat the password",
                    minlength: "Your password must be at least 6 characters long",
                    maxlength: "Your password must be at most 15 characters long",
                    equalTo: "Passwords do not match",
                },
                agree_terms: {
                    required: "You must agree to our terms of use",
                },
            },
        };
    }

    static resetPass() {
        return {
            rules: {
                user_password: {
                    required: true,
                    minlength: 6,
                },
                password_repeat: {
                    required: true,
                    minlength: 6,
                    equalTo: "#user_password",
                },
                reset_key: {
                    required: true,
                },
            },
            messages: {
                user_password: {
                    required: "Please provide a password",
                    minlength: "Your password must be at least 6 characters long",
                },
                password_repeat: {
                    required: "Please repeat the password",
                    minlength: "Your password must be at least 6 characters long",
                    equalTo: "Passwords do not match",
                },
                reset_key: {
                    required: "Make sure you clicked the reset link you received in your email",
                },
            },
        };
    }

    static recoverPassword() {
        return {
            rules: {
                useremail: {
                    required: true,
                    email: true,
                },
            },
            messages: {
                useremail: {
                    required: "Please enter your email address",
                    email: "Please enter a valid email address",
                },
            },
        };
    }

    static Login() {
        return {
            rules: {
                username: {
                    required: true,
                },
                userpassword: {
                    required: true,
                },
            },
            messages: {
                username: {
                    required: "Please enter your registered email or phone",
                },
                userpassword: {
                    required: "Please provide your password",
                },
            },
        };
    }

    static accountEdits() {
        return {
            rules: {               
                username: {
                    minlength: 6,
                    maxlength: 20,
                    alphanumeric: true,
                }
            },
            messages: {                
                username: {
                    minlength: "Username must have at least 6 characters",
                    maxlength: "Username should have a maximum of 20 characters",
                    alphanumeric: "Invalid username",
                }
            },
        };
    }

    static userProfile() {
        return {
            rules: {
                first_name: {
                    required: true,
                    minlength: 3,
                    maxlength: 20,
                },
                last_name: {
                    required: true,
                    minlength: 3,
                    maxlength: 20,
                },
                other_names: {
                    minlength: 3,
                    maxlength: 20,
                },
                company_name: {
                    minlength: 3,
                    maxlength: 30,
                },
                address: {
                    minlength: 3,
                    maxlength: 255,
                },
            },
            messages: {
                first_name: {
                    required: "You must provide your first name",
                    minlength: "Fisrt name must have at least 3 characters",
                    maxlength: "Fisrt name should have a maximum of 20 characters",
                },
                last_name: {
                    required: "You must provide your last name",
                    minlength: "Last name must have at least 3 characters",
                    maxlength: "Last name should have a maximum of 20 characters",
                },
                other_names: {
                    minlength: "Other name must have at least 3 characters",
                    maxlength: "Last name should have a maximum of 20 characters",
                },
                company_name: {
                    minlength: "Company name must have at least 3 characters",
                    maxlength: "Company name should have a maximum of 30 characters",
                },
                address: {
                    minlength: "Address must have at least 3 characters",
                    maxlength: "Address should have a maximum of 30 characters",
                },
            },
        };
    }

    static quickTenant() {
        return {
            rules: {
                first_name: {
                    required: true,
                    minlength: 3,
                    maxlength: 30,
                },
                last_name: {
                    required: true,
                    minlength: 3,
                    maxlength: 30,
                },
                phone_number: {
                    number: true,
                    maxlength: 12,
                    minlength: 10,
                },
                id_number: {
                    number: true,
                    maxlength: 8,
                    minlength: 7,
                },
            },
            messages: {
                first_name: {
                    required: "Tenant first name cannot be empty",
                    minlength: "Tenant first name should contain at least 3 characters",
                    maxlength: "Tenant first name should contain a maximum of 30 characters",
                },
                last_name: {
                    required: "Tenant last name cannot be empty",
                    minlength: "Tenant last name should contain at least 3 characters",
                    maxlength: "Tenant last name should contain a maximum of 30 characters",
                },
                phone_number: {
                    number: "Phone number should contain only numbers",
                    maxlength: "Provide phone number in format 07XXXXXXXX OR 2547XXXXXXXX",
                    minlength: "Provide phone number in format 07XXXXXXXX OR 2547XXXXXXXX",
                },
                id_number: {
                    number: "ID number should contain only numbers",
                    maxlength: "ID No should contain a maximum 8 characters",
                    minlength: "ID No should contain at least 7 characters",
                },
            },
        };
    }

    static updateTenant() {
        return {
            rules: {
                first_name: {
                    required: true,
                    minlength: 3,
                    maxlength: 30,
                },
                last_name: {
                    required: true,
                    minlength: 3,
                    maxlength: 30,
                },
                id_number: {
                    maxlength: 10,
                },
                phone_number: {
                    maxlength: 12,
                    number: true,
                },
                alt_phone_number: {
                    maxlength: 12,
                    number: true,
                },
                email_address: {
                    maxlength: 255,
                    email: true,
                },
                nationality: {
                    maxlength: 50,
                    required: true,
                },
            },
            messages: {
                first_name: {
                    required: "Tenant first name is required",
                    minlength: "Tenant first name must be at least 3 characters",
                    maxlength: "Tenant first length should not exceed 30 characters",
                },
                last_name: {
                    required: "Tenant last name is required",
                    minlength: "Tenant last name must be at least 3 characters",
                    maxlength: "Tenant last length should not exceed 30 characters",
                },
                id_number: {
                    maxlength: "ID Number length should not exceed 10 characters",
                },
                phone_number: {
                    maxlength: "Phone Number length should not exceed 12 characters",
                    number: "Provide correct phone number ie 0712345678",
                },
                alt_phone_number: {
                    maxlength: "Phone Number length should not exceed 12 characters",
                    number: "Provide correct phone number ie 0712345678",
                },
                email_address: {
                    maxlength: "Provide a correct email address",
                    email: "Provide a correct email address",
                },
                nationality: {
                    maxlength: "Nationality should not exceed 50 charaters",
                    required: "Provide the tenant's nationalitys",
                },
            },
        };
    }

    static newTenant() {
        return {
            rules: {
                first_name: {
                    required: true,
                    minlength: 3,
                    maxlength: 30,
                },
                last_name: {
                    required: true,
                    minlength: 3,
                    maxlength: 30,
                },
                id_number: {
                    maxlength: 10,
                },
                phone_number: {
                    maxlength: 12,
                    number: true,
                },
                alt_phone_number: {
                    maxlength: 12,
                    number: true,
                },
                email_address: {
                    maxlength: 255,
                    email: true,
                },
                nationality: {
                    maxlength: 50,
                    required: true,
                },
            },
            messages: {
                first_name: {
                    required: "Tenant first name is required",
                    minlength: "Tenant first name must be at least 3 characters",
                    maxlength: "Tenant first length should not exceed 30 characters",
                },
                last_name: {
                    required: "Tenant last name is required",
                    minlength: "Tenant last name must be at least 3 characters",
                    maxlength: "Tenant last length should not exceed 30 characters",
                },
                id_number: {
                    maxlength: "ID Number length should not exceed 10 characters",
                },
                phone_number: {
                    maxlength: "Phone Number length should not exceed 12 characters",
                    number: "Provide correct phone number ie 0712345678",
                },
                alt_phone_number: {
                    maxlength: "Phone Number length should not exceed 12 characters",
                    number: "Provide correct phone number ie 07XXXXXXXX or 2547XXXXXXXX",
                },
                email_address: {
                    maxlength: "Provide a correct email address",
                    email: "Provide a correct email address",
                },
                nationality: {
                    maxlength: "Nationality should not exceed 50 charaters",
                    required: "Provide the tenant's nationalitys",
                },
            },
        };
    }

    static newProperty() {
        return {
            rules: {
                property_name: {
                    required: true,
                    minlength: 3,
                    maxlength: 50,
                },
                property_description: {
                    required: true,
                    minlength: 3,
                    maxlength: 255,
                },
                locality_code: {
                    required: true,
                    number: true,
                },
                street_address: {
                    required: true,
                    minlength: 6,
                    maxlength: 255,
                },
                property_type: {
                    required: true,
                },
                unit_types: {
                    required: true,
                },
                year_built: {
                    required: true,
                },
                floors: {
                    required: true,
                },
            },
            messages: {
                property_name: {
                    required: "Please provide the name of the property",
                    minlength: "Property name should be between 3-50 characters",
                    maxlength: "Property name should be between 3-50 characters",
                },
                property_description: {
                    required: "Please provide a brief description",
                    minlength: "Property description should be between 3-50 characters",
                    maxlength: "Property description should be between 3-255 characters",
                },
                locality_code: {
                    required: "Please select county, area, and locality",
                    number: "Please select county, area, and locality",
                },
                street_address: {
                    required: "Location description is required",
                    minlength: "Location description should be between 3-180 characters",
                    maxlength: "Location description should be between 3-180 characters",
                },
                property_type: {
                    required: "Select a property type from the list",
                },
                unit_types: {
                    required: "Select a property unit types from the list",
                },
                year_built: {
                    required: "Select the year of built from the list",
                },
                floors: {
                    required: "Select the number of floors from the list",
                },
            },
        };
    }

    static newTenantPayment() {
        return {
            rules: {
                payment_date: {
                    required: true,
                    date: true,
                },
                payment_method: {
                    required: true,
                },
                payment_amount: {
                    required: true,
                    number: true,
                    min: 10,
                },
                payment_ref: {
                    maxlength: 255,
                },
                payment_by: {
                    maxlength: 255,
                },
                bill_id: { required: true },
            },
            messages: {
                payment_date: {
                    required: "Please click to select payment date",
                    date: "Invalid date value",
                },
                payment_method: {
                    required: "Invalid payment method",
                },
                payment_amount: {
                    required: "Please enter the paid amount",
                    number: "Please enter the paid amount",
                    min: "Amount should be greater than 10",
                },
                payment_ref: {
                    maxlength: "Maximum length required is 255 characters",
                },
                payment_by: {
                    maxlength: "Maximum length required is 255 characters",
                },
                bill_id: {
                    required: "Invalid form request",
                },
            },
        };
    }

    static newTenantInvoice() {
        return {
            rules: {
                unit_code: {
                    required: true,
                },
                tenant_id: {
                    required: true,
                },
                due_date: {
                    required: true,
                    date: true,
                },
            },
            messages: {
                unit_code: {
                    required: "Please select a unit from the list.",
                },
                tenant_id: {
                    required: "The selected unit has no tenant associated",
                },
                due_date: {
                    required: "Please select the lease date",
                    date: "Please enter correct lease date",
                },
            },
        };
    }

    static tenantsIncoiceReminders() {
        return {
            rules: {
                sms_template: {
                    required: true,
                    maxlength: 320,
                },
            },
            messages: {
                sms_template: {
                    required: "No SMS template defined",
                    maxlength: "SMS message limited to 320 characters",
                },
            },
        };
    }

    static tenantsBroadcastSMS() {
        return {
            rules: {
                sms_template: {
                    required: true,
                    maxlength: 320,
                },
            },
            messages: {
                sms_template: {
                    required: "No SMS template defined",
                    maxlength: "SMS message limited to 320 characters",
                },
            },
        };
    }
}

module.exports = ValidationHelper;
