import React from 'react';
import ReadingBox from '../components/ReadingBox';
import TermsPic from '../Images/pexels-fauxels-3184465.jpg'
function termsAndConditions() {
    return (
        <section className='FrontPgs'>
            <ReadingBox sideImg={TermsPic} photoCred='Photo by fauxels from Pexels' greetings='Terms and Conditions' redirect='Go to Signup' submit='Back to Login'></ReadingBox>
        </section>
    )
}

export default termsAndConditions;

// Photo Credit: Photo by fauxels from Pexels