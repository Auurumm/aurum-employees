import React, { useContext, useEffect } from 'react';
import { CommandPage } from './Home';
import { ThemeContext } from '../../../context/ThemeContext';

const Index3 = () => {
   const {setHeaderIcon} = useContext(ThemeContext);
    useEffect(()=>{
        setHeaderIcon(true)           
    },[])
    return (
        <>
            <CommandPage />            
        </>
    );
};

export default Index3;