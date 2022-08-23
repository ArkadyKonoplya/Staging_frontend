import SignUpBox from "../../components/SignUpBox";
function ProviderSignUp() {
    return (
        <section className='FrontPgs'>
            <SignUpBox
            greetings='We are excited to have Providers!' 
            instructions='Just fill in the needed information to get started!'
            userType="Doctor" 
            ></SignUpBox>
        </section>
    )
}

export default ProviderSignUp;