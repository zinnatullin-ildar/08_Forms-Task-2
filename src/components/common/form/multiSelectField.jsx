import Select from "react-select";
import PropTypes from "prop-types";

const MultiSelectField = ({ options, name, label, defaultValue, onChange }) => {
    // получаем и деструктурируем props

    // const optionsArray =
    //     !Array.isArray(options) && typeof options === "object"
    //         ? Object.keys(options).map((optionName) => ({
    //               label: options[optionName].name,
    //               value: options[optionName]._id
    //           }))
    //         : options;

    const optionsArray =
        !Array.isArray(options) && typeof options === "object"
            ? Object.values(options)
            : options;
    // приводим данные к массиву: если options является объектом, то создаем на его основе новый массив, если не является - оставляем старый массив
    // в таком варианте не привязываемся к конкретным полям в переиспользуемом компоненте

    const handleChange = (value) => {
        onChange({ name, value });
    };
    // привели результирующие данные компонентов полей к одному формату (чтобы у всех компонентов полей в onChange()
    // из props попадал объект одной и той же структуры - с ключами name и value) и таким образом, в родителе будет
    // не нужно обрабатывать каждое поле индивидуально, все имеют одну и ту же структуру

    return (
        <div className="mb-4">
            <label className="form-label">{label}</label>

            {/* компонент Select из библтотеки react-select */}
            <Select
                isMulti
                closeMenuOnSelect={false}
                className="basic-multi-select"
                classNamePrefix="select"
                defaultValue={defaultValue}
                options={optionsArray}
                name={name}
                onChange={handleChange}
            />
        </div>
    );
};

MultiSelectField.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    defaultValue: PropTypes.array,
    options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onChange: PropTypes.func
};

export default MultiSelectField;
