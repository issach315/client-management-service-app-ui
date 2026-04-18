import React from "react";
import {
  Grid,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
  Button,
} from "@mui/material";

const FormGenerator = ({
  fields = [],
  values = {},
  errors = {},
  onChange,
  onSubmit,
  submitText = "Submit",
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    onChange({
      target: {
        name,
        value: type === "checkbox" ? checked : value,
      },
    });
  };

  const renderField = (field) => {
    const {
      type,
      name,
      label,
      options = [],
      xs = 12,
      sm = 6,
      md = 4,
      ...rest
    } = field;

    switch (type) {
      case "text":
      case "email":
      case "number":
      case "password":
      case "date":
        return (
          <Grid item xs={xs} sm={sm} md={md} key={name}>
            <TextField
              fullWidth
              type={type}
              name={name}
              label={label}
              value={values[name] || ""}
              onChange={handleChange}
              error={!!errors[name]}
              helperText={errors[name]}
              {...rest}
            />
          </Grid>
        );

      case "select":
        return (
          <Grid item xs={xs} sm={sm} md={md} key={name}>
            <TextField
              select
              fullWidth
              name={name}
              label={label}
              value={values[name] || ""}
              onChange={handleChange}
              error={!!errors[name]}
              helperText={errors[name]}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        );

      case "checkbox":
        return (
          <Grid item xs={xs} sm={sm} md={md} key={name}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values[name] || false}
                  onChange={handleChange}
                  name={name}
                />
              }
              label={label}
            />
          </Grid>
        );

      case "radio":
        return (
          <Grid item xs={xs} sm={sm} md={md} key={name}>
            <FormControl>
              <FormLabel>{label}</FormLabel>
              <RadioGroup
                row
                name={name}
                value={values[name] || ""}
                onChange={handleChange}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        {fields.map((field) => renderField(field))}

        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>
            {submitText}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FormGenerator;
