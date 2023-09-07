import PropTypes from "prop-types";

const CheckBoxField = ({ name, value, children, error, onChange }) => {
    // получаем и деструктурируем props

    const handleChange = () => {
        onChange({ name, value: !value });
    };
    // привели результирующие данные компонентов полей к одному формату (чтобы у всех компонентов полей в onChange()
    // из props попадал объект одной и той же структуры - с ключами name и value) и таким образом, в родителе будет
    // не нужно обрабатывать каждое поле индивидуально, все имеют одну и ту же структуру

    const getInputClasses = () => {
        return "form-check-input" + (error ? " is-invalid" : "");
    }; // добавляет специальный класс в случае ошибки

    return (
        <div className="form-check mb-4">
            {/* атрибут checked является логическим атрибутом и указывает, что элемент должен быть выбран */}
            <input
                className={getInputClasses()}
                type="checkbox"
                value=""
                id={name}
                checked={value}
                onChange={handleChange}
            />
            {/* в содержимом <label> могут быть html-теги, поэтому передаем как children, а не просто props с текстом */}
            <label className="form-check-label" htmlFor={name}>
                {children}
            </label>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

CheckBoxField.propTypes = {
    name: PropTypes.string,
    error: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default CheckBoxField;
