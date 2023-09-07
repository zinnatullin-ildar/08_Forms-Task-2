import { useState } from "react";
import PropTypes from "prop-types";

const TextField = ({ label, type, name, value, onChange, error }) => {
    // получаем и деструктурируем props

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value });
    };
    // привели результирующие данные компонентов полей к одному формату (чтобы у всех компонентов полей в onChange()
    // из props попадал объект одной и той же структуры - с ключами name и value) и таким образом, в родителе будет
    // не нужно обрабатывать каждое поле индивидуально, все имеют одну и ту же структуру

    const toggleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    const getInputClasses = () => {
        return "form-control" + (error ? " is-invalid" : "");
    };

    return (
        <div className="mb-4">
            <label htmlFor={name}>{label}</label>
            <div className="input-group has-validation">
                <input
                    type={showPassword ? "text" : type}
                    name={name}
                    value={value}
                    className={getInputClasses()}
                    onChange={handleChange}
                />
                {type === "password" && (
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={toggleShowPassword}
                    >
                        <i
                            className={
                                "bi bi-eye" + (showPassword ? "-slash" : "")
                            }
                        ></i>
                    </button>
                )}
                {/* так как нет негативного отображения, то, если error существует, то отобразится элемент <p> */}
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        </div>
    );
};

/* Паттерн для скрытия / показа пароля 
1. Создаем новое состояние showPassword и добавляем onClick с референсом на toggleShowPassword.
2. При вызове toggleShowPassword() состояние showPassword будет изменяться на противоположное (с true на false и наоборот).
3. Создаем условие: если showPassword равен true, то атрибут text задается как "text" и пароль показывается, иначе атрибут text задается как "password" и пароль скрывается.
4. В кнопке "Отправить" добавляем иконку: при условии если showPassword равен true, то отображается eye-slash, если наоборот, то просто eye. */

TextField.defaultProps = {
    type: "text"
};

TextField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string
};

export default TextField;
