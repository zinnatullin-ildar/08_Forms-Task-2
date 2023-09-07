import { useEffect, useState } from "react";
import api from "../../api";
import TextField from "../common/form/textField";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/multiSelectField";
import CheckBoxField from "../common/form/checkBoxField";
import { validator } from "../../utils/validator";

const RegisterForm = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
        profession: "",
        sex: "male",
        qualities: [],
        licence: false
    }); // паттерн для создания универсального состояния для всех полей формы, при добавление нового поля в верстку добавляем новое начальное состояние
    // добавляем в состояние data новые свойства со значениемя по умолчанию: profession = "", sex = "male", qualities = [], licence = false

    const [professions, setProfession] = useState([]);
    const [qualities, setQualities] = useState({});
    const [errors, setErrors] = useState({});

    const getProfessionById = (id) => {
        for (const profession of professions) {
            if (profession.value === id) {
                return { _id: profession.value, name: profession.label };
            }
        }
    }; // согласуем данные, то есть сделаем так, чтобы после отправки в объекте была такая же структура, как у первоначальных данных

    const getQualities = (elements) => {
        const qualitiesArray = [];

        for (const element of elements) {
            for (const quality in qualities) {
                if (element.value === qualities[quality].value) {
                    qualitiesArray.push({
                        _id: qualities[quality].value,
                        name: qualities[quality].label,
                        color: qualities[quality].color
                    });
                }
            }
        }
        return qualitiesArray;
    }; // согласуем данные, то есть сделаем так, чтобы после отправки в объекте была такая же структура, как у первоначальных данных

    useEffect(() => {
        api.professions.fetchAll().then((data) => {
            const professionsList = Object.keys(data).map((professionName) => ({
                label: data[professionName].name,
                value: data[professionName]._id
            }));
            setProfession(professionsList);
        }); // получаем professions через API
        api.qualities.fetchAll().then((data) => {
            const qualitiesList = Object.keys(data).map((optionName) => ({
                label: data[optionName].name,
                value: data[optionName]._id,
                color: data[optionName].color
            }));
            setQualities(qualitiesList);
        }); // получаем qualities через API
    }, []);

    const handleChange = (target) => {
        // console.log(target);
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        })); // убираем деструктуризацию
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
        },
        profession: {
            isRequired: {
                message: "Обязательно выберите вашу профессию"
            }
        },
        licence: {
            isRequired: {
                message:
                    "Вы не можете использовать наш сервис без подтверждения лицензионного соглашения"
            }
        }
    };

    useEffect(() => {
        validate();
    }, [data]);

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isValid = Object.keys(errors).length === 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        const { profession, qualities } = data;
        console.log({
            ...data,
            profession: getProfessionById(profession),
            qualities: getQualities(qualities)
        });
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
            <SelectField
                label="Choose your profession"
                defaultOption="Choose..."
                name="profession"
                options={professions}
                value={data.profession}
                error={errors.profession}
                onChange={handleChange}
            />
            <RadioField
                label="Choose your gender"
                options={[
                    { name: "Male", value: "male" },
                    { name: "Female", value: "female" },
                    { name: "Other", value: "other" }
                ]}
                name="sex"
                value={data.sex}
                onChange={handleChange}
            />
            <MultiSelectField
                label="Choose your qualities"
                options={qualities}
                defaultValue={data.qualities}
                name="qualities"
                onChange={handleChange}
            />
            <CheckBoxField
                value={data.licence}
                name="licence"
                error={errors.licence}
                onChange={handleChange}
            >
                Confirm <a role="button">license agreement</a>
            </CheckBoxField>
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

export default RegisterForm;
