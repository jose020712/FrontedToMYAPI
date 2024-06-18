import React from 'react'
import { Routes, Route, NavLink, BrowserRouter, Navigate } from 'react-router-dom';
import { Home } from '../components/Home';
import { Service } from '../components/Service';
import { Portafolio } from '../components/Portafolio';
import { CV } from '../components/CV';
import { ContactUs } from '../components/ContactUs';
import { HeaderNav } from '../components/layout/HeaderNav';
import { Footer } from '../components/layout/Footer';
import { Proyecto } from '../components/Proyecto';
import { Error } from '../components/Error';
import { Log } from '../components/Log';
import { Warehouse } from '../components/Warehouse';
import { Tienda } from '../components/Tienda';


export const MisRutas = () => {
    return (

        <div className='layout'>
            <div>
                <BrowserRouter>
                    {/* Header y Navegacion */}
                    < HeaderNav />


                    {/*Contenido Central */}
                    <section className='content'>
                        <Routes>
                            <Route path='/' element={<Navigate to="/home" />} />
                            <Route path='/home' element={<Home />} />
                            <Route path='/service' element={<Service />} />
                            <Route path='/portafolio' element={<Portafolio />} />
                            <Route path='/cv' element={<CV />} />
                            <Route path='/contactus' element={<ContactUs />} />
                            <Route path='/portafolio/proyecto/:id' element={<Proyecto />} />
                            <Route path='/home/proyecto/:id' element={<Proyecto />} />
                            <Route path='/*' element={<Error />} />
                            <Route path='/store/warehouse' element={<Tienda />} />

                        </Routes>

                    </section>
                    {/*Footer */}
                    < Footer />
                </BrowserRouter>
            </div>
        </div>
    )
}
