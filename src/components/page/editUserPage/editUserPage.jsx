import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import api from "../../../api";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import { validator } from "../../../utils/validator";

const EditUserPage = () => {
    const { userId } = useParams();
    const history = useHistory(); // выполняет редирект после успешного выполнения формы
    const [isLoading, setIsLoading] = useState(false); // состояние отслеживания загрузки формы
    const [data, setData] = useState({
        name: "",
        email: "",
        profession: "",
        sex: "male",
        qualities: []
    }); // текущее состояние формы
    // паттерн для создания универсального состояния для всех полей формы, при добавление нового поля в верстку добавляем новое начальное состояние
    const [professions, setProfession] = useState([]); // состояние для загрузки профессий
    const [qualities, setQualities] = useState({}); // состояние для загрузки качеств
    const [errors, setErrors] = useState({}); // состояние для отслеживания ошибок

    const getProfessionById = (id) => {
        for (const profession of professions) {
            if (profession.value === id) {
                return { _id: profession.value, name: profession.label };
            }
        }
    }; // согласуем данные, чтобы после отправки в объекте была такая же структура, как у первоначальных данных

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
    }; // согласуем данные, чтобы после отправки в объекте была такая же структура, как у первоначальных данных

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        const { profession, qualities } = data;
        api.users
            .update(userId, {
                ...data,
                profession: getProfessionById(profession),
                qualities: getQualities(qualities)
            })
            .then((data) => history.push(`/users/${data._id}`)); // при получении обновленных данных о юзере переадресуем юзера на страницу с измененным id
        // console.log(data);
    }; // при отправке деструктуризируем profession и qualities отдельно от основных данных и трансформируем их к необходимому виду для хранения

    const transformData = (data) => {
        return data.map((quality) => ({
            label: quality.name,
            value: quality._id
        }));
    }; // в новом массиве каждое качество трансформируем из quality.name и quality._id в label и value
    useEffect(() => {
        setIsLoading(true);

        api.users.getById(userId).then(({ profession, qualities, ...data }) =>
            setData((prevState) => ({
                ...prevState,
                ...data,
                profession: profession._id,
                qualities: transformData(qualities) //
            }))
        ); // получаем выбранного юзера по id и отдельно деструктуризируем profession и qualities от основных данных для их дальнейшей трансформации

        api.professions.fetchAll().then((data) => {
            const professionsList = Object.keys(data).map((professionName) => ({
                label: data[professionName].name,
                value: data[professionName]._id
            }));
            setProfession(professionsList);
        }); // получаем professions и преобразовываем данные в массив

        api.qualities.fetchAll().then((data) => {
            const qualitiesList = Object.keys(data).map((optionName) => ({
                label: data[optionName].name,
                value: data[optionName]._id,
                color: data[optionName].color
            }));
            setQualities(qualitiesList);
        }); // получаем qualities и преобразовываем данные в массив
    }, []);

    useEffect(() => {
        if (data._id) setIsLoading(false);
    }, [data]); // завершаем загрузку при обновлении данных юзера, что будет срабатывать при каждом изменении data

    const validatorConfig = {
        email: {
            isRequired: {
                message: "Поле электронной почты обязательно для заполнения"
            },
            isEmail: {
                message: "Адрес электронной почты введен не корректно"
            }
        },
        name: {
            isRequired: {
                message: "введите ваше имя"
            }
        }
    };

    useEffect(() => {
        validate();
    }, [data]);

    const handleChange = (target) => {
        // console.log(target);
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        })); // убираем деструктуризацию
    };

    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isValid = Object.keys(errors).length === 0;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-5 offset-md-3 shadow p-4">
                    {/* если нет загрузки и уже загружены профессии, то отображаем форму */}
                    {!isLoading && Object.keys(professions).length > 0 ? (
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
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Отправить
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
