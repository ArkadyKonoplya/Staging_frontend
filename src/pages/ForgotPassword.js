import EmailValidate from "../components/EmailValidate";
function forgotPassword(){
    return(
        <EmailValidate greetings='Forgot your Password? No Problem! ' instructions='Enter the email registered to the account to reset your Password.' submit= 'Submit'></EmailValidate>
    )
}

export default forgotPassword;