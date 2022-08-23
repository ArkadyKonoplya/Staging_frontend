import SignUpBox from "../../components/SignUpBox";

function PatientSignUp() {
    return (
        <section className='FrontPgs'>
            <SignUpBox
                greetings='Welcome! Your needs are our top concern'
                instructions='Fill in the needed information. The click "Register".'
                userType="Patient" 
            ></SignUpBox>
        </section>
    )
}

export default PatientSignUp;

