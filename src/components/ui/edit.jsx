import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import api from "../../api";
import TextField from "../common/form/textField";
import SelectField from "../common/form/selectField";
import RadioField from "../common/form/radioField";
import MultiSelectField from "../common/form/multiSelectField";
import { validator } from "../../utils/validator";

const Edit = () => {
    const { userId } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false); // состояние отслеживания загрузки формы
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
    };

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
    };

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
            .then((data) => history.push(`/users/${data._id}`));
        // console.log(data);
    };

    const convertData = (data) => {
        return data.map((quality) => ({
            label: quality.name,
            value: quality._id
        }));
    };

    useEffect(() => {
        setLoading(true);
        console.log(loading);

        api.users.getById(userId).then(({ profession, qualities, ...data }) =>
            setData((prevState) => ({
                ...prevState,
                ...data,
                profession: profession._id,
                qualities: convertData(qualities) //
            }))
        );

        api.professions.fetchAll().then((data) => {
            const professionsList = Object.keys(data).map((professionName) => ({
                label: data[professionName].name,
                value: data[professionName]._id
            }));
            setProfession(professionsList);
        });

        api.qualities.fetchAll().then((data) => {
            const qualitiesList = Object.keys(data).map((optionName) => ({
                label: data[optionName].name,
                value: data[optionName]._id,
                color: data[optionName].color
            }));
            setQualities(qualitiesList);
        });
    }, []);

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
        }));
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
                </div>
            </div>
        </div>
    );
};

export default Edit;
