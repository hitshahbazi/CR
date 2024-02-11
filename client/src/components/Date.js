import React, { memo } from 'react';
import DatePicker from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';

const DateFarsiInput = memo(({ label, value, handleChange, disabled }) => {
  return (
    <div className='div'>
      <label htmlFor={label} className='label'>
        {label}
      </label>
      <DatePicker
        format='MM/DD/YYYY HH:mm'
        className='form-input common-input'
        calendarPosition='bottom-right'
        value={value}
        onChange={(date) => handleChange({ name: label, value: date })}
        disabled={disabled}
        style={{
          backgroundColor: 'var(--grey-50)',
          height: '35px',
          width: 'inherit',
          borderRadius: '4px',
          fontSize: '14px',
        }}
        plugins={[
          <TimePicker hideSeconds style={{ minWidth: '100px' }} />,
        ]}
      />
    </div>
  );
});

export default DateFarsiInput;
