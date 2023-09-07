import { useState } from "react";
import { useParams } from "react-router-dom";
import LoginForm from "../components/ui/loginForm";
import RegisterForm from "../components/ui/registerForm";

const Login = () => {
    const { type } = useParams(); // получаем type из query-параметров (добавляли type в Route этого компонента)
    const [formType, setFormType] = useState(
        type === "register" ? type : "login"
    ); // состояние отвечающее за тип формы ("register" или "login"), по умолчанию - "login"

    const toggleFormType = (params) => {
        setFormType((prevState) =>
            prevState === "register" ? "login" : "register"
        );
    }; // метод переключающий состояние между "register" и "login"

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-5 offset-md-3 shadow p-4">
                    {/* переключатели между компонентами форм, в зависимости от типа выводим нужный компонент */}
                    {formType === "register" ? (
                        <>
                            <h3 className="mb-4">Register</h3>
                            <RegisterForm />
                            <p>
                                Already have account?
                                <a role="button" onClick={toggleFormType}>
                                    {" "}
                                    Sign in
                                </a>
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="mb-4">Login</h3>
                            <LoginForm />
                            <p>
                                Dont have account?
                                <a role="button" onClick={toggleFormType}>
                                    {" "}
                                    Sign up
                                </a>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Login;
