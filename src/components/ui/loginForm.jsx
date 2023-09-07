import { useEffect, useState } from "react";
import TextField from "../common/form/textField";
import CheckBoxField from "../common/form/checkBoxField";
import { validator } from "../../utils/validator";
// import validateSchema from "../../utils/yup";

const LoginForm = () => {
    // const [email, setEmail] = useState(""); // состояние для одного поля
    const [data, setData] = useState({
        email: "",
        password: "",
        stayOn: false
    }); // паттерн для создания универсального состояния для всех полей формы, при добавление нового поля в верстку добавляем новое начальное состояние
    // добавляем в состояние data новое свойство stayOn со значениемя по умолчанию равном false
    const [errors, setErrors] = useState({}); // состояние для валидации формы на ошибки, принимает аргументом пустой объект

    const handleChange = (target) => {
        // setEmail(e.target.value);
        // console.log(e.target.value);
        // значение элемента <input/> в обработчике забирается из события e.target по ключу value и устанавливается в состояние email с помощью функции setEmail()
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        })); // убираем деструктуризацию
        // получаем предыдущее значение email / password и разворачиваем их в новый объект через spread-синтаксис ...prevState
        // так как параметр even это объект, то можно из него с помощью деструктуризации получить target
        // определяем какое текстовое поле нужно изменить, через target.name забираем значение из атрибута name, используем его в качестве ключа и добавляем текущее значение target.value к данному полю
        // при изменении элемента <input/> будет срабатывать обработчик события handleChange()
        // console.log(target.name); // идентифицируем поля через name
    };

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Поле электронной почты обязательно для заполнения"
            },
            isEmail: {
                message: "Адрес электронной почты введен не корректно"
            }
        },
        password: {
            isRequired: {
                message: "Поле пароля обязательно для заполнения"
            },
            isCapitalLetter: {
                message:
                    "Пароль должен содержать хотя бы одну заглавную латинскую букву"
            },
            isContainDigit: {
                message: "Пароль должен содержать хотя бы одну цифру"
            },
            isMinChar: {
                message: "Пароль должен содержать минимум 8 символов",
                value: 8
            },
            isMaxChar: {
                message: "Пароль должен содержать максимум 20 символов",
                value: 20
            }
        }
    }; // создаем validatorConfig, в котором записаны наименования и сообщения ошибок

    useEffect(() => {
        validate();
    }, [data]); // при изменении data вызывается validate()

    const validate = () => {
        const errors = validator(data, validatorConfig); // вызываем функцию validator() (с полями формы и конфигом) и присваиваем результат выполнения в errors

        // validateSchema
        //     .validate(data)
        //     .then(() => setErrors({}))
        //     .catch((err) => setErrors({ [err.path]: err.message }));
        // // с помощью библиотеки yup вызываем асинхронную валидацию, где then() отрабатывает если ошибок нет (положительный исход), а catch() - если есть ошибки (отрицательный исход)

        setErrors(errors); // записываем полученные ошибки в основное состояние с помощью setErrors()
        return Object.keys(errors).length === 0; // проверка на количество ошибок, true если нет ошибок и false если есть хотя бы одна
    };

    const isValid = Object.keys(errors).length === 0;

    const handleSubmit = (e) => {
        e.preventDefault(); // не перезагружаем страницу при отправке формы
        const isValid = validate();
        if (!isValid) return; // если isValidate равен false, отправка формы отменяется
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Email"
                name="email"
                value={data.email}
                error={errors.email}
                onChange={handleChange}
            />
            <TextField
                label="Password"
                type="password"
                name="password"
                value={data.password}
                error={errors.password}
                onChange={handleChange}
            />
            <CheckBoxField
                value={data.stayOn}
                name="stayOn"
                onChange={handleChange}
            >
                Remain in the system
            </CheckBoxField>
            {/* атрибут disabled блокирует кнопку, если есть ошибки валидации при отправке формы (!isValid) */}
            <button
                type="submit"
                disabled={!isValid}
                className="btn btn-primary w-100 mx-auto"
            >
                Отправить
            </button>
        </form>
    );
};

export default LoginForm;
