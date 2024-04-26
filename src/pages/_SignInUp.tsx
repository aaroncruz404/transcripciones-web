import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../services/Context/SessionContext';


export default function SignInUp() {
    const { supabaseClient, } = useSession();
    const navigate = useNavigate();

    // Verificar el inicio de sesión
    supabaseClient.auth.onAuthStateChange(async (event) => {
        if (event === 'SIGNED_IN') {
            navigate("/")
        }
    });

    // Estilos para el componente Auth
    const authStyle = {
        input: { color: '#fefefe' },
        button: {
            backgroundColor: '#fefefe',
            color: '#222',
            border: 'none',
        },
    };

    // Configuración para el componente Auth
    const signInUpConfig = {
        variables: {
            sign_in: {
                email_label: 'Correo electrónico',
                email_input_placeholder: 'ejemplo@algo.com',
                password_label: 'Contraseña',
                password_input_placeholder: 'Tu contraseña',
                button_label: "Iniciar sesión",
                link_text: "¿Ya tienes cuenta? Inicia sesión",
            },

            sign_up: {
                email_label: 'Correo electrónico',
                email_input_placeholder: 'ejemplo@algo.com',
                password_label: 'Contraseña',
                password_input_placeholder: 'Tu contraseña',
                button_label: "Registrarse",
                link_text: '¿No tienes una cuenta? Regístrate'
            },

            forgotten_password: {
                link_text: '¿Olvidaste tu contraseña?',
                email_label: 'Correo electrónico',
                email_input_placeholder: 'ejemplo@algo.com',
                button_label: "Enviar instrucciones de recuperación",
                loading_button_label: "Enviando instrucciones",
                confirmation_text: 'Instrucciones enviadas correctamente',
            },

            email_label: {
                link_text: '¿Olvidaste tu contraseña?'
            },

        }
    };

    return (
        <div className='animate-fade-in absolute z-10 h-full w-full flex justify-center items-center bg-[#212121] flex-col gap-6 transition duration-700'>
            <div className='flex flex-col text-center justify-center w-full px-2 text-[#fefefe]'>
                <h2 className="text-3xl font-bold ">¡Inicia sesión!</h2>
                <p className="text-lg font-normal">
                    Regístrate para guardar tus transcripciones. ¡Es grátis!
                </p>
            </div>
            <Auth
                supabaseClient={supabaseClient}
                localization={signInUpConfig}
                appearance={{ theme: ThemeSupa, style: authStyle }}
                providers={[]}
            />
        </div>
    );

};