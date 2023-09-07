import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";

const SelectField = ({
    label,
    value,
    onChange,
    defaultOption,
    options,
    name,
    error
}) => {
    // получаем и деструктурируем props

    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value });
    };
    // привели результирующие данные компонентов полей к одному формату (чтобы у всех компонентов полей в onChange()
    // из props попадал объект одной и той же структуры - с ключами name и value) и таким образом, в родителе будет
    // не нужно обрабатывать каждое поле индивидуально, все имеют одну и ту же структуру

    const getInputClasses = () => {
        return "form-select" + (error ? " is-invalid" : "");
    }; // данная функция добавляет специальный класс в случае ошибки

    // const optionsArray =
    //     !Array.isArray(options) && typeof options === "object"
    //         ? Object.keys(options).map((optionName) => ({
    //               name: options[optionName].name,
    //               value: options[optionName]._id
    //           }))
    //         : options;

    const optionsArray =
        !Array.isArray(options) && typeof options === "object"
            ? Object.values(options)
            : options;
    // приводим данные к массиву: если options является объектом, то создаем на его основе новый массив, если не является - оставляем старый массив
    // в таком варианте не привязываемся к конкретным полям в переиспользуемом компоненте

    return (
        <div className="mb-4">
            <label htmlFor={name} className="form-label">
                {label}
            </label>
            <select
                className={getInputClasses()}
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
            >
                {/* выводим первый <option>, его нельзя выбрать */}
                <option disabled value="">
                    {defaultOption}
                </option>
                {/* выводим optionsArray в шаблон */}
                {optionsArray.length > 0 &&
                    optionsArray.map((option) => (
                        <option value={option.value} key={uuid()}>
                            {option.label}
                        </option>
                    ))}
            </select>
            {/* при наличии ошибок отображаем их */}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

SelectField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    defaultOption: PropTypes.string,
    name: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default SelectField;
