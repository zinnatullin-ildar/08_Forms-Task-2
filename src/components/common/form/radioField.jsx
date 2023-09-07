import PropTypes from "prop-types";

const RadioField = ({ options, name, value, label, onChange }) => {
    // получаем и деструктурируем props

    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value });
    };
    // привели результирующие данные компонентов полей к одному формату (чтобы у всех компонентов полей в onChange()
    // из props попадал объект одной и той же структуры - с ключами name и value) и таким образом, в родителе будет
    // не нужно обрабатывать каждое поле индивидуально, все имеют одну и ту же структуру

    return (
        <div className="mb-4">
            <label className="form-label">{label}</label>
            <div>
                {options.map((option) => (
                    <div
                        className="form-check form-check-inline"
                        key={option.name + "_" + option.value}
                    >
                        <input
                            className="form-check-input"
                            type="radio"
                            name={name}
                            id={option.name + "_" + option.value}
                            value={option.value}
                            checked={option.value === value}
                            onChange={handleChange}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="inlineRadio1"
                        >
                            {option.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

RadioField.propTypes = {
    options: PropTypes.array,
    name: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func
};

export default RadioField;
