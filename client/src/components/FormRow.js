const FormRow = ({ type, name, value, handleChange, labelText , disabled}) => {
  return (
    <div className='form-row'>
      <label htmlFor={name} className='form-label'>
        {labelText || name}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className='form-input'
        disabled={disabled}
      />
    </div>
  )
}

export default FormRow
